import { Router, Request, Response } from 'express';
import lexerRoutes from './lexerRoutes';

export const router = Router();

// Example route
router.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'API is working!' });
});

// Lexer routes
router.use('/lexer', lexerRoutes); 