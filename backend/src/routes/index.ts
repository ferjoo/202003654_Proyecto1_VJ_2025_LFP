import { Router, Request, Response } from 'express';

export const router = Router();

// Example route
router.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'API is working!' });
}); 