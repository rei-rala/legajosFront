import React, { useEffect } from "react";
import TablaGenerica from "./TablaGenerica/TablaGenerica";
import columnasWf from "../../config";

// TODO: Hacer esto como la gente
const { canal, codigoSol, codigoExp, estadoExp, razonSocial, fechaIngreso, fechaAsignadoAnalista, faltaInfo, faltaInfoDesde, faltaInfoHasta, asesorComercial, sucursal, analista, fechaDevolucion } = columnasWf
const validColumns = ["Días GR", "Días asignado", "Días pendiente", codigoSol, /* codigoExp, */ estadoExp, razonSocial, canal, fechaIngreso, fechaAsignadoAnalista, faltaInfo, faltaInfoDesde, faltaInfoHasta, asesorComercial, sucursal, analista, fechaDevolucion]


const EnAnalisis: React.FC<IWorkflowTable> = ({ tableBody }) => {


  useEffect(() => {
    document.title = "Workflow | Tabla: En análisis";
  }, []);

  return (
    <div>
      <h3>Mostrando legajos en análisis</h3>
      <TablaGenerica headers={validColumns} tableBody={tableBody} />
    </div>
  )
}

export default EnAnalisis