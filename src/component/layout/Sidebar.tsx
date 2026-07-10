import { NavLink } from 'react-router-dom';
import logo from '../../assets/images.png';
import "./css/Sidebar.css";

export default function Sidebar() {
  return (
    <nav className="app-sidebar d-flex flex-column">
      <div className="sidebar-top text-center py-3">
        <img src={logo} alt="logo" className="sidebar-logo mb-2" />
        <div className="sidebar-env">Default</div>
        <div className="sidebar-version">v4.16.03</div>
        <div className="d-flex justify-content-center gap-1 mt-2">
          <span className="dot dot-orange"></span>
          <span className="dot dot-green"></span>
          <span className="dot dot-green-light"></span>
        </div>
      </div>

      <div className="text-center my-3">
        <button className="add-btn">
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>

      <div className="px-3">
        <div className="sidebar-section-label">GRAPHS</div>
        <ul className="nav flex-column gap-1 mt-2">
          <li className="nav-item">
            <NavLink to="/graph" className="nav-link">
              <i className="bi bi-share-fill me-2"></i>Graph Explorer
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/datasets" className="nav-link">
              <i className="bi bi-database me-2"></i>Datasets
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="mt-auto sidebar-bottom d-flex flex-column align-items-center gap-3 py-3">
        <i className="bi bi-gear icon-btn"></i>
        <i className="bi bi-code-slash icon-btn"></i>
        <i className="bi bi-moon icon-btn"></i>
        <i className="bi bi-box-arrow-right icon-btn"></i>
      </div>
    </nav>
  );
}