import { Router } from 'express';
import {
  createProductoConTalles,
  getProductosConTalles,
  getProductoById,
  updateProductoConTalles,
  deleteProducto,
  getProductosPorCategoria,
  buscarProductoPorNombre,
  getProductos
} from '../controllers/Productos.controller.js';

const router = Router();

router.get('/', getProductosConTalles);
router.get('/productos', getProductos);
router.get('/categoria/:id_categoria', getProductosPorCategoria);
router.get('/search', buscarProductoPorNombre); // ?q=nombre
router.get('/:id', getProductoById);
router.post('/con-talles', createProductoConTalles);
router.put('/con-talles/:id', updateProductoConTalles);
router.delete('/:id', deleteProducto);

export default router;
