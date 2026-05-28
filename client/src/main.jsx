import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { useLenis } from './hooks/useLenis.jsx';

import './index.css'

import ErrorPage from './pages/ErrorPage.jsx';
import Catalog from './pages/Catalog.jsx'
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreateProductPage from './pages/CreateProduct.jsx';
import Clients from './pages/Clients.jsx';
import ClientDetail from './pages/ClientDetail.jsx';
import Pendencies from './pages/Pendencies.jsx';
import Fornecedores from './pages/Fornecedores.jsx';
import FornecedorDetail from './pages/FornecedorDetail.jsx';
import Saidas from './pages/Saidas.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Catalog />,
  },
  {
    path: '/error',
    element: <ErrorPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/create-product',
    element: <CreateProductPage />
  },
  {
    path: '/clients',
    element: <Clients />
  },
  {
    path: '/clients/:id',
    element: <ClientDetail />
  },
  {
    path: '/pendencies',
    element: <Pendencies />
  },
  {
    path: '/admin/fornecedores',
    element: <Fornecedores />
  },
  {
    path: '/admin/fornecedores/:id',
    element: <FornecedorDetail />
  },
  {
    path: '/admin/saidas',
    element: <Saidas />
  }
]);

function App() {
  useLenis();
  return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
)