import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp, formatPrice } from '../context/AppContext.jsx';

const emptyProduct = { name: '', price: '', type: 'consola', image: '', description: '' };
const emptyUser = { name: '', lastName: '', email: '', role: 'user', password: '' };

export const AdminPanelPage = () => {
  const navigate = useNavigate();
  const { session, products, users, upsertProduct, deleteProduct, upsertUser, deleteUser } = useApp();
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState(null);
  const [file, setFile] = useState(null);
  const [userForm, setUserForm] = useState(emptyUser);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userError, setUserError] = useState('');

  useEffect(() => {
    if (!session || session.role !== 'admin') {
      navigate('/login-admin');
    }
  }, [session, navigate]);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;
    try {
      const form = new FormData();
      form.append('producto', new Blob([JSON.stringify({
        name: productForm.name,
        price: Number(productForm.price),
        type: productForm.type,
        description: productForm.description
      })], { type: 'application/json' }));
      if (file) form.append('file', file);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const { data } = await axios.post(`${API_URL}/productos`, form);

      // sincroniza con estado local (usa id del backend)
      upsertProduct({ ...productForm, image: data.image, price: Number(data.price) }, data.id);

      setProductForm(emptyProduct);
      setEditingProductId(null);
      setFile(null);
    } catch (err) {
      console.error('Error creando producto', err);
    }
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    const result = upsertUser(userForm, editingUserId);
    if (!result.ok) {
      setUserError(result.message);
      return;
    }
    setUserError('');
    setUserForm(emptyUser);
    setEditingUserId(null);
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm({ name: product.name, price: product.price, type: product.type, image: product.image, description: product.description });
    setFile(null);
  };

  const handleEditUser = (user) => {
    setEditingUserId(user.id);
    setUserForm({ name: user.name, lastName: user.lastName || '', email: user.email, role: user.role, password: '' });
  };

  return (
    <main className="container py-5" data-page="admin-only">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4 gap-3">
        <div>
          <p className="text-uppercase text-muted mb-1">Solo admin</p>
          <h1 className="mb-2">Panel administrador</h1>
          <p className="mb-0">Pepito (pepitoPro@gmail.com / Pepitogod123) gestiona productos aquí.</p>
        </div>
        <div className="text-lg-end">
          <Link className="btn btn-outline-light me-2" to="/productos">Ver catálogo</Link>
          <Link className="btn btn-primary" to="/login-admin">Cambiar de admin</Link>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted text-uppercase small mb-1">Crear/editar</p>
              <h5 className="orbitron mb-3">Producto</h5>
              <form className="d-grid gap-3" onSubmit={handleProductSubmit}>
                <div>
                  <label className="form-label">Nombre</label>
                  <input className="form-control" type="text" name="name" placeholder="Nombre del producto" value={productForm.name} onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))} required />
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label">Precio CLP</label>
                    <input className="form-control" type="number" name="price" min="0" step="1000" placeholder="99990" value={productForm.price} onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))} required />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Tipo</label>
                    <select className="form-select" name="type" value={productForm.type} onChange={(e) => setProductForm((prev) => ({ ...prev, type: e.target.value }))} required>
                      <option value="consola">Consola</option>
                      <option value="accesorio">Accesorio</option>
                      <option value="pc">PC</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Imagen (.jpg, .png)</label>
                  <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
                </div>
                <div>
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" name="description" rows="3" placeholder="Breve descripción" value={productForm.description} onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))} required></textarea>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">Guardar</button>
                  <button className="btn btn-outline-light" type="button" onClick={() => { setProductForm(emptyProduct); setEditingProductId(null); }}>Limpiar</button>
                </div>
                <p className="small text-muted mb-0">Si editas un producto, se carga aquí y se guarda con IDs numéricos consecutivos.</p>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted text-uppercase small mb-1">Listado</p>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="orbitron mb-0">Productos</h5>
                <span className="badge bg-secondary">Se guardan en localStorage</span>
              </div>
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Tipo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{formatPrice(p.price)}</td>
                        <td className="text-capitalize">{p.type}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-light" type="button" onClick={() => handleEditProduct(p)}>Editar</button>
                            <button className="btn btn-sm btn-danger" type="button" onClick={() => deleteProduct(p.id)}>Borrar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted text-uppercase small mb-1">Crear/editar</p>
              <h5 className="orbitron mb-3">Usuario</h5>
              <form className="d-grid gap-3" onSubmit={handleUserSubmit}>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label">Nombre</label>
                    <input className="form-control" type="text" name="name" placeholder="Nombre" value={userForm.name} onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))} required />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Apellido</label>
                    <input className="form-control" type="text" name="lastName" placeholder="Apellido" value={userForm.lastName} onChange={(e) => setUserForm((prev) => ({ ...prev, lastName: e.target.value }))} required />
                  </div>
                </div>
                <div>
                  <label className="form-label">Correo</label>
                  <input className="form-control" type="email" name="email" placeholder="correo@ejemplo.com" value={userForm.email} onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))} required />
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label">Rol</label>
                    <select className="form-select" name="role" value={userForm.role} onChange={(e) => setUserForm((prev) => ({ ...prev, role: e.target.value }))} required>
                      <option value="user">Usuario</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label">Contraseña</label>
                    <input className="form-control" type="text" name="password" placeholder="********" value={userForm.password} onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))} />
                    <div className="form-text">Requerida al crear. En edición, dejar vacío para mantener.</div>
                  </div>
                </div>
                {userError && <p className="text-danger mb-1">{userError}</p>}
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">Guardar usuario</button>
                  <button className="btn btn-outline-light" type="button" onClick={() => { setUserForm(emptyUser); setEditingUserId(null); setUserError(''); }}>Limpiar</button>
                </div>
                <p className="small text-muted mb-0">Los usuarios se guardan en localStorage. Correos únicos.</p>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted text-uppercase small mb-1">Listado</p>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="orbitron mb-0">Usuarios</h5>
                <span className="badge bg-secondary">LocalStorage</span>
              </div>
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.name} {u.lastName || ''}</td>
                        <td>{u.email}</td>
                        <td className="text-capitalize">{u.role}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-light" type="button" onClick={() => handleEditUser(u)}>Editar</button>
                            <button className="btn btn-sm btn-danger" type="button" onClick={() => deleteUser(u.id)}>Borrar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
