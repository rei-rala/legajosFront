import React, { useEffect, useMemo, useState } from "react";
import columnasWf from "../../../config";
import TablaGenerica from "../TablaGenerica/TablaGenerica";

import moment, { Moment } from "../../../libs/moment";

import styles from "./Resumen.module.css";

interface Props {
  counters: {
    asignar: number;
    devueltas: number;
    analisis: number;
    ingresar: number;
    pendientes: number;
    supervision: number;
  },
  supervisionTBody: TableBody,
  analisisTBody: TableBody,
  fullTBody: TableBody,
}


const { canal, codigoSol, razonSocial, asesorComercial, sucursal, analista, fechaFinalizadoAnalista } = columnasWf
const tablaSuperv = ["Días GR", "Días asignado", "Días pendiente", "Días finalizado", codigoSol, razonSocial, canal, asesorComercial, sucursal, analista, fechaFinalizadoAnalista]
const tablaAnalisis = ["Días GR", "Días asignado", "Días pendiente", codigoSol, razonSocial, canal, asesorComercial, sucursal, analista]

const Resumen: React.FC<Props> = ({ counters, supervisionTBody, analisisTBody, fullTBody }) => {
  const [dayFiltered, setDayFiltered] = useState<Moment>(moment());

  const [legajosIngresadosDia, cantidadLegajosIngresados] = useMemo(() => {
    const solicitudesDia = []
    for (let sol of Object.values(fullTBody)) {
      let fechaIngreso = sol["Ingreso Riesgo"]

      if (fechaIngreso) {
        let isToday = moment(fechaIngreso, "DD/MM/YYYY").format("DD/MM/YYYY") === dayFiltered.format("DD/MM/YYYY")
        if (isToday) {
          solicitudesDia.push(sol)
        }
      }
    }
    return [solicitudesDia, solicitudesDia.length]
  }, [fullTBody])

  const qSolicitudes = Object.values(counters).reduce((acc, v) => acc + v, 0) - counters.devueltas

  const [tablaInvertida, setTablaInvertida] = useState(false)

  const tablaConteo = {
    "Ingresar": counters.ingresar,
    "Asignar": counters.asignar,
    "Pendientes": counters.pendientes,
    "Análisis": counters.analisis,
    "Supervisión": counters.supervision,
    "Devueltas": counters.devueltas,
  }


  useEffect(() => {
    document.title = "Workflow | Resumen";
  }, []);


  return (
    <div className={styles.resumen}>
      <h3>Mostrando Resumen <button onClick={() => setTablaInvertida(!tablaInvertida)}>Invertir</button></h3>
      <div className={styles.miniTabla}>

        <table>
          {
            tablaInvertida
              ? (<>
                <thead>
                  <tr>
                    {
                      Object.keys(tablaConteo).map((key) => (
                        <th key={key} scope="col">{key}</th>
                      ))
                    }
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {
                      Object.values(tablaConteo).map((value, i) => (
                        <td key={"resumen" + i}>{value}</td>
                      ))
                    }
                  </tr>
                </tbody>
              </>)
              : (<>
                <thead>
                  <tr>
                    <th scope="col">Estado</th>
                    <th scope="col">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    Object.entries(tablaConteo).map(([column, value]) => (
                      <tr key={column}>
                        <th scope="col">
                          {column}
                        </th>
                        <td>{value}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </>)
          }

        </table>


        <div>
          <p>Contamos con {qSolicitudes} legajo{qSolicitudes > 1 && "s"} en riesgos </p>
          <p>El {dayFiltered.locale('es').format("dddd D [de] MMMM")} {cantidadLegajosIngresados === 0 ? "no hubo" : "hubo " + cantidadLegajosIngresados} ingresos</p>
        </div>


      </div>

      <div>
        <h4>Analisis</h4>
        <TablaGenerica headers={tablaAnalisis} tableBody={analisisTBody} tableName="analisis" />
      </div>

      <div>
        <h4>Supervision</h4>
        <TablaGenerica headers={tablaSuperv} tableBody={supervisionTBody} tableName="supervision" />
      </div>

    </div >
  )
}

export default Resumen