import { Router } from 'express';
import { createProductoConTalles, updateProductoConTalles, getProductosConTalles, deleteProductoLogico,deleteProductoFisico,getStockProductoTalle,activarProducto } from '../controllers/Productos.controller.js';
import upload from '../middlewares/upload.js';

const router = Router();

router.post('/con-talles', upload.single('imagen_producto'), createProductoConTalles);
router.get('/', getProductosConTalles);
router.get('/stock/:id_producto/:id_talle', getStockProductoTalle);
router.put('/baja/:id_producto', deleteProductoLogico);      
router.delete('/fisico/:id_producto', deleteProductoFisico);
router.put('/:id_producto', upload.single('imagen_producto'), updateProductoConTalles);
router.put('/activar/:id_producto', activarProducto);

export default router;