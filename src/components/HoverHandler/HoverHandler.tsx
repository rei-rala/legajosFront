import React, { useEffect } from "react";
import columnasWf from "../../config";
import { getImporteSolicitud, getLineaExpediente } from "../../helpers/workflowHelper";

import styles from "./HoverHandler.module.css"

interface HoverHandlerProps {
  data?: any
}

const { razonSocial: razonSocialCol, codigoSol, codigoExp, canal: canalSol, linea, sublinea, asesorComercial, sucursal: sucursalCol, fechaIngreso: fechaIngresoCol, fechaDevolucion, fechaFinalizadoAnalista, faltaInfo } = columnasWf

const DataTransformer: React.FC<{ data: Expediente[] }> = ({ data }) => {

  const tableTitles = [codigoExp, linea, sublinea, "Importe", canalSol]

  let reducedTitles = tableTitles.map(columnTitle => {
    const title = columnTitle

    if (title?.toLowerCase().includes("grupo")) {
      return "Canal"
    }
    switch (title) {
      case linea:
        return "Linea"
      case codigoExp:
        return "Exp"
      case sublinea:
        return "Sublinea"
      default:
        return title
    }
  })

  const [solicitud, razonSocial, asesor, canal, sucursal, fechaIngreso] = [data[0][codigoSol], data[0][razonSocialCol], data[0][asesorComercial], data[0][canalSol], data[0][sucursalCol], data[0][fechaIngresoCol]]
  const estado = () => {
    let isDevuelto = data[0][fechaDevolucion]

    if (isDevuelto) {
      return <b>Devuelto</b>
    }
    let isFinalizado = data[0][fechaFinalizadoAnalista]

    if (isFinalizado) {
      return <b>Finalizado</b>
    }

    let faltanteInfo = data[0][faltaInfo]?.toLowerCase() === "si" ?? true

    if (faltanteInfo) {
      return <b>Pendiente</b>
    }

    return <b>En análisis</b>
  }
  return (
    <div>
      <div>
        <p>Solicitud {solicitud}: {estado()}</p>
        <p>{razonSocial}</p>
        <p> {canal} </p>
        <p></p>
        <p>{asesor} ({sucursal}) </p>
        <p>Ingreso {fechaIngreso}</p>
        <hr />
      </div>
      <table className={styles.hoverTable}>
        <thead>
          <tr>
            {
              reducedTitles.map((title, i) => <th key={title}>{title}</th>)
            }
          </tr>
        </thead>
        <tbody>
          {
            /* For each exp, read data from title*/
            data.map(exp => <tr key={exp[codigoExp] + "row"}>
              {
                tableTitles.map(title => <td key={exp[codigoExp] + title}>{
                  title === "Importe"
                    ? getImporteSolicitud(exp)
                    : title === "Linea"
                      ? getLineaExpediente(exp)
                      : exp[title]
                }</td>)
              }
            </tr>)
          }
        </tbody>
      </table>
    </div>
  )
}


const HoverHandler: React.FC<HoverHandlerProps> = ({ data }) => {
  const [mousePos, setMousePos] = React.useState({ y: 0 })
  const isMouseAtBottom = () => mousePos.y > (window.innerHeight/2)

  const handleMouseMove = (e: any) => {
    setMousePos({ y: e.clientY })
  }

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  })

  return data && <aside className={(isMouseAtBottom() && styles.top) + " " + styles.wrapper}>
    <DataTransformer data={data} />
  </aside>
}

export default HoverHandler