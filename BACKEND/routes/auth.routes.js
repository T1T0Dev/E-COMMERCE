import { Router } from 'express';
import { registerClienteYUsuario,registerUsuario, loginUsuario } from '../controllers/Auth.controller.js';


const router = Router();

router.post('/register-full', registerClienteYUsuario);
router.post('/register', registerUsuario);
router.post('/login', loginUsuario);

export default router;
