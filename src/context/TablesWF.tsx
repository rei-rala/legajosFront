import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import columnasWf from "../config";
import { getWorkflowHeaders, retrieveLastDateFromSession, saveDateToSession } from "../helpers";
import { getNivel } from "../helpers/workflowHelper";
import moment, { Moment } from "../libs/moment";
import { useWorkflow } from "./Workflow";

const { subcategoriaCanal, fechaFinalizadoGr, canal, canalAlt, codigoSol, codigoSolAlt, codigoExp, estadoExp, razonSocial, fechaIngreso, fechaAsignadoAnalista, faltaInfo, faltaInfoDesde, faltaInfoHasta, asesorComercial, sucursal, analista, fechaDevolucion, fechaFinalizadoAnalista } = columnasWf

type Counter = {
  [key: string]: number
};


// from canalenum
const counterDefault: Counter = {
  estandar: 0,
  express: 0,
  productivas: 0
}


const fullCounterDefault = {
  ingresar: { ...counterDefault },
  asignar: { ...counterDefault },
  pendientes: { ...counterDefault },
  analisis: { ...counterDefault },
  supervision: { ...counterDefault },
  devueltas: { ...counterDefault },
  ["total canal"]: { ...counterDefault }
}

type FullCounter = {
  [key: string]: Counter
}

type TableBody = {
  [codigoSol: string]: Expediente;
  [codigoSol: number]: Expediente;
}

type TablesWFContextType = {
  workflow: Workflow | null,
  headers: string[],
  completoTBody: TableBody,
  ingresarTBody: TableBody,
  asignarTBody: TableBody,
  pendientesTBody: TableBody,
  analisisTBody: TableBody,
  supervisionTBody: TableBody,
  devueltasTBody: TableBody,
  fullCount: FullCounter
}

// Spread operation on default counters to avoid mutating an unique object
export const TablesWF = createContext<TablesWFContextType>({
  workflow: null,
  headers: [],
  completoTBody: {},
  ingresarTBody: {},
  asignarTBody: {},
  pendientesTBody: {},
  analisisTBody: {},
  supervisionTBody: {},
  devueltasTBody: {},
  fullCount: { ...fullCounterDefault }
})

type Props = { children: React.ReactNode }

export const TablesWFContext: (props: Props) => JSX.Element = ({ children }) => {
  const { parsedWorkflow } = useWorkflow()
  const [fullCount, setFullCount] = useState<FullCounter>({ ...fullCounterDefault })

  let [dayFiltered, setDayFiltered] = useState<Moment>(retrieveLastDateFromSession())
  const setDayHtml = (dayHtmlFormat: string) => {
    saveDateToSession(dayHtmlFormat)
    setDayFiltered(retrieveLastDateFromSession())
  }

  const headers = useMemo(() => getWorkflowHeaders(parsedWorkflow), [parsedWorkflow])

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

      for (const exp of sol) {

        // Si no existe la solicitud en full, es creada con algunos valores ya unicos
        if (!full[solCode]) {
          full[solCode] = {}
        }

        for (let [column, value] of Object.entries(exp)) {
          full[solCode][column] = value
        }
        break;
      }
    }
    return full
  }, [workflow, headers, dayFiltered])

  const [ingresarTBody, ingresarCount] = useMemo(() => {
    let ingresar: { [codigoSol: string | number]: Expediente } = {}
    let ingCounter: Counter = { ...counterDefault }

    for (const solCode in workflow) {
      let sol = workflow[solCode]
      for (const exp of sol) {

        // Pre chequeos
        let estadoExpInvalido = !["Solicitud - Documentación Pendiente de Aprobación"].includes((exp[estadoExp] as string))

        if (estadoExpInvalido) {
          continue;
        }


        // Si no existe la solicitud en ingresar, es creada con algunos valores ya unicos
        if (!ingresar[solCode]) {
          ingresar[solCode] = {}
        }


        ingresar[solCode][codigoSol] = exp[codigoSol] ?? exp[codigoSolAlt]
        ingresar[solCode][estadoExp] = exp[estadoExp]
        ingresar[solCode][razonSocial] = exp[razonSocial]
        ingresar[solCode][canal] = exp[canal] ?? exp[canalAlt]
        ingresar[solCode][sucursal] = exp[sucursal]
        ingresar[solCode][asesorComercial] = exp[asesorComercial]

        // Contador de expedientes
        let nivel = getNivel(exp)
        if (nivel === "GP") {
          ingCounter.productivas++
        } else if (nivel === "EXP") {
          ingCounter.express++
        } else {
          ingCounter.estandar++
        }

        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return [ingresar, ingCounter]
  }, [workflow, dayFiltered])

  const [asignarTBody, asignarCount] = useMemo(() => {
    let asignar: { [codigoSol: string | number]: Expediente } = {}
    let asignarCounter: Counter = { ...counterDefault }

    if (!workflow) {
      return [asignar, asignarCounter]
    }

    for (const solCode in workflow) {
      let sol = workflow[solCode]

      for (const exp of sol) {
        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos"].includes((exp[estadoExp] as string)) === false
        let analistaAsignado = !!exp[analista];

        if (estadoExpInvalido || analistaAsignado) {
          continue;
        }

        // Validando nombres de columnas por si se cambia el workflow
        let currSol = !!exp[codigoSol] ? codigoSol : codigoSolAlt
        let currCanal = !!exp[canal] ? canal : canalAlt

        // Si no existe la solicitud en asignar, es creada con algunos valores ya unicos
        if (!asignar[solCode]) {
          asignar[solCode] = {}
        }

        asignar[solCode][fechaIngreso] = exp[fechaIngreso] && moment(exp[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        asignar[solCode]["Días GR"] = dayFiltered.diff(moment(exp[fechaIngreso], "DD/MM/YYYY"), 'days')

        asignar[solCode][codigoSol] = exp[currSol]
        asignar[solCode][estadoExp] = exp[estadoExp]
        asignar[solCode][razonSocial] = exp[razonSocial]
        asignar[solCode][analista] = exp[analista]

        asignar[solCode][canal] = exp[currCanal]
        asignar[solCode][sucursal] = exp[sucursal]
        asignar[solCode][asesorComercial] = exp[asesorComercial]

        // Contador de expedientes
        let nivel = getNivel(exp)
        if (nivel === "GP") {
          asignarCounter.productivas++
        } else if (nivel === "EXP") {
          asignarCounter.express++
        } else {
          asignarCounter.estandar++
        }

        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return [asignar, asignarCounter]
  }, [workflow, dayFiltered])

  const [pendientesTBody, pendientesCount] = useMemo(() => {
    let pendientes: { [codigoSol: string | number]: Expediente } = {}
    let pendientesCounter: Counter = { ...counterDefault }

    for (const solCode in workflow) {
      let sol = workflow[solCode]
      for (const exp of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos", "Analisis"].includes((exp[estadoExp] as string)) === false
        let faltanteInfo = !exp[faltaInfo];
        let devuelto = !!exp[fechaDevolucion];
        let finalizado = !!exp[fechaFinalizadoAnalista];

        if (faltanteInfo || estadoExpInvalido || devuelto || finalizado) {
          continue;
        }


        // Si no existe la solicitud en pendientes, es creada con algunos valores ya unicos
        if (!pendientes[solCode]) {
          pendientes[solCode] = {}
        }


        pendientes[solCode][codigoSol] = exp[codigoSol] ?? exp[codigoSolAlt]
        pendientes[solCode][estadoExp] = exp[estadoExp]
        pendientes[solCode][razonSocial] = exp[razonSocial]
        pendientes[solCode][fechaIngreso] = exp[fechaIngreso] && moment(exp[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        pendientes[solCode][fechaAsignadoAnalista] = exp[fechaAsignadoAnalista] && moment(exp[fechaAsignadoAnalista], "DD/MM/YYYY").format("DD/MM")
        pendientes[solCode][faltaInfo] = exp[faltaInfo]
        pendientes[solCode][faltaInfoDesde] = exp[faltaInfoDesde] && moment(exp[faltaInfoDesde], "DD/MM/YYYY").format("DD/MM")
        pendientes[solCode][faltaInfoHasta] = exp[faltaInfoHasta] && moment(exp[faltaInfoHasta], "DD/MM/YYYY").format("DD/MM")
        pendientes[solCode][analista] = exp[analista]
        pendientes[solCode][canal] = exp[canal] ?? exp[canalAlt]
        pendientes[solCode][sucursal] = exp[sucursal]
        pendientes[solCode][asesorComercial] = exp[asesorComercial]
        pendientes[solCode]["Días GR"] = dayFiltered.diff(moment(exp[fechaIngreso], "DD/MM/YYYY"), 'days')
        pendientes[solCode]["Días asignado"] = dayFiltered.diff(moment(exp[fechaAsignadoAnalista], "DD/MM/YYYY"), 'days')
        pendientes[solCode]["Días pendiente"] = moment().diff(moment(exp[faltaInfoDesde], "DD/MM/YYYY"), 'days')

        // Contador de expedientes
        let nivel = getNivel(exp)
        if (nivel === "GP") {
          pendientesCounter.productivas++
        } else if (nivel === "EXP") {
          pendientesCounter.express++
        } else {
          pendientesCounter.estandar++
        }

        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return [pendientes, pendientesCounter]
  }, [workflow, dayFiltered])

  const [analisisTBody, analisisCount] = useMemo(() => {
    let analisis: { [codigoSol: string | number]: Expediente } = {}
    let analisisCounter: Counter = { ...counterDefault }

    for (const solCode in workflow) {
      let sol = workflow[solCode]
      for (const exp of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos", "Analisis"].includes((exp[estadoExp] as string)) === false;
        let faltanteInfo = !!exp[faltaInfo];
        let faltanteAnalista = !exp[analista];
        let finalizado = exp[fechaFinalizadoAnalista];

        if (faltanteInfo || faltanteAnalista || estadoExpInvalido || finalizado) {
          continue;
        }


        // Si no existe la solicitud en analisis, es creada con algunos valores ya unicos
        if (!analisis[solCode]) {
          analisis[solCode] = {}
        }


        analisis[solCode][codigoSol] = exp[codigoSol] ?? exp[codigoSolAlt]
        analisis[solCode][estadoExp] = exp[estadoExp]
        analisis[solCode][razonSocial] = exp[razonSocial]
        analisis[solCode][fechaIngreso] = exp[fechaIngreso] && moment(exp[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        analisis[solCode][fechaAsignadoAnalista] = exp[fechaAsignadoAnalista] && moment(exp[fechaAsignadoAnalista], "DD/MM/YYYY").format("DD/MM")
        analisis[solCode][faltaInfo] = exp[faltaInfo]
        analisis[solCode][faltaInfoDesde] = exp[faltaInfoDesde] && moment(exp[faltaInfoDesde], "DD/MM/YYYY").format("DD/MM")
        analisis[solCode][faltaInfoHasta] = exp[faltaInfoHasta] && moment(exp[faltaInfoHasta], "DD/MM/YYYY").format("DD/MM")
        analisis[solCode][analista] = exp[analista]
        analisis[solCode][canal] = exp[canal] ?? exp[canalAlt]
        analisis[solCode][sucursal] = exp[sucursal]
        analisis[solCode][asesorComercial] = exp[asesorComercial]
        analisis[solCode]["Días GR"] = dayFiltered.diff(moment(exp[fechaIngreso], "DD/MM/YYYY"), 'days')
        analisis[solCode]["Días asignado"] = dayFiltered.diff(moment(exp[fechaAsignadoAnalista], "DD/MM/YYYY"), 'days')
        analisis[solCode]["Días pendiente"] = exp[faltaInfoHasta] && exp[faltaInfoDesde] ? moment(exp[faltaInfoHasta], "DD/MM/YYYY").diff(moment(exp[faltaInfoDesde], "DD/MM/YYYY"), 'days') : 0

        // Contador de expedientes
        let nivel = getNivel(exp)
        if (nivel === "GP") {
          analisisCounter.productivas++
        } else if (nivel === "EXP") {
          analisisCounter.express++
        } else {
          analisisCounter.estandar++
        }

        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return [analisis, analisisCounter]
  }, [workflow, dayFiltered])

  const [supervisionTBody, supervisionCount] = useMemo(() => {
    let supervision: { [codigoSol: string | number]: Expediente } = {}
    let supervisionCounter: Counter = { ...counterDefault }

    for (const solCode in workflow) {
      let sol = workflow[solCode]
      for (const exp of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos", "Analisis"].includes((exp[estadoExp] as string)) === false
        let faltanteInfo = exp[faltaInfo];
        let sinAsignar = !exp[analista];
        let sinFinalizar = !exp[fechaFinalizadoAnalista]

        if (estadoExpInvalido || faltanteInfo || sinAsignar || sinFinalizar) {
          continue;
        }


        // Si no existe la solicitud en supervision, es creada con algunos valores ya unicos
        if (!supervision[solCode]) {
          supervision[solCode] = {}
        }


        supervision[solCode][codigoSol] = exp[codigoSol] ?? exp[codigoSolAlt]
        supervision[solCode][estadoExp] = exp[estadoExp]
        supervision[solCode][razonSocial] = exp[razonSocial]
        supervision[solCode][fechaIngreso] = exp[fechaIngreso] && moment(exp[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        supervision[solCode][fechaAsignadoAnalista] = exp[fechaAsignadoAnalista] && moment(exp[fechaAsignadoAnalista], "DD/MM/YYYY").format("DD/MM")
        supervision[solCode][faltaInfoDesde] = exp[faltaInfoDesde] && moment(exp[faltaInfoDesde], "DD/MM/YYYY").format("DD/MM")
        supervision[solCode][faltaInfoHasta] = exp[faltaInfoHasta] && moment(exp[faltaInfoHasta], "DD/MM/YYYY").format("DD/MM")
        supervision[solCode][fechaFinalizadoAnalista] = exp[fechaFinalizadoAnalista] && moment(exp[fechaFinalizadoAnalista], "DD/MM/YYYY").format("DD/MM")
        supervision[solCode][analista] = exp[analista]
        supervision[solCode][canal] = exp[canal] ?? exp[canalAlt]
        supervision[solCode][sucursal] = exp[sucursal]
        supervision[solCode][asesorComercial] = exp[asesorComercial]
        supervision[solCode][fechaFinalizadoAnalista] = exp[fechaFinalizadoAnalista]
        supervision[solCode]["Días GR"] = dayFiltered.diff(moment(exp[fechaIngreso], "DD/MM/YYYY"), 'days')
        supervision[solCode]["Días asignado"] = dayFiltered.diff(moment(exp[fechaAsignadoAnalista], "DD/MM/YYYY"), 'days')
        supervision[solCode]["Días supervisión"] = dayFiltered.diff(moment(exp[fechaFinalizadoAnalista], "DD/MM/YYYY"), 'days')
        supervision[solCode]["Días pendiente"] = exp[faltaInfoHasta] ? moment(exp[faltaInfoHasta], "DD/MM/YYYY").diff(moment(exp[faltaInfoDesde], "DD/MM/YYYY"), 'days') : 0

        // Contador de expedientes
        let nivel = getNivel(exp)
        if (nivel === "GP") {
          supervisionCounter.productivas++
        } else if (nivel === "EXP") {
          supervisionCounter.express++
        } else {
          supervisionCounter.estandar++
        }

        // Por ahora solo tomaremos un expediente
        break;
      }
    }

    return [supervision, supervisionCounter]
  }, [workflow, dayFiltered])


  const [devueltasTBody, devueltasCount] = useMemo(() => {
    let devueltas: { [codigoSol: string | number]: Expediente } = {}
    let devueltasCounter: Counter = { ...counterDefault }

    for (const solCode in workflow) {
      let sol = workflow[solCode]
      for (const exp of sol) {

        // Pre chequeos
        let estadoExpInvalido = ["Análisis de Bastanteo/Riesgos", "Analisis"].includes((exp[estadoExp] as string)) === false
        let faltanteInfo = exp[faltaInfo] !== 'Si';
        let noEstaDevuelto = exp[fechaDevolucion] == null

        if (faltanteInfo || estadoExpInvalido || noEstaDevuelto) {
          continue;
        }


        // Si no existe la solicitud en devueltas, es creada con algunos valores ya unicos
        if (!devueltas[solCode]) {
          devueltas[solCode] = {}
        }


        devueltas[solCode][codigoSol] = exp[codigoSol] ?? exp[codigoSolAlt]
        devueltas[solCode][estadoExp] = exp[estadoExp]
        devueltas[solCode][razonSocial] = exp[razonSocial]
        devueltas[solCode][fechaIngreso] = exp[fechaIngreso] && moment(exp[fechaIngreso], "DD/MM/YYYY").format("DD/MM")
        devueltas[solCode][fechaAsignadoAnalista] = exp[fechaAsignadoAnalista] && moment(exp[fechaAsignadoAnalista], "DD/MM/YYYY").format("DD/MM")
        devueltas[solCode][faltaInfo] = '-'
        devueltas[solCode][faltaInfoDesde] = exp[faltaInfoDesde] && moment(exp[faltaInfoDesde], "DD/MM/YYYY").format("DD/MM")
        devueltas[solCode][faltaInfoHasta] = exp[faltaInfoHasta] && moment(exp[faltaInfoHasta], "DD/MM/YYYY").format("DD/MM")
        devueltas[solCode][analista] = exp[analista]
        devueltas[solCode][canal] = exp[canal] ?? exp[canalAlt]
        devueltas[solCode][sucursal] = exp[sucursal]
        devueltas[solCode][asesorComercial] = exp[asesorComercial]
        devueltas[solCode]["Días GR"] = dayFiltered.diff(moment(exp[fechaIngreso], "DD/MM/YYYY"), 'days')
        devueltas[solCode]["Días asignado"] = dayFiltered.diff(moment(exp[fechaAsignadoAnalista], "DD/MM/YYYY"), 'days')
        devueltas[solCode]["Días pendiente"] = exp[faltaInfoHasta] ? moment(exp[faltaInfoHasta], "DD/MM/YYYY").diff(moment(exp[faltaInfoDesde], "DD/MM/YYYY"), 'days') : 0

        // Contador de expedientes
        let nivel = getNivel(exp)
        if (nivel === "GP") {
          devueltasCounter.productivas++
        } else if (nivel === "EXP") {
          devueltasCounter.express++
        } else {
          devueltasCounter.estandar++
        }

        // Por ahora solo tomaremos un expediente
        break;
      }
    }
    return [devueltas, devueltasCounter]
  }, [workflow, dayFiltered])


  // updating fullcount
  useEffect(() => {
    setFullCount({
      ...fullCount,
      ingresar: ingresarCount,
      asignar: asignarCount,
      pendientes: pendientesCount,
      analisis: analisisCount,
      supervision: supervisionCount,
      devueltas: devueltasCount,
      ["total canal"]: {
        estandar: asignarCount.estandar + pendientesCount.estandar + analisisCount.estandar + supervisionCount.estandar,
        express: asignarCount.express + pendientesCount.express + analisisCount.express + supervisionCount.express ,
        productivas: asignarCount.productivas + pendientesCount.productivas + analisisCount.productivas + supervisionCount.productivas 
      }
    })
  }, [supervisionCount, devueltasCount])

  return (
    <TablesWF.Provider value={{
      workflow,
      headers,
      completoTBody,
      ingresarTBody,
      asignarTBody,
      pendientesTBody,
      analisisTBody,
      supervisionTBody,
      devueltasTBody,
      fullCount,
    }}>
      {children}
    </TablesWF.Provider>
  )
}

export const useTablesWF = () => {
  const context = useContext(TablesWF);

  if (!context) {
    throw new Error("useTablesWF must be used within a TablesWFProvider");
  }

  return context;
}