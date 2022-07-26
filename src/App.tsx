import './styles/globals.css'
import Layout from './components/layout'
import { useState } from 'react'

import moment from 'moment'

type WorkflowObject = {
  [key: string | number]: any;
}

type Workflow = {
  [key: string]: WorkflowObject
}

function getColumnSolicitudExpediente(titles: string[]) {
  let currentCodExpedienteColumnName: string = import.meta.env.VITE_WF_CODIGO_SOLICITUD_COLUMN ?? "Expediente";

  return titles.findIndex(element => element === currentCodExpedienteColumnName);
}


function getColumnCodigoExpediente(titles: string[]) {
  let currentCodExpedienteColumnName: string = import.meta.env.VITE_WF_CODIGO_EXPEDIENTE_COLUMN ?? "Expediente";

  return titles.findIndex(element => element === currentCodExpedienteColumnName);
}

function parseWfObjectByName(title: string, value: string) {
  let currentWfColumnDate: string[] = import.meta.env.VITE_WF_DATE_COLUMNS || []
  let currentWfColumnFloat: string[] = import.meta.env.VITE_WF_FLOAT_COLUMNS || []
  let parsedValue = value.trim()

  if (parsedValue.length == 0) {
    return null;
  }

  // basic number
  if (!isNaN(+value)) {
    return +value
  }

  // float
  if (currentWfColumnFloat.includes(title) || title.toLowerCase().includes('importe')) {
    return +value.split("").filter(char => char !== ".").map(char => char === "," ? "." : char).join("");
  }

  if (title.toLowerCase().includes('fecha') || currentWfColumnDate.includes(title)) {
    // parse to date
    return moment(value, "dd/mm/YYYY").toDate()
  }

  return value;
}


async function workflowToArray(workflow: string) {
  const workflowArray = workflow.split("\n")
  let arrAux: string[][] = [];

  // La ultima linea copiada desde Excel es una linea vacia
  // De ahi el tope de la lista (-1)
  for (let i = 0; i < workflowArray.length - 1; i++) {
    let line = workflowArray[i].split("\t");
    line = line.map(item => item.trim())
    arrAux.push(line)
  }

  let lineSize = arrAux[0].length
  arrAux = arrAux.filter(v => v.length === lineSize)


  // TODO: Make more && smaller functions
  let columnTitles = arrAux[0];
  let codSolIndex = getColumnSolicitudExpediente(columnTitles)
  let codExpIndex = getColumnCodigoExpediente(columnTitles);

  let workflowObject: any = {}
  console.log(arrAux)

  for (let row of arrAux) {
    const codigoSolicitud = +row[codSolIndex]
    if (!codigoSolicitud) {
      continue;
    }

    const codigoExpediente = +row[codExpIndex]
    if (!codigoExpediente) {
      continue;
    }

    const rowObject: any = {}

    row.forEach((value, index) => {
      let columnTitle = columnTitles[index];
      rowObject[columnTitle] = parseWfObjectByName(columnTitle, value)
    })


    // MAKE "SOLICITUD" as ARRAY OF "EXPEDIENTES"
    if (!rowObject[codigoSolicitud]) {
      rowObject[codigoSolicitud] = []
    }
    rowObject[codigoSolicitud].push(rowObject)

    workflowObject[codigoSolicitud] = { ...workflowObject[codigoSolicitud], ...rowObject }
  }


  console.info(workflowObject)
  return workflowObject
}



function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [parserValue, setParserValue] = useState('')


  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setParserValue(e.target.value)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    Promise.resolve()
      .then(() => setIsLoading(true))
      .then(() => parserValue)
      .then(workflowToArray)
      .then(console.warn)
      .catch((err) => alert(err))
      .finally(() => setIsLoading(false))
  }

  return (
    <Layout>
      {isLoading && <div>Loading...</div>}
      <div id="PARSER">
        <h2>Bienvenido al parser</h2>

        <form onSubmit={handleSubmit}>

          <label htmlFor="input">Ingrese debajo el workflow correspondiente</label> <br />
          <textarea id="input"
            cols={100} rows={15}
            placeholder="Expediente, Codigo Solicitud, Estado Expediente, [...]"
            value={parserValue}
            onChange={handleChange}
          />

          <input type="submit" />
        </form>
      </div>
    </Layout>
  )
}

export default App
