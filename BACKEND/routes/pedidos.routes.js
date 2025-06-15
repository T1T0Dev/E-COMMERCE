import { Router } from 'express';
import {
  crearPedido,
  getPedidosCliente,
  getPedidoById,
  getPedidosJoin,
  getPedidosVentas,
  getVentasPorDia,
  getDetalleVentasPorDia,
} from '../controllers/Pedidos.controller.js';

const router = Router();

router.post("/", crearPedido);
router.get('/join', getPedidosJoin);
router.get('/cliente/:id_cliente', getPedidosCliente);
router.get('/ventas-por-dia', getVentasPorDia);
router.get('/ventas-por-dia/:fecha', getDetalleVentasPorDia);
router.get('/', getPedidosVentas);
router.get('/:id_pedido', getPedidoById);


export default router;