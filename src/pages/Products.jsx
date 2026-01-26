import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp, formatPrice } from '../context/AppContext.jsx';
import { useEffect } from 'react';

const dedupeById = (list = []) => {
  const seen = new Set();
  return list.filter((p) => {
    const key = String(p?.id ?? '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const resolveImage = (src) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  if (src.startsWith('/assets') || src.startsWith('assets')) {
    const origin = window.location.origin;
    return src.startsWith('/') ? `${origin}${src}` : `${origin}/${src}`;
  }
  const api = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
  const origin = api.replace(/\/api\/?$/, '');
  return src.startsWith('/api/') ? `${origin}${src}` : `${origin}/${src.replace(/^\//, '')}`;
};

export const ProductsPage = () => {
  const { products, cart, addToCart, removeFromCart, updateCartQty, clearCart, notify } = useApp();
  const [params, setParams] = useSearchParams();
  const tipo = params.get('tipo') || '';
  const productsUniq = useMemo(() => dedupeById(products), [products]);
  const filtered = useMemo(() => (tipo ? productsUniq.filter((p) => p.type === tipo) : productsUniq), [productsUniq, tipo]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('ProductsPage productsUniq', productsUniq.length, productsUniq.map((p) => p.id));
    }
  }, [productsUniq]);

  const handleFilter = (value) => {
    if (!value) {
      setParams({});
    } else {
      setParams({ tipo: value });
    }
  };

  return (
    <main className="container py-5">
      <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
        <h1 className="m-0">Catálogo</h1>
        <div className="d-flex flex-wrap gap-2">
          <button data-filter-btn="" className={`btn btn-sm ${tipo === '' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => handleFilter('')}>Todos</button>
          <button data-filter-btn="consola" className={`btn btn-sm ${tipo === 'consola' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => handleFilter('consola')}>Consolas</button>
          <button data-filter-btn="accesorio" className={`btn btn-sm ${tipo === 'accesorio' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => handleFilter('accesorio')}>Accesorios</button>
          <button data-filter-btn="pc" className={`btn btn-sm ${tipo === 'pc' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => handleFilter('pc')}>PCs</button>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="row g-4" id="products-grid">
            {filtered.map((product) => (
              <div className="col-md-6 col-xl-4" key={product.id}>
                <div className="card h-100 shadow-sm">
                  <img className="card-img-top" src={resolveImage(product.image)} alt={product.name} />
                  <div className="card-body d-flex flex-column">
                    <Link to={`/producto/${product.id}`} className="stretched-link text-decoration-none">
                      <h5 className="card-title">{product.name}</h5>
                    </Link>
                    <p className="text-muted mb-2 text-capitalize">{product.type}</p>
                    <p className="price-tag mb-3">{formatPrice(product.price)}</p>
                    <button className="btn btn-primary mt-auto" type="button" onClick={() => addToCart(product.id)}>Añadir</button>
                  </div>
                </div>
              </div>
            ))}
            {!filtered.length && <p className="text-muted">No hay productos en esta categoría.</p>}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="orbitron mb-3">Carrito</h5>
              <div className="mb-3">
                {cart.length === 0 && <p className="text-muted mb-0">Tu carrito está vacío.</p>}
                {cart.map((item) => {
                  const product = products.find((p) => p.id === item.id);
                  if (!product) return null;
                  const lineTotal = product.price * item.qty;
                  return (
                    <div className="d-flex align-items-center justify-content-between mb-2 gap-2" key={item.id}>
                      <div>
                        <div className="fw-semibold">{product.name}</div>
                        <small className="text-muted">{formatPrice(product.price)} c/u</small>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <input type="number" min="1" className="form-control form-control-sm" style={{ width: '72px' }} value={item.qty} onChange={(e) => updateCartQty(item.id, parseInt(e.target.value || '1', 10))} />
                        <span className="price-tag">{formatPrice(lineTotal)}</span>
                        <button className="btn btn-sm btn-outline-light" type="button" onClick={() => removeFromCart(item.id)}>✕</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Total</span>
                <span className="price-tag">{formatPrice(cart.reduce((acc, item) => {
                  const product = products.find((p) => p.id === item.id);
                  return acc + (product ? product.price * item.qty : 0);
                }, 0))}</span>
              </div>
              <p className="small text-muted mt-2 mb-3">El carrito se guarda en tu navegador (localStorage).</p>
              <div className="d-grid gap-2">
                <Link className="btn btn-primary" to="/pago">Proceder al pago</Link>
                <button className="btn btn-outline-light" type="button" onClick={() => { clearCart(); notify('Carrito vaciado exitosamente'); }}>Vaciar carrito</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
