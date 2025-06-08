import express from 'express';
import upload from '../middlewares/upload.js';
import { createProductoConTalles, getProductosConTalles, deleteProducto, updateProductoConTalles } from '../controllers/Productos.controller.js';

const router = express.Router();

router.post('/con-talles', upload.single('imagen_producto'), createProductoConTalles);
router.get('/', getProductosConTalles);
router.delete('/:id_producto', deleteProducto);
router.put('/:id_producto', upload.single('imagen_producto'), updateProductoConTalles);

export default router;