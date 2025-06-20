# Contexto Global de la Aplicación

Este directorio contiene el contexto global de la aplicación que maneja todo el estado compartido entre componentes.

## Estructura

### AppContext.tsx
El contexto principal que proporciona:
- Estado global de la aplicación
- Funciones para actualizar el estado
- Reducer para manejar acciones de estado

### Estado Global

```typescript
interface AppState {
  // Contenido del editor
  editorContent: string;
  
  // Resultados del análisis léxico
  tokens: Token[];
  lexerErrors: LexerError[];
  
  // Estados de carga
  isAnalyzing: boolean;
  
  // Errores de API
  apiErrors: string[];
  
  // Estado de la UI
  showMenu: boolean;
  currentView: 'tokens' | 'errors';
}
```

## Uso

### 1. Usando el contexto directamente

```typescript
import { useAppContext } from '../context/AppContext';

const MyComponent = () => {
  const { state, setEditorContent, addApiError, setCurrentView } = useAppContext();
  
  // Acceder al estado
  const { editorContent, tokens, isAnalyzing, currentView } = state;
  
  // Actualizar el estado
  const handleContentChange = (content: string) => {
    setEditorContent(content);
  };
  
  const handleError = (error: string) => {
    addApiError(error);
  };
  
  const switchToErrors = () => {
    setCurrentView('errors');
  };
};
```

### 2. Usando hooks personalizados

```typescript
import { useAppState, useAppActions, useApp } from '../hooks/useAppState';

// Solo estado
const MyComponent1 = () => {
  const state = useAppState();
  const { editorContent, tokens, currentView } = state;
};

// Solo acciones
const MyComponent2 = () => {
  const actions = useAppActions();
  const { setEditorContent, addApiError, setCurrentView } = actions;
};

// Estado y acciones
const MyComponent3 = () => {
  const { state, actions } = useApp();
  const { editorContent } = state;
  const { setEditorContent, setCurrentView } = actions;
};
```

## Acciones Disponibles

- `setEditorContent(content: string)` - Actualiza el contenido del editor
- `setTokens(tokens: Token[])` - Establece los tokens del análisis léxico
- `setLexerErrors(errors: LexerError[])` - Establece errores del lexer
- `setAnalyzing(isAnalyzing: boolean)` - Actualiza el estado de análisis
- `addApiError(error: string)` - Agrega un error de API
- `clearApiErrors()` - Limpia todos los errores de API
- `setShowMenu(show: boolean)` - Controla la visibilidad del menú
- `setCurrentView(view: 'tokens' | 'errors')` - Cambia entre vista de tokens y errores
- `clearEditor()` - Limpia el editor y resultados
- `resetState()` - Resetea todo el estado al inicial

## Componentes Relacionados

### ErrorDisplay.tsx
Componente que muestra los errores de API almacenados en el contexto.

### ErrorTable.tsx
Componente que muestra una tabla completa de todos los errores (lexer y API) con formato similar a la tabla de tokens.

### Hooks personalizados
- `useAppState()` - Acceso solo al estado
- `useAppActions()` - Acceso solo a las acciones
- `useApp()` - Acceso a estado y acciones

## Navegación

La aplicación ahora incluye navegación entre dos vistas principales:

1. **Home (Tokens)** - Muestra la tabla de tokens del análisis léxico
2. **Error Report** - Muestra la tabla de errores con contador de errores

### Características de la navegación:
- Indicador visual de la vista activa
- Contador de errores en el enlace "Error Report"
- Cambio dinámico entre vistas
- Botón "Ver Errores" cuando hay errores en la vista de tokens

## Beneficios

1. **Estado centralizado**: Todo el estado de la aplicación está en un solo lugar
2. **Reutilización**: Los datos se pueden compartir entre cualquier componente
3. **Mantenibilidad**: Cambios en el estado se reflejan automáticamente en todos los componentes
4. **Debugging**: Fácil seguimiento de cambios de estado
5. **Escalabilidad**: Fácil agregar nuevas propiedades al estado global
6. **Navegación intuitiva**: Cambio fácil entre vistas de tokens y errores
7. **Gestión de errores**: Visualización clara de todos los tipos de errores 