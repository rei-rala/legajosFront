import React, { useEffect, useState } from "react";
import columnasWf from "../../../config";
import { useUser, useWorkflow } from "../../../context";
import HoverHandler from "../../HoverHandler/HoverHandler";
import styles from "./TablaGenerica.module.css";

type TableOrder = {
  columnName: string;
  order: "asc" | "desc";
}
interface props {
  headers: string[],
  tableBody: {
    [codigoSol: string]: Expediente;
    [codigoSol: number]: Expediente;
  },
  tableName?: string,
}

const { razonSocial, codigoSol, codigoSolAlt, estadoExp, canal, canalAlt, analista, asesorComercial } = columnasWf

const TablaGenerica: React.FC<props> = ({ tableName, headers, tableBody }) => {
  const { parsedWorkflow } = useWorkflow()
  const { toggleHoverInfo, preferences: { hideHoverInfo } } = useUser()
  const [data, setData] = useState(Object.values(tableBody))

  const [sortedBy, setSortedBy] = useState<TableOrder>({ columnName: "", order: "desc", })
  const changeOrder = (columnName: string) => {
    setSortedBy({
      columnName,
      order: sortedBy.columnName === columnName ? sortedBy.order !== "desc" ? "desc" : "asc" : 'asc',
    })
  }

  const [hovered, setHovered] = useState<Expediente[] | undefined>(undefined)

  const cantidadSol = Object.values(tableBody).length
  // TODO: hacer esto mas limpio
  let doubledSizedCols = [estadoExp, analista, asesorComercial]
  let maxSizedCol = [razonSocial]

  function mouseEnterLeaveHandler(expediente?: Expediente) {
    if (hideHoverInfo) return

    if (!expediente) {
      setHovered(undefined)
      return
    }

    if (parsedWorkflow) {
      let hoveredSolicitud = (expediente[codigoSol] || expediente[codigoSolAlt])
      setHovered(parsedWorkflow[hoveredSolicitud])
    }
  }


  useEffect(() => {
    setData(Object.values(tableBody))
  }, [tableBody])

  useEffect(() => {
    Promise.resolve([])
      .then((d: Expediente[]) => setData(d))
      .then(() => data.sort((a, b) => {
        let aVal = a[sortedBy.columnName] ?? "*"
        let bVal = b[sortedBy.columnName] ?? "*"
        if (sortedBy.order === "asc") {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      }))
      .then((d) => setData(d))
  }, [sortedBy])

  useEffect(() => {
    setSortedBy({
      columnName: headers[0],
      order: "desc",
    })
  }, [headers])


  return (
    <>
      <i>{cantidadSol} solicitud{cantidadSol !== 1 && "es"} {tableName ? tableName : ""} </i>
      <HoverHandler data={hovered} />


      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              {headers.map((header, index) => <th
                key={index}
                className={maxSizedCol.includes(header) ? styles.maxSized : doubledSizedCols.includes(header) ? styles.minSized : styles.normal}
              >
                <span
                  onClick={() => changeOrder(header)}
                  className={styles.tableSorter}
                >
                  {header}
                  {
                    sortedBy.columnName === header &&
                    <span className={styles.sortIcon}>
                      {sortedBy.order === "asc" ? "▲" : "▼"}
                    </span>
                  }
                </span>
              </th>)}
            </tr>
          </thead>
          <tbody>
            {
              data.map((exp, index) => <tr
                key={"tablerow" + index}
                onMouseEnter={() => mouseEnterLeaveHandler(exp)}
                onMouseLeave={() => mouseEnterLeaveHandler(undefined)}
              >
                {
                  headers.map((value, index) => <td key={"header" + index + "-" + index} >
                    {exp[value]}
                  </td>)
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