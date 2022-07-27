import "./styles/globals.css";
import Layout from "./components/layout";
import { useState } from "react";

import moment from "moment";

type WorkflowObject = {
  [key: string | number]: any;
};

type Workflow = {
  [key: string]: WorkflowObject;
};

function getColumnCodSolicitud(titles: string[]) {
  let currentCodSolColumnName = import.meta.env.VITE_WF_CODIGO_SOLICITUD_COLUMN.toLowerCase().split("|") ?? ["codigo solicitud", "codigo solicitud"];

  return titles.findIndex((elem) => {
    let titleLower = elem.toLowerCase()
    return currentCodSolColumnName.includes(titleLower)
  });
}

function getColumnCodExpediente(titles: string[]) {
  let currentCodExpColumnName = import.meta.env.VITE_WF_CODIGO_EXPEDIENTE_COLUMN.toLowerCase().split("|") ?? ["expediente"];

  return titles.findIndex((elem) => {
    let titleLower = elem.toLowerCase()
    return currentCodExpColumnName.includes(titleLower)
  });
}

function parseWfObjectByName(title: string, value: string) {
  const titleLower = title.toLowerCase()

  let currentWfColumnDate = import.meta.env.VITE_WF_DATE_COLUMNS.toLowerCase().split("|") ?? [];
  let currentWfColumnFloat = import.meta.env.VITE_WF_FLOAT_COLUMNS.toLowerCase().split("|") ?? [];

  let trimmedValue = value.trim();
  if (trimmedValue.length == 0) {
    return null;
  }

  // basic number
  if (!isNaN(+trimmedValue)) {
    return +trimmedValue;
  }

  // float
  if (currentWfColumnFloat.includes(titleLower) || titleLower.includes("importe")) {
    return +trimmedValue
      .split("")
      .filter((char) => char !== ".")
      .map((char) => (char === "," ? "." : char))
      .join("");
  }

  if (titleLower.includes("fecha") || currentWfColumnDate.includes(titleLower)) {
    // parse to date
    return moment(trimmedValue, "dd/mm/YYYY").toDate();
  }

  return trimmedValue;
}

async function parseWfToObject(workflow: string) {
  let arrAux: string[][] = [];

  // Arrays of rows
  const workflowArray = workflow.split("\n");

  // Copying an entire excel table leaves a blank row at the end ("\n")
  // Therefore, omitting last row by default 
  for (let i = 0; i < workflowArray.length - 1; i++) {
    let line = workflowArray[i].split("\t");
    line = line.map((item) => item.trim());
    arrAux.push(line);
  }

  let lineSize = arrAux[0].length;
  arrAux = arrAux.filter((v) => v.length === lineSize);

  // TODO: Make more && smaller functions
  let columnTitles = arrAux[0];
  let codSolIndex = getColumnCodSolicitud(columnTitles);
  let codExpIndex = getColumnCodExpediente(columnTitles);

  const workflowObject: WorkflowObject = {};

  if (-1 in [codExpIndex, codSolIndex]) {
    return null;
  }

  // Skipping column titles (row 0)
  for (let i = 1; i < arrAux.length; i++) {
    let row = arrAux[i];

    const codigoSolicitud = +row[codSolIndex];
    if (!codigoSolicitud || isNaN(codigoSolicitud)) {
      continue;
    }

    const codigoExpediente = +row[codExpIndex];
    if (!codigoExpediente || isNaN(codigoExpediente)) {
      continue;
    }

    // make "SOLICITUD" as array of "EXPEDIENTES"
    if (!(workflowObject[codigoSolicitud])) {
      workflowObject[codigoSolicitud] = {};
    }

    if (codigoExpediente in workflowObject[codigoSolicitud]) {
      continue;
    }

    const rowObject: any = {};

    row.forEach((value, index) => {
      let columnTitle = columnTitles[index];
      rowObject[columnTitle] = parseWfObjectByName(columnTitle, value);
    });

    workflowObject[codigoSolicitud][codigoExpediente] = rowObject;
  }

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
      .then(parseWfToObject)
      .then(console.info)
      .catch(alert)
      .finally(() => setIsLoading(false));
  }

  return (
    <Layout>
      <div id="PARSER">
        <h2>Bienvenido al parser</h2>

        {isLoading && <b>CARGANDO...</b>}
        <form onSubmit={handleSubmit}>

          <label htmlFor="input">Ingrese debajo el workflow correspondiente</label> <br />
          <textarea
            id="input"
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

export default App;
