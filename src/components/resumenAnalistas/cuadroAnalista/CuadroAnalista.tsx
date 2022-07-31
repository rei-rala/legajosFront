import React from "react";
import columnasWf from "../../../config";
import styles from "./CuadroAnalista.module.css";

function getNivel(expediente: Expediente) {
  let nivelColNames = import.meta.env.VITE_WF_CANAL_COLS.toLowerCase().split("|") || ["Grupo de Canal Análisis según SGA"]
  let found = "n/a";

  for (let property in expediente) {
    if (nivelColNames.includes(property.toLowerCase())) {
      found = (expediente[property] as string ?? "").toLowerCase()
      break
    }
  }

  if (found.includes("expr")) {
    return "EXP"
  } else if (found.includes("productivas")) {
    return "GP"
  } else if (found.includes("2")) {
    return "N2"
  } else if (found.includes("1")) {
    return "N1"
  } else if (found.includes("comisión")) {
    return "CG"
  }

  return found
}

function getImporteSolicitud(expediente: Expediente) {
  let importeSolicitudColNames = import.meta.env.VITE_WF_IMPORTE_SOLICITUD_COLS.split("|") || ["Importe Solicitado"]
  let monedaSolicitudColName = import.meta.env.VITE_WF_MONEDA_SOLICITUD_COLS.split("|") || ["Moneda Solicitud"]
  let found: string = "";


  for (let impColName in importeSolicitudColNames) {
    let tryColName = expediente[impColName]

    if (tryColName) {
      found = found + (+(tryColName ?? "0") / 1000).toFixed(0) + " M"
    }
  }

  for (let monedaColName in monedaSolicitudColName) {
    let tryColName = expediente[monedaColName] as string
    if (tryColName) {
      if (tryColName.includes("usd") || tryColName.includes("dolar") || tryColName.includes("dólar")) {
        found = "U$S " + found
      } else if (tryColName.includes("eur")) {
        found = "€ " + found
      } else if (tryColName.includes("uva")) {
        found = "UVA " + found
      } else {
        found = "$ " + found
      }
    }
  }

  if (found === "") {
    let aux: string = (expediente["Importe Solicitado"] ? (expediente["Importe Solicitado"] as number / 1000) : 0).toFixed(0) + " M"

    let moneda: any = ("" + expediente["Moneda Solicitud"]).toLowerCase()

    if (moneda) {
      if (moneda.includes("usd") || moneda.includes("dolar") || moneda.includes("dólar")) {
        aux = "U$S " + aux
      } else if (moneda.includes("eur")) {
        aux = "€ " + aux
      } else if (moneda.includes("uva")) {
        aux = "UVA " + aux
      } else {
        aux = "$ " + aux
      }
    }
    return aux
  }
  return found
}

function getLineaExpediente(expediente: Expediente) {
  let lineaExpedienteColNames = /* import.meta.env.VITE_WF_LINEA_EXPEDIENTE_COLS.split("|") ||  */"SubLínea Solicitud"

  let found = (expediente[lineaExpedienteColNames] as string).toLowerCase()

  if (found.includes("amortizable")) {
    return found.includes("no revolving") ? "CPDP Rev" : "CPDP no rev"
  }
  if (found.includes("linea")) {
    return found.includes("espejo") ? "Terceros E" : "Terceros C"
  }
  if (found.includes("financiera")) {
    return "GF"
  }
  if (found.includes("comercial")) {
    return "GC"
  }
  if (found.includes("operaciones")) {
    return "GC"
  }
  if (found.includes("o.n.")) {
    return "ON"
  }
  if (found.includes("virtual")) {
    return "virtual"
  }
  if (found.includes("productivas")) {
    return "GP"
  }

  return found
}


function getEstadoStyle(solicitud: Expediente[]) {
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

const CuadroAnalista: React.FC<ICuadroAnalistaProps> = ({ analista, solicitudes, handleHide }) => {
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
            return <li key={solicitud}>
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