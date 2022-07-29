import moment from "moment";
import React, { useEffect, useMemo } from "react";
import { Navigate, NavLink } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import Asignar from "../components/tablas/Asignar";
import Base from "../components/tablas/Completo";
import Devueltas from "../components/tablas/Devueltas";
import EnAnalisis from "../components/tablas/EnAnalisis";
import Ingresar from "../components/tablas/Ingresar";
import Pendientes from "../components/tablas/Pendientes";
import Resumen from "../components/tablas/Resumen";
import Supervision from "../components/tablas/Supervision";
import columnasWf from "../config";
import { useWorkflow } from "../context";

const { canal, codigoSol, codigoExp, estadoExp, razonSocial, fechaIngreso, fechaAsignadoAnalista, faltaInfo, faltaInfoDesde, faltaInfoHasta, asesorComercial, sucursal, analista, fechaDevolucion, fechaFinalizadoAnalista } = columnasWf


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

  const completoTBody = useMemo(() => {
    let tableBody: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in parsedWorkflow) {
      let sol = parsedWorkflow[solCode]
      for (const expCode of sol) {

        // Si no existe la solicitud en tableBody, es creada con algunos valores ya unicos
        if (!tableBody[solCode]) {
          tableBody[solCode] = {}
        }

        for (let [column, value] of Object.entries(expCode)) {
          tableBody[solCode][column] = value
          /*        
            if (column in columns.date) {
              tableBody[solCode][column] = value
            }
  
            if (column in columns.float) {
              tableBody[solCode][column] = 0
            }
          */

        }
        break;
      }
    }
    return tableBody
  }, [parsedWorkflow, headers])

  const asignarTBody = useMemo(() => {
    let tableBody: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in parsedWorkflow) {
      let sol = parsedWorkflow[solCode]
      for (const expCode of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos"].includes((expCode[estadoExp] as string)) === false
        let analistaAsignado = expCode[analista];
        if (estadoExpInvalido || analistaAsignado) {
          continue;
        }

        // Si no existe la solicitud en tableBody, es creada con algunos valores ya unicos
        if (!tableBody[solCode]) {
          tableBody[solCode] = {}
        }

        tableBody[solCode][fechaIngreso] = expCode[fechaIngreso] && moment(expCode[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode]["Días GR"] = moment().diff(moment(expCode[fechaIngreso], "DD/MM/YYYY"), 'days')

        tableBody[solCode][codigoSol] = expCode[codigoSol]
        tableBody[solCode][estadoExp] = expCode[estadoExp]
        tableBody[solCode][razonSocial] = expCode[razonSocial]
        tableBody[solCode][analista] = expCode[analista]

        tableBody[solCode][canal] = expCode[canal]
        tableBody[solCode][sucursal] = expCode[sucursal]
        tableBody[solCode][asesorComercial] = expCode[asesorComercial]
        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return tableBody
  }, [parsedWorkflow])

  const devueltasTBody = useMemo(() => {
    let tableBody: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in parsedWorkflow) {
      let sol = parsedWorkflow[solCode]
      for (const expCode of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos", "Analisis"].includes((expCode[estadoExp] as string)) === false
        let faltanteInfo = expCode[faltaInfo] !== 'Si';
        let noEstaDevuelto = expCode[fechaDevolucion] == null

        if (faltanteInfo || estadoExpInvalido || noEstaDevuelto) {
          continue;
        }


        // Si no existe la solicitud en tableBody, es creada con algunos valores ya unicos
        if (!tableBody[solCode]) {
          tableBody[solCode] = {}
        }


        tableBody[solCode][codigoSol] = expCode[codigoSol]
        tableBody[solCode][estadoExp] = expCode[estadoExp]
        tableBody[solCode][razonSocial] = expCode[razonSocial]
        tableBody[solCode][fechaIngreso] = expCode[fechaIngreso] && moment(expCode[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][fechaAsignadoAnalista] = expCode[fechaAsignadoAnalista] && moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][faltaInfo] = '-'
        tableBody[solCode][faltaInfoDesde] = expCode[faltaInfoDesde] && moment(expCode[faltaInfoDesde], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][faltaInfoHasta] = expCode[faltaInfoHasta] && moment(expCode[faltaInfoHasta], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][analista] = expCode[analista]
        tableBody[solCode][canal] = expCode[canal]
        tableBody[solCode][sucursal] = expCode[sucursal]
        tableBody[solCode][asesorComercial] = expCode[asesorComercial]
        tableBody[solCode]["Días GR"] = moment().diff(moment(expCode[fechaIngreso], "DD/MM/YYYY"), 'days')
        tableBody[solCode]["Días asignado"] = moment().diff(moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY"), 'days')
        tableBody[solCode]["Días pendiente"] = expCode[faltaInfoHasta] ? moment(expCode[faltaInfoHasta], "DD/MM/YYYY").diff(moment(expCode[faltaInfoDesde], "DD/MM/YYYY"), 'days') : '-'

        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return tableBody
  }, [parsedWorkflow])

  const analisisTBody = useMemo(() => {
    let tableBody: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in parsedWorkflow) {
      let sol = parsedWorkflow[solCode]
      for (const expCode of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos", "Analisis"].includes((expCode[estadoExp] as string)) === false
        let faltanteInfo = expCode[faltaInfo] === 'Si';
        let faltanteAnalista = !expCode[analista] || expCode[analista] === '';

        if (faltanteInfo || faltanteAnalista || estadoExpInvalido) {
          continue;
        }


        // Si no existe la solicitud en tableBody, es creada con algunos valores ya unicos
        if (!tableBody[solCode]) {
          tableBody[solCode] = {}
        }


        tableBody[solCode][codigoSol] = expCode[codigoSol]
        tableBody[solCode][estadoExp] = expCode[estadoExp]
        tableBody[solCode][razonSocial] = expCode[razonSocial]
        tableBody[solCode][fechaIngreso] = expCode[fechaIngreso] && moment(expCode[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][fechaAsignadoAnalista] = expCode[fechaAsignadoAnalista] && moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][faltaInfo] = '-'
        tableBody[solCode][faltaInfoDesde] = expCode[faltaInfoDesde] && moment(expCode[faltaInfoDesde], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][faltaInfoHasta] = expCode[faltaInfoHasta] && moment(expCode[faltaInfoHasta], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][analista] = expCode[analista]
        tableBody[solCode][canal] = expCode[canal]
        tableBody[solCode][sucursal] = expCode[sucursal]
        tableBody[solCode][asesorComercial] = expCode[asesorComercial]
        tableBody[solCode]["Días GR"] = moment().diff(moment(expCode[fechaIngreso], "DD/MM/YYYY"), 'days')
        tableBody[solCode]["Días asignado"] = moment().diff(moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY"), 'days')
        tableBody[solCode]["Días pendiente"] = expCode[faltaInfoHasta] ? moment(expCode[faltaInfoHasta], "DD/MM/YYYY").diff(moment(expCode[faltaInfoDesde], "DD/MM/YYYY"), 'days') : '-'

        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return tableBody
  }, [parsedWorkflow])

  const ingresarTBody = useMemo(() => {
    let tableBody: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in parsedWorkflow) {
      let sol = parsedWorkflow[solCode]
      for (const expCode of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Solicitud - Documentación Faltante y Pendiente de Aprobación"].includes((expCode[estadoExp] as string)) === false

        if (estadoExpInvalido) {
          continue;
        }


        // Si no existe la solicitud en tableBody, es creada con algunos valores ya unicos
        if (!tableBody[solCode]) {
          tableBody[solCode] = {}
        }


        tableBody[solCode][codigoSol] = expCode[codigoSol]
        tableBody[solCode][estadoExp] = expCode[estadoExp]
        tableBody[solCode][razonSocial] = expCode[razonSocial]
        tableBody[solCode][canal] = expCode[canal]
        tableBody[solCode][sucursal] = expCode[sucursal]
        tableBody[solCode][asesorComercial] = expCode[asesorComercial]
        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return tableBody
  }, [parsedWorkflow])

  const pendientesTBody = useMemo(() => {
    let tableBody: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in parsedWorkflow) {
      let sol = parsedWorkflow[solCode]
      for (const expCode of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos", "Analisis"].includes((expCode[estadoExp] as string)) === false
        let faltanteInfo = expCode[faltaInfo] !== 'Si';

        if (faltanteInfo || estadoExpInvalido) {
          continue;
        }


        // Si no existe la solicitud en tableBody, es creada con algunos valores ya unicos
        if (!tableBody[solCode]) {
          tableBody[solCode] = {}
        }


        tableBody[solCode][codigoSol] = expCode[codigoSol]
        tableBody[solCode][estadoExp] = expCode[estadoExp]
        tableBody[solCode][razonSocial] = expCode[razonSocial]
        tableBody[solCode][fechaIngreso] = expCode[fechaIngreso] && moment(expCode[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][fechaAsignadoAnalista] = expCode[fechaAsignadoAnalista] && moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][faltaInfo] = '-'
        tableBody[solCode][faltaInfoDesde] = expCode[faltaInfoDesde] && moment(expCode[faltaInfoDesde], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][faltaInfoHasta] = expCode[faltaInfoHasta] && moment(expCode[faltaInfoHasta], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][analista] = expCode[analista]
        tableBody[solCode][canal] = expCode[canal]
        tableBody[solCode][sucursal] = expCode[sucursal]
        tableBody[solCode][asesorComercial] = expCode[asesorComercial]
        tableBody[solCode]["Días GR"] = moment().diff(moment(expCode[fechaIngreso], "DD/MM/YYYY"), 'days')
        tableBody[solCode]["Días asignado"] = moment().diff(moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY"), 'days')
        tableBody[solCode]["Días pendiente"] = expCode[faltaInfoHasta] ? moment(expCode[faltaInfoHasta], "DD/MM/YYYY").diff(moment(expCode[faltaInfoDesde], "DD/MM/YYYY"), 'days') : '-'

        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return tableBody
  }, [parsedWorkflow])

  const supervisionTBody = useMemo(() => {
    let tableBody: { [codigoSol: string | number]: Expediente } = {}

    for (const solCode in parsedWorkflow) {
      let sol = parsedWorkflow[solCode]
      for (const expCode of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos", "Analisis"].includes((expCode[estadoExp] as string)) === false
        let faltanteInfo = expCode[faltaInfo] === 'Si';
        let faltanteAnalista = !expCode[analista] || expCode[analista] === '';
        let sinFinalizar = !expCode[fechaFinalizadoAnalista]

        if (faltanteAnalista || estadoExpInvalido || faltanteInfo || sinFinalizar) {
          continue;
        }


        // Si no existe la solicitud en tableBody, es creada con algunos valores ya unicos
        if (!tableBody[solCode]) {
          tableBody[solCode] = {}
        }


        tableBody[solCode][codigoSol] = expCode[codigoSol]
        tableBody[solCode][estadoExp] = expCode[estadoExp]
        tableBody[solCode][razonSocial] = expCode[razonSocial]
        tableBody[solCode][fechaIngreso] = expCode[fechaIngreso] && moment(expCode[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][fechaAsignadoAnalista] = expCode[fechaAsignadoAnalista] && moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][faltaInfoDesde] = expCode[faltaInfoDesde] && moment(expCode[faltaInfoDesde], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][faltaInfoHasta] = expCode[faltaInfoHasta] && moment(expCode[faltaInfoHasta], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][fechaFinalizadoAnalista] = expCode[fechaFinalizadoAnalista] && moment(expCode[fechaFinalizadoAnalista], "DD/MM/YYYY").format("DD/MM")
        tableBody[solCode][analista] = expCode[analista]
        tableBody[solCode][canal] = expCode[canal]
        tableBody[solCode][sucursal] = expCode[sucursal]
        tableBody[solCode][asesorComercial] = expCode[asesorComercial]
        tableBody[solCode]["Días GR"] = moment().diff(moment(expCode[fechaIngreso], "DD/MM/YYYY"), 'days')
        tableBody[solCode]["Días asignado"] = moment().diff(moment(expCode[fechaAsignadoAnalista], "DD/MM/YYYY"), 'days')
        tableBody[solCode]["Días supervisión"] = moment().diff(moment(expCode[fechaFinalizadoAnalista], "DD/MM/YYYY"), 'days')
        tableBody[solCode]["Días pendiente"] = expCode[faltaInfoHasta] ? moment(expCode[faltaInfoHasta], "DD/MM/YYYY").diff(moment(expCode[faltaInfoDesde], "DD/MM/YYYY"), 'days') : '-'

        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return tableBody
  }, [parsedWorkflow])

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
        return <Base tableBody={completoTBody} headers={headers} />
      case "ingresar":
        return <Ingresar tableBody={ingresarTBody} />
      case "analisis":
        return <EnAnalisis tableBody={analisisTBody} />
      case "asignar":
        return <Asignar tableBody={asignarTBody} />
      case "pendientes":
        return <Pendientes tableBody={pendientesTBody} />
      case "devueltas":
        return <Devueltas tableBody={devueltasTBody} />
      case "supervision":
        return <Supervision tableBody={supervisionTBody} />
      case "resumen":
        return <Resumen />
      default:
        return null
    }
  }, [parsedWorkflow, seccion])

  return <section>
    <h1>Tabla resumen </h1> <Link to="/workflow" style={{ color: 'red', fontWeight: 'bold' }}>Cargar otro workflow?</Link>
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
          <br /><br />
          <NavLink to="/workflow/tablas/resumen" end className={({ isActive }) => isActive ? "navActive" : ""}><button>RESUMEN</button></NavLink>
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