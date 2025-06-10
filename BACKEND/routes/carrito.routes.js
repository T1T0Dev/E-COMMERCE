import { Router } from 'express';
import {
  crearCarrito,
  agregarProductoACarrito,
  quitarProductoDelCarrito,
  cambiarEstadoCarrito,
  verCarrito,
  vaciarCarrito,
  confirmarCarrito,
  listarCarritos,
  eliminarCarrito
} from '../controllers/Carritos.controller.js';


const router = Router();

router.post('/', crearCarrito);
router.post('/item', agregarProductoACarrito);
router.delete('/item/:id_carrito_detalle', quitarProductoDelCarrito);
router.get('/:id_carrito', verCarrito);
router.delete('/:id_carrito', eliminarCarrito);
router.put('/confirmar/:id_carrito', confirmarCarrito);
router.put('/:id_carrito/estado', cambiarEstadoCarrito);
router.get('/', listarCarritos);

export default router;
