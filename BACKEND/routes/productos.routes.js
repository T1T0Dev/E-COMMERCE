import { Router } from 'express';
import { createProductoConTalles, updateProductoConTalles, getProductosConTalles, deleteProducto } from '../controllers/Productos.controller.js';
import upload from '../middlewares/upload.js';

const router = Router();

router.post('/con-talles', upload.single('imagen_producto'), createProductoConTalles);
router.get('/', getProductosConTalles);
router.delete('/:id_producto', deleteProducto);
router.put('/:id_producto', upload.single('imagen_producto'), updateProductoConTalles);

export default router;