/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WF_DATE_COLUMNS: string
  readonly VITE_WF_FLOAT_COLUMNS: string
  
  readonly VITE_WF_CUIT: string
  readonly VITE_WF_COD_EMPRESA: string

  readonly VITE_WF_COD_SOLI_COLS: string
  readonly VITE_WF_COD_SOLI_ALT_COL: string
  readonly VITE_WF_COD_EXPE_COLS: string
  readonly VITE_WF_EST_EXPE_COLS: string
  readonly VITE_WF_CANAL_RIESGOS: string
  readonly VITE_WF_CANAL_COLS: string
  readonly VITE_WF_CANAL_ALT_COLS: string
  readonly VITE_VW_LINEA_COL: string
  readonly VITE_VW_SUBLINEA_COL: string
  readonly VITE_WF_RAZON_SOCIAL_COL: string
  readonly VITE_WF_IMPORTE_SOLICITUD_COLS: string
  readonly VITE_WF_MONEDA_SOLICITUD_COLS: string

  readonly VITE_VW_ANALISTA_COLS: string
  readonly VITE_WF_FALTA_INFO_COL: string
  readonly VITE_WF_FALTA_INFO_DESDE_COL: string
  readonly VITE_WF_FALTA_INFO_HASTA_COL: string
  readonly VITE_WF_FINALIZADO_ANALISTA_FECHA_COL: string
  readonly VITE_WF_DEVOLUCION_ANALISTA_FECHA_COL: string
  readonly VITE_WF_ASIGNADO_ANALISTA_FECHA_COL: string
  readonly VITE_WF_INGRESO_GR_FECHA_COL: string
  readonly VITE_WF_SOLICITUD_FECHA_COL: string
  readonly VITE_WF_RV_POTENCIAL_COL: string

  readonly VITE_VW_ASESOR_COM_COL: string
  readonly VITE_VW_SUCURSAL_COL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
