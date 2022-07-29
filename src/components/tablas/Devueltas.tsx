import React, { useEffect, useMemo } from "react";
import TablaGenerica from "./generica/TablaGenerica";
import columnasWf from "../../config";
import moment from "moment"

const tableName = "analisis"
// TODO: Hacer esto como la gente
const { canal, codigoSol, estadoExp, razonSocial, fechaIngreso, fechaAsignadoAnalista, faltaInfo, faltaInfoDesde, faltaInfoHasta, asesorComercial, sucursal, analista, fechaDevolucion } = columnasWf
const validColumns = ["Días asignado", "Días pendiente", "Días devuelto", codigoSol, /* codigoExp, */ estadoExp, razonSocial, canal, fechaIngreso, fechaAsignadoAnalista, faltaInfo, faltaInfoDesde, faltaInfoHasta, asesorComercial, sucursal, analista, fechaDevolucion]


const Devueltas: React.FC<IWorkflowTable> = ({ tableBody }) => {

  useEffect(() => {
    document.title = "Workflow | Tabla [En análisis]";
  }, []);

  return (
    <div>
      <h3 style={{ marginTop: '1rem', marginBottom: "0.5rem" }}>Mostrando tabla de legajos devueltos</h3>
      <TablaGenerica headers={validColumns} tableBody={tableBody} tableName={tableName} />
    </div>
  )
}

export default Devueltas