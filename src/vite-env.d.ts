/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WF_DATE_COLUMNS: string
  readonly VITE_WF_FLOAT_COLUMNS: string
  readonly VITE_WF_COD_EXPE_COLS: string
  readonly VITE_WF_COD_SOLI_COLS: string
  readonly VITE_WF_EST_EXPE_COLS: string
  readonly VITE_WF_CANAL_COLS: string
  readonly VITE_VW_ANALISTA_COLS: string
  readonly VITE_WF_IMPORTE_SOLICITUD_COLS: string
  readonly VITE_WF_MONEDA_SOLICITUD_COLS: string

  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
