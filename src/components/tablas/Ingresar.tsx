import React, { useEffect, useMemo } from "react";
import TablaGenerica from "./generica/TablaGenerica";
import columnasWf from "../../config";

const tableName = "analisis"
// TODO: Hacer esto como la gente
const { canal, codigoSol, codigoExp, estadoExp, razonSocial, asesorComercial, sucursal } = columnasWf
const validColumns = [codigoSol, /* codigoExp, */ estadoExp, razonSocial, canal, asesorComercial, sucursal]


const Ingresar: React.FC<IWorkflowTable> = ({ tableBody }) => {

  useEffect(() => {
    document.title = "Workflow | Tabla [En análisis]";
  }, []);

  return (
    <div>
      <h3 style={{ marginTop: '1rem', marginBottom: "0.5rem" }}>Mostrando tabla de legajos por ingresar</h3>
      <TablaGenerica headers={validColumns} tableBody={tableBody} tableName={tableName} />
    </div>
  )
}

export default Ingresar