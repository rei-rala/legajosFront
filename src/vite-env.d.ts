/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WF_DATE_COLUMNS: string[]
  readonly VITE_WF_FLOAT_COLUMNS: string[]
  readonly VITE_WF_CODIGO_EXPEDIENTE_COLUMN: string
  readonly VITE_WF_CODIGO_SOLICITUD_COLUMN: string

  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
