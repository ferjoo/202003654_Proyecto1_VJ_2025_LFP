import React, { useState } from 'react';
import { FaTrash, FaFolderOpen, FaSave, FaSyncAlt, FaBook, FaUser, FaFileAlt } from 'react-icons/fa';
import { analyzeCode } from '../services/api';
import type { Token, LexerError } from '../services/api';
import { toast } from 'react-toastify';

const initialContent = `Carrera: "Ciencias y Sistemas" [
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
]`;

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
  const [content, setContent] = useState(initialContent);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [errors, setErrors] = useState<LexerError[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = () => setShowMenu((v) => !v);
  
  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    if (action === 'clear') {
      setContent('');
      setTokens([]);
      setErrors([]);
    }
    // Implement load/save as needed
  };

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setTokens([]);
      setErrors([]);
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeCode(content);
      
      if (result.success && result.data) {
        setTokens(result.data.tokens);
        setErrors([]);
      } else {
        setTokens([]);
        if (result.errors && result.errors.length > 0) {
          setErrors(result.errors);
          result.errors.forEach(error => {
            toast.error(`Error en línea ${error.line}, columna ${error.column}: ${error.message}`);
          });
        } else {
          setErrors([{ message: 'Análisis fallido.', line: 0, column: 0 }]);
          toast.error('Ocurrió un error durante el análisis, verifica el contenido del editor o revisa la tabla de errores');
        }
      }
    } catch (error) {
      console.error('Error analyzing code:', error);
      setTokens([]);
      const errorMessage = 'Error de conexión con el servidor';
      setErrors([{
        message: errorMessage,
        line: 0,
        column: 0
      }]);
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="pensum-bg">
      {/* Menú superior */}
      <header className="pensum-header">
        <div className="pensum-header__left">
          <span className="pensum-header__logo">Pensum USAC</span>
        </div>
        <nav className="pensum-header__nav">
          <a href="#"><FaFileAlt /> Home</a>
          <a href="#"><FaBook /> Error Report</a>
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
            <span className="pensum-card__lines">Líneas: {content.split('\n').length}</span>
          </div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="pensum-editor__textarea"
            rows={14}
            placeholder="Escribe tu código aquí..."
          />
        </section>
        <section className="pensum-card pensum-tokens-card">
          <div className="pensum-card__header">
            <FaBook /> Tabla de Tokens
            {isAnalyzing && <span className="analyzing-indicator">Analizando...</span>}
          </div>
          {errors.length > 0 ? (
            <div className="table-container">
              <div className="table-placeholder">
                <div className="placeholder-icon">⚠️</div>
                <h3>No hay datos para mostrar</h3>
                <p>Hay errores en el código que impiden el análisis léxico</p>
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
                      <td><span className="token-lexema">{token.lexeme}</span></td>
                      <td><span className={`token-label ${tokenColorClass[getTokenColor(token.type)]}`}>{token.type}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <div className="pensum-analyze-btn-container">
        <button 
          className="pensum-analyze-btn" 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          <div className={isAnalyzing ? 'spinning' : ''}>
            <FaSyncAlt />
          </div>
          {isAnalyzing ? 'Analizando...' : 'Analizar'}
        </button>
      </div>
    </div>
  );
};

export default PensumEditorView; 