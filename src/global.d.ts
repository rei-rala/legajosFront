type DatoExpediente = string | number | Date | null;

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

interface ICuadroAnalistaProps {
  analista: string;
  solicitudes: { [codSolicitud: string | number]: any }
  isShowing?: boolean;
  handleHide: (e: React.ChangeEvent<HTMLInputElement>, nombreAnalista: string) => void;
}