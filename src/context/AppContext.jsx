import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultUsers, legacyIdMap } from '../data/defaults.js';
import { getProductos } from '../services/api';
const AppContext = createContext(null);

const STORAGE_KEYS = {
  products: 'products',
  users: 'users',
  session: 'session',
  cart: 'cart',
  receipts: 'receipts'
};

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return structuredClone(fallback);
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback) && Array.isArray(parsed)) return parsed;
    if (!Array.isArray(fallback) && parsed !== null && parsed !== undefined) return parsed;
  } catch (err) {
    console.error('Storage parse error', err);
  }
  localStorage.setItem(key, JSON.stringify(fallback));
  return structuredClone(fallback);
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage write error', err);
  }
};

const splitNameParts = (fullName = '') => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return { first: parts[0] || '', last: parts.slice(1).join(' ') || '' };
};

const normalizeUsers = (list) => list.map((u) => {
  if (!u) return u;
  const { last } = splitNameParts(u.name || '');
  return { ...u, lastName: u.lastName || last };
});

const normalizeCart = (cart = []) => cart.map((item) => {
  if (typeof item.id === 'string' && legacyIdMap[item.id] !== undefined) {
    return { ...item, id: legacyIdMap[item.id] };
  }
  return item;
});

const dedupeById = (list = []) => {
  const seen = new Set();
  return list.filter((p) => {
    const key = String(p?.id ?? '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const nextProductId = (products) => (products.length ? Math.max(...products.map((p) => Number(p.id))) + 1 : 0);
const nextUserId = (users) => (users.length ? Math.max(...users.map((u) => Number(u.id) || 0)) + 1 : 1);

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState(() => normalizeUsers(loadFromStorage(STORAGE_KEYS.users, defaultUsers)));
  const [session, setSession] = useState(() => loadFromStorage(STORAGE_KEYS.session, null));
  const [cart, setCart] = useState(() => normalizeCart(loadFromStorage(STORAGE_KEYS.cart, [])));
  const [receipts, setReceipts] = useState(() => loadFromStorage(STORAGE_KEYS.receipts, []));
  const [toasts, setToasts] = useState([]);

  // always dedupe when setting products
  const setProductsSafe = (updater) => {
    setProducts((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return dedupeById(next);
    });
  };

  const productsSafe = useMemo(() => dedupeById(products), [products]);

  useEffect(() => {
    // Debug: inspeccionar productos cargados en runtime
    if (typeof window !== 'undefined') {
      window.__products = productsSafe;
      // console.log('productsSafe length', productsSafe.length);
    }
  }, [productsSafe]);

  useEffect(() => {
    const seed = defaultUsers[0];
    setUsers((prev) => {
      const lowerSeed = seed.email.toLowerCase();
      const hasAdmin = prev.some((u) => u.role === 'admin');
      if (hasAdmin) return prev.map((u) => (u.role === 'admin' ? { ...u, ...seed, email: lowerSeed, lastName: u.lastName || '' } : u));
      return [...prev, { ...seed, email: lowerSeed, lastName: '' }];
    });
  }, []);

  // products se obtienen del backend; no se persisten en localStorage para evitar duplicados
  useEffect(() => saveToStorage(STORAGE_KEYS.users, users), [users]);
  useEffect(() => saveToStorage(STORAGE_KEYS.session, session), [session]);
  useEffect(() => saveToStorage(STORAGE_KEYS.cart, cart), [cart]);
  useEffect(() => saveToStorage(STORAGE_KEYS.receipts, receipts), [receipts]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await getProductos();
        if (Array.isArray(resp.data)) {
          setProductsSafe(resp.data);
        }
      } catch (err) {
        console.error('Error cargando productos desde backend', err);
      }
    })();
  }, []);

  const notify = (message, duration = 2200) => {    //pop up base para notificaciones
    const id = (globalThis.crypto?.randomUUID?.() || String(Date.now() + Math.random()));
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const login = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email === trimmedEmail);
    if (!user) {
      notify('Correo electrónico incorrecto o no registrado');
      return { ok: false, message: 'Correo electrónico incorrecto o no registrado' };
    }
    if (user.password !== password) {
      notify('Contraseña incorrecta');
      return { ok: false, message: 'Contraseña incorrecta' };
    }
    const normalized = { id: user.id, name: user.name, lastName: user.lastName || '', email: user.email, role: user.role };
    setSession(normalized);
    notify('Logeado con éxito');
    return { ok: true, user: normalized };
  };

  const adminLogin = (email, password) => {
    const user = users.find((u) => u.email === email && u.password === password && u.role === 'admin');
    if (!user) return { ok: false, message: 'Solo admin puede ingresar' };
    const normalized = { id: user.id, name: user.name, lastName: user.lastName || '', email: user.email, role: user.role };
    setSession(normalized);
    notify('Bienvenido admin');
    return { ok: true, user: normalized };
  };

  const logout = () => {
    setSession(null);
    notify('Sesión cerrada');
  };

  const register = ({ name, lastName, email, password, repeat }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const trimmedLast = (lastName || '').trim();
    if (password !== repeat) return { ok: false, message: 'Las contraseñas no coinciden' };
    if (users.some((u) => u.email === trimmedEmail)) return { ok: false, message: 'Ese correo ya está registrado' };
    const inferredLast = trimmedLast || splitNameParts(trimmedName).last;
    const newUser = { id: Date.now(), name: trimmedName, lastName: inferredLast, email: trimmedEmail, password, role: 'user' };
    setUsers((prev) => [...prev, newUser]);
    const normalized = { id: newUser.id, name: newUser.name, lastName: newUser.lastName, email: newUser.email, role: newUser.role };
    setSession(normalized);
    notify('Cuenta creada, bienvenido/a');
    return { ok: true, user: normalized };
  };

  const upsertProduct = (payload, editingId) => {
    if (editingId !== undefined && editingId !== null) {
      setProductsSafe((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p)));
      notify('Producto actualizado');
      return editingId;
    }
    const newId = nextProductId(products);
    setProductsSafe((prev) => [...prev, { id: newId, ...payload }]);
    notify('Producto creado');
    return newId;
  };

  const deleteProduct = (id) => {
    setProductsSafe((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.id !== id));
    notify('Producto eliminado');
  };

  const upsertUser = (payload, editingId) => {
    const trimmedEmail = payload.email.trim().toLowerCase();
    const emailTaken = users.some((u) => u.email === trimmedEmail && String(u.id) !== String(editingId ?? ''));
    if (emailTaken) return { ok: false, message: 'Ese correo ya existe' };
    if (editingId) {
      setUsers((prev) => prev.map((u) => (String(u.id) === String(editingId)
        ? { ...u, ...payload, email: trimmedEmail, password: payload.password || u.password }
        : u)));
      notify('Usuario actualizado');
      return { ok: true };
    }
    if (!payload.password) return { ok: false, message: 'Ingresa contraseña para crear usuario' };
    const newUser = { id: nextUserId(users), ...payload, email: trimmedEmail };
    setUsers((prev) => [...prev, newUser]);
    notify('Usuario creado');
    return { ok: true };
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => String(u.id) !== String(id)));
    notify('Usuario eliminado');
  };

  const addToCart = (id) => {
    const numericId = Number(id);
    setCart((prev) => {
      const found = prev.find((i) => i.id === numericId);
      if (found) return prev.map((i) => (i.id === numericId ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { id: numericId, qty: 1 }];
    });
    notify('Producto agregado al carrito');
  };

  const updateCartQty = (id, qty) => {
    const numericId = Number(id);
    const safeQty = Math.max(1, Number(qty) || 1);
    setCart((prev) => prev.map((i) => (i.id === numericId ? { ...i, qty: safeQty } : i)));
  };

  const removeFromCart = (id) => {
    const numericId = Number(id);
    setCart((prev) => prev.filter((i) => i.id !== numericId));
  };

  const clearCart = () => setCart([]);

  const recordReceipt = ({ userId, items, subtotal, discount = 0, total, method, cuotas = '', buyer }) => {
    if (!userId || !items?.length) return false;
    const id = globalThis.crypto?.randomUUID?.() || String(Date.now());
    const entry = {
      id,
      userId,
      items,
      subtotal,
      discount,
      total,
      method,
      cuotas,
      buyer,
      createdAt: new Date().toISOString()
    };
    setReceipts((prev) => [entry, ...prev]);
    return true;
  };

  const cartCount = useMemo(() => cart.reduce((acc, cur) => acc + cur.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((acc, item) => {
    const product = productsSafe.find((p) => p.id === item.id);
    return acc + (product ? product.price * item.qty : 0);
  }, 0), [cart, productsSafe]);

  const value = {
    products: productsSafe,
    users,
    session,
    cart,
    cartCount,
    cartTotal,
    receipts,
    toasts,
    notify,
    login,
    adminLogin,
    logout,
    register,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    recordReceipt,
    upsertProduct,
    deleteProduct,
    upsertUser,
    deleteUser,
    setSession,
    setCart,
    setProducts: setProductsSafe,
    setUsers
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const formatPrice = (value) => `$${Number(value || 0).toLocaleString('es-CL')}`;
