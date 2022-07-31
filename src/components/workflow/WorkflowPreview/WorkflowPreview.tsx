import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useWorkflow } from "../../../context/Workflow";
import { parseWfObjectByName } from "../../../helpers/workflowHelper";
import styles from "./WorkflowPreview.module.css";

const WorkflowPreview: React.FC = () => {

  const [redirect, setRedirect] = useState(false)
  const { datosWF: { encabezados, qSolicitudes, valuesExpExample }, saveWfToLocalStorage } = useWorkflow()

  function saveAndRedirect(e: any) {
    saveWfToLocalStorage(e)
    setRedirect(true)
  }

  if (redirect) {
    return <Navigate to="/workflow/resumen" />
  }

  return <form>
    <div className={styles.tableSection}>
      <h3> Se detectaron los siguientes datos:</h3>
      <ul>
        <li>Cantidad de solicitudes: {qSolicitudes}</li>
        <li>Cantidad encabezados: {encabezados.length} </li>
      </ul>

      <h4>Previsualizando tabla</h4>


      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead><tr>{encabezados.map((e) => <th key={e}>{e}</th>)}</tr></thead>
          <tbody>
            <tr>
              {
                valuesExpExample.map((e, i) => <td key={`exampleC${i}`}>
                  {parseWfObjectByName(encabezados[i], e)?.toString() ?? ""}
                </td>)
              }
            </tr>
            <tr>
              {
                valuesExpExample.map((e, i) => <td key={`exampleC${i}`}>
                  {parseWfObjectByName(encabezados[i], e)?.toString() ?? ""}
                </td>
                )
              }
            </tr>

            <tr>
              {
                valuesExpExample.map((e, i) => <td key={`exampleC${i}`}>
                  {parseWfObjectByName(encabezados[i], e)?.toString() ?? ""}
                </td>)
              }
            </tr>
            
          </tbody>
        </table>
      </div>

    </div>

    <p>La informacion es correcta? <button onClick={saveAndRedirect} >Guardar workflow y continuar</button></p>

  </form>
}
export default WorkflowPreview