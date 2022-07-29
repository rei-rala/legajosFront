import React, { useEffect, useMemo } from "react";
import TablaGenerica from "./generica/TablaGenerica";
import columnasWf from "../../config";
import moment from "moment";

const tableName = "analisis"
// TODO: Hacer esto como la gente
const { canal, codigoSol, codigoExp, estadoExp, razonSocial, asesorComercial, sucursal, analista, fechaIngreso } = columnasWf
// las columnas tendran el orden que se asignen en este array
let validColumns = ["Días GR", fechaIngreso, codigoSol, /* codigoExp, */ estadoExp, razonSocial, canal, asesorComercial, sucursal, analista]


const Asignar: React.FC<{ workflow: Workflow }> = ({ workflow }) => {

  const bodyCompleto = useMemo(() => {
    let tableBody: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in workflow) {
      let sol = workflow[solCode]
      for (const expCode of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos"].includes((expCode[estadoExp] as string)) === false
        let analistaAsignado = expCode[analista];
        if (estadoExpInvalido || analistaAsignado) {
          continue;
        }
        
        // Si no existe la solicitud en tableBody, es creada con algunos valores ya unicos
        if (!tableBody[solCode]) {
          tableBody[solCode] = {}
        }

        tableBody[solCode][fechaIngreso] = expCode[fechaIngreso] && moment(expCode[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode]["Días GR"] = moment().diff(moment(expCode[fechaIngreso], "DD/MM/YYYY"), 'days') 

        tableBody[solCode][codigoSol] = expCode[codigoSol]
        tableBody[solCode][estadoExp] = expCode[estadoExp]
        tableBody[solCode][razonSocial] = expCode[razonSocial]
        tableBody[solCode][analista] = expCode[analista]

        tableBody[solCode][canal] = expCode[canal]
        tableBody[solCode][sucursal] = expCode[sucursal]
        tableBody[solCode][asesorComercial] = expCode[asesorComercial]
        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return tableBody
  }, [workflow])

  useEffect(() => {
    document.title = "Workflow | Tabla [Asignar]";
  }, []);

  return (
    <div>
      <h3 style={{ marginTop: '1rem', marginBottom: "0.5rem" }}>Mostrando tabla de legajos ingresados sin asignar</h3>
      <TablaGenerica headers={validColumns} tableBody={bodyCompleto} tableName={tableName} />
    </div>
  )
}

export default Asignar