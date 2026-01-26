import { Link, NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

export const NavBar = () => {
  const { session, cartCount, logout } = useApp();
  const isAdmin = session?.role === 'admin';
  const adminTarget = isAdmin ? '/admin' : '/login-admin';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/assets/images/LevelUpLogo.svg" alt="Logo" width="44" height="44" />
          <span className="ms-2 orbitron">Level-Up Gamer</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item"><NavLink className={navLinkClass} to="/">Inicio</NavLink></li>
            <li className="nav-item"><NavLink className={navLinkClass} to="/productos">Productos</NavLink></li>
            <li className="nav-item"><NavLink className={navLinkClass} to="/blogs">Blogs</NavLink></li>
            <li className="nav-item"><NavLink className={navLinkClass} to="/nosotros">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className={navLinkClass} to="/contacto">Contacto</NavLink></li>
            <li className="nav-item"><NavLink className={navLinkClass} to={adminTarget}>Admin</NavLink></li>
            {!session && (
              <>
                <li className="nav-item"><NavLink className={navLinkClass} to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className={navLinkClass} to="/registro">Registro</NavLink></li>
              </>
            )}
            {session && (
              <>
                <li className="nav-item d-none d-lg-block"><Link className="nav-link" to="/perfil">Hola, {session.name}</Link></li>
                <li className="nav-item"><button className="btn btn-outline-light btn-sm ms-lg-2" type="button" onClick={logout}>Cerrar sesión</button></li>
              </>
            )}
            <li className="nav-item ms-lg-3"><Link className="btn btn-primary" to="/productos">Ver catálogo</Link></li>
            <li className="nav-item ms-lg-2"><span className="badge bg-secondary">Carrito <span>{cartCount}</span></span></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
