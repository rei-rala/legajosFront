import columnasWf from "../config";
import moment from "../libs/moment";

export function getColumnSolicitudExpediente(titles: string[]) {
  const { codigoSol, codigoSolAlt } = columnasWf
  let currentCodExpedienteColumnName = [codigoSol, codigoSolAlt] ?? ["codigo solicitud"];

  for (let v of currentCodExpedienteColumnName) {
    let index = titles.indexOf(v)

    if (index >= 0) {
      return index
    }
  }
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
  const { date, float } = columnasWf;
  let currentWfColumnDate = date || []
  let currentWfColumnFloat = float || []

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
    let arrValue = parsedValue.split("").filter((element: string) => [".", "."].includes(element) === false).map((element: string) => element === "," ? "." : element).join("")

    return +arrValue !== 0 ? +arrValue : null
  }

  if (titleLower.includes('fecha') || currentWfColumnDate.includes(titleLower)) {
    // parse to date
    return moment(value, "DD/MM/YYYY").format("DD/MM/YYYY")
  }

  return value;
}


export function parseWorkflowData(workflowObject: Workflow) {
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

  let lineSize = arrAux[0]?.length
  arrAux = arrAux.filter(v => v.length === lineSize)

  // TODO: Make more && smaller functions
  let columnTitles = arrAux[0] ?? undefined;
  let codSolIndex = getColumnSolicitudExpediente(columnTitles)
  let codExpIndex = getColumnCodigoExpediente(columnTitles);

  if (!codSolIndex || codExpIndex < 0) {
    alert("No se encontro el codigo de solicitud en el workflow")
    return null
  }

  for (let row of arrAux) {
    const codigoSolicitud = +row[codSolIndex]
    if (!codigoSolicitud) {
      continue;
    }

    const codigoExpediente = +row[codExpIndex]
    if (!codigoExpediente) {
      continue;
    }

    let sucursal = row[columnTitles.indexOf("Sucursal Garantizar")]
    if (sucursal.toLowerCase() === "digital") {
      continue;
    }


    let gtiaSucursal = row[columnTitles.indexOf("Canal Solicitud")]
    if (gtiaSucursal.toLowerCase() === "garantía sucursal") {
      continue
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

export function getWorkflowHeaders(workflow: Workflow | null) {
  let headers: string[] = []


  if (!workflow) {
    return headers
  }

  for (const sol in workflow) {
    for (const exp of workflow[sol]) {
      headers = Object.keys(exp)
      break;
    }
    break;
  }

  return headers
}


export function getCanalGr(expediente: Expediente) {
  const { canalGr } = columnasWf

  return expediente[canalGr]
}


export function getNivel(expediente: Expediente) {
  const { canal, canalAlt } = columnasWf
  let nivelColNames = [canal, canalAlt] || ["Grupo de Canal Análisis según SGA"]
  let found = "n/a";

  for (let property in expediente) {
    if (nivelColNames.includes(property)) {
      found = ("" + expediente[property]).toLowerCase()
      break
    }
  }

  if (found.includes("expr")) {
    return "EXP"
  } else if (found.includes("productivas")) {
    return "GP"
  } else if (found.includes("2")) {
    return "N2"
  } else if (found.includes("1")) {
    return "N1"
  } else if (found.includes("comisión")) {
    return "CG"
  }

  return found
}

export const getGrupoCanal = (expediente: Expediente) => {
  const { canal, canalAlt } = columnasWf
  let nivelColNames = [canal, canalAlt] || ["Grupo de Canal Análisis según SGA"]

  let found = "n/a";
  for (let col of nivelColNames) {
    console.log(col)
  }
}


export function getImporteSolicitud(expediente: Expediente) {
  const { importeOrigen, importeOrigenAlt, monedaOrigen } = columnasWf
  const importeSolicitudColNames = [importeOrigen, importeOrigenAlt] || ["Importe Solicitado"]
  let monedaSolicitudColName = [monedaOrigen] || ["Moneda Solicitud"]
  let found: string = "";

  for (let impColName of importeSolicitudColNames) {
    let tryColName = expediente[impColName]

    if (tryColName) {
      let miles = ("" + ((tryColName ?? 0) / 1000))

      found = found + miles.toLocaleString() + " M"
    }
  }

  for (let monedaColName in monedaSolicitudColName) {
    let tryColName = expediente[monedaColName] as string
    if (tryColName) {
      if (tryColName.includes("usd") || tryColName.includes("dolar") || tryColName.includes("dólar")) {
        found = "U$S " + found
      } else if (tryColName.includes("eur")) {
        found = "€ " + found
      } else if (tryColName.includes("uva")) {
        found = "UVA " + found
      } else {
        found = "$ " + found
      }
    }
  }

  if (found === "") {
    let aux: string = (expediente["Importe Solicitado"] ? (expediente["Importe Solicitado"] as number / 1000) : 0).toFixed(0) + " M"

    let moneda: any = ("" + expediente["Moneda Solicitud"]).toLowerCase()

    if (moneda) {
      if (moneda.includes("usd") || moneda.includes("dolar") || moneda.includes("dólar")) {
        aux = "U$S " + aux
      } else if (moneda.includes("eur")) {
        aux = "€ " + aux
      } else if (moneda.includes("uva")) {
        aux = "UVA " + aux
      } else {
        aux = "$ " + aux
      }
    }
    return aux
  }
  return found
}

export function getLineaExpediente(expediente: Expediente) {
  let lineaExpedienteColNames = /* import.meta.env.VITE_WF_LINEA_EXPEDIENTE_COLS.split("|") ||  */"SubLínea Solicitud"

  let found = (expediente[lineaExpedienteColNames] as string).toLowerCase()

  if (found.includes("amortizable")) {
    return found === "Amortizable Revolving".toLowerCase() ? "CPDP Rev" : "CPDP no rev"
  }
  if (found.includes("linea")) {
    return found.includes("espejo") ? "Terceros E" : "Terceros C"
  }
  if (found.includes("financiera")) {
    return "GF"
  }
  if (found.includes("comercial")) {
    return "GC"
  }
  if (found.includes("operaciones")) {
    return "GC"
  }
  if (found.includes("o.n.")) {
    return "ON"
  }
  if (found.includes("virtual")) {
    return "virtual"
  }
  if (found.includes("productivas")) {
    return "GP"
  }
  if (found.includes("exportaciones")) {
    return "Expo"
  }

  return found
}