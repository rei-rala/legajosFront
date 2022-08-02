import React, { useEffect, useMemo } from "react";
import { Navigate, NavLink, Link, useParams } from "react-router-dom";
import { Asignar, Devueltas, EnAnalisis, Ingresar, Pendientes, Supervision, Resumen, Completo } from "../components/tablas";
import { useTablesWF } from "../context/TablesWF";



const WfTablas: React.FC = () => {
  const { count, workflow, headers, completoTBody, ingresarTBody, asignarTBody, pendientesTBody, analisisTBody, supervisionTBody, devueltasTBody } = useTablesWF();
  const { seccion } = useParams()

  const seccionComponent = useMemo(() => {
    if (!workflow) {
      return null
    }

    switch (seccion) {
      case undefined:
      case "":
        return <Completo tableBody={completoTBody} headers={headers} />
      case "ingresar":
        return <Ingresar tableBody={ingresarTBody} />
      case "asignar":
        return <Asignar tableBody={asignarTBody} />
      case "pendientes":
        return <Pendientes tableBody={pendientesTBody} />
      case "analisis":
        return <EnAnalisis tableBody={analisisTBody} />
      case "supervision":
        return <Supervision tableBody={supervisionTBody} />
      case "devueltas":
        return <Devueltas tableBody={devueltasTBody} />
      case "resumen":
        return <Resumen counters={count} supervisionTBody={supervisionTBody} analisisTBody={analisisTBody} fullTBody={completoTBody} />
      default:
        return null
    }
  }, [workflow, seccion])


  const rutas: {
    [key: string]: string
  } = {
    "": "Completo",
    "ingresar": "Ingresar",
    "asignar": "Asignar",
    "pendientes": "Pendientes",
    "analisis": "En Análisis",
    "supervision": "Supervisión",
    "devueltas": "Devueltas",
    "resumen": "Resumen"
  }

  useEffect(() => {
    document.title = "Workflow | Resumen: Tablas";
  }, []);


  return <section>
    {workflow ? (
      <div>
        <h1>Tabla resumen</h1>
        <span><Link to="/workflow" style={{ color: 'red', fontWeight: 'bold' }}> <sup>Cargar otro workflow?</sup></Link></span>
        <hr style={{
          marginBottom: '0',
        }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {
            Object.keys(rutas).map((key: string) => {
              return <NavLink
                end
                to={`/workflow/tablas/${key}`}
                key={key}
                style={({ isActive }) => ({
                  padding: "0.5rem",
                  background: isActive ? 'var(--color-primary)' : '',
                  color: isActive ? 'white' : '',
                })}
              >
                {rutas[key]}
              </NavLink>
            })
          }
        </div>
        <hr style={{
          marginTop: '0',
        }} />
        {seccionComponent ?? <Navigate to="/workflow/tablas" />}
      </div>
    ) : (
      <>
        <h1>No hay workflow para mostrar</h1>
        <Link to="/workflow">Cargar un Workflow</Link>
      </>
    )}

    {/* <OpcionesTabla dayHtml={dayFiltered.format("YYYY-MM-DD")} setDayHtml={setDayHtml} /> */}
  </section>;
}

export default WfTablas