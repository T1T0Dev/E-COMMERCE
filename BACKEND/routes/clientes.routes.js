import { Router } from 'express';
import {
  getClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
  createCliente, // <-- importa el controlador
  uploadFotoPerfil
} from '../controllers/Clientes.controller.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.get('/', getClientes);
router.get('/:id', getClienteById);
router.put('/:id', updateCliente);
router.delete('/:id', deleteCliente); // <-- agrega si no está
router.post('/', createCliente); // <-- ESTA ES LA RUTA QUE FALTA
router.post('/:id/foto', upload.single('foto'), uploadFotoPerfil);

export default router;