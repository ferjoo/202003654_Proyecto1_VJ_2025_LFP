# MANUAL TÉCNICO - ANALIZADOR LÉXICO PARA LENGUAJE DE DEFINICIÓN DE PENSUMS

## Índice
1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Lenguaje de Definición de Pensums](#lenguaje-de-definición-de-pensums)
4. [Análisis Léxico](#análisis-léxico)
5. [Autómata Finito Determinista (AFD)](#autómata-finito-determinista-afd)
6. [Implementación del Analizador Léxico](#implementación-del-analizador-léxico)
7. [Manejo de Errores](#manejo-de-errores)
8. [Interfaz de Usuario](#interfaz-de-usuario)
9. [API REST](#api-rest)
10. [Tecnologías Utilizadas](#tecnologías-utilizadas)
11. [Estructura del Código](#estructura-del-código)
12. [Casos de Uso](#casos-de-uso)
13. [Conclusiones](#conclusiones)

---

## 1. Introducción

Este proyecto implementa un **analizador léxico** para un lenguaje específico de dominio (DSL) diseñado para la definición de pensums universitarios. El sistema está construido como una aplicación web full-stack que permite a los usuarios escribir código en un lenguaje especializado y obtener un análisis léxico detallado con detección de errores.

### 1.1 Objetivos del Proyecto
- Implementar un analizador léxico robusto para un DSL de pensums
- Proporcionar una interfaz web intuitiva para análisis de código
- Detectar y reportar errores léxicos con precisión
- Visualizar tokens con resaltado de sintaxis en tiempo real
- Validar la estructura sintáctica básica del lenguaje

### 1.2 Alcance
El sistema se enfoca en la **fase de análisis léxico** del proceso de compilación, transformando el código fuente en una secuencia de tokens que representan los elementos léxicos del lenguaje.

---

## 2. Arquitectura del Sistema

### 2.1 Arquitectura General
El proyecto sigue una arquitectura **cliente-servidor** con separación clara de responsabilidades:

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   Frontend      │ ◄─────────────► │    Backend      │
│   (React)       │                 │   (Express)     │
└─────────────────┘                 └─────────────────┘
         │                                   │
         │                                   │
         ▼                                   ▼
┌─────────────────┐                 ┌─────────────────┐
│   Interfaz      │                 │  Analizador     │
│   de Usuario    │                 │   Léxico        │
└─────────────────┘                 └─────────────────┘
```

### 2.2 Componentes Principales

#### Frontend (React + TypeScript)
- **Editor de código**: Interfaz para escribir código del pensum
- **Resaltador de sintaxis**: Coloreado en tiempo real
- **Visualizador de tokens**: Tabla con todos los tokens encontrados
- **Manejador de errores**: Visualización de errores léxicos

#### Backend (Express + TypeScript)
- **API REST**: Endpoints para análisis léxico
- **Analizador Léxico**: Implementación del AFD
- **Controladores**: Manejo de requests HTTP
- **Validadores**: Verificación de entrada

---

## 3. Lenguaje de Definición de Pensums

### 3.1 Descripción del DSL
El lenguaje implementado es un **DSL específico para pensums universitarios** que permite definir:
- Carreras universitarias
- Semestres académicos
- Cursos con sus propiedades
- Prerrequisitos entre cursos
- Metadatos de cursos (créditos, área, etc.)

### 3.2 Sintaxis del Lenguaje

```typescript
Carrera: "Nombre de la Carrera" [
    Semestre: 01 {
        Curso: 101 {
            Nombre: "Nombre del Curso";
            Codigo: "COD101";
            Creditos: 4;
            Area: "Área del Curso";
            Descripcion: "Descripción del curso";
            Prerrequisitos: ();
            Obligatorio: true;
        }
    }
]
```

### 3.3 Elementos Léxicos

#### Palabras Reservadas
- `Carrera`, `Semestre`, `Curso`, `Nombre`, `Codigo`
- `Creditos`, `Area`, `Descripcion`, `Prerrequisitos`
- `Obligatorio`, `Electivo`, `true`, `false`

#### Símbolos Especiales
- **Delimitadores**: `{`, `}`, `[`, `]`, `(`, `)`
- **Separadores**: `:`, `;`, `,`
- **Operadores**: `=`

#### Literales
- **Cadenas**: Texto entre comillas dobles o simples
- **Números**: Secuencias de dígitos
- **Booleanos**: `true`, `false`

#### Identificadores
- Secuencias de letras, dígitos y guiones bajos
- No pueden comenzar con dígito

---

## 4. Análisis Léxico

### 4.1 Definición y Propósito
El **análisis léxico** es la primera fase del proceso de compilación que convierte el código fuente (secuencia de caracteres) en una secuencia de **tokens** (elementos léxicos).

### 4.2 Funciones del Analizador Léxico
1. **Tokenización**: Dividir el código en tokens individuales
2. **Clasificación**: Identificar el tipo de cada token
3. **Validación**: Detectar errores léxicos
4. **Posicionamiento**: Mantener información de línea y columna
5. **Filtrado**: Ignorar espacios en blanco y comentarios

### 4.3 Proceso de Análisis
```
Código Fuente → Escáner → Tokens → Tabla de Símbolos
     ↓              ↓        ↓           ↓
"Curso: 101" → ["Curso", ":", "101"] → [CURSO, DOS_PUNTOS, NUMERO]
```

---

## 5. Autómata Finito Determinista (AFD)

### 5.1 Definición del AFD
El analizador léxico implementa un **Autómata Finito Determinista** que reconoce los patrones léxicos del lenguaje. Un AFD es una máquina de estados que:
- Tiene un número finito de estados
- Lee símbolos de entrada secuencialmente
- Transita entre estados según reglas deterministas
- Acepta o rechaza cadenas de entrada

### 5.2 Estados del AFD

#### Estado Inicial (S0)
- Estado de partida para cada token
- Lee el primer carácter y decide el tipo de token

#### Estados de Reconocimiento
1. **Estado de Identificador (S1)**
   - Transiciones: letras, dígitos, guiones bajos
   - Aceptación: cuando encuentra un carácter no válido

2. **Estado de Número (S2)**
   - Transiciones: solo dígitos
   - Aceptación: cuando encuentra un carácter no dígito

3. **Estado de Cadena (S3)**
   - Transiciones: cualquier carácter excepto comillas
   - Aceptación: cuando encuentra la comilla de cierre

4. **Estado de Símbolo (S4)**
   - Transiciones: símbolos especiales únicos
   - Aceptación: inmediata

### 5.3 Diagrama de Estados del AFD

```
                    ┌─────────────────┐
                    │   Estado S0     │
                    │   (Inicial)     │
                    └─────────┬───────┘
                              │
                    ┌─────────▼───────┐
                    │   Análisis      │
                    │   del primer    │
                    │   carácter      │
                    └─────────┬───────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   S1: Letra   │    │   S2: Dígito  │    │   S4: Símbolo │
│Identificador  │    │   Número      │    │   Especial    │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Continúa    │    │   Continúa    │    │   Acepta      │
│   leyendo     │    │   leyendo     │    │   inmediato   │
│   alfanum.    │    │   dígitos     │    │               │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │
        ▼                     ▼
┌───────────────┐    ┌───────────────┐
│   Verifica    │    │   Acepta      │
│   palabra     │    │   número      │
│   reservada   │    │               │
└───────────────┘    └───────────────┘
```

### 5.4 Tabla de Transiciones del AFD

| Estado | Entrada | Siguiente Estado | Acción |
|--------|---------|------------------|---------|
| S0 | Letra | S1 | Iniciar identificador |
| S0 | Dígito | S2 | Iniciar número |
| S0 | Comilla | S3 | Iniciar cadena |
| S0 | Símbolo | S4 | Aceptar símbolo |
| S1 | Letra/Dígito | S1 | Continuar identificador |
| S1 | Otro | - | Aceptar identificador |
| S2 | Dígito | S2 | Continuar número |
| S2 | Otro | - | Aceptar número |
| S3 | No comilla | S3 | Continuar cadena |
| S3 | Comilla | - | Aceptar cadena |
| S4 | - | - | Aceptar símbolo |

---

## 6. Implementación del Analizador Léxico

### 6.1 Clase Lexer

La implementación del analizador léxico se encuentra en `backend/src/lexer/Lexer.ts`:

```typescript
export class Lexer {
    private source: string;           // Código fuente
    private current: number;          // Posición actual
    private start: number;            // Inicio del token actual
    private line: number;             // Línea actual
    private column: number;           // Columna actual
    private tokens: Token[];          // Lista de tokens
    private errors: LexerError[];     // Lista de errores
    private bracketStack: any[];      // Pila para validar brackets
}
```

### 6.2 Algoritmo Principal

```typescript
public analyze(): { tokens: Token[], errors: LexerError[] } {
    while (!this.isAtEnd()) {
        this.start = this.current;
        this.scanToken();
    }
    
    // Validar brackets no cerrados
    if (this.bracketStack.length > 0) {
        const lastBracket = this.bracketStack.pop()!;
        this.addError(`Símbolo de apertura '${lastBracket.char}' no fue cerrado.`);
    }
    
    return { tokens: this.tokens, errors: this.errors };
}
```

### 6.3 Función scanToken()

Esta función implementa el **AFD** y decide qué tipo de token procesar:

```typescript
private scanToken(): void {
    const c = this.advance();
    
    switch (c) {
        case '{': case '}': case '[': case ']': case '(': case ')':
            this.handleBrackets(c);
            break;
        case ',': case ';': case ':': case '=':
            this.addToken(this.getSymbolType(c));
            break;
        case ' ': case '\r': case '\t':
            // Ignorar espacios en blanco
            break;
        case '\n':
            this.line++; this.column = 1;
            break;
        case '"': case "'":
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
```

### 6.4 Reconocimiento de Identificadores

```typescript
private identifier(): void {
    while (this.isAlphaNumeric(this.peek())) {
        this.advance();
    }
    
    const text = this.source.substring(this.start, this.current);
    let type = TokenType.IDENTIFICADOR;
    
    // Verificar palabras reservadas
    switch (text.toUpperCase()) {
        case 'CARRERA': type = TokenType.CARRERA; break;
        case 'CURSO': type = TokenType.CURSO; break;
        case 'SEMESTRE': type = TokenType.SEMESTRE; break;
        // ... más palabras reservadas
    }
    
    this.addToken(type);
}
```

### 6.5 Reconocimiento de Cadenas

```typescript
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
    
    // Consumir comilla de cierre
    this.advance();
    
    // Extraer valor sin comillas
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.CADENA, value);
}
```

### 6.6 Validación de Brackets

El analizador implementa validación de brackets para detectar errores de estructura:

```typescript
private handleClosingBracket(c: string, column: number): void {
    if (this.bracketStack.length === 0) {
        this.addError(`Símbolo de cierre '${c}' inesperado.`);
        return;
    }
    
    const lastOpen = this.bracketStack.pop()!;
    const expectedClosing = this.getMatchingClosingBracket(lastOpen.char);
    
    if (c !== expectedClosing) {
        this.addError(`'${c}' no coincide con la apertura '${lastOpen.char}'.`);
    }
}
```

---

## 7. Manejo de Errores

### 7.1 Tipos de Errores Léxicos

1. **Caracteres Inesperados**
   - Símbolos no reconocidos por el lenguaje
   - Ejemplo: `@`, `#`, `$`

2. **Cadenas No Terminadas**
   - Comillas de apertura sin cierre
   - Ejemplo: `"Hola mundo`

3. **Brackets Desbalanceados**
   - Símbolos de apertura sin cierre correspondiente
   - Ejemplo: `{ [ } ]`

4. **Brackets Incorrectos**
   - Símbolo de cierre que no coincide con la apertura
   - Ejemplo: `{ } ]`

### 7.2 Estructura de Error

```typescript
interface LexerError {
    message: string;    // Descripción del error
    line: number;       // Línea donde ocurrió
    column: number;     // Columna donde ocurrió
}
```

### 7.3 Reporte de Errores

Los errores se reportan con:
- **Posición exacta**: Línea y columna
- **Mensaje descriptivo**: Explicación del problema
- **Contexto**: Información adicional cuando es relevante

---

## 8. Interfaz de Usuario

### 8.1 Componentes Principales

#### Editor de Código
- **Textarea sincronizado**: Para entrada de código
- **Resaltado en tiempo real**: Coloreado de sintaxis
- **Contador de líneas**: Numeración automática
- **Scroll sincronizado**: Entre editor y resaltado

#### Visualizador de Tokens
- **Tabla organizada**: Tokens con tipo, lexema, posición
- **Colores por tipo**: Diferentes colores para cada categoría
- **Información detallada**: Línea, columna, tipo de token

#### Manejador de Errores
- **Tabla de errores**: Lista organizada de errores
- **Posicionamiento**: Navegación a errores específicos
- **Categorización**: Errores léxicos vs errores de API

### 8.2 Resaltado de Sintaxis

El resaltado se implementa en `frontend/src/services/syntaxHighlighter.ts`:

```typescript
export const highlightText = (text: string): string => {
    const patterns: [RegExp, TokenColor][] = [
        [/"[^"]*"/g, 'orange'],           // Cadenas
        [/\b(Carrera|Curso|...)\b/gi, 'blue'],  // Palabras reservadas
        [/\b\d+\b/g, 'purple'],           // Números
        [/(:|;|=|\[|\]|\{|\}|\(|\)|,)/g, 'green'], // Símbolos
    ];
    
    // Procesar patrones y generar HTML
    // ...
};
```

### 8.3 Estados de la Aplicación

- **Idle**: Esperando entrada del usuario
- **Analyzing**: Procesando código
- **Success**: Análisis completado sin errores
- **Error**: Errores detectados en el análisis

---

## 9. API REST

### 9.1 Endpoint Principal

```
POST /api/lexer/analyze
```

### 9.2 Estructura de Request

```json
{
    "input": "Carrera: \"Ingeniería\" [ ... ]"
}
```

### 9.3 Estructura de Response

#### Respuesta Exitosa
```json
{
    "success": true,
    "data": {
        "tokens": [
            {
                "type": "CARRERA",
                "lexeme": "Carrera",
                "line": 1,
                "column": 1
            }
        ]
    }
}
```

#### Respuesta con Errores
```json
{
    "success": false,
    "data": {
        "errors": [
            {
                "message": "Carácter inesperado: @",
                "line": 1,
                "column": 5
            }
        ]
    }
}
```

### 9.4 Controlador de API

```typescript
export const analyzeInput = (req: Request, res: Response) => {
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
            data: { errors: result.errors }
        });
    }
    
    return res.json({
        success: true,
        data: { tokens: result.tokens }
    });
};
```

---

## 10. Tecnologías Utilizadas

### 10.1 Frontend
- **React 19**: Framework de interfaz de usuario
- **TypeScript**: Tipado estático
- **Vite**: Herramienta de construcción
- **SCSS**: Preprocesador CSS
- **Axios**: Cliente HTTP
- **React Icons**: Iconografía

### 10.2 Backend
- **Node.js**: Runtime de JavaScript
- **Express**: Framework web
- **TypeScript**: Tipado estático
- **CORS**: Middleware para CORS
- **ts-node-dev**: Desarrollo con hot reload

### 10.3 Herramientas de Desarrollo
- **ESLint**: Linter de código
- **Prettier**: Formateador de código
- **Git**: Control de versiones

---

## 11. Estructura del Código

### 11.1 Organización del Backend

```
backend/
├── src/
│   ├── lexer/
│   │   ├── Lexer.ts          # Implementación del AFD
│   │   └── types.ts          # Definiciones de tipos
│   ├── controllers/
│   │   └── lexerController.ts # Controlador de API
│   ├── routes/
│   │   ├── index.ts          # Rutas principales
│   │   └── lexerRoutes.ts    # Rutas del analizador
│   ├── config/               # Configuraciones
│   └── server.ts             # Servidor principal
├── package.json
└── tsconfig.json
```

### 11.2 Organización del Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── PensumEditorView.tsx    # Editor principal
│   │   ├── ErrorTable.tsx          # Tabla de errores
│   │   └── ErrorDisplay.tsx        # Display de errores
│   ├── services/
│   │   ├── api.ts                  # Cliente API
│   │   └── syntaxHighlighter.ts    # Resaltado de sintaxis
│   ├── context/
│   │   └── AppContext.tsx          # Estado global
│   ├── hooks/
│   │   └── useAppState.ts          # Hooks personalizados
│   └── styles/
│       └── main.scss               # Estilos principales
├── package.json
└── vite.config.ts
```

---

## 12. Casos de Uso

### 12.1 Análisis Exitoso
1. Usuario escribe código válido en el editor
2. Hace clic en "Analizar"
3. Sistema envía código al backend
4. Analizador léxico procesa el código
5. Se muestran tokens en tabla organizada
6. Resaltado de sintaxis aplicado

### 12.2 Detección de Errores
1. Usuario escribe código con errores
2. Hace clic en "Analizar"
3. Analizador detecta errores léxicos
4. Errores se muestran en tabla especial
5. Posiciones exactas de errores reportadas
6. Usuario puede corregir errores

### 12.3 Validación de Estructura
1. Sistema valida brackets automáticamente
2. Detecta símbolos no cerrados
3. Verifica correspondencia de brackets
4. Reporta errores de estructura

---

## 13. Conclusiones

### 13.1 Logros del Proyecto
- ✅ Implementación exitosa del analizador léxico
- ✅ AFD funcional para reconocimiento de tokens
- ✅ Interfaz web intuitiva y moderna
- ✅ Detección robusta de errores léxicos
- ✅ Resaltado de sintaxis en tiempo real
- ✅ API REST bien estructurada

### 13.2 Características Técnicas Destacadas
- **Autómata Finito Determinista**: Implementación eficiente del AFD
- **Manejo de Errores**: Detección precisa con posicionamiento
- **Validación de Estructura**: Verificación de brackets balanceados
- **Interfaz Responsiva**: Adaptable a diferentes dispositivos
- **Arquitectura Modular**: Código mantenible y escalable

### 13.3 Aplicabilidad
El analizador léxico desarrollado puede ser utilizado como:
- **Herramienta educativa**: Para enseñar análisis léxico
- **Prototipo**: Base para compiladores más complejos
- **Validador**: Verificación de sintaxis de DSLs
- **Editor**: Componente de editores de código especializados

### 13.4 Extensiones Futuras
- Análisis sintáctico (Parser)
- Análisis semántico
- Generación de código
- Optimizaciones de rendimiento
- Soporte para más tipos de tokens

---

## Anexos

### A.1 Ejemplo Completo de Análisis

**Entrada:**
```
Carrera: "Ingeniería" [
    Curso: 101 {
        Nombre: "Matemática";
    }
]
```

**Tokens Generados:**
```
1. CARRERA (línea 1, columna 1)
2. DOS_PUNTOS (línea 1, columna 8)
3. CADENA "Ingeniería" (línea 1, columna 10)
4. CORCHETE_ABIERTO (línea 1, columna 22)
5. CURSO (línea 2, columna 5)
6. DOS_PUNTOS (línea 2, columna 10)
7. NUMERO 101 (línea 2, columna 12)
8. LLAVE_ABIERTA (línea 2, columna 16)
9. NOMBRE (línea 3, columna 9)
10. DOS_PUNTOS (línea 3, columna 15)
11. CADENA "Matemática" (línea 3, columna 17)
12. PUNTO_COMA (línea 3, columna 28)
13. LLAVE_CERRADA (línea 4, columna 5)
14. CORCHETE_CERRADO (línea 5, columna 1)
```

### A.2 Tabla de Tokens Completa

| TokenType | Descripción | Ejemplo |
|-----------|-------------|---------|
| CARRERA | Palabra reservada | `Carrera` |
| CURSO | Palabra reservada | `Curso` |
| SEMESTRE | Palabra reservada | `Semestre` |
| NOMBRE | Palabra reservada | `Nombre` |
| CREDITOS | Palabra reservada | `Creditos` |
| PREREQUISITO | Palabra reservada | `Prerequisito` |
| CADENA | Literal de texto | `"Hola mundo"` |
| NUMERO | Literal numérico | `101` |
| BOOLEANO | Literal booleano | `true`, `false` |
| LLAVE_ABIERTA | Símbolo | `{` |
| LLAVE_CERRADA | Símbolo | `}` |
| CORCHETE_ABIERTO | Símbolo | `[` |
| CORCHETE_CERRADO | Símbolo | `]` |
| PARENTESIS_ABIERTO | Símbolo | `(` |
| PARENTESIS_CERRADO | Símbolo | `)` |
| DOS_PUNTOS | Símbolo | `:` |
| PUNTO_COMA | Símbolo | `;` |
| COMA | Símbolo | `,` |
| IGUAL | Símbolo | `=` |
| IDENTIFICADOR | Identificador | `miVariable` |

---

**Documento generado automáticamente por el sistema de análisis léxico**
**Fecha: 2025**
**Versión: 1.0**
