import React from "react";
import Navbar from "./Navbar/Navbar";

import styles from "./Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerWrapper} >
        <div>
          <img src="/isotipo.png" alt='logo' />
          <span>Riesgos GTZ</span>
        </div>
        <Navbar />
      </div>
    </header>
  );
}

export default Header;