const columnasWf = {
  date: import.meta.env.VITE_WF_DATE_COLUMNS.split("|") ?? [],
  float: import.meta.env.VITE_WF_FLOAT_COLUMNS.split("|") ?? [],

  codigoSol: import.meta.env.VITE_WF_COD_SOLI_COLS ?? "",
  codigoExp: import.meta.env.VITE_WF_COD_EXPE_COLS ?? "",
  estadoExp: import.meta.env.VITE_WF_EST_EXPE_COLS ?? "",
  fechaSolicitud: import.meta.env.VITE_WF_SOLICITUD_FECHA_COL ?? "",
  canal: import.meta.env.VITE_WF_CANAL_COLS ?? "",
  razonSocial: import.meta.env.VITE_WF_RAZON_SOCIAL_COL ?? "",

  fechaIngreso: import.meta.env.VITE_WF_INGRESO_GR_FECHA_COL ?? "",
  asesorComercial: import.meta.env.VITE_VW_ASESOR_COM_COL ?? "",
  sucursal: import.meta.env.VITE_VW_SUCURSAL_COL ?? "",

  importeOrigen: import.meta.env.VITE_WF_IMPORTE_SOLICITUD_COLS ?? "",
  monedaOrigen: import.meta.env.VITE_WF_MONEDA_SOLICITUD_COLS ?? "",

  analista: import.meta.env.VITE_VW_ANALISTA_COLS ?? "",
  fechaAsignadoAnalista: import.meta.env.VITE_WF_ASIGNADO_ANALISTA_FECHA_COL ?? "",
  fechaFinalizadoAnalista: import.meta.env.VITE_WF_FINALIZADO_ANALISTA_FECHA_COL ?? "",
  faltaInfo: import.meta.env.VITE_WF_FALTA_INFO_COL ?? "",
  faltaInfoDesde: import.meta.env.VITE_WF_FALTA_INFO_DESDE_COL ?? "",
  faltaInfoHasta: import.meta.env.VITE_WF_FALTA_INFO_HASTA_COL ?? "",
  fechaDevolucion: import.meta.env.VITE_WF_DEVOLUCION_ANALISTA_FECHA_COL ?? "",
}

export default columnasWf