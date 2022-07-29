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