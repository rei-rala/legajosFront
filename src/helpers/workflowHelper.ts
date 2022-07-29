import { moment } from "../libs"

export function getColumnSolicitudExpediente(titles: string[]) {
  let currentCodExpedienteColumnName = import.meta.env.VITE_WF_COD_SOLI_COLS.toLowerCase().split("|") ?? ["codigo solicitud"];

  return titles.findIndex(element => currentCodExpedienteColumnName.includes(element.toLowerCase()));
}


export function getColumnCodigoExpediente(titles: string[]) {
  let currentCodExpedienteColumnName = import.meta.env.VITE_WF_COD_EXPE_COLS.toLowerCase().split("|") ?? ["expediente"];

  return titles.findIndex(element => currentCodExpedienteColumnName.includes(element.toLowerCase()));
}

export function getColumnNameEstadoExpediente() {
  return import.meta.env.VITE_WF_EST_EXPE_COLS.toLowerCase().split("|") ?? ["estado expediente"];
}

export function getColumnNameCanal() {
  return import.meta.env.VITE_WF_CANAL_COLS.toLowerCase().split("|") ?? ["canal analisis solicitud"];
}


export function parseWfObjectByName(title: string, value: any): DatoExpediente {
  let currentWfColumnDate = import.meta.env.VITE_WF_DATE_COLUMNS.toLowerCase().split("|") || []
  let currentWfColumnFloat = import.meta.env.VITE_WF_FLOAT_COLUMNS.toLowerCase().split("|") || []

  const titleLower = title.toLowerCase();
  let parsedValue = value.trim()

  if (parsedValue.length == 0) {
    return null;
  }

  // basic number
  if (!isNaN(+value)) {
    return +value
  }

  // float
  if (currentWfColumnFloat.includes(titleLower) || titleLower.includes('importe')) {
    return +value.replace(".", "").replace(",", ".")
  }

  if (titleLower.includes('fecha') || currentWfColumnDate.includes(titleLower)) {
    // parse to date
    return moment(value, "DD/MM/YYYY").format("DD/MM/YYYY")
  }

  return value;
}


export function parseWorkflowData(workflowObject:Workflow ) {
  let { title, value } = workflowObject;
  return parseWfObjectByName("" + title, value)

}

export async function parseWorkflow(workflow: string) {
  const workflowArray = workflow.split("\n")
  let arrAux: string[][] = [];
  let workflowObject: Workflow = {}

  // La ultima linea copiada desde Excel es una linea vacia
  // De ahi el tope de la lista (-1)
  for (let i = 0; i < workflowArray.length - 1; i++) {
    let line = workflowArray[i].split("\t");
    line = line.map(item => item.trim())
    arrAux.push(line)
  }

  if (arrAux.length == 0) {
    return null;
  }

  let lineSize = arrAux[0].length
  arrAux = arrAux.filter(v => v.length === lineSize)


  // TODO: Make more && smaller functions
  let columnTitles = arrAux[0] ?? undefined;
  let codSolIndex = getColumnSolicitudExpediente(columnTitles)
  let codExpIndex = getColumnCodigoExpediente(columnTitles);

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
    if (!workflowObject[codigoSolicitud]) {
      workflowObject[codigoSolicitud] = []
      // Alternativa?
      //workflowObject[codigoSolicitud].expedientes = []
    }
    workflowObject[codigoSolicitud].push(rowObject)

  }

  return workflowObject
}


export function obtenerEncabezadosWorkflow(workflow: Workflow | null) {
  if (!workflow) {
    return ["Workflow no valido"]
  }

  let encabezados: string[] = []

  for (let solicitud in workflow) {
    for (let expediente of workflow[solicitud]) {
      for (let columna in expediente) {
        encabezados.push(columna)
      }
    }
    break;
  }

  return encabezados
}