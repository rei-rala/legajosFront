import React, { useEffect, useMemo } from "react";
import TablaGenerica from "./generica/TablaGenerica";
import columnasWf from "../../config";

const tableName = "analisis"
// TODO: Hacer esto como la gente
const { canal, codigoSol, codigoExp, estadoExp, razonSocial, asesorComercial, sucursal } = columnasWf
const validColumns = [codigoSol, /* codigoExp, */ estadoExp, razonSocial, canal, asesorComercial, sucursal]


const Ingresar: React.FC<{ workflow: Workflow }> = ({ workflow }) => {

  const bodyCompleto = useMemo(() => {
    let tableBody: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in workflow) {
      let sol = workflow[solCode]
      for (const expCode of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Solicitud - Documentación Faltante y Pendiente de Aprobación"].includes((expCode[estadoExp] as string)) === false

        if (estadoExpInvalido) {
          continue;
        }


        // Si no existe la solicitud en tableBody, es creada con algunos valores ya unicos
        if (!tableBody[solCode]) {
          tableBody[solCode] = {}
        }


        tableBody[solCode][codigoSol] = expCode[codigoSol]
        tableBody[solCode][estadoExp] = expCode[estadoExp]
        tableBody[solCode][razonSocial] = expCode[razonSocial]
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
    document.title = "Workflow | Tabla [En análisis]";
  }, []);

  return (
    <div>
      <h3 style={{ marginTop: '1rem', marginBottom: "0.5rem" }}>Mostrando tabla de legajos por ingresar</h3>
      <TablaGenerica headers={validColumns} tableBody={bodyCompleto} tableName={tableName} />
    </div>
  )
}

export default Ingresar