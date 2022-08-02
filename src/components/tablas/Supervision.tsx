import React, { useEffect } from "react";
import TablaGenerica from "./TablaGenerica/TablaGenerica";
import columnasWf from "../../config";

const tableName = "analisis"
// TODO: Hacer esto como la gente
const { canal, codigoSol, codigoExp, estadoExp, razonSocial, fechaIngreso, fechaAsignadoAnalista, fechaFinalizadoAnalista, faltaInfo, faltaInfoDesde, faltaInfoHasta, asesorComercial, sucursal, analista } = columnasWf
const validColumns = ["Días GR", "Días asignado", "Días pendiente", "Días supervisión", codigoSol, /* codigoExp, */ estadoExp, razonSocial, canal, fechaIngreso, fechaAsignadoAnalista, fechaFinalizadoAnalista, faltaInfo, faltaInfoDesde, faltaInfoHasta, asesorComercial, sucursal, analista]


const Supervision: React.FC<IWorkflowTable> = ({ tableBody }) => {

  useEffect(() => {
    document.title = "Workflow | Tabla: En supervisión";
  }, []);

  return (
    <div>
      <h3>Mostrando legajos para supervisar</h3>
      <TablaGenerica headers={validColumns} tableBody={tableBody} tableName={tableName} />
    </div>
  )
}

export default Supervision