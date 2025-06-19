# Proyecto 1 - Lenguajes Formales y de Programación

## Descripción
Este proyecto consiste en un **analizador léxico** para un lenguaje específico de definición de pensums universitarios, implementado como una aplicación web full-stack con frontend y backend separados.

## Funcionalidades Principales

### 🔍 Análisis Léxico
- **Tokenización**: Convierte el código fuente en tokens individuales
- **Detección de errores**: Identifica errores léxicos con posicionamiento preciso
- **Tabla de tokens**: Visualización organizada de todos los tokens encontrados
- **Colores por tipo**: Diferentes colores para cada tipo de token

### 📝 Editor de Código
- **Editor en tiempo real**: Interfaz para escribir código del pensum
- **Contador de líneas**: Muestra el número de líneas del código
- **Sintaxis intuitiva**: Lenguaje específico para definir pensums

### 🎨 Interfaz Moderna
- **Diseño responsivo**: Adaptable a diferentes tamaños de pantalla
- **Animaciones**: Indicadores visuales durante el análisis
- **Manejo de errores**: Visualización clara de errores encontrados

## Lenguaje de Definición de Pensums

El proyecto implementa un **lenguaje específico de dominio (DSL)** con la siguiente sintaxis:

```typescript
Carrera: "Ciencias y Sistemas" [
    Semestre: 01 {
        Curso: 101 {
            Nombre: "Mate Basica 1";
            Area: 04;
            Prerrequisitos: ();
        }
        Curso: 017 {
            Nombre: "Social Humanistica 1";
            Area: 04;
            Prerrequisitos: ();
        }
    }
]
```

### Tokens Reconocidos
- **Palabras reservadas**: `CARRERA`, `CURSO`, `SEMESTRE`, `NOMBRE`, `CREDITOS`, etc.
- **Símbolos**: `{`, `}`, `[`, `]`, `:`, `=`, `,`, `;`
- **Literales**: Cadenas de texto, números, booleanos
- **Identificadores**: Variables y nombres personalizados

## Estructura del Proyecto
El proyecto está dividido en dos partes principales:

### Frontend
Ubicado en el directorio `frontend/`, es una aplicación web desarrollada con React y TypeScript.

### Backend
Ubicado en el directorio `backend/`, es un servidor API REST desarrollado con Express y TypeScript.

## Tecnologías Utilizadas

### Frontend
- Node.js 18
- React 19
- TypeScript
- Vite
- SCSS
- Axios
- React Icons

### Backend
- Node.js 18
- Express
- TypeScript
- Cors
- Dotenv

## Instalación y Configuración

### Frontend
1. Navegar al directorio del frontend:
   ```bash
   cd frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:5173`

### Backend
1. Navegar al directorio del backend:
   ```bash
   cd backend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor:
   ```bash
   npm run dev
   ```
   El backend estará disponible en `http://localhost:3000`

## Uso de la Aplicación

### 1. Escribir Código
- Abre la aplicación en tu navegador
- Escribe código del pensum en el editor de texto
- El código debe seguir la sintaxis del lenguaje definido

### 2. Analizar Código
- Haz clic en el botón "Analizar" (ubicado en la esquina inferior derecha)
- El sistema enviará el código al backend para análisis léxico
- Se mostrará un indicador de "Analizando..." durante el proceso

### 3. Ver Resultados
- **Si no hay errores**: Se mostrará la tabla de tokens con todos los elementos encontrados
- **Si hay errores**: Se mostrarán los errores con su posición exacta (línea y columna)

### 4. Interpretar Tokens
- **Azul**: Palabras reservadas (CARRERA, CURSO, etc.)
- **Naranja**: Símbolos de puntuación (:, =, etc.)
- **Verde**: Cadenas de texto
- **Púrpura**: Llaves y corchetes
- **Rojo**: Números y booleanos

## APIs Disponibles

### POST /api/lexer/analyze
Analiza el código fuente y retorna los tokens o errores.

**Request:**
```json
{
  "input": "Carrera: \"Ciencias y Sistemas\" [ ... ]"
}
```

**Response (éxito):**
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

**Response (error):**
```json
{
  "success": false,
  "errors": [
    {
      "message": "Carácter inesperado: @",
      "line": 1,
      "column": 5
    }
  ]
}
```

## Características Técnicas

### Manejo de Errores
- Detección de caracteres inesperados
- Cadenas no terminadas
- Posicionamiento preciso de errores
- Respuestas estructuradas de error

### Escalabilidad
- Arquitectura modular
- Separación de responsabilidades
- Tipado fuerte con TypeScript
- Código reutilizable

## Scripts Disponibles

### Frontend
- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la versión de producción

### Backend
- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm run build`: Compila el código TypeScript
- `npm start`: Inicia el servidor en modo producción

## Contribución
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
