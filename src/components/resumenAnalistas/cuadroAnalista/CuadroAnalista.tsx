import React from "react";
import columnasWf from "../../../config";
import { getImporteSolicitud, getLineaExpediente, getNivel } from "../../../helpers/workflowHelper";
import styles from "./CuadroAnalista.module.css";

export function getEstadoStyle(solicitud: Expediente[]) {
  const { fechaDevolucion, faltaInfo, fechaFinalizadoAnalista } = columnasWf

  let isDevuelto = solicitud[0][fechaDevolucion]

  if (isDevuelto) {
    return styles.isDevuelto
  }
  let isFinalizado = solicitud[0][fechaFinalizadoAnalista]

  if (isFinalizado) {
    return styles.isFinalizado
  }

  let faltanteInfo = solicitud[0][faltaInfo]?.toLowerCase() === "si" ?? true

  if (faltanteInfo) {
    return styles.isFaltaInfo
  }


}

const CuadroAnalista: React.FC<ICuadroAnalistaShowingProps> = ({ analista, solicitudes, showDetail, handleHide }) => {
  const { razonSocial: razonSolCol } = columnasWf

  // desastre right? 
  // quedo safable

  return (
    <div
      key={analista}
      className={styles.analistaBox + " " + (!analista && styles.boxNoAsignado)}
    >
      <h3 className={styles.analistaBox_title}>{analista ?? "SIN ANALISTA"}</h3>
      <ol className={styles.analistaBox_content}>
        {
          Object.entries(solicitudes).map(([solicitud, expedientes]) => {
            const razonSocial = expedientes[0][razonSolCol] ? expedientes[0][razonSolCol] : solicitud
            // TODO: FIX este desastre
            return <li key={solicitud}
              onMouseEnter={() => showDetail(expedientes)}
              onMouseLeave={() => showDetail(undefined)}
            >
              <details>
                {/* TODO: Title on hover */}
                <summary><span className={getEstadoStyle(expedientes)}>{razonSocial}</span> <strong>{getNivel(expedientes[0])}</strong></summary>

                <ul>
                  {
                    /* TODO: Title on hover */
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