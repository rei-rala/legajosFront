import moment from "moment";
import React from "react";
import columnasWf from "../../../config";
import { useUser } from "../../../context";
import { getImporteSolicitud, getLineaExpediente, getNivel } from "../../../helpers/workflowHelper";
import styles from "./CuadroAnalista.module.css";

const { faltaInfo, fechaAsignadoAnalista, fechaDevolucion, fechaFinalizadoAnalista } = columnasWf

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


const CuadroAnalista: React.FC<ICuadroAnalistaShowingProps> = ({ analista, solicitudes, showDetail, handleHide }) => {
  const { razonSocial: razonSolCol } = columnasWf
  const { analisis, devuelto, finalizado, pendiente } = useUser().preferences.analistaSectionHide

  return (
    <div
      key={analista}
      className={styles.analistaBox + " " + (!analista && styles.boxNoAsignado)}
    >
      <h3 className={styles.analistaBox_title}>{analista ?? "SIN ANALISTA"}</h3>
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
      <div className={styles.analistaBox_footer} >

        <div>
          <label>
            <input type="checkbox" onChange={(e) => handleHide(e, analista)} />
            Ocultar
          </label>
        </div>
      </div>
    </div>
  )
}

export default CuadroAnalista