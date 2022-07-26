import React from "react";
import { useLoading } from "../../context";

import "./Loader.module.css";

const Loader: React.FC = () => {
  const { currentlyLoading } = useLoading();

  return (
    <div >
      <div >
        <h1>Cargando...</h1>
        <ul >
          {currentlyLoading.map((r, index) => <li key={r + index}>{r}</li>)}
        </ul>
      </div>
    </div>
  )
}

export default Loader;