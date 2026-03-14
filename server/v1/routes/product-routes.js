import express from 'express';
import productController from '../controllers/product-controller.js';

import { authenticateToken } from '../middlewares/auth-middleware.js';
import upload from '../middlewares/multer-upload.js';

const router = express.Router();

router.post('/', authenticateToken, upload.array('images', 10), productController.createProduct);
router.put('/:id', authenticateToken, upload.array('images', 10), productController.updateProduct);

router.get('/:id', productController.getProductByDaliaId);
router.get('/', productController.getAllProducts);

router.delete('/:id', authenticateToken, productController.deleteProduct);

export default router;
