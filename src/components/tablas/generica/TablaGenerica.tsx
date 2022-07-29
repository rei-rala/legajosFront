import React from "react";
import styles from "./TablaGenerica.module.css";

interface props {
  headers: string[],
  tableBody: {
    [codigoSol: string]: Expediente;
    [codigoSol: number]: Expediente;
  },
  tableName: string,
}

const TablaGenerica: React.FC<props> = ({ headers, tableBody }) => {
  return (
    <>
      <i>Conteo de solicitudes: {Object.values(tableBody).length}</i>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              {headers.map((header, index) => <th key={index}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {
              Object.values(tableBody).map((exp, index) => {
                return <tr key={index}>
                  {headers.map((value, index) => <td key={index}>{exp[value]}</td>)}
                </tr>
              })
            }

          </tbody>
        </table>
      </div>
    </>
  )
}

export default TablaGenerica