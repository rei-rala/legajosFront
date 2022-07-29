import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const WfResumen: React.FC = () => {
  // setting title
  useEffect(() => {
    document.title = "Workflow | Resumen";
  }, []);


  return <section>
    <h1>Resumen de Workflow</h1> <Link to="/workflow">Cargar otro workflow</Link>
    
  </section>;
}

export default WfResumen