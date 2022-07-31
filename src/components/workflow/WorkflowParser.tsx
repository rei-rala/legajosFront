import React, { useEffect, useState } from "react";

import WorkflowPreview from "./WorkflowPreview/WorkflowPreview";
import WorkflowInput from "./WorkflowInput/WorkflowInput";
import { parseWorkflow } from "../../helpers/workflowHelper";
import { useWorkflow, useLoading } from "../../context";

import styles from './WorkflowParser.module.css';


const WorkflowParser: React.FC = () => {
  const { pushLoading, popLoading } = useLoading()
  const { parsedWorkflow, setParsedWorkflow, clearWorkflowData } = useWorkflow()

  const [error, setError] = useState<string | null>(null)

  function submitWorkflow(workflow: string) {
    return Promise.resolve()
      .then(() => pushLoading("Parsing workflow"))
      .then(() => parseWorkflow(workflow))
      .then(setParsedWorkflow)
      .catch((err) => setError("Workflow no valido:\n\t" + err))
      .finally(() => popLoading("Parsing workflow"))
  }


  function resetSavedWorkflows(e: React.FormEvent<any>) {
    e.preventDefault();
    clearWorkflowData()
  }


  useEffect(() => {
    if (error) {
      alert(error)
      setError(null)
    }
  }, [error])

  return <div>

    <div className={styles.formContainer}>

      {
        parsedWorkflow
          ? <WorkflowPreview />
          : <WorkflowInput submitWorkflow={submitWorkflow} />
      }
    </div>
    <button className={styles.button} onClick={resetSavedWorkflows}>Reset</button>

  </div >;
}

export default WorkflowParser