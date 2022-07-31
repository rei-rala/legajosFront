import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import CuadroAnalistas from "../components/resumenAnalistas/ResumenAnalistas/ResumenAnalistas";
import { useWorkflow } from "../context";

const WfResumen: React.FC = () => {
  const { parsedWorkflow } = useWorkflow()

  useEffect(() => {
    document.title = "Workflow | Resumen";
  }, []);


  if (!parsedWorkflow) {
    return <section>
      <h1>No hay workflow para mostrar</h1>

      <Link to="/workflow">Cargar un Workflow</Link>
    </section>
  }


  return <section>
    <h1>Resumen de Workflow</h1>
    <CuadroAnalistas />
  </section>;
}

export default WfResumen