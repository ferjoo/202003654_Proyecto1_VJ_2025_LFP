import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Token, LexerError, Pensum } from '../services/api';

// Tipos para el estado
export interface AppState {
  // Editor state
  editorContent: string;
  
  // Analysis results
  tokens: Token[];
  lexerErrors: LexerError[];
  pensum: Pensum | null;
  
  // Loading states
  isAnalyzing: boolean;
  
  // API errors
  apiErrors: string[];
  
  // UI state
  showMenu: boolean;
  currentView: 'tokens' | 'errors' | 'pensum';
  showTechnicalManual: boolean;
  showUserManual: boolean;
  selectedCourse: string | null;
}

// Tipos para las acciones
export type AppAction =
  | { type: 'SET_EDITOR_CONTENT'; payload: string }
  | { type: 'SET_TOKENS'; payload: Token[] }
  | { type: 'SET_LEXER_ERRORS'; payload: LexerError[] }
  | { type: 'SET_PENSUM'; payload: Pensum | null }
  | { type: 'SET_ANALYZING'; payload: boolean }
  | { type: 'ADD_API_ERROR'; payload: string }
  | { type: 'CLEAR_API_ERRORS' }
  | { type: 'SET_SHOW_MENU'; payload: boolean }
  | { type: 'SET_CURRENT_VIEW'; payload: 'tokens' | 'errors' | 'pensum' }
  | { type: 'SET_SHOW_TECHNICAL_MANUAL'; payload: boolean }
  | { type: 'SET_SHOW_USER_MANUAL'; payload: boolean }
  | { type: 'SET_SELECTED_COURSE'; payload: string | null }
  | { type: 'CLEAR_EDITOR' }
  | { type: 'RESET_STATE' };

// Estado inicial
const initialState: AppState = {
  editorContent: `Carrera: "Ciencias y Sistemas" [
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
]`,
  tokens: [],
  lexerErrors: [],
  pensum: null,
  isAnalyzing: false,
  apiErrors: [],
  showMenu: false,
  currentView: 'tokens',
  showTechnicalManual: false,
  showUserManual: false,
  selectedCourse: null,
};

// Reducer para manejar las acciones
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_EDITOR_CONTENT':
      return {
        ...state,
        editorContent: action.payload,
      };
    
    case 'SET_TOKENS':
      return {
        ...state,
        tokens: action.payload,
        lexerErrors: [], // Limpiar errores cuando hay tokens válidos
      };
    
    case 'SET_LEXER_ERRORS':
      return {
        ...state,
        lexerErrors: action.payload,
        tokens: [], // Limpiar tokens cuando hay errores
        pensum: null, // Limpiar pensum cuando hay errores
      };
    
    case 'SET_PENSUM':
      return {
        ...state,
        pensum: action.payload,
      };
    
    case 'SET_ANALYZING':
      return {
        ...state,
        isAnalyzing: action.payload,
      };
    
    case 'ADD_API_ERROR':
      return {
        ...state,
        apiErrors: [...state.apiErrors, action.payload],
      };
    
    case 'CLEAR_API_ERRORS':
      return {
        ...state,
        apiErrors: [],
      };
    
    case 'SET_SHOW_MENU':
      return {
        ...state,
        showMenu: action.payload,
      };
    
    case 'SET_CURRENT_VIEW':
      return {
        ...state,
        currentView: action.payload,
      };
    
    case 'SET_SHOW_TECHNICAL_MANUAL':
      return {
        ...state,
        showTechnicalManual: action.payload,
      };
    
    case 'SET_SHOW_USER_MANUAL':
      return {
        ...state,
        showUserManual: action.payload,
      };
    
    case 'SET_SELECTED_COURSE':
      return {
        ...state,
        selectedCourse: action.payload,
      };
    
    case 'CLEAR_EDITOR':
      return {
        ...state,
        editorContent: '',
        tokens: [],
        lexerErrors: [],
        pensum: null,
        apiErrors: [],
        selectedCourse: null,
      };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// Contexto
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Helper functions
  setEditorContent: (content: string) => void;
  setTokens: (tokens: Token[]) => void;
  setLexerErrors: (errors: LexerError[]) => void;
  setPensum: (pensum: Pensum | null) => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
  addApiError: (error: string) => void;
  clearApiErrors: () => void;
  setShowMenu: (show: boolean) => void;
  setCurrentView: (view: 'tokens' | 'errors' | 'pensum') => void;
  setShowTechnicalManual: (show: boolean) => void;
  setShowUserManual: (show: boolean) => void;
  setSelectedCourse: (course: string | null) => void;
  clearEditor: () => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions
  const setEditorContent = (content: string) => {
    dispatch({ type: 'SET_EDITOR_CONTENT', payload: content });
  };

  const setTokens = (tokens: Token[]) => {
    dispatch({ type: 'SET_TOKENS', payload: tokens });
  };

  const setLexerErrors = (errors: LexerError[]) => {
    dispatch({ type: 'SET_LEXER_ERRORS', payload: errors });
  };

  const setPensum = (pensum: Pensum | null) => {
    dispatch({ type: 'SET_PENSUM', payload: pensum });
  };

  const setAnalyzing = (isAnalyzing: boolean) => {
    dispatch({ type: 'SET_ANALYZING', payload: isAnalyzing });
  };

  const addApiError = (error: string) => {
    dispatch({ type: 'ADD_API_ERROR', payload: error });
  };

  const clearApiErrors = () => {
    dispatch({ type: 'CLEAR_API_ERRORS' });
  };

  const setShowMenu = (show: boolean) => {
    dispatch({ type: 'SET_SHOW_MENU', payload: show });
  };

  const setCurrentView = (view: 'tokens' | 'errors' | 'pensum') => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
  };

  const setShowTechnicalManual = (show: boolean) => {
    dispatch({ type: 'SET_SHOW_TECHNICAL_MANUAL', payload: show });
  };

  const setShowUserManual = (show: boolean) => {
    dispatch({ type: 'SET_SHOW_USER_MANUAL', payload: show });
  };

  const setSelectedCourse = (course: string | null) => {
    dispatch({ type: 'SET_SELECTED_COURSE', payload: course });
  };

  const clearEditor = () => {
    dispatch({ type: 'CLEAR_EDITOR' });
  };

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    setEditorContent,
    setTokens,
    setLexerErrors,
    setPensum,
    setAnalyzing,
    addApiError,
    clearApiErrors,
    setShowMenu,
    setCurrentView,
    setShowTechnicalManual,
    setShowUserManual,
    setSelectedCourse,
    clearEditor,
    resetState,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 