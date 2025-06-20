import React, { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaRobot, FaCode, FaCogs, FaExclamationTriangle, FaBook, FaServer, FaDesktop, FaDatabase, FaTools, FaLightbulb, FaCheckCircle } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const TechnicalManual: React.FC = () => {
  const { state: { showTechnicalManual }, setShowTechnicalManual } = useAppContext();
  const [currentSection, setCurrentSection] = useState(0);

  const sections: Section[] = [
    {
      id: 'introduccion',
      title: 'Introducción',
      icon: <FaBook />,
      content: (
        <div className="manual-section">
          <h2>🎯 Análisis Léxico para DSL de Pensums</h2>
          <p>Este proyecto implementa un <strong>analizador léxico</strong> para un lenguaje específico de dominio (DSL) diseñado para la definición de pensums universitarios.</p>
          
          <div className="feature-grid">
            <div className="feature-card">
              <FaRobot />
              <h3>Analizador Léxico Robusto</h3>
              <p>Implementación completa del AFD para reconocimiento de tokens</p>
            </div>
            <div className="feature-card">
              <FaDesktop />
              <h3>Interfaz Web Moderna</h3>
              <p>Editor con resaltado de sintaxis en tiempo real</p>
            </div>
            <div className="feature-card">
              <FaExclamationTriangle />
              <h3>Detección de Errores</h3>
              <p>Reporte preciso de errores léxicos con posicionamiento</p>
            </div>
            <div className="feature-card">
              <FaServer />
              <h3>API REST</h3>
              <p>Backend escalable con Express y TypeScript</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'afd',
      title: 'Autómata Finito Determinista',
      icon: <FaCogs />,
      content: (
        <div className="manual-section">
          <h2>🤖 Autómata Finito Determinista (AFD)</h2>
          <p>El corazón del analizador léxico es un <strong>AFD</strong> que reconoce patrones léxicos del lenguaje.</p>
          
          <div className="afd-diagram">
            <h3>Diagrama de Estados del AFD</h3>
            <div className="state-machine">
              <div className="state initial">
                <div className="state-content">
                  <div className="state-title">S0</div>
                  <div className="state-desc">Estado Inicial</div>
                </div>
              </div>
              <div className="state-arrow">→</div>
              <div className="states-row">
                <div className="state">
                  <div className="state-content">
                    <div className="state-title">S1</div>
                    <div className="state-desc">Identificador</div>
                    <div className="state-transitions">Letra → S1</div>
                  </div>
                </div>
                <div className="state">
                  <div className="state-content">
                    <div className="state-title">S2</div>
                    <div className="state-desc">Número</div>
                    <div className="state-transitions">Dígito → S2</div>
                  </div>
                </div>
                <div className="state">
                  <div className="state-content">
                    <div className="state-title">S3</div>
                    <div className="state-desc">Cadena</div>
                    <div className="state-transitions">Cualquier char → S3</div>
                  </div>
                </div>
                <div className="state">
                  <div className="state-content">
                    <div className="state-title">S4</div>
                    <div className="state-desc">Símbolo</div>
                    <div className="state-transitions">Acepta inmediato</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="code-example">
            <h3>Implementación del AFD</h3>
            <pre><code>{`private scanToken(): void {
    const c = this.advance();
    
    switch (c) {
        case '{': case '}': case '[': case ']': 
            this.handleBrackets(c);
            break;
        case ',': case ';': case ':': case '=':
            this.addToken(this.getSymbolType(c));
            break;
        case '"': case "'":
            this.string(c);
            break;
        default:
            if (this.isDigit(c)) {
                this.number();
            } else if (this.isAlpha(c)) {
                this.identifier();
            } else {
                this.addError(\`Carácter inesperado: \${c}\`);
            }
            break;
    }
}`}</code></pre>
          </div>
        </div>
      )
    },
    {
      id: 'implementacion',
      title: 'Implementación',
      icon: <FaCode />,
      content: (
        <div className="manual-section">
          <h2>⚙️ Implementación del Analizador Léxico</h2>
          
          <div className="implementation-details">
            <div className="detail-card">
              <h3>Clase Lexer</h3>
              <p>El analizador está implementado en TypeScript con las siguientes características:</p>
              <ul>
                <li><strong>Posicionamiento preciso:</strong> Línea y columna de cada token</li>
                <li><strong>Validación de brackets:</strong> Verificación de estructura</li>
                <li><strong>Manejo de errores:</strong> Detección y reporte detallado</li>
                <li><strong>Palabras reservadas:</strong> Reconocimiento automático</li>
              </ul>
            </div>

            <div className="detail-card">
              <h3>Tipos de Tokens</h3>
              <div className="token-types">
                <div className="token-type">
                  <span className="token-example blue">Carrera</span>
                  <span className="token-name">Palabras Reservadas</span>
                </div>
                <div className="token-type">
                  <span className="token-example orange">"Texto"</span>
                  <span className="token-name">Cadenas</span>
                </div>
                <div className="token-type">
                  <span className="token-example purple">101</span>
                  <span className="token-name">Números</span>
                </div>
                <div className="token-type">
                  <span className="token-example green">{ } [ ] ( )</span>
                  <span className="token-name">Símbolos</span>
                </div>
              </div>
            </div>
          </div>

          <div className="architecture-diagram">
            <h3>Arquitectura del Sistema</h3>
            <div className="arch-diagram">
              <div className="arch-layer">
                <div className="arch-component">Frontend (React)</div>
                <div className="arch-arrow">HTTP/REST</div>
                <div className="arch-component">Backend (Express)</div>
              </div>
              <div className="arch-layer">
                <div className="arch-component">Editor + UI</div>
                <div className="arch-arrow">API Calls</div>
                <div className="arch-component">Analizador Léxico</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'errores',
      title: 'Manejo de Errores',
      icon: <FaExclamationTriangle />,
      content: (
        <div className="manual-section">
          <h2>🚨 Manejo de Errores Léxicos</h2>
          
          <div className="error-types">
            <div className="error-type-card">
              <div className="error-icon">⚠️</div>
              <h3>Caracteres Inesperados</h3>
              <p>Símbolos no reconocidos por el lenguaje</p>
              <div className="error-example">
                <code>Curso: @101 {'{'}</code>
                <div className="error-message">Error: Carácter inesperado: @</div>
              </div>
            </div>

            <div className="error-type-card">
              <div className="error-icon">📝</div>
              <h3>Cadenas No Terminadas</h3>
              <p>Comillas de apertura sin cierre correspondiente</p>
              <div className="error-example">
                <code>Nombre: "Matemática Básica</code>
                <div className="error-message">Error: Cadena no terminada</div>
              </div>
            </div>

            <div className="error-type-card">
              <div className="error-icon">🔗</div>
              <h3>Brackets Desbalanceados</h3>
              <p>Símbolos de apertura sin cierre correspondiente</p>
              <div className="error-example">
                <code>Carrera: "Ingeniería" [ {'{'}</code>
                <div className="error-message">Error: Símbolo de apertura {'{'}' no fue cerrado</div>
              </div>
            </div>
          </div>

          <div className="error-structure">
            <h3>Estructura de Error</h3>
            <pre><code>{`interface LexerError {
    message: string;    // Descripción del error
    line: number;       // Línea donde ocurrió
    column: number;     // Columna donde ocurrió
}`}</code></pre>
          </div>
        </div>
      )
    },
    {
      id: 'tecnologias',
      title: 'Tecnologías',
      icon: <FaTools />,
      content: (
        <div className="manual-section">
          <h2>🛠️ Stack Tecnológico</h2>
          
          <div className="tech-stack">
            <div className="tech-category">
              <h3>Frontend</h3>
              <div className="tech-items">
                <div className="tech-item">
                  <FaDesktop />
                  <span>React 19</span>
                </div>
                <div className="tech-item">
                  <FaCode />
                  <span>TypeScript</span>
                </div>
                <div className="tech-item">
                  <FaTools />
                  <span>Vite</span>
                </div>
                <div className="tech-item">
                  <FaDatabase />
                  <span>SCSS</span>
                </div>
              </div>
            </div>

            <div className="tech-category">
              <h3>Backend</h3>
              <div className="tech-items">
                <div className="tech-item">
                  <FaServer />
                  <span>Node.js</span>
                </div>
                <div className="tech-item">
                  <FaCogs />
                  <span>Express</span>
                </div>
                <div className="tech-item">
                  <FaCode />
                  <span>TypeScript</span>
                </div>
              </div>
            </div>

            <div className="tech-category">
              <h3>Herramientas</h3>
              <div className="tech-items">
                <div className="tech-item">
                  <FaTools />
                  <span>ESLint</span>
                </div>
                <div className="tech-item">
                  <FaCode />
                  <span>Git</span>
                </div>
              </div>
            </div>
          </div>

          <div className="performance-metrics">
            <h3>Métricas de Rendimiento</h3>
            <div className="metrics-grid">
              <div className="metric">
                <div className="metric-value">⚡</div>
                <div className="metric-label">Análisis en tiempo real</div>
              </div>
              <div className="metric">
                <div className="metric-value">🎯</div>
                <div className="metric-label">100% precisión en tokens</div>
              </div>
              <div className="metric">
                <div className="metric-value">🔍</div>
                <div className="metric-label">Detección precisa de errores</div>
              </div>
              <div className="metric">
                <div className="metric-value">📱</div>
                <div className="metric-label">Interfaz responsiva</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'conclusiones',
      title: 'Conclusiones',
      icon: <FaLightbulb />,
      content: (
        <div className="manual-section">
          <h2>🎉 Logros y Conclusiones</h2>
          
          <div className="achievements">
            <div className="achievement-card">
              <FaLightbulb />
              <h3>Implementación Exitosa</h3>
              <p>Analizador léxico robusto con AFD funcional</p>
            </div>
            <div className="achievement-card">
              <FaCheckCircle />
              <h3>Interfaz Moderna</h3>
              <p>Editor web intuitivo con resaltado de sintaxis</p>
            </div>
            <div className="achievement-card">
              <FaExclamationTriangle />
              <h3>Manejo de Errores</h3>
              <p>Detección precisa con posicionamiento exacto</p>
            </div>
            <div className="achievement-card">
              <FaServer />
              <h3>Arquitectura Escalable</h3>
              <p>Código modular y mantenible</p>
            </div>
          </div>

          <div className="future-extensions">
            <h3>Extensiones Futuras</h3>
            <div className="extensions-list">
              <div className="extension-item">
                <span className="extension-icon">📊</span>
                <span>Análisis sintáctico (Parser)</span>
              </div>
              <div className="extension-item">
                <span className="extension-icon">🧠</span>
                <span>Análisis semántico</span>
              </div>
              <div className="extension-item">
                <span className="extension-icon">⚡</span>
                <span>Generación de código</span>
              </div>
              <div className="extension-item">
                <span className="extension-icon">🚀</span>
                <span>Optimizaciones de rendimiento</span>
              </div>
            </div>
          </div>

          <div className="manual-footer">
            <p><strong>Documento generado automáticamente por el sistema de análisis léxico</strong></p>
            <p>Fecha: 2025 | Versión: 1.0</p>
          </div>
        </div>
      )
    }
  ];

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % sections.length);
  };

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + sections.length) % sections.length);
  };

  if (!showTechnicalManual) return null;

  return (
    <div className="technical-manual-overlay">
      <div className="technical-manual-modal">
        <div className="manual-header">
          <div className="manual-title">
            <FaBook /> Manual Técnico - Analizador Léxico
          </div>
          <button 
            onClick={() => setShowTechnicalManual(false)}
            className="manual-close-btn"
          >
            <FaTimes />
          </button>
        </div>

        <div className="manual-navigation">
          <button 
            onClick={prevSection}
            className="nav-btn"
            disabled={currentSection === 0}
          >
            <FaChevronLeft /> Anterior
          </button>
          
          <div className="section-indicators">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(index)}
                className={`section-indicator ${index === currentSection ? 'active' : ''}`}
                title={section.title}
              >
                {section.icon}
              </button>
            ))}
          </div>

          <button 
            onClick={nextSection}
            className="nav-btn"
            disabled={currentSection === sections.length - 1}
          >
            Siguiente <FaChevronRight />
          </button>
        </div>

        <div className="manual-content">
          <div className="section-header">
            <h1>{sections[currentSection].icon} {sections[currentSection].title}</h1>
            <div className="section-progress">
              {currentSection + 1} de {sections.length}
            </div>
          </div>
          
          <div className="section-content">
            {sections[currentSection].content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalManual;
