import React, { useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, Link, useParams } from "react-router-dom";
import { Asignar, Devueltas, EnAnalisis, Ingresar, Pendientes, Supervision, Resumen, Completo } from "../components/tablas";
import columnasWf from "../config";
import { useWorkflow } from "../context";
import { getWorkflowHeaders } from "../helpers";
import moment, { Moment } from "../libs/moment";
//import OpcionesTabla from "../components/OpcionesTabla/OpcionesTabla";

const { subcategoriaCanal, fechaFinalizadoGr, canal, canalAlt, codigoSol, codigoSolAlt, codigoExp, estadoExp, razonSocial, fechaIngreso, fechaAsignadoAnalista, faltaInfo, faltaInfoDesde, faltaInfoHasta, asesorComercial, sucursal, analista, fechaDevolucion, fechaFinalizadoAnalista } = columnasWf


function saveDateToSession(dateAsString: string) {
  const date = moment(dateAsString)
  const dateAsStringWithFormat = date.format("YYYY-MM-DD")
  sessionStorage.setItem("date", dateAsStringWithFormat)
}

function retrieveLastDateFromSession() {
  const lastDate = sessionStorage.getItem("lastDate") || undefined
  let asMoment = moment(lastDate)

  if (!asMoment.isValid()) {
    asMoment = moment()
  }
  return asMoment
}


const WfTablas: React.FC = () => {
  const { parsedWorkflow } = useWorkflow()
  const { seccion } = useParams()

  let [dayFiltered, setDayFiltered] = useState<Moment>(retrieveLastDateFromSession())
  const setDayHtml = (dayHtmlFormat: string) => {
    saveDateToSession(dayHtmlFormat)
    setDayFiltered(retrieveLastDateFromSession())
  }

  const headers = useMemo(() => getWorkflowHeaders(parsedWorkflow), [parsedWorkflow])

  const [count, setCount] = useState({
    asignar: 0,
    devueltas: 0,
    analisis: 0,
    ingresar: 0,
    pendientes: 0,
    supervision: 0
  })

  const workflow = useMemo(() => parsedWorkflow, [parsedWorkflow, dayFiltered])

  const completoTBody = useMemo(() => {
    let full: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in workflow) {
      let pass = false;
      let sol = workflow[solCode]

      // Pre verificacion si el expediente esta contiene "sucursal" (Garantia Sucursal)
      sol.forEach(exp => {
        let subcatLow = exp[subcategoriaCanal]?.toLowerCase()
        pass = subcatLow.includes("sucursal")
        if (pass) {
          delete workflow[solCode]
        }

        // Finalizado por GR pero falta bastanteo
        pass = exp[fechaFinalizadoGr]
        if (pass) {
          delete workflow[solCode]
        }
      })

      if (pass) {
        continue
      }

      for (const expCode of sol) {

        // Si no existe la solicitud en full, es creada con algunos valores ya unicos
        if (!full[solCode]) {
          full[solCode] = {}
        }

        for (let [column, value] of Object.entries(expCode)) {
          full[solCode][column] = value
        }
        break;
      }
    }
    return full
  }, [workflow, headers, dayFiltered])

  const ingresarTBody = useMemo(() => {
    let ingresar: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in workflow) {
      let sol = workflow[solCode]
      for (const expCode of sol) {

        // Pre chequeos
        let estadoExpInvalido = !["Solicitud - Documentación Pendiente de Aprobación"].includes((expCode[estadoExp] as string))

        if (estadoExpInvalido) {
          continue;
        }


        // Si no existe la solicitud en ingresar, es creada con algunos valores ya unicos
        if (!ingresar[solCode]) {
          ingresar[solCode] = {}
        }


        ingresar[solCode][codigoSol] = expCode[codigoSol] ?? expCode[codigoSolAlt]
        ingresar[solCode][estadoExp] = expCode[estadoExp]
        ingresar[solCode][razonSocial] = expCode[razonSocial]
        ingresar[solCode][canal] = expCode[canal] ?? expCode[canalAlt]
        ingresar[solCode][sucursal] = expCode[sucursal]
        ingresar[solCode][asesorComercial] = expCode[asesorComercial]
        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return ingresar
  }, [workflow, dayFiltered])

  const asignarTBody = useMemo(() => {
    let asignar: { [codigoSol: string | number]: Expediente } = {}

    if (!workflow) {
      return asignar
    }

    for (const solCode in workflow) {
      let sol = workflow[solCode]


      for (const expCode of sol) {
        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos"].includes((expCode[estadoExp] as string)) === false
        let analistaAsignado = !!expCode[analista];

        if (estadoExpInvalido || analistaAsignado) {
          continue;
        }

        // Validando nombres de columnas por si se cambia el workflow
        let currSol = !!expCode[codigoSol] ? codigoSol : codigoSolAlt
        let currCanal = !!expCode[canal] ? canal : canalAlt

        // Si no existe la solicitud en asignar, es creada con algunos valores ya unicos
        if (!asignar[solCode]) {
          asignar[solCode] = {}
        }

        asignar[solCode][fechaIngreso] = expCode[fechaIngreso] && moment(expCode[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        asignar[solCode]["Días GR"] = dayFiltered.diff(moment(expCode[fechaIngreso], "DD/MM/YYYY"), 'days')

        asignar[solCode][codigoSol] = expCode[currSol]
        asignar[solCode][estadoExp] = expCode[estadoExp]
        asignar[solCode][razonSocial] = expCode[razonSocial]
        asignar[solCode][analista] = expCode[analista]

        asignar[solCode][canal] = expCode[currCanal]
        asignar[solCode][sucursal] = expCode[sucursal]
        asignar[solCode][asesorComercial] = expCode[asesorComercial]
        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return asignar
  }, [workflow, dayFiltered])

  const pendientesTBody = useMemo(() => {
    let pendientes: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in workflow) {
      let sol = workflow[solCode]
      for (const expCode of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos", "Analisis"].includes((expCode[estadoExp] as string)) === false
        let faltanteInfo = !expCode[faltaInfo];
        let devuelto = !!expCode[fechaDevolucion];
        let finalizado = !!expCode[fechaFinalizadoAnalista];

        if (faltanteInfo || estadoExpInvalido || devuelto || finalizado) {
          continue;
        }


        // Si no existe la solicitud en pendientes, es creada con algunos valores ya unicos
        if (!pendientes[solCode]) {
          pendientes[solCode] = {}
        }


        pendientes[solCode][codigoSol] = expCode[codigoSol] ?? expCode[codigoSolAlt]
        pendientes[solCode][estadoExp] = expCode[estadoExp]
        pendientes[solCode][razonSocial] = expCode[razonSocial]
        pendientes[solCode][fechaIngreso] = expCode[fechaIngreso] && moment(expCode[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        pendientes[solCode][fechaAsignadoAnalista] = expCode[fechaAsignadoAnalista] && moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY").format("DD/MM")
        pendientes[solCode][faltaInfo] = '-'
        pendientes[solCode][faltaInfoDesde] = expCode[faltaInfoDesde] && moment(expCode[faltaInfoDesde], "DD/MM/YYYY").format("DD/MM")
        pendientes[solCode][faltaInfoHasta] = expCode[faltaInfoHasta] && moment(expCode[faltaInfoHasta], "DD/MM/YYYY").format("DD/MM")
        pendientes[solCode][analista] = expCode[analista]
        pendientes[solCode][canal] = expCode[canal] ?? expCode[canalAlt]
        pendientes[solCode][sucursal] = expCode[sucursal]
        pendientes[solCode][asesorComercial] = expCode[asesorComercial]
        pendientes[solCode]["Días GR"] = dayFiltered.diff(moment(expCode[fechaIngreso], "DD/MM/YYYY"), 'days')
        pendientes[solCode]["Días asignado"] = dayFiltered.diff(moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY"), 'days')
        pendientes[solCode]["Días pendiente"] = expCode[faltaInfoHasta] ? moment(expCode[faltaInfoHasta], "DD/MM/YYYY").diff(moment(expCode[faltaInfoDesde], "DD/MM/YYYY"), 'days') : '-'

        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return pendientes
  }, [workflow, dayFiltered])

  const analisisTBody = useMemo(() => {
    let analisis: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in workflow) {
      let sol = workflow[solCode]
      for (const expCode of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos", "Analisis"].includes((expCode[estadoExp] as string)) === false;
        let faltanteInfo = expCode[faltaInfo];
        let faltanteAnalista = !expCode[analista];
        let finalizado = expCode[fechaFinalizadoAnalista];

        if (faltanteInfo || faltanteAnalista || estadoExpInvalido || finalizado) {
          continue;
        }


        // Si no existe la solicitud en analisis, es creada con algunos valores ya unicos
        if (!analisis[solCode]) {
          analisis[solCode] = {}
        }


        analisis[solCode][codigoSol] = expCode[codigoSol] ?? expCode[codigoSolAlt]
        analisis[solCode][estadoExp] = expCode[estadoExp]
        analisis[solCode][razonSocial] = expCode[razonSocial]
        analisis[solCode][fechaIngreso] = expCode[fechaIngreso] && moment(expCode[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        analisis[solCode][fechaAsignadoAnalista] = expCode[fechaAsignadoAnalista] && moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY").format("DD/MM")
        analisis[solCode][faltaInfo] = '-'
        analisis[solCode][faltaInfoDesde] = expCode[faltaInfoDesde] && moment(expCode[faltaInfoDesde], "DD/MM/YYYY").format("DD/MM")
        analisis[solCode][faltaInfoHasta] = expCode[faltaInfoHasta] && moment(expCode[faltaInfoHasta], "DD/MM/YYYY").format("DD/MM")
        analisis[solCode][analista] = expCode[analista]
        analisis[solCode][canal] = expCode[canal] ?? expCode[canalAlt]
        analisis[solCode][sucursal] = expCode[sucursal]
        analisis[solCode][asesorComercial] = expCode[asesorComercial]
        analisis[solCode]["Días GR"] = dayFiltered.diff(moment(expCode[fechaIngreso], "DD/MM/YYYY"), 'days')
        analisis[solCode]["Días asignado"] = dayFiltered.diff(moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY"), 'days')
        analisis[solCode]["Días pendiente"] = expCode[faltaInfoHasta] ? moment(expCode[faltaInfoHasta], "DD/MM/YYYY").diff(moment(expCode[faltaInfoDesde], "DD/MM/YYYY"), 'days') : '-'

        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return analisis
  }, [workflow, dayFiltered])

  const supervisionTBody = useMemo(() => {
    let tableBody: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in workflow) {
      let sol = workflow[solCode]
      for (const expCode of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos", "Analisis"].includes((expCode[estadoExp] as string)) === false
        let faltanteInfo = expCode[faltaInfo];
        let sinAsignar = !expCode[analista];
        let sinFinalizar = !expCode[fechaFinalizadoAnalista]

        if (estadoExpInvalido || faltanteInfo || sinAsignar || sinFinalizar) {
          continue;
        }


        // Si no existe la solicitud en tableBody, es creada con algunos valores ya unicos
        if (!tableBody[solCode]) {
          tableBody[solCode] = {}
        }


        tableBody[solCode][codigoSol] = expCode[codigoSol] ?? expCode[codigoSolAlt]
        tableBody[solCode][estadoExp] = expCode[estadoExp]
        tableBody[solCode][razonSocial] = expCode[razonSocial]
        tableBody[solCode][fechaIngreso] = expCode[fechaIngreso] && moment(expCode[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][fechaAsignadoAnalista] = expCode[fechaAsignadoAnalista] && moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][faltaInfoDesde] = expCode[faltaInfoDesde] && moment(expCode[faltaInfoDesde], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][faltaInfoHasta] = expCode[faltaInfoHasta] && moment(expCode[faltaInfoHasta], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][fechaFinalizadoAnalista] = expCode[fechaFinalizadoAnalista] && moment(expCode[fechaFinalizadoAnalista], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][analista] = expCode[analista]
        tableBody[solCode][canal] = expCode[canal] ?? expCode[canalAlt]
        tableBody[solCode][sucursal] = expCode[sucursal]
        tableBody[solCode][asesorComercial] = expCode[asesorComercial]
        tableBody[solCode][fechaFinalizadoAnalista] = expCode[fechaFinalizadoAnalista]
        tableBody[solCode]["Días GR"] = dayFiltered.diff(moment(expCode[fechaIngreso], "DD/MM/YYYY"), 'days')
        tableBody[solCode]["Días asignado"] = dayFiltered.diff(moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY"), 'days')
        tableBody[solCode]["Días supervisión"] = dayFiltered.diff(moment(expCode[fechaFinalizadoAnalista], "DD/MM/YYYY"), 'days')
        tableBody[solCode]["Días pendiente"] = expCode[faltaInfoHasta] ? moment(expCode[faltaInfoHasta], "DD/MM/YYYY").diff(moment(expCode[faltaInfoDesde], "DD/MM/YYYY"), 'days') : '-'

        // Por ahora solo tomaremos un expediente
        break;
      }
    }

    return tableBody
  }, [workflow, dayFiltered])


  const devueltasTBody = useMemo(() => {
    let devueltas: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in workflow) {
      let sol = workflow[solCode]
      for (const expCode of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos", "Analisis"].includes((expCode[estadoExp] as string)) === false
        let faltanteInfo = expCode[faltaInfo] !== 'Si';
        let noEstaDevuelto = expCode[fechaDevolucion] == null

        if (faltanteInfo || estadoExpInvalido || noEstaDevuelto) {
          continue;
        }


        // Si no existe la solicitud en devueltas, es creada con algunos valores ya unicos
        if (!devueltas[solCode]) {
          devueltas[solCode] = {}
        }


        devueltas[solCode][codigoSol] = expCode[codigoSol] ?? expCode[codigoSolAlt]
        devueltas[solCode][estadoExp] = expCode[estadoExp]
        devueltas[solCode][razonSocial] = expCode[razonSocial]
        devueltas[solCode][fechaIngreso] = expCode[fechaIngreso] && moment(expCode[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        devueltas[solCode][fechaAsignadoAnalista] = expCode[fechaAsignadoAnalista] && moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY").format("DD/MM")
        devueltas[solCode][faltaInfo] = '-'
        devueltas[solCode][faltaInfoDesde] = expCode[faltaInfoDesde] && moment(expCode[faltaInfoDesde], "DD/MM/YYYY").format("DD/MM")
        devueltas[solCode][faltaInfoHasta] = expCode[faltaInfoHasta] && moment(expCode[faltaInfoHasta], "DD/MM/YYYY").format("DD/MM")
        devueltas[solCode][analista] = expCode[analista]
        devueltas[solCode][canal] = expCode[canal] ?? expCode[canalAlt]
        devueltas[solCode][sucursal] = expCode[sucursal]
        devueltas[solCode][asesorComercial] = expCode[asesorComercial]
        devueltas[solCode]["Días GR"] = dayFiltered.diff(moment(expCode[fechaIngreso], "DD/MM/YYYY"), 'days')
        devueltas[solCode]["Días asignado"] = dayFiltered.diff(moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY"), 'days')
        devueltas[solCode]["Días pendiente"] = expCode[faltaInfoHasta] ? moment(expCode[faltaInfoHasta], "DD/MM/YYYY").diff(moment(expCode[faltaInfoDesde], "DD/MM/YYYY"), 'days') : '-'

        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return devueltas
  }, [workflow, dayFiltered])


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

  useEffect(() => {
    setCount({
      ingresar: Object.keys(ingresarTBody).length,
      asignar: Object.keys(asignarTBody).length,

      pendientes: Object.keys(pendientesTBody).length,
      analisis: Object.keys(analisisTBody).length,
      supervision: Object.keys(supervisionTBody).length,

      devueltas: Object.keys(devueltasTBody).length,
    })

  }, [completoTBody, ingresarTBody, asignarTBody, pendientesTBody, analisisTBody, supervisionTBody, devueltasTBody])

  return <section>
    {workflow ? (
      <div>
        <h1>Tabla resumen</h1>
        <span><Link to="/workflow" style={{ color: 'red', fontWeight: 'bold' }}> <sup>Cargar otro workflow?</sup></Link></span>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          {
            Object.keys(rutas).map((key: string) => {
              return <NavLink
                to={`/workflow/tablas/${key}`}
                end className={({ isActive }) => isActive ? "navActive" : ""}
                key={key}
              >
                {rutas[key]}
              </NavLink>
            })
          }
        </div>
        <hr />
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