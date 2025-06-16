import { Token, TokenType } from '../lexer/types';

interface Curso {
    codigo: string;
    nombre: string;
    creditos: number;
    semestre: number;
    descripcion: string;
    obligatorio: boolean;
    prerequisitos: string[];
}

interface Carrera {
    nombre: string;
    cursos: Curso[];
}

export class PensumGenerator {
    private tokens: Token[];
    private current: number;
    private carrera: Carrera;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.current = 0;
        this.carrera = {
            nombre: '',
            cursos: []
        };
    }

    public generate(): string {
        this.parseCarrera();
        return this.generateHTML();
    }

    private parseCarrera(): void {
        while (!this.isAtEnd()) {
            if (this.match(TokenType.CARRERA)) {
                this.parseCarreraDefinition();
            } else if (this.match(TokenType.CURSO)) {
                this.parseCurso();
            } else {
                this.advance();
            }
        }
    }

    private parseCarreraDefinition(): void {
        this.consume(TokenType.LLAVE_ABIERTA, "Se esperaba '{' después de CARRERA");
        
        while (!this.check(TokenType.LLAVE_CERRADA) && !this.isAtEnd()) {
            if (this.match(TokenType.NOMBRE)) {
                this.consume(TokenType.IGUAL, "Se esperaba '=' después de NOMBRE");
                this.carrera.nombre = this.consume(TokenType.CADENA, "Se esperaba una cadena para el nombre").lexeme;
            } else {
                this.advance();
            }
        }
        
        this.consume(TokenType.LLAVE_CERRADA, "Se esperaba '}' al final de la definición de carrera");
    }

    private parseCurso(): void {
        const curso: Curso = {
            codigo: '',
            nombre: '',
            creditos: 0,
            semestre: 0,
            descripcion: '',
            obligatorio: true,
            prerequisitos: []
        };

        this.consume(TokenType.LLAVE_ABIERTA, "Se esperaba '{' después de CURSO");

        while (!this.check(TokenType.LLAVE_CERRADA) && !this.isAtEnd()) {
            if (this.match(TokenType.CODIGO)) {
                this.consume(TokenType.IGUAL, "Se esperaba '=' después de CODIGO");
                curso.codigo = this.consume(TokenType.CADENA, "Se esperaba una cadena para el código").lexeme;
            } else if (this.match(TokenType.NOMBRE)) {
                this.consume(TokenType.IGUAL, "Se esperaba '=' después de NOMBRE");
                curso.nombre = this.consume(TokenType.CADENA, "Se esperaba una cadena para el nombre").lexeme;
            } else if (this.match(TokenType.CREDITOS)) {
                this.consume(TokenType.IGUAL, "Se esperaba '=' después de CREDITOS");
                curso.creditos = parseInt(this.consume(TokenType.NUMERO, "Se esperaba un número para los créditos").lexeme);
            } else if (this.match(TokenType.SEMESTRE)) {
                this.consume(TokenType.IGUAL, "Se esperaba '=' después de SEMESTRE");
                curso.semestre = parseInt(this.consume(TokenType.NUMERO, "Se esperaba un número para el semestre").lexeme);
            } else if (this.match(TokenType.DESCRIPCION)) {
                this.consume(TokenType.IGUAL, "Se esperaba '=' después de DESCRIPCION");
                curso.descripcion = this.consume(TokenType.CADENA, "Se esperaba una cadena para la descripción").lexeme;
            } else if (this.match(TokenType.OBLIGATORIO)) {
                this.consume(TokenType.IGUAL, "Se esperaba '=' después de OBLIGATORIO");
                curso.obligatorio = this.consume(TokenType.BOOLEANO, "Se esperaba un booleano para obligatorio").lexeme === 'TRUE';
            } else if (this.match(TokenType.PREREQUISITO)) {
                this.consume(TokenType.IGUAL, "Se esperaba '=' después de PREREQUISITO");
                this.consume(TokenType.CORCHETE_ABIERTO, "Se esperaba '[' para la lista de prerrequisitos");
                
                while (!this.check(TokenType.CORCHETE_CERRADO) && !this.isAtEnd()) {
                    curso.prerequisitos.push(this.consume(TokenType.CADENA, "Se esperaba una cadena para el prerrequisito").lexeme);
                    if (this.check(TokenType.COMA)) {
                        this.advance();
                    }
                }
                
                this.consume(TokenType.CORCHETE_CERRADO, "Se esperaba ']' al final de la lista de prerrequisitos");
            } else {
                this.advance();
            }
        }

        this.consume(TokenType.LLAVE_CERRADA, "Se esperaba '}' al final de la definición del curso");
        this.carrera.cursos.push(curso);
    }

    private generateHTML(): string {
        const cursosPorSemestre = this.agruparCursosPorSemestre();
        
        let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pensum - ${this.carrera.nombre}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .semestre {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .semestre h2 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        .curso {
            background-color: #f8f9fa;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .curso h3 {
            margin: 0 0 10px 0;
            color: #2c3e50;
        }
        .curso-info {
            color: #666;
            font-size: 0.9em;
        }
        .prerequisitos {
            margin-top: 10px;
            font-style: italic;
            color: #e74c3c;
        }
        .electivo {
            border-left-color: #e74c3c;
        }
        .tooltip {
            position: relative;
            display: inline-block;
            cursor: help;
        }
        .tooltip .tooltiptext {
            visibility: hidden;
            width: 200px;
            background-color: #555;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            margin-left: -100px;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .tooltip:hover .tooltiptext {
            visibility: visible;
            opacity: 1;
        }
    </style>
</head>
<body>
    <h1>Pensum - ${this.carrera.nombre}</h1>
`;

        for (const [semestre, cursos] of Object.entries(cursosPorSemestre)) {
            html += `
    <div class="semestre">
        <h2>Semestre ${semestre}</h2>
`;
            for (const curso of cursos) {
                html += `
        <div class="curso ${curso.obligatorio ? '' : 'electivo'}">
            <h3>${curso.codigo} - ${curso.nombre}</h3>
            <div class="curso-info">
                <p>Créditos: ${curso.creditos}</p>
                <p>Tipo: ${curso.obligatorio ? 'Obligatorio' : 'Electivo'}</p>
                <div class="tooltip">
                    <p>Descripción: ${curso.descripcion}</p>
                    <span class="tooltiptext">${curso.descripcion}</span>
                </div>
                ${curso.prerequisitos.length > 0 ? `
                <div class="prerequisitos">
                    <p>Prerrequisitos: ${curso.prerequisitos.join(', ')}</p>
                </div>` : ''}
            </div>
        </div>`;
            }
            html += `
    </div>`;
        }

        html += `
</body>
</html>`;

        return html;
    }

    private agruparCursosPorSemestre(): { [key: number]: Curso[] } {
        const cursosPorSemestre: { [key: number]: Curso[] } = {};
        
        for (const curso of this.carrera.cursos) {
            if (!cursosPorSemestre[curso.semestre]) {
                cursosPorSemestre[curso.semestre] = [];
            }
            cursosPorSemestre[curso.semestre].push(curso);
        }

        // Ordenar los cursos por código dentro de cada semestre
        for (const semestre in cursosPorSemestre) {
            cursosPorSemestre[semestre].sort((a, b) => a.codigo.localeCompare(b.codigo));
        }

        return cursosPorSemestre;
    }

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
        throw new Error(message);
    }

    private peek(): Token {
        return this.tokens[this.current];
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    private isAtEnd(): boolean {
        return this.peek().type === TokenType.EOF;
    }
} 