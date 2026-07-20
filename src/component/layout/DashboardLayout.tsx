import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useViewStore } from '../../store/viewStore';
import './css/DashboardLayout.css';
import GraphInfoPanel from '../GraphInfoPanel';

export default function DashboardLayout() {
  const view = useViewStore((state) => state.view);
  const setView = useViewStore((state) => state.setView);

  return (
    <div className="dashboard-layout d-flex">
      <Sidebar />
         <GraphInfoPanel />
      <div className="dashboard-main flex-grow-1 d-flex flex-column">
        <Topbar />
        <div className="dashboard-content flex-grow-1">
          <Outlet />

          <div className="view-toggle-icons d-flex align-items-center gap-3">
            <i
              className={`bi bi-diagram-3 view-icon ${view === 'graph' ? 'active' : ''}`}
              onClick={() => setView('graph')}
            ></i>
            <i
              className={`bi bi-table view-icon ${view === 'table' ? 'active' : ''}`}
              onClick={() => setView('table')}
            ></i>
            <i
              className={`bi bi-file-earmark-text view-icon ${view === 'text' ? 'active' : ''}`}
              onClick={() => setView('text')}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
}