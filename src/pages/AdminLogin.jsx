import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export const AdminLoginPage = () => {
  const { adminLogin, session } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'pepitoPro@gmail.com', password: 'Pepitogod123' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = adminLogin(form.email.trim().toLowerCase(), form.password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError('');
    setTimeout(() => navigate('/admin'), 300);
  };

  if (session?.role === 'admin') {
    return (
      <main className="container py-5 min-vh-100">
        <p className="text-muted">Ya estás logueado como admin.</p>
        <Link className="btn btn-primary" to="/admin">Ir al panel</Link>
      </main>
    );
  }

  return (
    <main className="container py-5 min-vh-100 d-flex align-items-center" style={{ maxWidth: '720px' }}>
      <div className="w-100">
        <h1 className="mb-4">Acceso administrador</h1>
        <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo admin</label>
            <input type="email" className="form-control" name="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" name="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required />
          </div>
          {error && <p className="text-danger mb-2">{error}</p>}
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">Ingresar</button>
            <Link className="btn btn-outline-light" to="/">Volver a inicio</Link>
          </div>
          <p className="small text-muted mb-0 mt-3">Si no eres admin, usa <Link className="link-light" to="/login">login de usuario</Link>.</p>
        </form>
      </div>
    </main>
  );
};
