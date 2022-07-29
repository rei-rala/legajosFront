import React, { useEffect, useMemo } from "react";
import { Navigate, NavLink } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import Asignar from "../components/tablas/Asignar";
import Base from "../components/tablas/Completo";
import Devueltas from "../components/tablas/Devueltas";
import EnAnalisis from "../components/tablas/EnAnalisis";
import Ingresar from "../components/tablas/Ingresar";
import Pendientes from "../components/tablas/Pendientes";
import Supervision from "../components/tablas/Supervision";
import { useWorkflow } from "../context";


function getWorkflowHeaders(workflow: Workflow | null) {
  let headers: string[] = []


  if (!workflow) {
    return headers
  }

  for (const sol in workflow) {
    for (const exp of workflow[sol]) {
      headers = Object.keys(exp)
      break;
    }
    break;
  }

  return headers
}

const WfTablas: React.FC = () => {
  const { parsedWorkflow } = useWorkflow()
  const { seccion } = useParams()

  const headers = useMemo(() => getWorkflowHeaders(parsedWorkflow), [parsedWorkflow])


  useEffect(() => {
    document.title = "Workflow | Resumen: Tablas";
  }, []);


  const seccionComponent = useMemo(() => {
    if (!parsedWorkflow) {
      return null
    }

    switch (seccion) {
      case undefined:
      case "":
        return <Base workflow={parsedWorkflow} headers={headers} />
      case "ingresar":
        return <Ingresar workflow={parsedWorkflow} />
      case "analisis":
        return <EnAnalisis workflow={parsedWorkflow} />
      case "asignar":
        return <Asignar workflow={parsedWorkflow} />
      case "pendientes":
        return <Pendientes workflow={parsedWorkflow} />
      case "devueltas":
        return <Devueltas workflow={parsedWorkflow} />
      case "supervision":
        return <Supervision workflow={parsedWorkflow} />
      default:
        return null
    }
  }, [parsedWorkflow, seccion])

  return <section>
    <h1>Tabla resumen </h1> <Link to="/workflow" style={{ color: 'red', fontWeight: 'bold' }}>Cargar otro workflow</Link>
    {parsedWorkflow ? (
      <div>
        <div>
          {/* TODO: rutas dinamicas */}
          <NavLink to="/workflow/tablas" end className={({ isActive }) => isActive ? "navActive" : ""}>Completo</NavLink>
          <b> | </b>
          <NavLink to="/workflow/tablas/ingresar" end className={({ isActive }) => isActive ? "navActive" : ""}>Ingresar</NavLink>
          <b> | </b>
          <NavLink to="/workflow/tablas/asignar" end className={({ isActive }) => isActive ? "navActive" : ""}>Asignar</NavLink>
          <b> | </b>
          <NavLink to="/workflow/tablas/analisis" end className={({ isActive }) => isActive ? "navActive" : ""}>En análisis</NavLink>
          <b> | </b>
          <NavLink to="/workflow/tablas/pendientes" end className={({ isActive }) => isActive ? "navActive" : ""}>Pendientes</NavLink>
          <b> | </b>
          <NavLink to="/workflow/tablas/devueltas" end className={({ isActive }) => isActive ? "navActive" : ""}>Devueltas</NavLink>
          <b> | </b>
          <NavLink to="/workflow/tablas/supervision" end className={({ isActive }) => isActive ? "navActive" : ""}>En supervisión</NavLink>
        </div>

        {seccionComponent ?? <Navigate to="/workflow/tablas" />}
      </div>
    ) : (
      <div>
        <h1>No hay workflow para mostrar</h1>
        <Link to="/workflow">Cargar un Workflow</Link>
      </div>
    )}
  </section>;
}

export default WfTablas