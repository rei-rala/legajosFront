import React, { useEffect } from "react";
import TablaGenerica from "./TablaGenerica/TablaGenerica";
import columnasWf from "../../config";

// TODO: Hacer esto como la gente
const { canal, codigoSol, codigoExp, estadoExp, razonSocial, asesorComercial, sucursal } = columnasWf
const validColumns = [codigoSol, /* codigoExp, */ estadoExp, razonSocial, canal, asesorComercial, sucursal]


const Ingresar: React.FC<IWorkflowTable> = ({ tableBody }) => {

  useEffect(() => {
    document.title = "Workflow | Tabla: Ingresar";
  }, []);

  return (
    <div>
      <h3>Mostrando legajos por ingresar</h3>
      <TablaGenerica headers={validColumns} tableBody={tableBody} />
    </div>
  )
}

export default Ingresar