import React, { useEffect, useMemo } from "react";
import TablaGenerica from "./generica/TablaGenerica";



const Resumen: React.FC = () => {



  useEffect(() => {
    document.title = "Workflow | Resumen";
  }, []);

  return (
    <div>
      <h3 style={{ marginTop: '1rem', marginBottom: "0.5rem" }}>Mostrando Resumen</h3>
      {/* <TablaGenerica headers={headers} tableBody={asignarBody} tableName={"completo"} /> */}
    </div>
  )
}

export default Resumen