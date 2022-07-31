import React, { useEffect } from "react";
import { WorkflowParser } from "../components";

const WorkflowPage: React.FC = () => {

  useEffect(() => {
    document.title = "Workflow";
  }, [])

  return <section>
    <h1>Workflow</h1>
    <WorkflowParser />

  </section>;
}

export default WorkflowPage