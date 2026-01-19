import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.jsx';
import { Footer } from './Footer.jsx';
import { ToastHost } from './ToastHost.jsx';

export const Layout = () => (
  <div className="app-shell">
    <NavBar />
    <main className="main-content">
      <Outlet />
    </main>
    <Footer />
    <ToastHost />
  </div>
);
