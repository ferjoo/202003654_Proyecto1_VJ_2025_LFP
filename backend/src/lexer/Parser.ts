import { Token, TokenType } from './types';

export interface Curso {
    codigo: string;
    nombre: string;
    creditos?: number;
    prerrequisitos: string[];
    semestre: number;
    descripcion?: string;
    area?: string;
    obligatorio?: boolean;
}

export interface Pensum {
    carrera: string;
    semestres: Map<number, Curso[]>;
    cursos: Map<string, Curso>;
}

export class Parser {
    private tokens: Token[];
    private current: number;
    private pensum: Pensum;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.current = 0;
        this.pensum = {
            carrera: '',
            semestres: new Map(),
            cursos: new Map()
        };
    }

    public parse(): Pensum {
        this.parsePensum();
        return this.pensum;
    }

    private parsePensum(): void {
        console.log('Iniciando parsing del pensum');
        while (!this.isAtEnd()) {
            console.log(`Token actual: ${this.peek().type} '${this.peek().lexeme}'`);
            if (this.match(TokenType.CARRERA)) {
                console.log('Encontrado CARRERA');
                this.parseCarrera();
            } else if (this.match(TokenType.SEMESTRE)) {
                console.log('Encontrado SEMESTRE');
                this.parseSemestre();
            } else {
                console.log(`Token no reconocido en nivel principal: ${this.peek().type} '${this.peek().lexeme}'`);
                this.advance();
            }
        }
        console.log('Parsing del pensum completado');
    }

    private parseCarrera(): void {
        this.consume(TokenType.DOS_PUNTOS, "Se esperaba ':' después de CARRERA");
        this.consume(TokenType.CADENA, "Se esperaba el nombre de la carrera");
        this.pensum.carrera = this.previous().lexeme.replace(/"/g, '');
        
        if (this.match(TokenType.CORCHETE_ABIERTO)) {
            this.advance(); // Consumir '['
            while (!this.check(TokenType.CORCHETE_CERRADO) && !this.isAtEnd()) {
                if (this.match(TokenType.SEMESTRE)) {
                    this.parseSemestre();
                } else {
                    this.advance();
                }
            }
            if (this.match(TokenType.CORCHETE_CERRADO)) {
                this.advance(); // Consumir ']'
            }
        }
    }

    private parseSemestre(): void {
        this.consume(TokenType.DOS_PUNTOS, "Se esperaba ':' después de SEMESTRE");
        this.consume(TokenType.NUMERO, "Se esperaba el número del semestre");
        const numeroSemestre = parseInt(this.previous().lexeme);
        
        console.log(`Parseando semestre: ${numeroSemestre}`);
        
        this.consume(TokenType.LLAVE_ABIERTA, "Se esperaba '{' después del número del semestre");
        
        while (!this.check(TokenType.LLAVE_CERRADA) && !this.isAtEnd()) {
            if (this.match(TokenType.CURSO)) {
                console.log('Encontrado CURSO en semestre', numeroSemestre);
                this.parseCurso(numeroSemestre);
            } else {
                console.log(`Token en semestre ${numeroSemestre}: ${this.peek().type} '${this.peek().lexeme}'`);
                this.advance();
            }
        }
        
        if (this.match(TokenType.LLAVE_CERRADA)) {
            this.advance(); // Consumir '}'
        }
        
        console.log(`Semestre ${numeroSemestre} completado`);
    }

    private parseCurso(semestre: number): void {
        this.consume(TokenType.DOS_PUNTOS, "Se esperaba ':' después de CURSO");
        this.consume(TokenType.NUMERO, "Se esperaba el código del curso");
        const codigo = this.previous().lexeme;
        
        console.log(`Parseando curso: ${codigo} en semestre ${semestre}`);
        
        this.consume(TokenType.LLAVE_ABIERTA, "Se esperaba '{' después del código del curso");
        
        const curso: Curso = {
            codigo,
            nombre: '',
            creditos: 0,
            prerrequisitos: [],
            semestre
        };
        
        while (!this.check(TokenType.LLAVE_CERRADA) && !this.isAtEnd()) {
            if (this.match(TokenType.NOMBRE)) {
                console.log('Encontrado NOMBRE');
                this.parseNombre(curso);
            } else if (this.match(TokenType.CODIGO)) {
                console.log('Encontrado CODIGO');
                this.parseCodigo(curso);
            } else if (this.match(TokenType.CREDITOS)) {
                console.log('Encontrado CREDITOS');
                this.parseCreditos(curso);
            } else if (this.match(TokenType.DESCRIPCION)) {
                console.log('Encontrado DESCRIPCION');
                this.parseDescripcion(curso);
            } else if (this.match(TokenType.OBLIGATORIO)) {
                console.log('Encontrado OBLIGATORIO');
                this.parseObligatorio(curso);
            } else if (this.match(TokenType.PREREQUISITO) || this.match(TokenType.IDENTIFICADOR)) {
                // Verificar si es "Prerrequisitos" o "Prerequisito"
                const token = this.previous();
                console.log(`Encontrado identificador: ${token.lexeme}`);
                if (token.lexeme.toLowerCase() === 'prerrequisitos' || token.lexeme.toLowerCase() === 'prerequisito') {
                    console.log('Parseando prerrequisitos');
                    this.parsePrerrequisitos(curso);
                } else if (token.lexeme.toLowerCase() === 'area') {
                    console.log('Encontrado AREA');
                    this.parseArea(curso);
                } else {
                    // Si es otro identificador, avanzar
                    this.advance();
                }
            } else {
                console.log(`Token no reconocido: ${this.peek().type} '${this.peek().lexeme}'`);
                this.advance();
            }
        }
        
        if (this.match(TokenType.LLAVE_CERRADA)) {
            this.advance(); // Consumir '}'
        }
        
        console.log(`Curso completado: ${curso.codigo} - ${curso.nombre}`);
        
        // Agregar el curso al pensum
        this.pensum.cursos.set(codigo, curso);
        
        if (!this.pensum.semestres.has(semestre)) {
            this.pensum.semestres.set(semestre, []);
        }
        this.pensum.semestres.get(semestre)!.push(curso);
    }

    private parseNombre(curso: Curso): void {
        this.consume(TokenType.DOS_PUNTOS, "Se esperaba ':' después de NOMBRE");
        this.consume(TokenType.CADENA, "Se esperaba el nombre del curso");
        curso.nombre = this.previous().lexeme.replace(/"/g, '');
        this.consume(TokenType.PUNTO_COMA, "Se esperaba ';' después del nombre");
    }

    private parsePrerrequisitos(curso: Curso): void {
        this.consume(TokenType.DOS_PUNTOS, "Se esperaba ':' después de PREREQUISITO");
        this.consume(TokenType.PARENTESIS_ABIERTO, "Se esperaba '(' después de ':'");
        
        // Verificar si hay prerrequisitos o si los paréntesis están vacíos
        while (!this.check(TokenType.PARENTESIS_CERRADO) && !this.isAtEnd()) {
            if (this.match(TokenType.NUMERO)) {
                curso.prerrequisitos.push(this.previous().lexeme);
            } else if (this.match(TokenType.COMA)) {
                // Consumir la coma y continuar
                continue;
            } else {
                // Si encontramos algo que no es número ni coma, avanzar pero registrar un warning
                this.advance();
            }
        }
        
        if (this.match(TokenType.PARENTESIS_CERRADO)) {
            this.advance(); // Consumir ')'
        } else {
            throw new Error("Se esperaba ')' para cerrar los prerrequisitos");
        }
        
        // No requerir punto y coma después de los prerrequisitos
        // this.consume(TokenType.PUNTO_COMA, "Se esperaba ';' después de los prerrequisitos");
    }

    private parseCreditos(curso: Curso): void {
        this.consume(TokenType.DOS_PUNTOS, "Se esperaba ':' después de CREDITOS");
        this.consume(TokenType.NUMERO, "Se esperaba el número de créditos");
        curso.creditos = parseInt(this.previous().lexeme);
        this.consume(TokenType.PUNTO_COMA, "Se esperaba ';' después de los créditos");
    }

    private parseCodigo(curso: Curso): void {
        this.consume(TokenType.DOS_PUNTOS, "Se esperaba ':' después de CODIGO");
        this.consume(TokenType.CADENA, "Se esperaba el código del curso");
        // El código ya está en el curso, pero podemos validar que coincida
        const codigoEsperado = this.previous().lexeme.replace(/"/g, '');
        if (codigoEsperado !== curso.codigo) {
            console.warn(`Código en campo no coincide con código del curso: ${codigoEsperado} vs ${curso.codigo}`);
        }
        this.consume(TokenType.PUNTO_COMA, "Se esperaba ';' después del código");
    }

    private parseDescripcion(curso: Curso): void {
        this.consume(TokenType.DOS_PUNTOS, "Se esperaba ':' después de DESCRIPCION");
        this.consume(TokenType.CADENA, "Se esperaba la descripción del curso");
        curso.descripcion = this.previous().lexeme.replace(/"/g, '');
        this.consume(TokenType.PUNTO_COMA, "Se esperaba ';' después de la descripción");
    }

    private parseObligatorio(curso: Curso): void {
        this.consume(TokenType.DOS_PUNTOS, "Se esperaba ':' después de OBLIGATORIO");
        this.consume(TokenType.BOOLEANO, "Se esperaba true o false para obligatorio");
        curso.obligatorio = this.previous().lexeme.toLowerCase() === 'true';
        this.consume(TokenType.PUNTO_COMA, "Se esperaba ';' después de obligatorio");
    }

    private parseArea(curso: Curso): void {
        this.consume(TokenType.DOS_PUNTOS, "Se esperaba ':' después de AREA");
        this.consume(TokenType.CADENA, "Se esperaba el área del curso");
        curso.area = this.previous().lexeme.replace(/"/g, '');
        this.consume(TokenType.PUNTO_COMA, "Se esperaba ';' después del área");
    }

    // Métodos auxiliares
    private match(type: TokenType): boolean {
        if (this.check(type)) {
            this.advance();
            return true;
        }
        return false;
    }

    private check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance();
        
        // Si no hay más tokens, dar un error más específico
        if (this.isAtEnd()) {
            throw new Error(`${message} - Se alcanzó el final del archivo inesperadamente`);
        }
        
        const currentToken = this.peek();
        throw new Error(`${message} - Encontrado: ${currentToken.type} '${currentToken.lexeme}' en línea ${currentToken.line}`);
    }

    private isAtEnd(): boolean {
        return this.current >= this.tokens.length || this.peek().type === TokenType.EOF;
    }

    private peek(): Token {
        if (this.current >= this.tokens.length) {
            throw new Error('Se alcanzó el final de los tokens inesperadamente');
        }
        return this.tokens[this.current];
    }

    private previous(): Token {
        if (this.current <= 0) {
            throw new Error('No hay tokens previos');
        }
        return this.tokens[this.current - 1];
    }
} 