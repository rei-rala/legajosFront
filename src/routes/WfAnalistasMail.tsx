import moment from "moment";
import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import AnalistasMail from "../components/AnalistasMail/AnalistasMail";
import columnasWf from "../config";
import { useWorkflow } from "../context";

const { fechaAsignadoAnalista: fechaAsignadoAnalistaColumn, analista: analistaColumn } = columnasWf

const WfAnalistasMail: React.FC = () => {
  const { parsedWorkflow } = useWorkflow()

  const analistasAsignadosDia = useMemo(() => {
    let analistas: { nombre: string, solicitudes: Expediente[] }[] = []

    // Por que habia hecho la estructura de datos asi?
    parsedWorkflow && Object.values(parsedWorkflow).forEach((solicitud) => {
      const asignadoHoy = solicitud[0][fechaAsignadoAnalistaColumn] && moment().diff(moment(solicitud[0][fechaAsignadoAnalistaColumn], "DD/MM/YYYY"), "days") === 0 || false

      if (!asignadoHoy) {
        return
      }

      const nombre = solicitud[0][analistaColumn] as string
      const existe = analistas.find(a => a.nombre === nombre);


      if (existe) {
        existe.solicitudes.push(solicitud)
      } else {
        analistas.push({
          nombre,
          solicitudes: [solicitud]
        })
      }
    })

    // Sorted by name
    return analistas.sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [parsedWorkflow])

  useEffect(() => {
    document.title = "Workflow | Generar mail para analistas";
  }, []);


  if (!parsedWorkflow) {
    return <section>
      <h1>No hay workflow para mostrar</h1>

      <Link to="/workflow">Cargar un Workflow</Link>
    </section>
  }

  return <section>
    <h1>Copiar tabla Email para analistas</h1>
    <span><Link to="/workflow" style={{ color: 'red', fontWeight: 'bold' }}> <sup>Cargar otro workflow?</sup></Link></span>
    <div>
      <div>
        <p>Puede copiar la siguiente tabla</p>
        <i>Clickee una línea para quitarla del cuadro</i>
      </div>

      <AnalistasMail analistas={analistasAsignadosDia} />
    </div>
  </section>;
}

export default WfAnalistasMail