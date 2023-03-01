import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './Navbar.module.css';

const links = [
  {
    to: '/workflow',
    text: 'Workflow'
  },
  {
    to: '/workflow/analistas',
    text: 'Analistas'
  },
  {
    to: '/workflow/tablas',
    text: 'Workflow'
  },

]

const Navbar: React.FC = () => {
  return (
    <nav style={{ height: '100%' }}>
      <ul className={styles.navList}>
        {
          links.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} className={navData => styles.navLink + " " + (navData.isActive ? styles.active : "")} end>
                {l.text}
              </NavLink>
            </li>
          ))
        }
      </ul>
    </nav>
  );
}

export default Navbar;