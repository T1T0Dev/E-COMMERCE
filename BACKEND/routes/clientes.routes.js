import { Router } from 'express';
import {
  getClientes,
  getClienteById,
  getClienteByUsuarioId,
  updateCliente,
  deleteCliente,
  createCliente,
  uploadFotoPerfil
} from '../controllers/Clientes.controller.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.get('/', getClientes);
router.get('/usuario/:id_usuario', getClienteByUsuarioId); // <-- PON ESTA PRIMERO
router.get('/:id', getClienteById);
router.put('/:id', updateCliente);
router.delete('/:id', deleteCliente);
router.post('/', createCliente);
router.post('/:id/foto', upload.single('foto'), uploadFotoPerfil);

export default router;