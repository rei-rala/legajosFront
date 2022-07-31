import React, { useEffect, useMemo, useState } from "react";
import columnasWf from "../../config";
import TablaGenerica from "./generica/TablaGenerica";

import moment, { Moment } from "../../libs/moment";

import styles from "./Resumen.module.css";

interface Props {
  counters: {
    asignar: number;
    devueltas: number;
    analisis: number;
    ingresar: number;
    pendientes: number;
    supervision: number;
  },
  supervisionTBody: TableBody,
  analisisTBody: TableBody,
  fullTBody: TableBody,
}


const { canal, codigoSol, razonSocial, asesorComercial, sucursal, analista, fechaFinalizadoAnalista } = columnasWf
const tablaSuperv = ["Días GR", "Días asignado", "Días pendiente", "Días finalizado", codigoSol, razonSocial, canal, asesorComercial, sucursal, analista, fechaFinalizadoAnalista]
const tablaAnalisis = ["Días GR", "Días asignado", "Días pendiente", codigoSol, razonSocial, canal, asesorComercial, sucursal, analista]

const Resumen: React.FC<Props> = ({ counters, supervisionTBody, analisisTBody, fullTBody }) => {
  const [dayFiltered, setDayFiltered] = useState<Moment>(moment());

  const [legajosIngresadosDia, cantidadLegajosIngresados] = useMemo(() => {
    const solicitudesDia = []
    for (let sol of Object.values(fullTBody)) {
      let fechaIngreso = sol["Ingreso Riesgo"]

      if (fechaIngreso) {
        let isToday = moment(fechaIngreso, "DD/MM/YYYY").format("DD/MM/YYYY") === dayFiltered.format("DD/MM/YYYY")
        if (isToday) {
          solicitudesDia.push(sol)
        }
      }
    }
    return [solicitudesDia, solicitudesDia.length]
  }, [fullTBody])

  const [tablaInvertida, setTablaInvertida] = useState(false)

  useEffect(() => {
    document.title = "Workflow | Resumen";
  }, []);


  return (

    <div>
      <h3 style={{ marginTop: '1rem', marginBottom: "0.5rem" }}>Mostrando Resumen</h3>
      <button onClick={() => setTablaInvertida(!tablaInvertida)}>Invertir</button>
      <div>
        <h4>Conteo</h4>

        <table className={styles.tableResume}>
          {
            tablaInvertida
              ? (<>
                <thead>
                  <tr>
                    <td scope="row">Ingresar</td>
                    <td scope="row">Asignar</td>
                    <td scope="row">Análisis</td>
                    <td scope="row">Pendientes</td>
                    <td scope="row">Supervisión</td>
                    <td scope="row">Devueltas</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{counters.ingresar}</td>
                    <td>{counters.asignar}</td>
                    <td>{counters.analisis}</td>
                    <td>{counters.pendientes}</td>
                    <td>{counters.supervision}</td>
                    <td>{counters.devueltas}</td>
                  </tr>
                </tbody>
              </>)
              : (<>
                <thead>
                  <tr>
                    <td scope="col">Estado</td>
                    <td scope="col">Cantidad</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ingresar</td>
                    <td>{counters.ingresar}</td>
                  </tr>
                  <tr>
                    <td>Asignar</td>
                    <td>{counters.asignar}</td>
                  </tr>
                  <tr>
                    <td>Análisis</td>
                    <td>{counters.analisis}</td>
                  </tr>
                  <tr>
                    <td>Pendientes</td>
                    <td>{counters.pendientes}</td>
                  </tr>
                  <tr>
                    <td>Supervisión</td>
                    <td>{counters.supervision}</td>
                  </tr>
                  <tr>
                    <td>Devueltas</td>
                    <td>{counters.devueltas}</td>
                  </tr>
                </tbody>
              </>)
          }

        </table>


        <div>
          <p>El {dayFiltered.locale('es').format("dddd DD [de] MMMM")} {cantidadLegajosIngresados === 0 ? "no ingresaron" : "ingresaron " + cantidadLegajosIngresados} legajos</p>
        </div>


      </div>

      <div>
        <h4>Analisis</h4>
        <TablaGenerica headers={tablaAnalisis} tableBody={analisisTBody} tableName="analisis" />
      </div>

      <div>
        <h4>Supervision</h4>
        <TablaGenerica headers={tablaSuperv} tableBody={supervisionTBody} tableName="supervision" />
      </div>

    </div >
  )
}

export default Resumen