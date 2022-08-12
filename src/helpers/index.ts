import moment, { Moment } from "../libs/moment";

import {
  getColumnSolicitudExpediente,
  getColumnCodigoExpediente,
  getColumnNameEstadoExpediente,
  getColumnNameCanal,
  parseWfObjectByName,
  parseWorkflowData,
  parseWorkflow,
  getWorkflowHeaders
} from "./workflowHelper"

export function saveWorkflow(workflow: Workflow | null) {
  try {
    let wf = JSON.parse(JSON.stringify(workflow))
    localStorage.setItem("parsedWorkflow", JSON.stringify(wf))
    console.info("Workflow saved")
  } catch (err) {
    console.warn("Workflow not saved")
  }
}

export function retrieveParsedWorkflow(): Workflow | null {
  try {
    let wf = JSON.parse(localStorage.getItem("parsedWorkflow") ?? "") ?? null
    console.info("Workflow retrieved")
    return wf;
  } catch (err) {
    console.warn("Workflow not retrieved")
    return null
  }
}

export function removeParsedWfFromLocalStorage() {
  try {
    localStorage.removeItem("parsedWorkflow")
    localStorage.removeItem("lastDateWF")
    console.info("Workflow removed")
  } catch (err) {
    console.warn("Workflow not removed")
  }
}

export {
  getColumnSolicitudExpediente,
  getColumnCodigoExpediente,
  getColumnNameEstadoExpediente,
  getColumnNameCanal,
  parseWfObjectByName,
  parseWorkflowData,
  parseWorkflow,
  getWorkflowHeaders
}



export function saveDateToSession(dateAsString: string) {
  const date = moment(dateAsString)
  const dateAsStringWithFormat = date.format("YYYY-MM-DD")
  sessionStorage.setItem("date", dateAsStringWithFormat)
}

export function retrieveLastDateFromSession() {
  const lastDate = sessionStorage.getItem("lastDate") || undefined
  let asMoment = moment(lastDate)

  if (!asMoment.isValid()) {
    asMoment = moment()
  }
  return asMoment
}


export function shortenString(str: string, maxLength: number = 40) {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "..."
  }
  return str
}

export function momentFromToday(date: Moment | Date | string | null) {
  if (!date) {
    return null
  }

  const today = moment()
  let inputDate;

  if (typeof date === "string") {
    inputDate = moment(date, "DD/MM/YYYY")

    if (!inputDate.isValid()) {
      inputDate = moment(date, "D/MM")
    }

    if (!inputDate.isValid()) {
      inputDate = moment(date, "D/M")
    }

    if (!inputDate.isValid()) {
      inputDate = moment(date)
    }

  } else {
    inputDate = moment(date)
  }

  return today.diff(inputDate, "days")
}

export function getDateDiff(dateA: Moment | Date | string | null, dateB: Moment | Date | string | null, inputFormatDate: string = "DD/MM/YYYY") {
  if (!dateA || !dateB) {
    return null
  }

  let first, second;

  first = typeof dateA === "string" ? moment(dateA, inputFormatDate) : moment(dateA)
  second = typeof dateB === "string" ? moment(dateB, inputFormatDate) : moment(dateB)

  return first.diff(second, "days")
}

export function getDateDMM(date: Moment | Date | string | null, inputFormatDate: string = "DD/MM/YYYY") {
  if (!date) {
    return null
  }
  let inputDate = typeof date === "string" ? moment(date, inputFormatDate) : moment(date)

  return inputDate.format("D/MM")
}