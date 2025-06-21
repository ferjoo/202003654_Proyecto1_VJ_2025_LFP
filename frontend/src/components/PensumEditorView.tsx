import React, { useRef, useEffect } from 'react';
import { FaTrash, FaFolderOpen, FaSave, FaSyncAlt, FaBook, FaUser, FaFileAlt, FaExclamationTriangle, FaGraduationCap } from 'react-icons/fa';
import { analyzeCode } from '../services/api';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';
import ErrorTable from './ErrorTable';
import PensumView from './PensumView';
import { highlightText, getTokenColor, tokenColorClass } from '../services/syntaxHighlighter';

// Componente del editor con resaltado
const SyntaxHighlightedEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current && highlightRef.current) {
      const textarea = textareaRef.current;
      const highlight = highlightRef.current;
      
      // Sincronizar scroll
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
    }
  }, [value]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Función para obtener el texto a resaltar
  const getHighlightText = () => {
    const textToHighlight = value || placeholder || '';
    // Si no hay valor y hay placeholder, usamos el placeholder para el resaltado
    if (!value && placeholder) {
      return highlightText(placeholder);
    }
    return highlightText(textToHighlight);
  };

  return (
    <div className="syntax-editor-container">
      <div className="syntax-editor-highlight" ref={highlightRef}>
        <pre
          className="syntax-editor-pre"
          data-placeholder={placeholder}
          dangerouslySetInnerHTML={{
            __html: getHighlightText()
          }}
        />
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onScroll={handleScroll}
        className="syntax-editor-textarea"
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
};

const PensumEditorView: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    state: { editorContent, tokens, lexerErrors, isAnalyzing, showMenu, currentView, pensum },
    setEditorContent,
    setTokens,
    setLexerErrors,
    setPensum,
    setAnalyzing,
    addApiError,
    setShowMenu,
    setCurrentView,
    clearEditor,
    setShowTechnicalManual,
    setShowUserManual,
  } = useAppContext();

  const handleMenuClick = () => setShowMenu(!showMenu);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar que sea un archivo .plfp
    if (!file.name.toLowerCase().endsWith('.plfp')) {
      toast.error('Por favor selecciona un archivo .plfp válido');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setEditorContent(content);
        toast.success(`Archivo ${file.name} cargado exitosamente`);
      }
    };
    reader.onerror = () => {
      toast.error('Error al leer el archivo');
    };
    reader.readAsText(file);

    // Limpiar el input para permitir cargar el mismo archivo nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    if (action === 'clear') {
      clearEditor();
    } else if (action === 'load') {
      fileInputRef.current?.click();
    } else if (action === 'save') {
      // Implementar guardado de archivo
      const blob = new Blob([editorContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pensum.plfp';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Archivo guardado exitosamente');
    }
  };

  const handleAnalyze = async () => {
    if (!editorContent.trim()) {
      setTokens([]);
      setLexerErrors([]);
      setPensum(null);
      return;
    }

    setAnalyzing(true);
    try {
      const result = await analyzeCode(editorContent);
      
      if (result.success && result.data) {
        setTokens(result.data.tokens);
        // No necesitamos el pensum del backend, lo parseamos en el frontend
        toast.success('Análisis completado exitosamente. El pensum está listo para visualizar.');
      } else {
        setTokens([]);
        setPensum(null);
        if (result.errors && result.errors.length > 0) {
          setLexerErrors(result.errors);
          result.errors.forEach(error => {
            toast.error(`Error en línea ${error.line}, columna ${error.column}: ${error.message}`);
          });
        } else {
          const errorMessage = 'Análisis fallido.';
          setLexerErrors([{ message: errorMessage, line: 0, column: 0 }]);
          toast.error('Ocurrió un error durante el análisis, verifica el contenido del editor o revisa la tabla de errores');
        }
      }
    } catch (error) {
      console.error('Error analyzing code:', error);
      setTokens([]);
      setPensum(null);
      const errorMessage = 'Error de conexión con el servidor';
      setLexerErrors([{
        message: errorMessage,
        line: 0,
        column: 0
      }]);
      addApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  const totalErrors = lexerErrors.length + (useAppContext().state.apiErrors.length);

  // Si la vista actual es pensum, mostrar el componente PensumView
  if (currentView === 'pensum') {
    return <PensumView />;
  }

  return (
    <div className="pensum-bg">
      {/* Input file oculto para cargar archivos */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".plfp"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      
      {/* Menú superior */}
      <header className="pensum-header">
        <div className="pensum-header__left">
          <span className="pensum-header__logo">Pensum USAC</span>
        </div>
        <nav className="pensum-header__nav">
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('tokens'); }}>
            <FaFileAlt /> Home
          </a>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setCurrentView('errors'); }}
            className={currentView === 'errors' ? 'active' : ''}
          >
            <FaExclamationTriangle /> Error Report {totalErrors > 0 && `(${totalErrors})`}
          </a>
          {lexerErrors.length === 0 && tokens.length > 0 && (
            <button
              onClick={() => setCurrentView('pensum')}
              className="pensum-download-btn"
            >
              <FaGraduationCap /> Ver Pensum
            </button>
          )}
          <div className="pensum-header__menu">
            <button onClick={handleMenuClick} className="pensum-header__menu-btn">
              <FaFolderOpen /> Archivo <span className="arrow">▼</span>
            </button>
            {showMenu && (
              <div className="pensum-header__dropdown">
                <div onClick={() => handleMenuAction('clear')}><FaTrash /> Limpiar Editor</div>
                <div onClick={() => handleMenuAction('load')}><FaFolderOpen /> Cargar Archivo</div>
                <div onClick={() => handleMenuAction('save')}><FaSave /> Guardar Archivo</div>
              </div>
            )}
          </div>
          <a href="#" onClick={(e) => { e.preventDefault(); setShowTechnicalManual(true); }}>
            <FaBook /> Manual Técnico
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setShowUserManual(true); }}>
            <FaUser /> Manual de Usuario
          </a>
        </nav>
      </header>

      {/* Contenido principal */}
      <main className="pensum-main">
        <section className="pensum-card pensum-editor-card">
          <div className="pensum-card__header">
            <FaFileAlt /> Editor de Texto
            <span className="pensum-card__lines">Líneas: {editorContent.split('\n').length}</span>
          </div>
          <SyntaxHighlightedEditor
            value={editorContent}
            onChange={setEditorContent}
            placeholder="Escribe tu código aquí..."
          />
        </section>
        <section className="pensum-card pensum-tokens-card">
          <div className="pensum-card__header">
            {currentView === 'tokens' ? (
              <>
                <FaBook /> Tabla de Tokens
                {isAnalyzing && <span className="analyzing-indicator">Analizando...</span>}
              </>
            ) : currentView === 'errors' ? (
              <>
                <FaExclamationTriangle /> Tabla de Errores
                {totalErrors > 0 && <span className="error-count">({totalErrors} errores)</span>}
              </>
            ) : (
              <>
                <FaBook /> Tabla de Tokens
                {isAnalyzing && <span className="analyzing-indicator">Analizando...</span>}
              </>
            )}
          </div>
          {currentView === 'tokens' ? (
            // Vista de Tokens
            lexerErrors.length > 0 ? (
              <div className="table-container">
                <div className="table-placeholder">
                  <div className="placeholder-icon">⚠️</div>
                  <h3>No hay datos para mostrar</h3>
                  <p>Hay errores en el código que impiden el análisis léxico</p>
                  <button 
                    onClick={() => setCurrentView('errors')}
                    className="view-errors-btn"
                  >
                    Ver Errores
                  </button>
                </div>
              </div>
            ) : tokens.length === 0 ? (
              <div className="table-container">
                <div className="table-placeholder">
                  <div className="placeholder-icon">📋</div>
                  <h3>Tabla de Tokens</h3>
                  <p>Haz clic en "Analizar" para ver los tokens del código</p>
                </div>
              </div>
            ) : (
              <div className="table-container">
                <table className="pensum-tokens-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Fila</th>
                      <th>Columna</th>
                      <th>Lexema</th>
                      <th>Token</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((token, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{token.line}</td>
                        <td>{token.column}</td>
                        <td className={getTokenColor(token.type) ? tokenColorClass[getTokenColor(token.type)!] : ''}>
                          {token.lexeme}
                        </td>
                        <td>{token.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            // Vista de Errores
            <ErrorTable />
          )}
        </section>
      </main>

      {/* Botón de análisis y descarga de pensum */}
      <div className="pensum-actions">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="pensum-analyze-btn"
        >
          {isAnalyzing ? (
            <>
              <FaSyncAlt /> Analizando...
            </>
          ) : (
            <>
              <FaBook /> Analizar
            </>
          )}
        </button>
        
        {pensum && (
          <button
            onClick={() => setCurrentView('pensum')}
            className="pensum-download-btn"
          >
            <FaGraduationCap /> Ver Pensum
          </button>
        )}
      </div>
    </div>
  );
};

export default PensumEditorView; 