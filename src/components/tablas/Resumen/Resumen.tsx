import React, { useEffect, useMemo, useState } from "react";
import columnasWf from "../../../config";
import TablaGenerica from "../TablaGenerica/TablaGenerica";

import moment, { Moment } from "../../../libs/moment";

import styles from "./Resumen.module.css";
import { useTablesWF } from "../../../context";

interface Props {
  supervisionTBody: TableBody,
  analisisTBody: TableBody,
  fullTBody: TableBody,
}



const { canal, codigoSol, razonSocial, asesorComercial, analista } = columnasWf
const tablaSuperv = ["Días GR", "Días asignado", "Días pendiente", "Días supervisión", codigoSol, razonSocial, analista, canal, asesorComercial]
const tablaAnalisis = ["Días GR", "Días asignado", "Días pendiente", codigoSol, razonSocial, analista, canal, asesorComercial]

const Resumen: React.FC<Props> = ({ supervisionTBody, analisisTBody, fullTBody }) => {
  const { fullCount } = useTablesWF()
  const solicitudesTotal = Object.values(fullCount["total canal"]).reduce((acc, cur) => acc + cur, 0)

  const [tablaInvertida, setTablaInvertida] = useState(false)
  const [hideMiddle, setHideMiddle] = useState(false)

  const [dayFiltered, setDayFiltered] = useState<Moment>(moment());

  const [minDayFilter, setMinDayFilter] = useState<number>(0);
  const [columnFiltered, setColumnFiltered] = useState<string>("Días GR");

  const [_, cantidadLegajosIngresados] = useMemo(() => {
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


  useEffect(() => {
    document.title = "Workflow | Resumen";
  }, []);


  const TablaAnalisis = useMemo(() => {
    let analisisTableName = "en análisis " + (minDayFilter > 0 ? " de " + minDayFilter + " o más " + columnFiltered : "")
    let filterAnalisis: TableBody = {}

    for (let sol of Object.values(analisisTBody)) {
      if (sol[columnFiltered] >= minDayFilter) {
        filterAnalisis[sol[codigoSol]] = sol
      }
    }

    return Object.keys(filterAnalisis).length > 0
      ? <TablaGenerica headers={tablaAnalisis} tableBody={filterAnalisis} tableName={analisisTableName} />
      : <i> No hay solicitudes en análisis con el criterio proporcionado</i>
  }, [analisisTBody, minDayFilter, columnFiltered])

  const TablaSupervision = useMemo(() => {
    let supervisionTableName = "en supervisión " + (minDayFilter > 0 ? " de " + minDayFilter + " o más " + columnFiltered : "")
    let filterSupervision: TableBody = {}

    for (let sol of Object.values(supervisionTBody)) {
      if (sol[columnFiltered] >= minDayFilter) {
        filterSupervision[sol[codigoSol]] = sol
      }
    }
    return Object.keys(filterSupervision).length > 0
      ? <TablaGenerica headers={tablaSuperv} tableBody={filterSupervision} tableName={supervisionTableName} />
      : <i> No hay solicitudes en supervisión con el criterio proporcionado</i>
  }, [supervisionTBody, minDayFilter, columnFiltered])


  return (
    <div className={styles.resumen}>
      <h3>
        Mostrando Resumen  <button onClick={() => setTablaInvertida(!tablaInvertida)}>Invertir</button>  <button onClick={() => setHideMiddle(!hideMiddle)}>Ocultar intermedios</button>
      </h3>
      <div className={styles.miniTabla}>
        <table>
          {
            tablaInvertida
              ? (<>
                <thead>
                  <tr>
                    {
                      !hideMiddle && <th scope="col">Canal</th>
                    }
                    {
                      Object.keys(fullCount).map((key) => (
                        <th key={"thCol" + key} scope="col">{hideMiddle && key === "total canal" ? "Total canales" : key}</th>
                      ))
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    Object.keys(fullCount.asignar).map((canal, i) => {
                      if (hideMiddle && !(i + 1 === Object.keys(fullCount).length)) {
                        return null
                      }

                      return (
                        <tr>
                          <th
                            key={"thRow" + canal}
                            scope="row"
                          >
                            {canal}
                          </th>
                          {
                            Object.keys(fullCount).map((estado, i) => {
                              if (hideMiddle && !(i + 1 === Object.keys(fullCount).length)) {
                                return null
                              }
                              return (
                                <td
                                  key={"td" + canal + estado}
                                >
                                  {fullCount[estado][canal] > 0 ? fullCount[estado][canal] : "-"}
                                </td>
                              )
                            })
                          }
                        </tr>
                      )
                    })
                  }
                  <tr className={styles.lastRow}>
                    {!hideMiddle && <th scope="row">Total Estado</th>}
                    {
                      Object.entries(fullCount).map(([estado, valores]) => (
                        <th key={"lastThRow" + estado}>
                          {Object.values(valores).reduce((acc, v) => acc + v, 0)}
                        </th>
                      ))
                    }
                  </tr>
                </tbody>
              </>)
              : (<>
                <thead>
                  <tr>
                    <th scope="col">Estado</th>
                    {
                      !hideMiddle && Object.keys(fullCount.ingresar).map((key) => (
                        <th key={key} scope="col">{key}</th>
                      ))
                    }
                    <th scope="col">{hideMiddle ? "Cantidad" : "Total estados"}</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    Object.keys(fullCount).map((column: string, index) => (
                      <tr key={column} className={index + 1 === Object.keys(fullCount).length ? styles.lastRow : ""} >
                        <th scope="col">
                          {column}
                        </th>
                        {
                          !hideMiddle && Object.keys(fullCount[column]).map((key) => <td
                            key={key}
                            className={index + 1 === Object.keys(fullCount).length ? styles.lastRow : ""}
                          >
                            {fullCount[column][key] > 0 ? fullCount[column][key] : "-"}
                          </td>)
                        }
                        {
                          <td>
                            {
                              Object.values(fullCount[column]).reduce((acc, v) => acc + v, 0)
                            }
                          </td>
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </>)
          }

        </table>


        <div>
          <p>Contamos con {solicitudesTotal} legajo{solicitudesTotal > 1 && "s"} en riesgos </p>
          <p>El {dayFiltered.locale('es').format("dddd D [de] MMMM")} {cantidadLegajosIngresados === 0 ? "no hubo" : "hubo " + cantidadLegajosIngresados} ingresos</p>
        </div>

        <div className={styles.filterWrapper}>
          <h5>Filtrar por cantidad de días</h5>
          <div className={styles.filter}>
            <input type="number" min={0} max={999} value={minDayFilter} onChange={(e) => setMinDayFilter(Number(e.target.value))} />
            <select value={columnFiltered} onChange={(e) => setColumnFiltered(e.target.value)}>
              {
                ["Días GR", "Días asignado", "Días pendiente", "Días supervisión"].map(str => (
                  <option key={str} value={str}>{str}</option>
                ))
              }
            </select>
          </div>
        </div>
      </div>

      <div>
        <h4>Analisis</h4>
        {TablaAnalisis}
      </div>

      <div>
        <h4>Supervision</h4>
        {TablaSupervision}
      </div>

    </div >
  )
}

export default Resumen