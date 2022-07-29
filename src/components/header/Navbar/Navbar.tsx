import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './Navbar.module.css';


const Navbar: React.FC = () => {
  return (
    <nav style={{height: '100%'}}>
      <ul className={styles.navList}>
        <li>
          <NavLink to="/workflow" className={navData => styles.navLink + " " + (navData.isActive ? styles.active : "")} end>
            Workflow
          </NavLink>
        </li>

        <li>
          <NavLink to="/workflow/resumen" className={navData => styles.navLink + " " + (navData.isActive ? styles.active : "")} end>
            Resumen
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;