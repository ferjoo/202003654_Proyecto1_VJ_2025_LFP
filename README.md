# Proyecto 1 - Lenguajes Formales y de Programación

## Descripción
Este proyecto consiste en un sistema de gestión de información para un hospital, implementado como una aplicación web full-stack con frontend y backend separados.

## Estructura del Proyecto
El proyecto está dividido en dos partes principales:

### Frontend
Ubicado en el directorio `frontend/`, es una aplicación web desarrollada con React y TypeScript.

### Backend
Ubicado en el directorio `backend/`, es un servidor API REST desarrollado con Express y TypeScript.

## Tecnologías Utilizadas

### Frontend
- Node.js 18
- React 18
- TypeScript
- Vite
- SCSS
- Axios
- React Router DOM
- React Icons

### Backend
- Node.js 18
- Express
- TypeScript
- Cors
- Dotenv
- Morgan (para logging)

## Requisitos Previos
- Node.js 18 o superior
- npm (incluido con Node.js)

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

## Estructura de Archivos

### Frontend
```
frontend/
├── src/
│   ├── components/     # Componentes React reutilizables
│   ├── pages/         # Páginas principales
│   ├── styles/        # Archivos SCSS
│   ├── types/         # Definiciones de tipos TypeScript
│   └── utils/         # Utilidades y helpers
├── public/            # Archivos estáticos
└── index.html         # Punto de entrada HTML
```

### Backend
```
backend/
├── src/
│   ├── routes/        # Definición de rutas API
│   ├── controllers/   # Controladores de la lógica de negocio
│   ├── models/        # Modelos de datos
│   └── utils/         # Utilidades y helpers
└── .env              # Variables de entorno
```

## Características Principales

### Frontend
- Interfaz de usuario moderna y responsiva
- Navegación entre páginas con React Router
- Estilos modulares con SCSS
- Comunicación con el backend mediante Axios
- Componentes reutilizables

### Backend
- API RESTful
- Manejo de CORS
- Logging de peticiones con Morgan
- Estructura modular y escalable
- Tipado fuerte con TypeScript

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
