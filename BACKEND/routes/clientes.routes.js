import { Router } from 'express';
import {
  getClientes,
  getClienteById,
  updateCliente,
  uploadFotoPerfil
} from '../controllers/Clientes.controller.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.get('/', getClientes);
router.get('/:id', getClienteById);
router.put('/:id', updateCliente);
router.post('/:id/foto', upload.single('foto'), uploadFotoPerfil);

export default router;
