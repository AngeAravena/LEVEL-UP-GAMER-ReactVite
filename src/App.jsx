import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { HomePage } from './pages/Home.jsx';
import { ProductsPage } from './pages/Products.jsx';
import { ProductDetailPage } from './pages/ProductDetail.jsx';
import { BlogsPage } from './pages/Blogs.jsx';
import { NosotrosPage } from './pages/Nosotros.jsx';
import { ContactPage } from './pages/Contact.jsx';
import { LoginPage } from './pages/Login.jsx';
import { RegisterPage } from './pages/Register.jsx';
import { AdminLoginPage } from './pages/AdminLogin.jsx';
import { AdminPanelPage } from './pages/AdminPanel.jsx';
import { PaymentPage } from './pages/Payment.jsx';
import { NotFoundPage } from './pages/NotFound.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/login-admin" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
          <Route path="/pago" element={<PaymentPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
