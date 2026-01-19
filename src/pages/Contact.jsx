import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export const ContactPage = () => {
  const { notify } = useApp();
  const formRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formEl = formRef.current;
    if (!formEl) return;

    if (!formEl.checkValidity()) {
      e.stopPropagation();
      formEl.classList.add('was-validated');
      return;
    }

    notify('Mensaje enviado', 3000);
    setForm({ name: '', email: '', message: '' });
    formEl.classList.remove('was-validated');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="container py-5 min-vh-100">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card p-4 shadow-sm">
            <p className="text-muted text-uppercase small mb-1">Escríbenos</p>
            <h1 className="mb-3">Contacto</h1>
            <h4 className="mb-4">Cuéntanos qué producto buscas o en qué necesitas ayuda. </h4>
                <p>Respondemos solo en horario hábil de lunes a viernes, de 9:00 a 18:00 horas.</p>
            <form className="d-grid gap-3" onSubmit={handleSubmit} ref={formRef} noValidate data-contact-form>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input className="form-control" type="text" placeholder="Tu nombre" name="name" value={form.name} onChange={handleChange} required />
                  <div className="invalid-feedback">Ingresa tu nombre.</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Correo</label>
                  <input className="form-control" type="email" placeholder="correo@ejemplo.com" name="email" value={form.email} onChange={handleChange} required />
                  <div className="invalid-feedback">Ingresa un correo válido.</div>
                </div>
              </div>
              <div>
                <label className="form-label">Mensaje</label>
                <textarea className="form-control" rows="4" placeholder="¿Qué necesitas?" name="message" value={form.message} onChange={handleChange} required></textarea>
                <div className="invalid-feedback">Cuéntanos en qué podemos ayudarte.</div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit">Enviar</button>
                <Link className="btn btn-outline-light" to="/">Volver</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};
