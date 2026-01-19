import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export const RegisterPage = () => {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', lastName: '', email: '', password: '', repeat: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = register({ ...form, email: form.email.trim().toLowerCase() });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError('');
    setTimeout(() => navigate('/'), 400);
  };

  return (
    <main className="container py-5" style={{ maxWidth: '720px' }}>
      <h1 className="mb-4">Crear cuenta</h1>
      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" name="name" placeholder="Tu nombre" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Apellido</label>
            <input type="text" className="form-control" name="lastName" placeholder="Apellido" value={form.lastName} onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))} required />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input type="email" className="form-control" name="email" placeholder="correo@ejemplo.com" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
          <div className="form-text">Usa tu correo DUOC para beneficios si aplica.</div>
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required />
        </div>
        <div className="mb-4">
          <label className="form-label">Repetir contraseña</label>
          <input type="password" className="form-control" name="repeat" value={form.repeat} onChange={(e) => setForm((prev) => ({ ...prev, repeat: e.target.value }))} required />
        </div>
        <div className="form-check mb-4">
          <input className="form-check-input" type="checkbox" value="" id="terms" required />
          <label className="form-check-label" htmlFor="terms">Acepto términos y condiciones</label>
        </div>
        {error && <p className="text-danger mb-3">{error}</p>}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Registrarme</button>
          <Link className="btn btn-outline-light" to="/login">Ya tengo cuenta</Link>
        </div>
      </form>
    </main>
  );
};
