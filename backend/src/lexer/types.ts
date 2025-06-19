export enum TokenType {
    // Palabras reservadas
    CARRERA = 'CARRERA',
    CURSO = 'CURSO',
    PREREQUISITO = 'PREREQUISITO',
    CREDITOS = 'CREDITOS',
    SEMESTRE = 'SEMESTRE',
    NOMBRE = 'NOMBRE',
    CODIGO = 'CODIGO',
    DESCRIPCION = 'DESCRIPCION',
    OBLIGATORIO = 'OBLIGATORIO',
    ELECTIVO = 'ELECTIVO',
    
    // Símbolos
    LLAVE_ABIERTA = 'LLAVE_ABIERTA',
    LLAVE_CERRADA = 'LLAVE_CERRADA',
    CORCHETE_ABIERTO = 'CORCHETE_ABIERTO',
    CORCHETE_CERRADO = 'CORCHETE_CERRADO',
    PARENTESIS_ABIERTO = 'PARENTESIS_ABIERTO',
    PARENTESIS_CERRADO = 'PARENTESIS_CERRADO',
    COMA = 'COMA',
    PUNTO_COMA = 'PUNTO_COMA',
    DOS_PUNTOS = 'DOS_PUNTOS',
    IGUAL = 'IGUAL',
    
    // Identificadores y literales
    IDENTIFICADOR = 'IDENTIFICADOR',
    CADENA = 'CADENA',
    NUMERO = 'NUMERO',
    BOOLEANO = 'BOOLEANO',
    
    // Fin de archivo
    EOF = 'EOF',
    
    // Error
    ERROR = 'ERROR'
}

export interface Token {
    type: TokenType;
    lexeme: string;
    line: number;
    column: number;
}

export interface LexerError {
    message: string;
    line: number;
    column: number;
} 