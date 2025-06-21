# 🎓 Proyecto 1 - Lenguajes Formales y de Programación

## 📋 Descripción
Este proyecto implementa un **analizador léxico y parser** para un lenguaje específico de dominio (DSL) diseñado para definir pensums universitarios. Es una aplicación web full-stack moderna que permite crear, analizar y visualizar estructuras curriculares de múltiples carreras.

## ✨ Funcionalidades Principales

### 🔍 Análisis Léxico Avanzado
- **Tokenización inteligente**: Convierte código fuente en tokens con posicionamiento preciso
- **Detección de errores**: Identifica errores léxicos y sintácticos con ubicación exacta
- **Tabla de tokens interactiva**: Visualización organizada con colores por tipo de token
- **Resaltado de sintaxis**: Editor con colores diferenciados para cada elemento

### 📝 Editor de Código Inteligente
- **Editor en tiempo real**: Interfaz moderna para escribir código del pensum
- **Contador de líneas**: Navegación visual del código
- **Sintaxis intuitiva**: Lenguaje específico para definir pensums universitarios
- **Autocompletado visual**: Guías de sintaxis integradas

### 🎨 Interfaz Moderna y Responsiva
- **Diseño adaptativo**: Funciona perfectamente en desktop, tablet y móvil
- **Animaciones fluidas**: Indicadores visuales durante el análisis
- **Manejo de errores intuitivo**: Visualización clara y detallada de errores
- **Tema oscuro**: Interfaz moderna con colores optimizados

### 📊 Visualización de Pensums
- **Vista de pensum interactiva**: Visualización gráfica de la estructura curricular
- **Soporte multi-carrera**: Manejo de múltiples carreras en un solo archivo
- **Resaltado de prerrequisitos**: Visualización de dependencias entre cursos
- **Exportación a CSV**: Descarga de datos en formato tabular

### 🔧 Herramientas de Desarrollo
- **Manual técnico**: Documentación completa del sistema
- **Manual de usuario**: Guía paso a paso para usuarios
- **Diagrama AFD**: Visualización del autómata finito determinístico
- **Debugging avanzado**: Herramientas para desarrollo y testing

## 🏗️ Arquitectura del Proyecto

```
202003654_Proyecto1_VJ_2025_LFP/
├── frontend/                 # Aplicación React/TypeScript
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── context/         # Context API para estado global
│   │   ├── services/        # Servicios de API y utilidades
│   │   ├── styles/          # Estilos SCSS
│   │   └── hooks/           # Custom hooks
│   └── public/              # Archivos estáticos
├── backend/                  # API REST con Express/TypeScript
│   ├── src/
│   │   ├── controllers/     # Controladores de la API
│   │   ├── lexer/           # Analizador léxico y parser
│   │   ├── generators/      # Generadores de pensums
│   │   ├── routes/          # Rutas de la API
│   │   └── config/          # Configuración
│   └── dist/                # Código compilado
├── Archivos de Entrada-20250620/  # Archivos de prueba
└── demo_pensum.plfp         # Ejemplo de pensum
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19.1.0** - Biblioteca de interfaz de usuario
- **TypeScript 5.8.3** - Tipado estático
- **Vite 6.3.5** - Build tool y dev server
- **SCSS/Sass 1.89.2** - Preprocesador CSS
- **Axios 1.10.0** - Cliente HTTP
- **React Icons** - Iconografía
- **React Flow 11.11.4** - Visualización de diagramas

### Backend
- **Node.js 18+** - Runtime de JavaScript
- **Express 4.18.2** - Framework web
- **TypeScript 4.9.5** - Tipado estático
- **CORS 2.8.5** - Middleware para CORS
- **Dotenv 16.5.0** - Variables de entorno
- **ts-node-dev 2.0.0** - Desarrollo con hot reload

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js 18+** y **npm** instalados
- **Git** para clonar el repositorio

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd 202003654_Proyecto1_VJ_2025_LFP
```

### 2. Configurar Backend
```bash
cd backend
npm install
npm run dev
```
El backend estará disponible en `http://localhost:3000`

### 3. Configurar Frontend
```bash
cd frontend
npm install
npm run dev
```
El frontend estará disponible en `http://localhost:5173`

### 4. Verificar Instalación
- Abre `http://localhost:5173` en tu navegador
- Deberías ver la interfaz principal del analizador
- El backend debe estar corriendo en `http://localhost:3000`

## 📚 Lenguaje de Definición de Pensums

El proyecto implementa un **DSL (Domain Specific Language)** con sintaxis intuitiva:

### Sintaxis Básica
```typescript
Carrera: "Nombre de la Carrera" [
    Semestre: 01 {
        Curso: 101 {
            Nombre: "Nombre del Curso";
            Codigo: "COD101";
            Creditos: 4;
            Area: "Área del Conocimiento";
            Descripcion: "Descripción del curso";
            Prerrequisitos: (101, 102);
            Obligatorio: true;
        }
    }
]
```

### Elementos del Lenguaje
- **Carrera**: Define el nombre de la carrera
- **Semestre**: Agrupa cursos por semestre
- **Curso**: Define un curso individual
- **Atributos**: Nombre, código, créditos, área, descripción, prerrequisitos

### Tokens Reconocidos
- **Palabras reservadas**: `CARRERA`, `CURSO`, `SEMESTRE`, `NOMBRE`, `CREDITOS`, etc.
- **Símbolos**: `{`, `}`, `[`, `]`, `:`, `;`, `(`, `)`
- **Literales**: Cadenas de texto, números, booleanos
- **Identificadores**: Variables y nombres personalizados

## 🎯 Uso de la Aplicación

### 1. Escribir Código del Pensum
- Abre la aplicación en `http://localhost:5173`
- Escribe código del pensum en el editor de texto
- Usa la sintaxis del lenguaje definido
- Puedes cargar archivos `.plfp` existentes

### 2. Analizar el Código
- Haz clic en el botón "Analizar" (esquina inferior derecha)
- El sistema enviará el código al backend para análisis
- Se mostrará un indicador de progreso durante el análisis

### 3. Interpretar Resultados
- **Sin errores**: Se muestra la tabla de tokens con todos los elementos
- **Con errores**: Se muestran los errores con posición exacta (línea y columna)
- **Tokens coloreados**: Diferentes colores para cada tipo de token

### 4. Visualizar Pensum
- Navega a la vista de pensum para ver la estructura curricular
- Haz clic en cursos para ver prerrequisitos resaltados
- Descarga el pensum en formato CSV

## 🔌 APIs Disponibles

### POST /api/lexer/analyze
Analiza el código fuente y retorna tokens o errores.

**Request:**
```json
{
  "input": "Carrera: \"Ingeniería en Ciencias y Sistemas\" [ ... ]"
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

## 📁 Estructura de Archivos

### Archivos de Entrada
- `demo_pensum.plfp` - Ejemplo completo de pensum
- `Archivos de Entrada-20250620/` - Archivos de prueba adicionales

### Documentación
- `MANUAL_TECNICO.md` - Documentación técnica completa
- `README.md` - Este archivo

## 🎨 Características de la Interfaz

### Colores de Tokens
- **🔵 Azul**: Palabras reservadas (CARRERA, CURSO, etc.)
- **🟠 Naranja**: Símbolos de puntuación (:, =, etc.)
- **🟢 Verde**: Cadenas de texto
- **🟣 Púrpura**: Llaves y corchetes
- **🔴 Rojo**: Números y booleanos

### Navegación
- **Editor**: Escribir y editar código
- **Tokens**: Ver resultados del análisis léxico
- **Errores**: Revisar errores encontrados
- **Pensum**: Visualizar estructura curricular
- **Manuales**: Documentación del sistema

## 🛠️ Scripts Disponibles

### Frontend
```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Construye para producción
npm run preview  # Previsualiza versión de producción
npm run lint     # Ejecuta linter
```

### Backend
```bash
npm run dev      # Inicia servidor en modo desarrollo
npm run build    # Compila TypeScript
npm start        # Inicia servidor en producción
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno
Crea un archivo `.env` en el directorio `backend/`:
```env
PORT=3000
NODE_ENV=development
```

### Estructura de Desarrollo
- **Modo desarrollo**: Hot reload automático
- **Modo producción**: Código optimizado y minificado
- **TypeScript**: Tipado estático en todo el proyecto
- **ESLint**: Linting automático del código

## 🧪 Testing y Debugging

### Archivos de Prueba
- `demo_pensum.plfp` - Pensum completo para testing
- `Archivos de Entrada-20250620/` - Casos de prueba adicionales

### Debugging
- Console logs detallados en el backend
- Herramientas de desarrollo del navegador
- Visualización de errores en tiempo real

## 📈 Características Técnicas

### Manejo de Errores
- Detección de caracteres inesperados
- Cadenas no terminadas
- Posicionamiento preciso de errores
- Respuestas estructuradas de error
- Validación sintáctica completa

### Escalabilidad
- Arquitectura modular y extensible
- Separación clara de responsabilidades
- Tipado fuerte con TypeScript
- Código reutilizable y mantenible
- API RESTful bien estructurada

### Rendimiento
- Compilación rápida con Vite
- Hot reload en desarrollo
- Optimización automática en producción
- Carga eficiente de componentes

## 🤝 Contribución

1. **Fork** el repositorio
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Estándares de Código
- Usar TypeScript para todo el código
- Seguir convenciones de ESLint
- Documentar funciones complejas
- Mantener cobertura de tipos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Fernando Morales Ralda** - *Desarrollo completo* - [GitHub](https://github.com/fernandomoralesralda)

## 🙏 Agradecimientos

- Universidad de San Carlos de Guatemala
- Facultad de Ingeniería
- Departamento de Ciencias de la Computación
- Curso de Lenguajes Formales y de Programación

---

**🎓 Proyecto desarrollado para el curso de Lenguajes Formales y de Programación - USAC 2025**
