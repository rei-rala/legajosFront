import React from "react";
import styles from "./CuadroAnalistaHidden.module.css";



const CuadroAnalistaHidden: React.FC<ICuadroAnalistaProps> = ({ analista, solicitudes, handleHide }) => {

  return (
    <div key={analista} className={styles.analistaBox}>
      <h3 className={styles.analistaBox_title}>{analista}</h3>
      <p>Cantidad de legajos: {Object.keys(solicitudes).length}</p>
      <div className={styles.analistaBox_footer} >
        <div>
          <label>
            <input type="checkbox" onChange={(e) => handleHide(e, analista)} />
            Mostrar
          </label>
        </div>
      </div>
    </div>

  )
}

export default CuadroAnalistaHidden