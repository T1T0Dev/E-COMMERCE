import { Router } from 'express';
import {
  crearCarrito,
  cambiarEstadoCarrito,
  agregarProductoACarrito,
  quitarProductoDelCarrito,
  verCarrito,
  vaciarCarrito,
  confirmarCarrito,
  listarCarritos,
  eliminarCarrito,
  getCarritosPedidosFusion
} from '../controllers/Carritos.controller.js';

const router = Router();

router.post('/', crearCarrito);
router.put('/:id_carrito/estado', cambiarEstadoCarrito);
router.post('/item', agregarProductoACarrito);
router.delete('/item/:id_carrito_detalle', quitarProductoDelCarrito);
router.get('/fusion', getCarritosPedidosFusion); // <-- PON ESTA ANTES DE LAS RUTAS CON PARAMS
router.get('/:id_carrito', verCarrito);
router.delete('/:id_carrito', eliminarCarrito);
router.put('/confirmar/:id_carrito', confirmarCarrito);
router.get('/', listarCarritos);

export default router;
