import { Router } from 'express';
import {
  crearCarrito,
  agregarProductoACarrito,
  quitarProductoDelCarrito,
  verCarrito,
  vaciarCarrito,
  confirmarCarrito
} from '../controllers/Carritos.controller.js';


const router = Router();

router.post('/', crearCarrito);
router.post('/item', agregarProductoACarrito);
router.delete('/item/:id_carrito_detalle', quitarProductoDelCarrito);
router.get('/:id_carrito', verCarrito);
router.delete('/:id_carrito', vaciarCarrito);
router.put('/confirmar/:id_carrito', confirmarCarrito);

export default router;
