import express from 'express';
import path from 'path';
import cors from 'cors'
import { configDotenv } from 'dotenv';

const app = express();

configDotenv();
app.use(cors());
app.use(express.json());

// Importação das rotas
import authRoutes from './routes/auth-routes.js';
import productRoutes from './routes/product-routes.js';
import clientRoutes from './routes/client-routes.js';
import saleRoutes from './routes/sale-routes.js';
import fornecedorRoutes from './routes/fornecedor-routes.js';
import compraFornecedorRoutes from './routes/compra-fornecedor-routes.js';
import saidaRoutes from './routes/saida-routes.js';

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/sales', saleRoutes);
app.use('/api/v1/fornecedores', fornecedorRoutes);
app.use('/api/v1/compras-fornecedor', compraFornecedorRoutes);
app.use('/api/v1/saidas', saidaRoutes);

// Usando a pasta uploads como estática
const uploadsPath = path.join(process.cwd(), 'uploads');

app.use('/uploads', express.static(uploadsPath));

export default app;