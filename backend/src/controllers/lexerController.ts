import { Request, Response } from 'express';
import { Lexer } from '../lexer/Lexer';
import { Parser, Pensum } from '../lexer/Parser';

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

        // Si no hay errores, parsear el pensum
        try {
            const parser = new Parser(result.tokens);
            const pensum = parser.parse();
            
            console.log('Pensum parseado:', {
                carrera: pensum.carrera,
                numSemestres: pensum.semestres.size,
                numCursos: pensum.cursos.size,
                semestres: Array.from(pensum.semestres.entries()),
                cursos: Array.from(pensum.cursos.entries())
            });
            
            return res.json({
                success: true,
                data: {
                    tokens: result.tokens,
                    pensum: {
                        carrera: pensum.carrera,
                        semestres: Array.from(pensum.semestres.entries()).map(([semestre, cursos]) => ({
                            semestre,
                            cursos: cursos.map(curso => ({
                                codigo: curso.codigo,
                                nombre: curso.nombre,
                                creditos: curso.creditos,
                                prerrequisitos: curso.prerrequisitos,
                                semestre: curso.semestre
                            }))
                        })),
                        cursos: Array.from(pensum.cursos.entries()).map(([codigo, curso]) => ({
                            codigo,
                            nombre: curso.nombre,
                            creditos: curso.creditos,
                            prerrequisitos: curso.prerrequisitos,
                            semestre: curso.semestre
                        }))
                    }
                }
            });
        } catch (parseError) {
            return res.json({
                success: false,
                data: {
                    tokens: result.tokens,
                    errors: [{
                        message: `Error al parsear el pensum: ${parseError instanceof Error ? parseError.message : 'Error desconocido'}`,
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