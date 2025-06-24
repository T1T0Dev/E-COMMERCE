import { Router } from 'express';
import { registerClienteYUsuario,registerUsuario, loginUsuario, emailExiste, telefonoExiste } from '../controllers/Auth.controller.js';


const router = Router();

router.post('/register-full', registerClienteYUsuario);
router.post('/register', registerUsuario);
router.post('/login', loginUsuario);
router.get('/email-existe/:email', emailExiste);
router.get('/telefono-existe/:telefono', telefonoExiste);

export default router;
