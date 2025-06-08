import express from 'express';
import upload from '../middlewares/upload.js';
import { createProductoConTalles, getProductosConTalles } from '../controllers/Productos.controller.js';

const router = express.Router();

router.post('/con-talles', upload.single('imagen_producto'), createProductoConTalles);
router.get('/', getProductosConTalles);

export default router;