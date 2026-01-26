import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp, formatPrice } from '../context/AppContext.jsx';

export const ProfilePage = () => {
  const { session, cartTotal, receipts } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) navigate('/login');
  }, [session, navigate]);

  if (!session) return null;

  const userReceipts = useMemo(() => receipts.filter((r) => String(r.userId) === String(session.id)), [receipts, session.id]);

  const formatDate = (iso) => new Date(iso).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <main className="container py-5">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Tu perfil</h5>
              <dl className="mb-0">
                <dt className="text-muted">Nombre</dt>
                <dd>{session.name || '—'}</dd>
                <dt className="text-muted">Apellido</dt>
                <dd>{session.lastName || '—'}</dd>
                <dt className="text-muted">Correo</dt>
                <dd>{session.email || '—'}</dd>
                <dt className="text-muted">Rol</dt>
                <dd className="text-capitalize">{session.role || 'usuario'}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Boletas de compra</h5>
                <Link to="/productos" className="btn btn-outline-light btn-sm">Seguir comprando</Link>
              </div>
              {!userReceipts.length && <p className="text-muted mb-0">Aún no registramos boletas. Completa una compra para ver aquí tu historial.</p>}
              {userReceipts.map((rec) => (
                <div key={rec.id} className="border-top border-secondary pt-3 mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <div className="fw-semibold">Boleta #{rec.id.slice(-6)}</div>
                      <small className="text-muted">{formatDate(rec.createdAt)}</small>
                    </div>
                    <div className="text-end">
                      <div className="price-tag">{formatPrice(rec.total)}</div>
                      {rec.discount > 0 && <small className="text-success">Incluye descuento de {formatPrice(rec.discount)}</small>}
                    </div>
                  </div>
                  <div className="d-grid gap-2">
                    {rec.items.map((it) => (
                      <div key={`${rec.id}-${it.id}`} className="d-flex justify-content-between align-items-center text-muted small">
                        <span>{it.qty} x {it.name}</span>
                        <span>{formatPrice(it.line)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-muted small mt-2">Método: {rec.method === 'credito' ? 'Crédito' : 'Débito'}{rec.cuotas ? ` • ${rec.cuotas === 'sin-cuotas' ? 'Sin cuotas' : `${rec.cuotas} cuotas`}` : ''}</div>
                </div>
              ))}
              <div className="d-flex align-items-center gap-2 text-muted small mt-3">
                <span>Tu carrito actual:</span>
                <span className="fw-semibold">{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
