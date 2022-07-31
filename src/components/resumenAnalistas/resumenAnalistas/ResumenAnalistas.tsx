import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useWorkflow } from "../../../context";
import CuadroAnalista from "../cuadroAnalista/CuadroAnalista";
import CuadroAnalistaHidden from "../CuadroAnalistaHidden/CuadroAnalistaHidden";
import styles from "./ResumenAnalistas.module.css";

type AnalistaCuadro = {
  nombre: string;
  isHiding: boolean,
  solicitudes: any[];
}

const ResumenAnalistas: React.FC = () => {
  const { parsedWorkflow } = useWorkflow()
  const [renderCount, setRenderCount] = useState(0)

  const analistas: AnalistaCuadro[] = useMemo(getAnalistas, [parsedWorkflow, renderCount])

  const [showingAnalistas, hiddenAnalistas] = useMemo(() => {
    let showing: AnalistaCuadro[] = [], hidding: AnalistaCuadro[] = []
    analistas.forEach(analista => {
      analista.isHiding ? hidding.push(analista) : showing.push(analista)
    })

    return [showing, hidding]
  }, [analistas])



  function getAnalistas(): AnalistaCuadro[] {
    let analistas: AnalistaCuadro[] = []

    // Por que habia hecho la estructura de datos asi?
    parsedWorkflow && Object.values(parsedWorkflow).forEach((solicitud) => {
      const nombre = solicitud[0]["Analista Riesgo"] as string
      const existe = analistas.find(a => a.nombre === nombre);

      if (existe) {
        existe.solicitudes.push(solicitud)
      } else {
        analistas.push({
          nombre,
          isHiding: isHiding(nombre),
          solicitudes: [solicitud]
        })
      }
    })

    return analistas
  }


  function isHiding(name: string) {
    const ls_key = `hide_${name}`
    return localStorage.getItem(ls_key) === "true"
  }

  function handleHide(e: React.ChangeEvent<HTMLInputElement>, name: string) {
    e.stopPropagation()
    const ls_key = `hide_${name}`
    localStorage.setItem(ls_key, "" + e.target.checked);
    setRenderCount(renderCount + 1)
  }


  return <section>
    <div>
      <span><Link to="/workflow" style={{ color: 'red', fontWeight: 'bold' }}> <sup>Cargar otro workflow?</sup></Link></span>
      <h2>Cuadro de Analistas</h2><br />
      <div className={styles.analistasContainer}>
        {
          showingAnalistas.map(analista => <CuadroAnalista key={analista.nombre} analista={analista.nombre} solicitudes={analista.solicitudes} handleHide={handleHide} />)
        }
      </div>
    </div>

    <div>
      <h3>Analistas ocultos</h3>
      <div className={styles.analistasContainer_hide}>
        {
          hiddenAnalistas.map(analista => <CuadroAnalistaHidden key={analista.nombre} analista={analista.nombre} solicitudes={analista.solicitudes} handleHide={handleHide} />)
        }
      </div>
    </div>
  </section>;
}

export default ResumenAnalistas