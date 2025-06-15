import { Router } from 'express';
import {
  getTalles,
  createTalle,
  updateTalle,
  deleteTalle
} from '../controllers/Talles.controller.js';

const router = Router();

router.get('/', getTalles);
router.post('/', createTalle);
router.put('/:id', updateTalle);
router.delete('/:id', deleteTalle);

export default router;
