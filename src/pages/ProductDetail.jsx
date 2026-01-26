import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp, formatPrice } from '../context/AppContext.jsx';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useApp();
  const product = products.find((p) => String(p.id) === String(id));

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

  if (!product) {
    return (
      <main className="container py-5">
        <p className="text-muted">Producto no encontrado.</p>
        <button className="btn btn-outline-light" type="button" onClick={() => navigate(-1)}>Volver</button>
      </main>
    );
  }

  return (
    <main className="container py-5" data-product-detail>
      <div className="row g-4 align-items-start">
        <div className="col-lg-6">
          <img className="img-fluid rounded shadow-sm" src={resolveImage(product.image)} alt={product.name} />
        </div>
        <div className="col-lg-6">
          <p className="text-uppercase text-muted mb-1">Tipo: <span>{product.type}</span></p>
          <h1 className="mb-3">{product.name}</h1>
          <p className="h4 price-tag mb-3">{formatPrice(product.price)}</p>
          <p className="mb-4">{product.description}</p>
          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="button" onClick={() => addToCart(product.id)}>Agregar al carrito</button>
            <Link className="btn btn-outline-light" to="/productos">Volver al catálogo</Link>
          </div>
        </div>
      </div>
    </main>
  );
};
