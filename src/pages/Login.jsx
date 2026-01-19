import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export const LoginPage = () => {
  const { login, session } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(form.email.trim().toLowerCase(), form.password);
    if (result.ok) {
      setTimeout(() => {
        if (result.user.role === 'admin') navigate('/admin');
        else navigate('/');
      }, 300);
    }
  };

  if (session) {
    return (
      <main className="container py-5 min-vh-100">
        <p className="text-muted">Ya tienes sesión activa.</p>
        <Link className="btn btn-primary" to="/">Volver a inicio</Link>
      </main>
    );
  }

  return (
    <main className="container py-5 min-vh-100 d-flex align-items-center" style={{ maxWidth: '720px' }}>
      <div className="w-100">
        <h1 className="mb-4">Iniciar sesión</h1>
        <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input type="email" className="form-control" name="email" placeholder="correo@ejemplo.com" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" name="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required />
          </div>
          <div className="d-flex gap-2 mb-3">
            <button type="submit" className="btn btn-primary">Ingresar</button>
            <Link className="btn btn-outline-light" to="/registro">Crear cuenta</Link>
          </div>
          <p className="small text-muted mb-0">Si eres admin usa <Link className="link-light" to="/login-admin">login admin</Link>.</p>
        </form>
      </div>
    </main>
  );
};
