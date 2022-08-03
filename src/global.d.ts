type DatoExpediente = string | number | NumberFormat | null;

type Expediente = {
  [columna: string | number]: DatoExpediente;
}

type Workflow = {
  [codigoSolicitud: string | number]: Expediente[]
}

type PreviewWorkflow = {
  encabezados: string[],
  qSolicitudes: number,
  valuesExpExample: string[],
}

type AnalistaCuadro = {
  nombre: string;
  isHiding: boolean,
  solicitudes: Expediente[][];
}

interface ICuadroAnalistaProps {
  analista: string;
  solicitudes: Expediente[][]
  isShowing?: boolean;
  handleHide: (e: React.ChangeEvent<HTMLInputElement>, nombreAnalista: string) => void;
}

interface ICuadroAnalistaShowingProps extends ICuadroAnalistaProps {
  showDetail: (solicitud: Expediente[] | undefined) => void;
}

type TableBody = {
  [codigoSol: string]: Expediente;
  [codigoSol: number]: Expediente;
}

interface IWorkflowTable {
  headers?: string[],
  tableBody: TableBody
}