import React, { useEffect } from "react";
import columnasWf from "../../config";
import { getGrupoCanal, getImporteSolicitud, getLineaExpediente } from "../../helpers/workflowHelper";

import styles from "./HoverHandler.module.css"

interface HoverHandlerProps {
  data?: any
}

const { analista, razonSocial: razonSocialCol, codigoSol, codigoSolAlt, codigoExp, canalGr, canal: canalSol, canalAlt: canalSolAlt, linea, sublinea, asesorComercial, sucursal: sucursalCol, fechaIngreso: fechaIngresoCol, fechaDevolucion, fechaFinalizadoAnalista, faltaInfo } = columnasWf

const DataTransformer: React.FC<{ data: Expediente[] }> = ({ data }) => {

  const tableTitles = [codigoExp, linea, sublinea, "Importe"]

  let reducedTitles = tableTitles.map(columnTitle => {
    const title = columnTitle

    if (title?.toLowerCase().includes("grupo")) {
      return "Canal"
    }

    for (let possibleTitle of columnTitle.split("|")) {
      switch (possibleTitle) {
        case linea:
          return "Linea"
        case codigoExp:
          return "Exp"
        case sublinea:
          return "Sublinea"
        default:
          return title
      }
    }
  })

  const sol = {
    codigo: data[0][codigoSol] ?? data[0][codigoSolAlt],
    razonSocial: data[0][razonSocialCol],
    asesor: data[0][asesorComercial],
    canal: data[0][canalSol] ?? data[0][canalSolAlt],
    sucursal: data[0][sucursalCol],
    fechaIngreso: data[0][fechaIngresoCol],
    canalDeGR: data[0][canalGr]
  }

  const estado = () => {
    let sinAsignar = !data[0][analista]
    let isDevuelto = data[0][fechaDevolucion]
    let pendienteIngreso = !data[0][fechaIngresoCol]

    if (pendienteIngreso) {
      return <b>Pendiente de ingreso</b>
    }

    if (sinAsignar) {
      return <b>Sin asignar</b>
    }

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
        <p>Solicitud {sol.codigo}: {estado()}</p>
        <p>{sol.razonSocial}</p>
        <p> {sol.canal} {sol.canalDeGR}</p>
        <p></p>
        <p>{sol.asesor} ({sol.sucursal}) </p>
        <p>Ingreso a GR {sol.fechaIngreso}</p>
        <hr />
      </div>
      <table className={styles.hoverTable}>
        <thead>
          <tr>
            {
              reducedTitles.map((title) => <th
                key={title}
              >
                {title}
              </th>)
            }
          </tr>
        </thead>
        <tbody>
          {
            /* For each exp, read data from title*/
            data.map(exp => <tr key={exp[codigoExp] + "row"}>
              {
                tableTitles.map(title => {
                  const titleLow = title.toLowerCase()

                  return <td
                    key={exp[codigoExp] + title}
                  >{
                      titleLow.includes("canal") ?
                        getGrupoCanal(exp[title])
                        : titleLow.includes("importe")
                          ? getImporteSolicitud(exp)
                          : titleLow === "linea"
                            ? getLineaExpediente(exp)
                            : exp[title]
                    }
                  </td>
                })
              }
            </tr>)
          }
        </tbody>
      </table>
    </div>
  )
}


const HoverHandler: React.FC<HoverHandlerProps> = ({ data }) => {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 })
  const [hhPos, setHhPos] = React.useState({
    top: false,
    right: false,
  })

  const isMouseAtTop = () => (window.innerHeight / 2) > mousePos.y
  const isMouseAtRight = () => mousePos.x > (window.innerWidth / 2)


  const handleMouseMove = (e: any) => {
    setMousePos({ x: e.clientX, y: e.clientY })
    setHhPos({
      right: isMouseAtRight(),
      top: isMouseAtTop()
    })
  }

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  })

  return data && <aside
    style={{
      top: mousePos.y + (hhPos.top ? 15 : -15),
      left: mousePos.x + (hhPos.right ? -15 : 15)
    }}
    className={
      styles.wrapper + " " +
      (hhPos.top ? styles.top : "") + " " +
      (hhPos.right ? styles.right : "")
    }
  >
    <DataTransformer data={data} />
  </aside>
}

export default HoverHandler