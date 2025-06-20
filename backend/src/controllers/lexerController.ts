import { Request, Response } from 'express';
import { Lexer } from '../lexer/Lexer';

export const analyzeInput = (req: Request, res: Response) => {
    try {
        const { input } = req.body;

        if (!input || typeof input !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Input must be a non-empty string'
            });
        }

        const lexer = new Lexer(input);
        const result = lexer.analyze();

        if (result.errors.length > 0) {
            return res.json({
                success: false,
                data: {
                    errors: result.errors
                }
            });
        }

        // Return only the tokens for lexical analysis
            return res.json({
                success: true,
                data: {
                tokens: result.tokens
                }
            });

    } catch (error) {
        console.error('Error analyzing input:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}; 