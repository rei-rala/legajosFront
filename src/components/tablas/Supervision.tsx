import React, { useEffect, useMemo } from "react";
import TablaGenerica from "./generica/TablaGenerica";
import columnasWf from "../../config";
import moment from "moment"

const tableName = "analisis"
// TODO: Hacer esto como la gente
const { canal, codigoSol, codigoExp, estadoExp, razonSocial, fechaIngreso, fechaAsignadoAnalista, fechaFinalizadoAnalista, faltaInfo, faltaInfoDesde, faltaInfoHasta, asesorComercial, sucursal, analista } = columnasWf
const validColumns = ["Días GR", "Días asignado", "Días pendiente", "Días supervisión", codigoSol, /* codigoExp, */ estadoExp, razonSocial, canal, fechaIngreso, fechaAsignadoAnalista, fechaFinalizadoAnalista, faltaInfo, faltaInfoDesde, faltaInfoHasta, asesorComercial, sucursal, analista]


const Supervision: React.FC<{ workflow: Workflow }> = ({ workflow }) => {

  const bodyCompleto = useMemo(() => {
    let tableBody: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in workflow) {
      let sol = workflow[solCode]
      for (const expCode of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos", "Analisis"].includes((expCode[estadoExp] as string)) === false
        let faltanteInfo = expCode[faltaInfo] === 'Si';
        let faltanteAnalista = !expCode[analista] || expCode[analista] === '';
        let sinFinalizar = !expCode[fechaFinalizadoAnalista]

        if (faltanteAnalista || estadoExpInvalido || faltanteInfo || sinFinalizar) {
          continue;
        }


        // Si no existe la solicitud en tableBody, es creada con algunos valores ya unicos
        if (!tableBody[solCode]) {
          tableBody[solCode] = {}
        }


        tableBody[solCode][codigoSol] = expCode[codigoSol]
        tableBody[solCode][estadoExp] = expCode[estadoExp]
        tableBody[solCode][razonSocial] = expCode[razonSocial]
        tableBody[solCode][fechaIngreso] = expCode[fechaIngreso] && moment(expCode[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][fechaAsignadoAnalista] = expCode[fechaAsignadoAnalista] && moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][faltaInfoDesde] = expCode[faltaInfoDesde] && moment(expCode[faltaInfoDesde], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][faltaInfoHasta] = expCode[faltaInfoHasta] && moment(expCode[faltaInfoHasta], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][fechaFinalizadoAnalista] = expCode[fechaFinalizadoAnalista] && moment(expCode[fechaFinalizadoAnalista], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][analista] = expCode[analista]
        tableBody[solCode][canal] = expCode[canal]
        tableBody[solCode][sucursal] = expCode[sucursal]
        tableBody[solCode][asesorComercial] = expCode[asesorComercial]
        tableBody[solCode]["Días GR"] = moment().diff(moment(expCode[fechaIngreso], "DD/MM/YYYY"), 'days')
        tableBody[solCode]["Días asignado"] = moment().diff(moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY"), 'days')
        tableBody[solCode]["Días supervisión"] = moment().diff(moment(expCode[fechaFinalizadoAnalista], "DD/MM/YYYY"), 'days')
        tableBody[solCode]["Días pendiente"] = expCode[faltaInfoHasta] ? moment(expCode[faltaInfoHasta], "DD/MM/YYYY").diff(moment(expCode[faltaInfoDesde], "DD/MM/YYYY"), 'days') : '-'

        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return tableBody
  }, [workflow])

  useEffect(() => {
    document.title = "Workflow | Tabla [En supervisión]";
  }, []);

  return (
    <div>
      <h3 style={{ marginTop: '1rem', marginBottom: "0.5rem" }}>Mostrando tabla de legajos para supervisar</h3>
      <TablaGenerica headers={validColumns} tableBody={bodyCompleto} tableName={tableName} />
    </div>
  )
}

export default Supervision