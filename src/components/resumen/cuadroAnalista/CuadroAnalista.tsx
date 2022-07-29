import React from "react";
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

    let moneda: any = expediente["Moneda Solicitud"]
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
  let lineaExpedienteColNames = /* import.meta.env.VITE_WF_LINEA_EXPEDIENTE_COLS.split("|") ||  */"Línea Solicitud"
  
  let found = (expediente[lineaExpedienteColNames] as string).toLowerCase()
  
  if (found.includes("propios")) {
    return "CPDP"
  } 
  if (found.includes("terceros")) {
    return "CPDT"
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

  return "n/a"
}


const CuadroAnalista: React.FC<ICuadroAnalistaProps> = ({ analista, solicitudes, handleHide }) => {

  // desastre right? 
  // quedo safable

  return (
    analista !== "Sin analista" ?
      <div key={analista} className={styles.analistaBox}>
        <h3 className={styles.analistaBox_title}>{analista}</h3>
        <ol className={styles.analistaBox_content}>
          {
            Object.entries(solicitudes).map(([solicitud, expedientes]) => {
              // TODO: FIX este desastre
              const razonSocial = expedientes[0]["Razón Social"] ? expedientes[0]["Razón Social"] : solicitud
              const a = '';

              return <li key={solicitud}>
                <details>
                  <summary title={razonSocial}><span>{razonSocial}</span> <button>{getNivel(expedientes[0])}</button></summary>

                  <ul>
                    {
                      expedientes.map((expediente: any) => <li key={solicitud + "-" + expediente.Expediente} title={expediente.Expediente}>
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
      : null
  )
}

export default CuadroAnalista