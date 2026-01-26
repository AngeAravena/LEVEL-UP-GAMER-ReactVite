import axios from 'axios';

// Base de API tomada de la env var de Vite; fallback a localhost:8080/api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const getProductos = async () => {
    return await axios.get(`${API_URL}/productos`);
};

export const loginUsuario = async (credenciales) => {
    
    return await axios.post(`${API_URL}/auth/login`, credenciales);
    // credenciales = { name: 'usuario', password: 'contraseña' }
};