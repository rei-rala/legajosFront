type WorkflowData = string | number | Date | null;

type WorkflowObject = {
  [columna: string]: WorkflowData;
}

type Workflow = {
  [codigoSolicitud: string | number]: WorkflowObject[]
}

type PreviewWorkflow = {
  encabezados: string[],
  qSolicitudes: number,
  valuesExpExample: string[],
}