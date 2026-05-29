import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';

import './index.css'

import PageWrapper from './components/layout/PageWrapper.jsx';
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
import Relatorios from './pages/Relatorios.jsx';

const wrap = (el) => <PageWrapper>{el}</PageWrapper>;

const router = createBrowserRouter([
  { path: '/', element: wrap(<Catalog />) },
  { path: '/error', element: wrap(<ErrorPage />) },
  { path: '/login', element: wrap(<LoginPage />) },
  { path: '/dashboard', element: wrap(<Dashboard />) },
  { path: '/create-product', element: wrap(<CreateProductPage />) },
  { path: '/clients', element: wrap(<Clients />) },
  { path: '/clients/:id', element: wrap(<ClientDetail />) },
  { path: '/pendencies', element: wrap(<Pendencies />) },
  { path: '/admin/fornecedores', element: wrap(<Fornecedores />) },
  { path: '/admin/fornecedores/:id', element: wrap(<FornecedorDetail />) },
  { path: '/admin/saidas', element: wrap(<Saidas />) },
  { path: '/admin/relatorios', element: wrap(<Relatorios />) },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>,
)
