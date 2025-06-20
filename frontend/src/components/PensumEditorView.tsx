import React from 'react';
import { FaTrash, FaFolderOpen, FaSave, FaSyncAlt, FaBook, FaUser, FaFileAlt, FaExclamationTriangle } from 'react-icons/fa';
import { analyzeCode } from '../services/api';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';
import ErrorTable from './ErrorTable';

type TokenColor = 'blue' | 'orange' | 'green' | 'purple' | 'red';

const tokenColorClass: Record<TokenColor, string> = {
  blue: 'token-blue',
  orange: 'token-orange',
  green: 'token-green',
  purple: 'token-purple',
  red: 'token-red',
};

const getTokenColor = (tokenType: string): TokenColor => {
  switch (tokenType) {
    case 'CARRERA':
    case 'CURSO':
    case 'SEMESTRE':
    case 'NOMBRE':
    case 'CREDITOS':
    case 'PREREQUISITO':
    case 'CODIGO':
    case 'DESCRIPCION':
    case 'OBLIGATORIO':
    case 'ELECTIVO':
      return 'blue';
    case 'DOS_PUNTOS':
    case 'IGUAL':
    case 'COMA':
    case 'PUNTO_COMA':
      return 'orange';
    case 'CADENA':
      return 'green';
    case 'LLAVE_ABIERTA':
    case 'LLAVE_CERRADA':
    case 'CORCHETE_ABIERTO':
    case 'CORCHETE_CERRADO':
    case 'PARENTESIS_ABIERTO':
    case 'PARENTESIS_CERRADO':
      return 'purple';
    case 'NUMERO':
    case 'BOOLEANO':
      return 'red';
    default:
      return 'blue';
  }
};

const PensumEditorView: React.FC = () => {
  const {
    state: { editorContent, tokens, lexerErrors, isAnalyzing, showMenu, currentView },
    setEditorContent,
    setTokens,
    setLexerErrors,
    setAnalyzing,
    addApiError,
    setShowMenu,
    setCurrentView,
    clearEditor,
  } = useAppContext();

  const handleMenuClick = () => setShowMenu(!showMenu);
  
  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    if (action === 'clear') {
      clearEditor();
    }
    // Implement load/save as needed
  };

  const handleAnalyze = async () => {
    if (!editorContent.trim()) {
      setTokens([]);
      setLexerErrors([]);
      return;
    }

    setAnalyzing(true);
    try {
      const result = await analyzeCode(editorContent);
      
      if (result.success && result.data) {
        setTokens(result.data.tokens);
      } else {
        setTokens([]);
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

  return (
    <div className="pensum-bg">
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
          <a href="#"><FaBook /> Manual Técnico</a>
          <a href="#"><FaUser /> Manual de Usuario</a>
        </nav>
      </header>

      {/* Contenido principal */}
      <main className="pensum-main">
        <section className="pensum-card pensum-editor-card">
          <div className="pensum-card__header">
            <FaFileAlt /> Editor de Texto
            <span className="pensum-card__lines">Líneas: {editorContent.split('\n').length}</span>
          </div>
          <textarea
            value={editorContent}
            onChange={e => setEditorContent(e.target.value)}
            className="pensum-editor__textarea"
            rows={14}
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
            ) : (
              <>
                <FaExclamationTriangle /> Tabla de Errores
                {totalErrors > 0 && <span className="error-count">({totalErrors} errores)</span>}
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
                        <td className={tokenColorClass[getTokenColor(token.type)]}>
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

      {/* Botón de análisis */}
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
      </div>
    </div>
  );
};

export default PensumEditorView; 