import React, { useEffect } from "react";
import TablaGenerica from "./TablaGenerica/TablaGenerica";

const Completo: React.FC<IWorkflowTable> = ({ tableBody, headers }) => {

  useEffect(() => {
    document.title = "Workflow | Tabla completa";
  }, []);

  if (!headers || headers.length === 0) {
    return <div>No hay datos para mostrar</div>
  }

  return (
    <div>
      <h3>Mostrando tabla completa</h3>
      <TablaGenerica headers={headers} tableBody={tableBody} tableName={"completo"} />
    </div>
  )

}

export default Completo