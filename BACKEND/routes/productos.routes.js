import { Router } from 'express';
import { createProductoConTalles, updateProductoConTalles, getProductosConTalles, deleteProducto,getStockProductoTalle,activarProducto } from '../controllers/Productos.controller.js';
import upload from '../middlewares/upload.js';

const router = Router();

router.post('/con-talles', upload.single('imagen_producto'), createProductoConTalles);
router.get('/', getProductosConTalles);
router.get('/stock/:id_producto/:id_talle', getStockProductoTalle);
router.delete('/:id_producto', deleteProducto);
router.put('/:id_producto', upload.single('imagen_producto'), updateProductoConTalles);
router.put('/activar/:id_producto', activarProducto);

export default router;