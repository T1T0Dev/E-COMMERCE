import { Router } from 'express';
import {
  crearPedido,
  getPedidosCliente,
  getPedidoById,
  cambiarEstadoPedido,
  getPedidosJoin,
  getPedidosVentas,
  getVentasPorDia,
  getDetalleVentasPorDia,
} from '../controllers/pedidos.controller.js';

const router = Router();

router.post("/", crearPedido);
router.get('/join', getPedidosJoin);
router.get('/cliente/:id_cliente', getPedidosCliente);
router.get('/ventas-por-dia', getVentasPorDia);
router.get('/ventas-por-dia/:fecha', getDetalleVentasPorDia);
router.get('/', getPedidosVentas);
router.get('/:id_pedido', getPedidoById);
router.put('/:id_pedido/estado', cambiarEstadoPedido);

export default router;