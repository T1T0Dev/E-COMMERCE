import { Router } from 'express';
import {
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  createUsuario
} from '../controllers/Usuarios.controller.js';

const router = Router();

router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.post('/', createUsuario); // <-- agrega esta línea
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;
