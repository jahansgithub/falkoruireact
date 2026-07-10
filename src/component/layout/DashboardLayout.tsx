import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './css/DashboardLayout.css';

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout d-flex">
      <Sidebar />
      <div className="dashboard-main flex-grow-1 d-flex flex-column">
        <Topbar />
        <div className="dashboard-content flex-grow-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}