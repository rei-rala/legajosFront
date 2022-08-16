import React from "react";

import columnasWf from "../../config";
import { shortenString } from "../../helpers";
import { getCanalGr } from "../../helpers/workflowHelper";
import styles from "./AnalistasMail.module.css";

type AnalistasAsignadosDia = { nombre: string, solicitudes: Expediente[] }[]
const { razonSocial: razonSocialColumn, codEmpresa: codEmpresaColumn, cuit: cuitColumn } = columnasWf

const AnalistasMail: React.FC<{ analistas: AnalistasAsignadosDia }> = ({ analistas: analistasAsignadosDia }) => {

  const [analistasNoIncluidos, setAnalistasNoIncluidos] = React.useState<string[]>([]);
  const tableRef = React.useRef<HTMLDivElement>(null);

  function toggleIncluirAnalista(analista: string) {
    let nuevosAnalistas: string[]

    if (analistasNoIncluidos.includes(analista)) {
      nuevosAnalistas = analistasNoIncluidos.filter(a => a !== analista);
    } else {
      nuevosAnalistas = [...analistasNoIncluidos, analista];
    }

    setAnalistasNoIncluidos(nuevosAnalistas);
  }

  return (
    <div className={styles.container} ref={tableRef}>
      <h3>Asignaciones del día</h3>
      <table className={styles.table}>
        <thead>
          {
            ["Analista", "Empresa"].map((col, i) => <th key={i}>{col}</th>)
          }
        </thead>
        <tbody>
          {
            analistasAsignadosDia.map((analista) => {
              return analistasNoIncluidos.includes(analista.nombre)
                ? null
                : <tr
                  key={analista.nombre}
                  onClick={() => toggleIncluirAnalista(analista.nombre)}
                  className={analistasNoIncluidos.includes(analista.nombre) ? styles.analistaExcluido : ""}
                >
                  <td>
                    <span>
                      {analista.nombre}
                    </span>
                  </td>
                  <td>
                    <ol>
                      {analista.solicitudes.map((solicitud) => {
                        let sol = solicitud[0]
                        return (
                          <li
                            className={styles.tableData}
                            key={sol[razonSocialColumn]}
                          >
                            <span>{sol[cuitColumn]}</span>
                            <a
                              href={`https://sga/Empresas/${sol[codEmpresaColumn]}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.preventDefault()}
                            >{shortenString(sol[razonSocialColumn])}</a>
                            <span> {getCanalGr(sol)}</span>
                          </li>
                        )
                      }
                      )}
                    </ol>
                  </td>
                </tr>
            })
          }
        </tbody>
      </table>

      {analistasNoIncluidos.length > 0 &&
        <div>
          <h4>Recuperar analistas filtrados</h4>
          <ul className={styles.listaExcluidos}>
            {
              analistasNoIncluidos.map((analista) => <li key={analista}><a href="#" onClick={() => toggleIncluirAnalista(analista)}>{analista}</a></li>)
            }
          </ul>
        </div>}

    </div>
  )
}

export default AnalistasMail