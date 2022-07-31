import React, { createContext, useContext, useEffect, useState } from "react";
import { removeParsedWfFromLocalStorage, retrieveParsedWorkflow } from "../helpers";
import { getWorkflowHeaders } from "../helpers/workflowHelper";

type WorkflowContextType = {
  parsedWorkflow: Workflow | null,
  setParsedWorkflow: React.Dispatch<React.SetStateAction<Workflow | null>>,
  datosWF: PreviewWorkflow;
  saveWfToLocalStorage: (e: any) => void;
  clearWorkflowData: () => void;
}

export const Workflow = createContext<WorkflowContextType>({
  datosWF: {
    encabezados: [],
    qSolicitudes: 0,
    valuesExpExample: []
  },
  parsedWorkflow: null,
  setParsedWorkflow: () => { },
  saveWfToLocalStorage: () => { },
  clearWorkflowData: () => { },
})

type Props = { children: React.ReactNode }

export const WorkflowContext: (props: Props) => JSX.Element = ({ children }) => {
  const [parsedWorkflow, setParsedWorkflow] = useState<Workflow | null>(null)
  const [datosWF, setDatosWF] = useState<PreviewWorkflow>({
    encabezados: [],
    qSolicitudes: 0,
    valuesExpExample: []
  })

  function gestionarDatosWorkflow() {
    if (!parsedWorkflow) {
      throw "No se detecta workflow valido"
    }

    const encabezados: string[] = getWorkflowHeaders(parsedWorkflow)
    const valuesExpExample: any = []
    let solicitudes = Object.keys(parsedWorkflow)
    let expExample = parsedWorkflow[solicitudes[0]][0]
    const qSolicitudes = solicitudes.length

    if (encabezados.length == 0) {
      throw "No se detectan encabezados"
    }

    if (qSolicitudes == 0) {
      throw "No se detectan solicitudes"
    }

    if (!(expExample?.lenght !== 0)) {
      throw "No se detectan expedientes"
    }

    for (let columnName in expExample) {
      valuesExpExample.push(expExample[columnName]?.toString() ?? "")
    }

    setDatosWF({ encabezados, qSolicitudes, valuesExpExample })
  }

  function saveWfToLocalStorage(e: any) {
    e.preventDefault();
    if (!parsedWorkflow) {
      return
    }

    localStorage.setItem("parsedWorkflow", JSON.stringify(parsedWorkflow))
    localStorage.setItem("lastDateWF", "" + new Date().valueOf())
  }

  function clearWorkflowData() {
    setParsedWorkflow(null)
    setDatosWF({ encabezados: [], qSolicitudes: 0, valuesExpExample: [] })
    removeParsedWfFromLocalStorage()
  }

  useEffect(() => {
    if (parsedWorkflow) {
      gestionarDatosWorkflow()
    }
  }, [parsedWorkflow])

  useEffect(() => {
    let wf = retrieveParsedWorkflow()

    if (wf) {
      setParsedWorkflow(wf)
    }
  }, [])

  return (
    <Workflow.Provider value={{
      parsedWorkflow, setParsedWorkflow,
      datosWF,
      saveWfToLocalStorage,
      clearWorkflowData
    }}>
      {children}
    </Workflow.Provider>
  )
}

export const useWorkflow = () => {
  const context = useContext(Workflow);

  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }

  return context;
}