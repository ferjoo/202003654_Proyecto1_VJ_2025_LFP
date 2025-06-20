import { useAppContext } from '../context/AppContext';

// Hook personalizado para acceder al estado de la aplicación
export const useAppState = () => {
  const { state } = useAppContext();
  return state;
};

// Hook personalizado para acceder a las acciones de la aplicación
export const useAppActions = () => {
  const {
    setEditorContent,
    setTokens,
    setLexerErrors,
    setAnalyzing,
    addApiError,
    clearApiErrors,
    setShowMenu,
    clearEditor,
    resetState,
  } = useAppContext();

  return {
    setEditorContent,
    setTokens,
    setLexerErrors,
    setAnalyzing,
    addApiError,
    clearApiErrors,
    setShowMenu,
    clearEditor,
    resetState,
  };
};

// Hook personalizado para acceder tanto al estado como a las acciones
export const useApp = () => {
  const context = useAppContext();
  return {
    state: context.state,
    actions: {
      setEditorContent: context.setEditorContent,
      setTokens: context.setTokens,
      setLexerErrors: context.setLexerErrors,
      setAnalyzing: context.setAnalyzing,
      addApiError: context.addApiError,
      clearApiErrors: context.clearApiErrors,
      setShowMenu: context.setShowMenu,
      clearEditor: context.clearEditor,
      resetState: context.resetState,
    },
  };
}; 