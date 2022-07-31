import React from "react";
import columnasWf from "../../../config";
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
  const cantidadSol = Object.values(tableBody).length
  // TODO: hacer esto mas limpio
  const { razonSocial, estadoExp, analista, asesorComercial } = columnasWf
  let doubledSizedCols = [estadoExp, analista, asesorComercial]
  let maxSizedCol = [razonSocial]

  return (
    <>
      <i>{cantidadSol} solicitud{cantidadSol !== 1 && "es"} </i>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              {headers.map((header, index) => <th
                key={index}
                className={maxSizedCol.includes(header) ? styles.maxSized : doubledSizedCols.includes(header) ? styles.minSized : styles.normal}
              >{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {
              Object.values(tableBody).map((exp, index) => <tr key={index}>
                {
                  headers.map((value, index) => <td key={index}>{exp[value]}</td>)
                }
              </tr>
              )
            }

          </tbody>
        </table>
      </div>
    </>
  )
}

export default TablaGenerica