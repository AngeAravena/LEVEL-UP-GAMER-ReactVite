import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp, formatPrice } from '../context/AppContext.jsx';

export const PaymentPage = () => {
  const navigate = useNavigate();
  const { cart, products, cartTotal, clearCart, session, notify } = useApp();
  const [form, setForm] = useState({ name: '', last: '', email: '' });
  const [method, setMethod] = useState('');
  const [cuotas, setCuotas] = useState('');

  useEffect(() => {
    if (session) {
      const [first, ...rest] = (session.name || '').split(' ');
      setForm((prev) => ({
        name: prev.name || first || '',
        last: prev.last || session.lastName || rest.join(' ') || '',
        email: prev.email || session.email || ''
      }));
    }
  }, [session]);

  const discount = useMemo(() => {
    const domain = (form.email || '').toLowerCase().split('@')[1] || '';
    return domain.includes('duocuc.cl') ? Math.round(cartTotal * 0.2) : 0;
  }, [form.email, cartTotal]);

  const finalTotal = Math.max(0, cartTotal - discount);

  const handleConfirm = () => {
    if (!cart.length) {
      notify('Tu carrito está vacío');
      return;
    }
    if (!form.name.trim() || !form.last.trim()) {
      notify('Completa nombre y apellido');
      return;
    }
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailValid) {
      notify('Correo inválido');
      return;
    }
    if (!method) {
      notify('Selecciona débito o crédito');
      return;
    }
    if (method === 'credito' && !cuotas) {
      notify('Elige una cantidad de cuotas');
      return;
    }
    clearCart();
    notify('Pago exitoso, compra finalizada', 5000);
    setTimeout(() => navigate('/'), 5200);
  };

  return (
    <main className="container py-5 min-vh-100">
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card p-4 shadow-sm h-100" data-pay-cart>
            <p className="text-muted text-uppercase small mb-1">Resumen carrito</p>
            <h4 className="mb-3">Productos</h4>
            <div className="d-grid gap-3" data-pay-cart-items>
              {!cart.length && <p className="text-muted mb-0">Tu carrito está vacío.</p>}
              {cart.map((item) => {
                const product = products.find((p) => p.id === item.id);
                if (!product) return null;
                const line = product.price * item.qty;
                return (
                  <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-2" key={item.id}>
                    <div>
                      <div className="fw-semibold">{product.name}</div>
                      <small className="text-muted">{item.qty} x {formatPrice(product.price)}</small>
                    </div>
                    <div className="price-tag">{formatPrice(line)}</div>
                  </div>
                );
              })}
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-secondary" data-pay-cart-total-row>
              <span>Total</span>
              <span className="price-tag" data-pay-cart-total>{formatPrice(finalTotal)}</span>
            </div>
            {discount > 0 && (
              <div className="d-flex justify-content-between align-items-center text-success mt-2">
                <span>Descuento exclusivo Duoc</span>
                <span>- {formatPrice(discount)}</span>
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card p-4 shadow-sm">
            <p className="text-muted text-uppercase small mb-1">Checkout</p>
            <h1 className="mb-4">Pago</h1>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input className="form-control" type="text" placeholder="Nombre" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Apellido</label>
                <input className="form-control" type="text" placeholder="Apellido" value={form.last} onChange={(e) => setForm((prev) => ({ ...prev, last: e.target.value }))} required />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Correo</label>
              <input className="form-control" type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Método de pago</label>
              <div className="btn-group w-100" role="group">
                <button type="button" className={`btn ${method === 'debito' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => { setMethod('debito'); setCuotas(''); }}>Débito</button>
                <button type="button" className={`btn ${method === 'credito' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setMethod('credito')}>Crédito</button>
              </div>
            </div>

            {method === 'credito' && (
              <div className="mb-3">
                <label className="form-label">Cuotas (solo crédito)</label>
                <div className="d-flex flex-wrap gap-2">
                  {['sin-cuotas', '3', '6', '12'].map((value) => (
                    <button key={value} type="button" className={`btn ${cuotas === value ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setCuotas(value)}>
                      {value === 'sin-cuotas' ? 'Sin cuotas' : `${value} cuotas`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-primary" type="button" onClick={handleConfirm}>Ir a portal de pago</button>
              <Link className="btn btn-outline-light" to="/productos">Volver</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
