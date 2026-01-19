import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <main className="container py-5 min-vh-100">
    <h1 className="mb-3">Página no encontrada</h1>
    <p className="text-muted">La ruta solicitada no existe.</p>
    <Link className="btn btn-primary" to="/">Volver al inicio</Link>
  </main>
);
