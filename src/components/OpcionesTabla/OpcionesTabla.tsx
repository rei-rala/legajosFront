import React, { useState } from "react";

import styles from "./OpcionesTabla.module.css";

const OpcionesTabla: React.FC<{ dayHtml: string, setDayHtml: (day: string) => void }> = ({ dayHtml, setDayHtml }) => {
  const [hide, setHide] = useState(false);

  return <aside className={styles.opcionesContainer}>
    <button onClick={() => setHide(!hide)}>X</button>
    <aside className={styles.opciones + " " + (hide ? styles.hide : "")}>
      <h4>Opciones </h4>
      <ul className={styles.opcionesList}>
        <li>
          <input type="date" value={dayHtml} onChange={e => setDayHtml(e.target.value)} />
        </li>
        <li>
          <a href="#">Fecha</a>
        </li>
      </ul>
    </aside>
  </aside>
}

export default OpcionesTabla