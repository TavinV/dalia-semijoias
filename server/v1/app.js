import express from 'express';
import path from 'path';
import fs from 'fs';
import { configDotenv } from 'dotenv';

const app = express();

configDotenv();
app.use(express.json());

// Importação das rotas
import authRoutes from './routes/auth-routes.js';
import productRoutes from './routes/product-routes.js';

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/auth', authRoutes);

// Usando a pasta uploads como estática
const uploadsPath = path.join(process.cwd(), 'uploads');

app.use('/uploads', express.static(uploadsPath));

export default app;