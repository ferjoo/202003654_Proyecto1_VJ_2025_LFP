import { Request, Response } from 'express';
import { Lexer } from '../lexer/Lexer';
import { PensumGenerator } from '../generators/PensumGenerator';

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

        try {
            const generator = new PensumGenerator(result.tokens);
            const html = generator.generate();

            return res.json({
                success: true,
                data: {
                    tokens: result.tokens,
                    html: html
                }
            });
        } catch (error: any) {
            return res.json({
                success: false,
                data: {
                    errors: [{
                        message: error.message || 'Error desconocido',
                        line: 0,
                        column: 0
                    }]
                }
            });
        }
    } catch (error) {
        console.error('Error analyzing input:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}; 