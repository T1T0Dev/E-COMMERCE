import { Router } from 'express';
import {
  crearPedido,
  getPedidosCliente,
  getPedidoById,
  cambiarEstadoPedido,
  getPedidosJoin,
} from '../controllers/Pedidos.controller.js';

const router = Router();

router.post("/", crearPedido);
router.get('/join', getPedidosJoin); // <-- Mueve esta línea arriba
router.get('/cliente/:id_cliente', getPedidosCliente);
router.get('/:id_pedido', getPedidoById);
router.put('/:id_pedido/estado', cambiarEstadoPedido);

export default router;