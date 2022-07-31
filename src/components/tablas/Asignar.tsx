import React, { useEffect } from "react";
import TablaGenerica from "./TablaGenerica/TablaGenerica";
import columnasWf from "../../config";

const tableName = "analisis"
// TODO: Hacer esto como la gente
const { canal, codigoSol, codigoExp, estadoExp, razonSocial, asesorComercial, sucursal, analista, fechaIngreso } = columnasWf
// las columnas tendran el orden que se asignen en este array
let validColumns = ["Días GR", fechaIngreso, codigoSol, /* codigoExp, */ estadoExp, razonSocial, canal, asesorComercial, sucursal, analista]

const Asignar: React.FC<IWorkflowTable> = ({ tableBody }) => {

  useEffect(() => {
    document.title = "Workflow | Tabla [Asignar]";
  }, []);

  return (
    <div>
      <h3>Mostrando legajos ingresados sin asignar</h3>
      <TablaGenerica headers={validColumns} tableBody={tableBody} tableName={tableName} />
    </div>
  )
}

export default Asignar