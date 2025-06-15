import { Router } from "express";
import { crearEnvio } from "../controllers/Envios.controller.js";
const router = Router();

router.post("/", crearEnvio);

export default router;