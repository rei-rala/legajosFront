import React from "react";
import Navbar from "./navbar/Navbar";

import styles from "./header.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div>
        <img src="/isotipo.png" alt='logo' />
        <span>Riesgos GTZ <button onClick={() => window.localStorage.clear()}>clear</button></span>
      </div>
      <Navbar />
    </header>
  );
}

export default Header;