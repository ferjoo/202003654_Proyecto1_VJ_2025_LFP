import { Router } from 'express';
import { analyzeInput } from '../controllers/lexerController';

const router = Router();

router.post('/analyze', analyzeInput);

export default router; 