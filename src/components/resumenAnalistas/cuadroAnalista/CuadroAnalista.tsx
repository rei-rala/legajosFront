import moment from "moment";
import React, { useMemo } from "react";
import columnasWf from "../../../config";
import { useUser } from "../../../context";
import { getImporteSolicitud, getLineaExpediente, getNivel } from "../../../helpers/workflowHelper";
import styles from "./CuadroAnalista.module.css";

const { faltaInfo, fechaAsignadoAnalista, fechaDevolucion, fechaFinalizadoAnalista } = columnasWf
const { canal, canalAlt } = columnasWf;

export function getEstadoStyle(solicitud: Expediente[]) {

  let faltanteInfo = solicitud[0][faltaInfo]?.toLowerCase() === "si" ?? false
  let isDevuelto = solicitud[0][fechaDevolucion] && faltanteInfo
  let isAsignadoDia = solicitud[0][fechaAsignadoAnalista] && moment().diff(moment(solicitud[0][fechaAsignadoAnalista], "DD/MM/YYYY"), "days") === 0 && styles.isAsignadoDia + " " || " "

  if (isDevuelto) {
    return isAsignadoDia + styles.isDevuelto
  }
  let isFinalizado = solicitud[0][fechaFinalizadoAnalista]

  if (isFinalizado) {
    return isAsignadoDia + styles.isFinalizado
  }

  if (faltanteInfo) {
    return isAsignadoDia + styles.isFaltaInfo
  }

  return isAsignadoDia
}

type Counter = {
  analisis: number,
  pendientes: number,
  finalizados: number,
  total: number
}

type CounterGroup = {
  estandar?: Counter;
  express?: Counter;
  productivas?: Counter;
}

const SubTablaBox: React.FC<{ counter?: Counter }> = ({ counter }) => {
  if (!counter) {
    return null
  }

  const analisisCount = counter.analisis > 0 ? counter.analisis : "-"
  const pendientesCount = counter.pendientes > 0 ? counter.pendientes : "-"
  const finalizadosCount = counter.finalizados > 0 ? counter.finalizados : "-"

  return (
    <td>
      <table className={styles.analistaBox_table__sub}>
        <thead>
        </thead>
        <tbody>
          <tr>
            <td className={styles.analistaBox_table__analisis} >  {analisisCount}</td>
            <td className={styles.analistaBox_table__pendientes} >{pendientesCount}</td>
            <td className={styles.analistaBox_table__finalizado} >{finalizadosCount}</td>
          </tr>
        </tbody>
      </table>
    </td>
  )
}

const TablaBox: React.FC<{ solicitudesAnalista: Expediente[][] }> = ({ solicitudesAnalista }) => {
  const { analisis, devuelto, finalizado, pendiente } = useUser().preferences.analistaSectionHide

  const counter = useMemo(() => {
    let counter: CounterGroup = {}

    for (let solicitud of solicitudesAnalista) {
      for (let expediente of solicitud) {
        let omitDevuelto = devuelto && expediente[fechaDevolucion] && expediente[faltaInfo]
        let omitFinalizado = finalizado && expediente[fechaFinalizadoAnalista]
        let omitPendiente = pendiente && expediente[faltaInfo] && !(expediente[fechaFinalizadoAnalista] || expediente[fechaDevolucion])

        if (omitDevuelto || omitFinalizado || omitPendiente) {
          continue
        }

        if (analisis && !(omitDevuelto && omitFinalizado && omitPendiente)) {
          continue
        }

        let canalSol = getNivel(expediente);
        canalSol = ["GP", "EXP"].includes(canalSol) ? canalSol : "EST";

        let canal: keyof CounterGroup | null = null;

        if (canalSol === "EST") {
          canal = "estandar"
        } else if (canalSol === "EXP") {
          canal = "express"
        } else if (canalSol === "GP") {
          canal = "productivas"
        }

        if (!canal) {
          continue;
        }

        if (counter[canal] === undefined) {
          counter[canal] = { analisis: 0, pendientes: 0, finalizados: 0, total: 0 }
        }

        counter[canal]!.total += 1;

        if (expediente[fechaFinalizadoAnalista] && !expediente[faltaInfo]) {
          counter[canal]!.finalizados++
        } else if (expediente[faltaInfo]) {
          counter[canal]!.pendientes++
        } else {
          counter[canal]!.analisis++
        }
        break;
      }

    }

    return counter
  }, [solicitudesAnalista])

  return (
    <table className={styles.analistaBox_table}>
      <thead>
        <tr>
          {counter.estandar && <th>
            <span>EST</span> <span>{counter.estandar.total}</span>
          </th>}
          {counter.express && <th>
            <span>EXP</span> <span>{counter.express.total}</span>
          </th>}
          {counter.productivas && <th>
            <span>GP</span> <span>{counter.productivas.total}</span>
          </th>}
        </tr>
      </thead>
      <tbody>
        <tr>
          <SubTablaBox counter={counter.estandar} />
          <SubTablaBox counter={counter.express} />
          <SubTablaBox counter={counter.productivas} />
        </tr>
      </tbody>
    </table>
  )
}


const CuadroAnalista: React.FC<ICuadroAnalistaShowingProps> = ({ analista, solicitudes, showDetail, handleHide }) => {
  const { razonSocial: razonSolCol } = columnasWf
  const { analistaSectionHide, hideFooter } = useUser().preferences;
  const { analisis, devuelto, finalizado, pendiente } = analistaSectionHide

  const solicitudesCount = useMemo(() => {
    let counter = 0;

    for (let solicitud of solicitudes) {
      let exp = solicitud[0]

      let omitDevuelto = devuelto && exp[fechaDevolucion]
      let omitFinalizado = finalizado && exp[fechaFinalizadoAnalista]
      let omitPendiente = pendiente && exp[faltaInfo] && !exp[fechaDevolucion]

      if (omitDevuelto || omitFinalizado || omitPendiente) {
        continue
      }

      if (analisis && !(exp[fechaDevolucion] || exp[faltaInfo] || exp[fechaFinalizadoAnalista])) {
        continue
      }

      counter++
    }

    return counter
  }, [solicitudes, analistaSectionHide])

  return (
    <div
      key={analista}
      className={styles.analistaBox + " " + (analista ? "" : styles.boxNoAsignado)}
    >
      <div className={styles.analistaBox_title}>
        <span>{solicitudesCount}</span>
        <h3>{analista ?? "SIN ANALISTA"}</h3>
        <label><input type="checkbox" onChange={(e) => handleHide(e, analista)} />X</label>
      </div>

      <ol className={styles.analistaBox_content}>
        {
          Object.entries(solicitudes).map(([solicitud, expedientes]) => {
            let omit = false;

            if (devuelto) {
              omit = expedientes.some((expediente) => expediente[fechaDevolucion])
            }

            if (!omit && pendiente) {
              omit = !expedientes.some((expediente) => expediente[fechaDevolucion]) && expedientes.some((expediente) => expediente[faltaInfo])
            }

            if (!omit && finalizado) {
              omit = expedientes.some((expediente) => expediente[fechaFinalizadoAnalista])
            }


            if (!omit && analisis) {
              let p = !expedientes.some((expediente) => expediente[faltaInfo])
              let f = !expedientes.some((expediente) => expediente[fechaFinalizadoAnalista])
              let d = !expedientes.some((expediente) => expediente[fechaDevolucion])

              omit = p && f && d
            }


            if (omit) {
              return null;
            }

            const razonSocial = expedientes[0][razonSolCol] ? expedientes[0][razonSolCol] : solicitud
            // TODO: arreglar este desastre
            return <li key={solicitud}
              onMouseEnter={() => showDetail(expedientes)}
              onMouseLeave={() => showDetail(undefined)}
            >
              <details>
                <summary><span className={getEstadoStyle(expedientes)}>{razonSocial}</span> <strong>{getNivel(expedientes[0])}</strong></summary>

                <ul>
                  {
                    expedientes.map((expediente: any) => <li key={solicitud + "-" + expediente.Expediente}>
                      <b>{getLineaExpediente(expediente)}</b>
                      <span>{getImporteSolicitud(expediente)}</span>
                    </li>)
                  }
                </ul>
              </details>

            </li>
          })
        }
      </ol>

      {
        !hideFooter && <div className={styles.analistaBox_footer} >
          <TablaBox solicitudesAnalista={solicitudes} />
        </div>
      }
    </div>
  )
}

export default CuadroAnalista