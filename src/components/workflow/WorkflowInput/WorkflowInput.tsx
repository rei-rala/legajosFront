import React, { useState } from "react"

interface IWorkflowInputProps {
  submitWorkflow: (workflow: string) => Promise<void>;
}

const WorkflowInput: React.FC<IWorkflowInputProps> = ({ submitWorkflow }) => {
  const [parserValue, setParserValue] = useState('');

  function changeHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setParserValue(e.target.value);
  }

  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submitWorkflow(parserValue);
  }

  return (
    <form onSubmit={submitHandler} style={{}}>
      <label htmlFor="input">Ingrese debajo el workflow correspondiente</label> <br />
      <i>No es necesario quitar duplicados</i> <br />
      <textarea id="input"
        cols={100} rows={15}
        placeholder="Incluya la tabla con los encabezados: Expediente, Codigo Solicitud, Estado Expediente, etc"
        value={parserValue}
        onChange={changeHandler}
      />
      <div>
        <button>Previsualizar datos</button>
      </div>
    </form>
  )
}

export default WorkflowInput