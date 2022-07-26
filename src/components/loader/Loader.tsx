import React from "react";
import { useLoading } from "../../context";

import styles from "./Loader.module.css";

const Loader: React.FC = () => {
  const { currentlyLoading } = useLoading();

  return (
    <div className={styles.wrapper} >
      <div className={styles.loader}>
        <h1>Cargando...</h1>
        <ul className={styles.loadList}>
          {currentlyLoading.map((r, index) => <li key={r + index}>{r}</li>)}
        </ul>
      </div>
    </div>
  )
}

export default Loader;