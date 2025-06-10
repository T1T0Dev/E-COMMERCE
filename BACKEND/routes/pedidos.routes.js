import { Router } from 'express';
import {
  crearPedido,
  getPedidosCliente,
  getPedidoById,
  getPedidosJoin,
} from '../controllers/Pedidos.controller.js';

const router = Router();

router.post("/", crearPedido);
router.get('/join', getPedidosJoin); // <-- Mueve esta línea arriba
router.get('/cliente/:id_cliente', getPedidosCliente);
router.get('/:id_pedido', getPedidoById);


export default router;