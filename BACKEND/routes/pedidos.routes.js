import { Router } from 'express';
import {
  crearPedido,
  getPedidosCliente,
  getPedidoById,
  cambiarEstadoPedido,
  getPedidosAdmin
} from '../controllers/Pedidos.controller.js';

const router = Router();

router.post("/", crearPedido);
router.get('/cliente/:id_cliente', getPedidosCliente);
router.get('/:id_pedido', getPedidoById);
router.put('/:id_pedido/estado', cambiarEstadoPedido);
router.get('/', getPedidosAdmin);

export default router;
