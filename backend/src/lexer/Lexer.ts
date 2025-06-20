import { Token, TokenType, LexerError } from './types';

export class Lexer {
    private source: string;
    private current: number;
    private start: number;
    private line: number;
    private column: number;
    private tokens: Token[];
    private errors: LexerError[];
    private bracketStack: { char: string, line: number, column: number }[];

    constructor(source: string) {
        this.source = source;
        this.current = 0;
        this.start = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
        this.errors = [];
        this.bracketStack = [];
    }

    public analyze(): { tokens: Token[], errors: LexerError[] } {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        
        if (this.bracketStack.length > 0) {
            const lastBracket = this.bracketStack.pop()!;
            this.addError(`Símbolo de apertura '${lastBracket.char}' en línea ${lastBracket.line} no fue cerrado.`);
        }

        return {
            tokens: this.tokens,
            errors: this.errors
        };
    }

    private scanToken(): void {
        const c = this.advance();
        const startColumn = this.column -1;

        switch (c) {
            case '{':
                this.addToken(TokenType.LLAVE_ABIERTA);
                this.bracketStack.push({ char: c, line: this.line, column: startColumn });
                break;
            case '}':
                this.handleClosingBracket(c, startColumn);
                this.addToken(TokenType.LLAVE_CERRADA);
                break;
            case '[':
                this.addToken(TokenType.CORCHETE_ABIERTO);
                this.bracketStack.push({ char: c, line: this.line, column: startColumn });
                break;
            case ']':
                this.handleClosingBracket(c, startColumn);
                this.addToken(TokenType.CORCHETE_CERRADO);
                break;
            case '(':
                this.addToken(TokenType.PARENTESIS_ABIERTO);
                this.bracketStack.push({ char: c, line: this.line, column: startColumn });
                break;
            case ')':
                this.handleClosingBracket(c, startColumn);
                this.addToken(TokenType.PARENTESIS_CERRADO);
                break;
            case ',': this.addToken(TokenType.COMA); break;
            case ';': this.addToken(TokenType.PUNTO_COMA); break;
            case ':': this.addToken(TokenType.DOS_PUNTOS); break;
            case '=': this.addToken(TokenType.IGUAL); break;

            // Espacios en blanco
            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                this.line++;
                this.column = 1;
                break;

            // Strings
            case '"':
            case "'":
                this.string(c);
                break;

            default:
                if (this.isDigit(c)) {
                    this.number();
                } else if (this.isAlpha(c)) {
                    this.identifier();
                } else {
                    this.addError(`Carácter inesperado: ${c}`);
                }
                break;
        }
    }

    private handleClosingBracket(c: string, column: number): void {
        if (this.bracketStack.length === 0) {
            this.addError(`Símbolo de cierre '${c}' inesperado en la línea ${this.line}.`);
            return;
        }

        const lastOpen = this.bracketStack.pop()!;
        const expectedClosing = this.getMatchingClosingBracket(lastOpen.char);

        if (c !== expectedClosing) {
            this.addError(`'${c}' en la línea ${this.line} no coincide con la apertura '${lastOpen.char}' en la línea ${lastOpen.line}.`);
            // We put it back on the stack so the outer-most unclosed bracket is reported.
            this.bracketStack.push(lastOpen); 
        }
    }

    private getMatchingClosingBracket(c: string): string {
        switch (c) {
            case '{': return '}';
            case '[': return ']';
            case '(': return ')';
            default: return '';
        }
    }

    private string(quote: string): void {
        while (this.peek() !== quote && !this.isAtEnd()) {
            if (this.peek() === '\n') {
                this.line++;
                this.column = 1;
            }
            this.advance();
        }

        if (this.isAtEnd()) {
            this.addError('Cadena no terminada');
            return;
        }

        // Consumir la comilla de cierre
        this.advance();

        // Extraer el string sin las comillas
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(TokenType.CADENA, value);
    }

    private number(): void {
        while (this.isDigit(this.peek())) {
            this.advance();
        }

        this.addToken(TokenType.NUMERO);
    }

    private identifier(): void {
        while (this.isAlphaNumeric(this.peek())) {
            this.advance();
        }

        const text = this.source.substring(this.start, this.current);
        let type = TokenType.IDENTIFICADOR;

        // Palabras reservadas
        switch (text.toUpperCase()) {
            case 'CARRERA': type = TokenType.CARRERA; break;
            case 'CURSO': type = TokenType.CURSO; break;
            case 'PREREQUISITO': type = TokenType.PREREQUISITO; break;
            case 'CREDITOS': type = TokenType.CREDITOS; break;
            case 'SEMESTRE': type = TokenType.SEMESTRE; break;
            case 'NOMBRE': type = TokenType.NOMBRE; break;
            case 'CODIGO': type = TokenType.CODIGO; break;
            case 'DESCRIPCION': type = TokenType.DESCRIPCION; break;
            case 'OBLIGATORIO': type = TokenType.OBLIGATORIO; break;
            case 'ELECTIVO': type = TokenType.ELECTIVO; break;
            case 'TRUE':
            case 'FALSE':
                type = TokenType.BOOLEANO;
                break;
        }

        this.addToken(type);
    }

    private advance(): string {
        this.current++;
        this.column++;
        return this.source[this.current - 1];
    }

    private match(expected: string): boolean {
        if (this.isAtEnd()) return false;
        if (this.source[this.current] !== expected) return false;

        this.current++;
        this.column++;
        return true;
    }

    private peek(): string {
        if (this.isAtEnd()) return '\0';
        return this.source[this.current];
    }

    private peekNext(): string {
        if (this.current + 1 >= this.source.length) return '\0';
        return this.source[this.current + 1];
    }

    private isAlpha(c: string): boolean {
        return (c >= 'a' && c <= 'z') ||
               (c >= 'A' && c <= 'Z') ||
               c === '_';
    }

    private isDigit(c: string): boolean {
        return c >= '0' && c <= '9';
    }

    private isAlphaNumeric(c: string): boolean {
        return this.isAlpha(c) || this.isDigit(c);
    }

    private isAtEnd(): boolean {
        return this.current >= this.source.length;
    }

    private addToken(type: TokenType, lexeme?: string): void {
        const text = lexeme || this.source.substring(this.start, this.current);
        this.tokens.push({
            type,
            lexeme: text,
            line: this.line,
            column: this.column - text.length
        });
    }

    private addError(message: string): void {
        this.errors.push({
            message,
            line: this.line,
            column: this.column
        });
    }
} 