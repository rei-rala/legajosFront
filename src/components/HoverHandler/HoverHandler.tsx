import React, { useEffect } from "react";
import columnasWf from "../../config";
import { getDateDiff, getDateDMM, momentFromToday } from "../../helpers";
import { getGrupoCanal, getImporteSolicitud, getLineaExpediente } from "../../helpers/workflowHelper";

import styles from "./HoverHandler.module.css"

interface HoverHandlerProps {
  data?: any
}

function getEstado(sol: any) {
  let sinAsignar = !sol.analista
  let isFinalizado = sol.fechaFinalizado
  let faltanteInfo = sol.isPendiente ?? false
  let isDevuelto = sol.fechaDevolucion && faltanteInfo
  let pendienteIngreso = !sol.fechaIngreso

  if (pendienteIngreso) {
    return <b>Pendiente de ingreso</b>
  }

  if (sinAsignar) {
    return <b>Sin asignar</b>
  }

  if (isDevuelto) {
    return <b>Devuelto</b>
  }

  if (isFinalizado) {
    return <b>Finalizado</b>
  }


  if (faltanteInfo) {
    return <b>Pendiente</b>
  }

  return <b>En análisis</b>
}

const { analista, razonSocial: razonSocialCol,
  codigoSol, codigoSolAlt, codigoExp, canalGr, canal: canalSol, canalAlt: canalSolAlt, linea, sublinea,
  asesorComercial, sucursal: sucursalCol,
  rvPotencial,
  fechaIngreso: fechaIngresoCol, fechaAsignadoAnalista: fechaAsignadoCol, fechaDevolucion, fechaFinalizadoAnalista,
  faltaInfo, faltaInfoDesde, faltaInfoHasta,
} = columnasWf

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
    estado: <></>,
    asesor: data[0][asesorComercial],
    analista: data[0][analista],
    canal: data[0][canalSol] ?? data[0][canalSolAlt],
    sucursal: data[0][sucursalCol],
    fechaIngreso: getDateDMM(data[0][fechaIngresoCol]),
    fechaAsignado: getDateDMM(data[0][fechaAsignadoCol]),
    isPendiente: data[0][faltaInfo],
    fechaPendDesde: getDateDMM(data[0][faltaInfoDesde]),
    fechaPendHasta: getDateDMM(data[0][faltaInfoHasta]),
    fechaDevolucion: getDateDMM(data[0][fechaDevolucion]),
    fechaFinalizado: getDateDMM(data[0][fechaFinalizadoAnalista]),
    canalDeGR: data[0][canalGr],
    rvPotencial: data[0][rvPotencial]
  }

  sol.estado = getEstado(sol)

  const dayCount = {
    ingreso: momentFromToday(sol.fechaIngreso),
    asignado: momentFromToday(sol.fechaAsignado),
    pendiente: momentFromToday(sol.fechaPendDesde),
    devuelto: momentFromToday(sol.fechaDevolucion),
    finalizado: momentFromToday(sol.fechaFinalizado),

    diffPendiente: getDateDiff(sol.fechaPendHasta, sol.fechaPendDesde, "D/MM"),
  }

  return (
    <div>
      <div>
        <p>Solicitud {sol.codigo}: {sol.estado}</p>
        <p>{sol.razonSocial}</p>
        <p>{sol.canal} {sol.canalDeGR}</p>
        <p>{rvPotencial && `RV Potencial sin CPDT $ ${sol.rvPotencial}`}</p>
        <p>{sol.asesor} ({sol.sucursal}) </p>
        {sol.fechaIngreso && <>
          <hr />
          <p>Ingreso a GR {sol.fechaIngreso} ({dayCount.ingreso !== 0 ? (dayCount.ingreso + "d") : "Hoy"}) </p>
          {sol.fechaAsignado && <p>Asignado {sol.fechaAsignado} ({dayCount.asignado !== 0 ? (dayCount.asignado + "d") : "Hoy"}) </p>}
          {sol.isPendiente && <p>Pendiente desde {sol.fechaPendDesde} ({dayCount.pendiente !== 0 ? (dayCount.pendiente + "d") : "Hoy"}) </p>}
          {!sol.isPendiente && dayCount.diffPendiente !== null && <p>Pendiente entre {sol.fechaPendDesde} y {sol.fechaPendHasta} ({dayCount.diffPendiente! + 1}d)</p>}
          {sol.fechaDevolucion && <p>Devuelto {sol.fechaDevolucion} ({dayCount.devuelto !== 0 ? (dayCount.devuelto + "d") : "Hoy"}) </p>}
          {sol.fechaFinalizado && <p>Finalizado {sol.fechaFinalizado} ({dayCount.finalizado !== 0 ? (dayCount.finalizado + "d") : "Hoy"}) </p>}
        </>}
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