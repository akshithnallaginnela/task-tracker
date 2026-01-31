import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="ml-64">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
