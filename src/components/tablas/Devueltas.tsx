import React, { useEffect } from "react";
import TablaGenerica from "./TablaGenerica/TablaGenerica";
import columnasWf from "../../config";

// TODO: Hacer esto como la gente
const { canal, codigoSol, estadoExp, razonSocial, fechaIngreso, fechaAsignadoAnalista, faltaInfo, faltaInfoDesde, faltaInfoHasta, asesorComercial, sucursal, analista, fechaDevolucion } = columnasWf
const validColumns = ["Días asignado", "Días pendiente", "Días devuelto", codigoSol, /* codigoExp, */ estadoExp, razonSocial, canal, fechaIngreso, fechaAsignadoAnalista, faltaInfo, faltaInfoDesde, faltaInfoHasta, asesorComercial, sucursal, analista, fechaDevolucion]


const Devueltas: React.FC<IWorkflowTable> = ({ tableBody }) => {

  useEffect(() => {
    document.title = "Workflow | Tabla: Devueltas";
  }, []);

  return (
    <div>
      <h3>Mostrando legajos devueltos</h3>
      <TablaGenerica headers={validColumns} tableBody={tableBody} />
    </div>
  )
}

export default Devueltas