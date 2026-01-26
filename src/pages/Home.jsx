import { Link } from 'react-router-dom';
import { useApp, formatPrice } from '../context/AppContext.jsx';

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

export const HomePage = () => {
  const { products, addToCart } = useApp();
  const featured = dedupeById(products).slice(0, 3);

  return (
    <>
      <header className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h1 className="display-5 fw-bold">Level-Up Gamer</h1>
              <p className="lead mb-4">Consolas, periféricos, PCs y poleras personalizadas. Acumula puntos LevelUp y canjéalos por descuentos.</p>
              <div className="d-flex gap-3">
                <Link className="btn btn-primary" to="/productos">Explorar productos</Link>
                <Link className="btn btn-outline-light" to="/blogs">Ver noticias</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card bg-light text-dark shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold">Beneficios rápidos</h5>
                  <ul className="mb-3">
                    <li>20% de por vida con correo DUOC</li>
                    <li>Puntos por referidos y niveles</li>
                    <li>Despachos a todo Chile</li>
                  </ul>
                  <Link className="btn btn-primary w-100" to="/registro">Registrarme</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Categorías</h4>
            <Link className="btn btn-outline-dark btn-sm" to="/productos">Ver todas</Link>
          </div>
          <div className="row g-3">
            <div className="col-6 col-md-3"><div className="card text-center p-3">Consolas</div></div>
            <div className="col-6 col-md-3"><div className="card text-center p-3">Accesorios</div></div>
            <div className="col-6 col-md-3"><div className="card text-center p-3">PC Gamers</div></div>
            <div className="col-6 col-md-3"><div className="card text-center p-3">Sillas</div></div>
          </div>
        </div>
      </section>

      <section className="pb-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Destacados</h4>
            <Link className="btn btn-outline-dark btn-sm" to="/productos">Ver catálogo</Link>
          </div>
          <div className="row g-4">
            {featured.map((product) => (
              <div className="col-md-4" key={product.id}>
                <div className="card h-100 shadow-sm">
                  <img src={resolveImage(product.image)} className="card-img-top" alt={product.name} />
                  <div className="card-body d-flex flex-column">
                    <Link to={`/producto/${product.id}`} className="text-decoration-none">
                      <h5 className="card-title">{product.name}</h5>
                    </Link>
                    <p className="card-text text-muted mb-2">{formatPrice(product.price)}</p>
                    <button className="btn btn-primary mt-auto" type="button" onClick={() => addToCart(product.id)}>Añadir</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
