import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ResumenAnalistas from "../components/resumenAnalistas/ResumenAnalistas";
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
    <Link to="/workflow/">Atras</Link>
    <h1>Resumen de Workflow</h1>
    <span><Link to="/workflow" style={{ color: 'red', fontWeight: 'bold' }}> <sup>Cargar otro workflow?</sup></Link></span>

    <ResumenAnalistas />
  </section>;
}

export default WfResumen