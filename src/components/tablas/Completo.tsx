import React, { useEffect, useMemo } from "react";
import TablaGenerica from "./generica/TablaGenerica";


const Completo: React.FC<{ workflow: Workflow, headers: string[] }> = ({ workflow, headers }) => {

  const bodyCompleto = useMemo(() => {
    let tableBody: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in workflow) {
      let sol = workflow[solCode]
      for (const expCode of sol) {

        // Si no existe la solicitud en tableBody, es creada con algunos valores ya unicos
        if (!tableBody[solCode]) {
          tableBody[solCode] = {}
        }

        for (let [column, value] of Object.entries(expCode)) {
          tableBody[solCode][column] = value
          /*        
            if (column in columns.date) {
              tableBody[solCode][column] = value
            }
  
            if (column in columns.float) {
              tableBody[solCode][column] = 0
            }
          */

        }
        break;
      }
    }
    return tableBody
  }, [workflow, headers])

  useEffect(() => {
    document.title = "Workflow | Tabla completa [Resumen]";
  }, []);

  return (
    <div>
      <h3 style={{ marginTop: '1rem', marginBottom: "0.5rem" }}>Mostrando tabla completa</h3>
      <TablaGenerica headers={headers} tableBody={bodyCompleto} tableName={"completo"} />
    </div>
  )
}

export default Completo