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
}
```

## Uso

### 1. Usando el contexto directamente

```typescript
import { useAppContext } from '../context/AppContext';

const MyComponent = () => {
  const { state, setEditorContent, addApiError } = useAppContext();
  
  // Acceder al estado
  const { editorContent, tokens, isAnalyzing } = state;
  
  // Actualizar el estado
  const handleContentChange = (content: string) => {
    setEditorContent(content);
  };
  
  const handleError = (error: string) => {
    addApiError(error);
  };
};
```

### 2. Usando hooks personalizados

```typescript
import { useAppState, useAppActions, useApp } from '../hooks/useAppState';

// Solo estado
const MyComponent1 = () => {
  const state = useAppState();
  const { editorContent, tokens } = state;
};

// Solo acciones
const MyComponent2 = () => {
  const actions = useAppActions();
  const { setEditorContent, addApiError } = actions;
};

// Estado y acciones
const MyComponent3 = () => {
  const { state, actions } = useApp();
  const { editorContent } = state;
  const { setEditorContent } = actions;
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
- `clearEditor()` - Limpia el editor y resultados
- `resetState()` - Resetea todo el estado al inicial

## Componentes Relacionados

### ErrorDisplay.tsx
Componente que muestra los errores de API almacenados en el contexto.

### Hooks personalizados
- `useAppState()` - Acceso solo al estado
- `useAppActions()` - Acceso solo a las acciones
- `useApp()` - Acceso a estado y acciones

## Beneficios

1. **Estado centralizado**: Todo el estado de la aplicación está en un solo lugar
2. **Reutilización**: Los datos se pueden compartir entre cualquier componente
3. **Mantenibilidad**: Cambios en el estado se reflejan automáticamente en todos los componentes
4. **Debugging**: Fácil seguimiento de cambios de estado
5. **Escalabilidad**: Fácil agregar nuevas propiedades al estado global 