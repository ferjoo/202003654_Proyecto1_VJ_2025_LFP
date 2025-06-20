import React, { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaUser, FaPlay, FaCode, FaExclamationTriangle, FaBook, FaKeyboard, FaMouse, FaLightbulb, FaCheckCircle, FaFileAlt, FaDownload, FaUpload, FaTrash, FaEye, FaTable, FaDesktop } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const UserManual: React.FC = () => {
  const { state: { showUserManual }, setShowUserManual } = useAppContext();
  const [currentSection, setCurrentSection] = useState(0);

  const sections: Section[] = [
    {
      id: 'introduccion',
      title: 'Bienvenido',
      icon: <FaUser />,
      content: (
        <div className="manual-section">
          <h2>🎉 ¡Bienvenido al Analizador Léxico de Pensums!</h2>
          <p>Esta aplicación te permite crear y analizar <strong>pensums universitarios</strong> usando un lenguaje especializado. ¡Es súper fácil de usar!</p>
          
          <div className="welcome-features">
            <div className="welcome-card">
              <FaCode />
              <h3>Editor Inteligente</h3>
              <p>Escribe código con resaltado de sintaxis en tiempo real</p>
            </div>
            <div className="welcome-card">
              <FaPlay />
              <h3>Análisis Instantáneo</h3>
              <p>Obtén resultados inmediatos con un solo clic</p>
            </div>
            <div className="welcome-card">
              <FaEye />
              <h3>Visualización Clara</h3>
              <p>Ve todos los tokens organizados en una tabla</p>
            </div>
            <div className="welcome-card">
              <FaExclamationTriangle />
              <h3>Detección de Errores</h3>
              <p>Encuentra y corrige errores fácilmente</p>
            </div>
          </div>

          <div className="quick-start">
            <h3>🚀 Inicio Rápido</h3>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Escribe tu código</h4>
                  <p>Usa el editor para escribir tu pensum</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Haz clic en "Analizar"</h4>
                  <p>El sistema procesará tu código</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Revisa los resultados</h4>
                  <p>Ve los tokens o corrige errores</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'interfaz',
      title: 'Interfaz',
      icon: <FaDesktop />,
      content: (
        <div className="manual-section">
          <h2>🖥️ Conoce la Interfaz</h2>
          <p>La aplicación está diseñada para ser <strong>intuitiva y fácil de usar</strong>. Aquí te explico cada parte:</p>
          
          <div className="interface-overview">
            <div className="interface-section">
              <h3>📝 Barra Superior</h3>
              <div className="interface-items">
                <div className="interface-item">
                  <FaFileAlt />
                  <div>
                    <strong>Home</strong>
                    <p>Vista principal con tabla de tokens</p>
                  </div>
                </div>
                <div className="interface-item">
                  <FaExclamationTriangle />
                  <div>
                    <strong>Error Report</strong>
                    <p>Vista de errores encontrados</p>
                  </div>
                </div>
                <div className="interface-item">
                  <FaDownload />
                  <div>
                    <strong>Archivo</strong>
                    <p>Menú para cargar/guardar archivos</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="interface-section">
              <h3>✏️ Editor de Código</h3>
              <div className="editor-features">
                <div className="feature-item">
                  <span className="feature-icon">🎨</span>
                  <span>Resaltado de sintaxis en tiempo real</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <span>Contador de líneas automático</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📱</span>
                  <span>Diseño responsivo</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Scroll sincronizado</span>
                </div>
              </div>
            </div>

            <div className="interface-section">
              <h3>📋 Tabla de Resultados</h3>
              <div className="table-features">
                <div className="table-feature">
                  <FaTable />
                  <div>
                    <strong>Vista de Tokens</strong>
                    <p>Muestra todos los elementos léxicos encontrados</p>
                  </div>
                </div>
                <div className="table-feature">
                  <FaExclamationTriangle />
                  <div>
                    <strong>Vista de Errores</strong>
                    <p>Lista detallada de errores con posiciones</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="color-guide">
            <h3>🎨 Guía de Colores</h3>
            <div className="color-items">
              <div className="color-item">
                <div className="color-sample blue"></div>
                <span>Palabras reservadas (Carrera, Curso, etc.)</span>
              </div>
              <div className="color-item">
                <div className="color-sample orange"></div>
                <span>Cadenas de texto ("Hola mundo")</span>
              </div>
              <div className="color-item">
                <div className="color-sample purple"></div>
                <span>Números y booleanos (101, true)</span>
              </div>
              <div className="color-item">
                <div className="color-sample green"></div>
                <span>Símbolos ({ }, [ ], :, ;)</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'lenguaje',
      title: 'Lenguaje',
      icon: <FaCode />,
      content: (
        <div className="manual-section">
          <h2>📚 El Lenguaje de Pensums</h2>
          <p>Nuestro lenguaje especializado es <strong>sencillo y poderoso</strong>. Te permite definir pensums universitarios de forma clara y estructurada.</p>
          
          <div className="language-basics">
            <h3>🏗️ Estructura Básica</h3>
            <div className="structure-example">
              <pre><code>{`Carrera: "Nombre de la Carrera" [
    Semestre: 01 {
        Curso: 101 {
            Nombre: "Nombre del Curso";
            Codigo: "COD101";
            Creditos: 4;
            Area: "Área del Curso";
            Descripcion: "Descripción del curso";
            Prerrequisitos: ();
            Obligatorio: true;
        }
    }
]`}</code></pre>
            </div>
          </div>

          <div className="language-elements">
            <h3>🧩 Elementos del Lenguaje</h3>
            <div className="elements-grid">
              <div className="element-card">
                <h4>Palabras Reservadas</h4>
                <div className="element-examples">
                  <code>Carrera</code>
                  <code>Semestre</code>
                  <code>Curso</code>
                  <code>Nombre</code>
                  <code>Creditos</code>
                  <code>Prerrequisitos</code>
                </div>
              </div>
              <div className="element-card">
                <h4>Símbolos Especiales</h4>
                <div className="element-examples">
                  <code>{ }</code>
                  <code>[ ]</code>
                  <code>( )</code>
                  <code>:</code>
                  <code>;</code>
                  <code>,</code>
                </div>
              </div>
              <div className="element-card">
                <h4>Tipos de Datos</h4>
                <div className="element-examples">
                  <code>"Texto"</code>
                  <code>101</code>
                  <code>true</code>
                  <code>false</code>
                </div>
              </div>
            </div>
          </div>

          <div className="writing-tips">
            <h3>💡 Consejos para Escribir</h3>
            <div className="tips-list">
              <div className="tip">
                <div className="tip-icon">✅</div>
                <div>
                  <strong>Usa comillas dobles</strong> para cadenas de texto
                </div>
              </div>
              <div className="tip">
                <div className="tip-icon">✅</div>
                <div>
                  <strong>Termina las líneas</strong> con punto y coma (;)
                </div>
              </div>
              <div className="tip">
                <div className="tip-icon">✅</div>
                <div>
                  <strong>Cierra todos los brackets</strong> que abras
                </div>
              </div>
              <div className="tip">
                <div className="tip-icon">✅</div>
                <div>
                  <strong>Usa indentación</strong> para mejor legibilidad
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'uso',
      title: 'Cómo Usar',
      icon: <FaPlay />,
      content: (
        <div className="manual-section">
          <h2>🎯 Guía Paso a Paso</h2>
          <p>Sigue estos pasos para <strong>crear y analizar</strong> tu pensum universitario:</p>
          
          <div className="usage-steps">
            <div className="usage-step">
              <div className="step-header">
                <div className="step-number">1</div>
                <h3>Escribir el Código</h3>
              </div>
              <div className="step-content">
                <p>En el editor de texto, escribe tu pensum usando la sintaxis del lenguaje:</p>
                <div className="code-example">
                  <pre><code>{`Carrera: "Ingeniería en Ciencias y Sistemas" [
    Semestre: 01 {
        Curso: 101 {
            Nombre: "Matemática Básica 1";
            Creditos: 4;
            Prerrequisitos: ();
        }
    }
]`}</code></pre>
                </div>
                <div className="step-tips">
                  <strong>💡 Consejos:</strong>
                  <ul>
                    <li>Comienza con la estructura básica</li>
                    <li>Usa el resaltado de sintaxis como guía</li>
                    <li>Guarda tu trabajo frecuentemente</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="usage-step">
              <div className="step-header">
                <div className="step-number">2</div>
                <h3>Analizar el Código</h3>
              </div>
              <div className="step-content">
                <p>Haz clic en el botón <strong>"Analizar"</strong> ubicado en la esquina inferior derecha:</p>
                <div className="button-example">
                  <button className="analyze-btn-example">
                    <FaPlay /> Analizar
                  </button>
                </div>
                <div className="step-tips">
                  <strong>⏱️ Durante el análisis:</strong>
                  <ul>
                    <li>Verás un indicador "Analizando..."</li>
                    <li>El sistema procesará tu código</li>
                    <li>Los resultados aparecerán automáticamente</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="usage-step">
              <div className="step-header">
                <div className="step-number">3</div>
                <h3>Revisar Resultados</h3>
              </div>
              <div className="step-content">
                <div className="results-options">
                  <div className="result-option">
                    <h4>✅ Sin Errores</h4>
                    <p>Si tu código es correcto, verás:</p>
                    <ul>
                      <li>Tabla de tokens organizada</li>
                      <li>Información de línea y columna</li>
                      <li>Tipos de tokens identificados</li>
                    </ul>
                  </div>
                  <div className="result-option">
                    <h4>❌ Con Errores</h4>
                    <p>Si hay errores, verás:</p>
                    <ul>
                      <li>Lista de errores específicos</li>
                      <li>Posición exacta de cada error</li>
                      <li>Descripción clara del problema</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="usage-step">
              <div className="step-header">
                <div className="step-number">4</div>
                <h3>Corregir y Mejorar</h3>
              </div>
              <div className="step-content">
                <p>Si hay errores, corrígelos en el editor y vuelve a analizar:</p>
                <div className="correction-tips">
                  <div className="correction-tip">
                    <strong>🔧 Errores Comunes:</strong>
                    <ul>
                      <li>Cadenas no terminadas: <code>"Texto"</code></li>
                      <li>Brackets desbalanceados: <code>{`{ } ]`}</code></li>
                      <li>Caracteres inválidos: <code>@ # $</code></li>
                    </ul>
                  </div>
                  <div className="correction-tip">
                    <strong>🎯 Consejos de Corrección:</strong>
                    <ul>
                      <li>Lee el mensaje de error completo</li>
                      <li>Ve a la línea y columna indicada</li>
                      <li>Corrige un error a la vez</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'archivos',
      title: 'Archivos',
      icon: <FaFileAlt />,
      content: (
        <div className="manual-section">
          <h2>📁 Manejo de Archivos</h2>
          <p>La aplicación te permite <strong>guardar y cargar</strong> tus pensums para trabajar con ellos más tarde.</p>
          
          <div className="file-operations">
            <div className="file-operation">
              <div className="operation-header">
                <FaUpload />
                <h3>Cargar Archivo</h3>
              </div>
              <div className="operation-steps">
                <div className="operation-step">
                  <div className="step-number">1</div>
                  <p>Haz clic en <strong>"Archivo"</strong> en la barra superior</p>
                </div>
                <div className="operation-step">
                  <div className="step-number">2</div>
                  <p>Selecciona <strong>"Cargar Archivo"</strong></p>
                </div>
                <div className="operation-step">
                  <div className="step-number">3</div>
                  <p>Elige un archivo <code>.plfp</code> de tu computadora</p>
                </div>
                <div className="operation-step">
                  <div className="step-number">4</div>
                  <p>El contenido se cargará en el editor</p>
                </div>
              </div>
              <div className="file-tips">
                <strong>📋 Formato de archivo:</strong> Solo archivos <code>.plfp</code> (Pensum Language File)
              </div>
            </div>

            <div className="file-operation">
              <div className="operation-header">
                <FaDownload />
                <h3>Guardar Archivo</h3>
              </div>
              <div className="operation-steps">
                <div className="operation-step">
                  <div className="step-number">1</div>
                  <p>Haz clic en <strong>"Archivo"</strong> en la barra superior</p>
                </div>
                <div className="operation-step">
                  <div className="step-number">2</div>
                  <p>Selecciona <strong>"Guardar Archivo"</strong></p>
                </div>
                <div className="operation-step">
                  <div className="step-number">3</div>
                  <p>El archivo se descargará automáticamente</p>
                </div>
              </div>
              <div className="file-tips">
                <strong>💾 Guardado automático:</strong> El archivo se guarda como <code>pensum.plfp</code>
              </div>
            </div>

            <div className="file-operation">
              <div className="operation-header">
                <FaTrash />
                <h3>Limpiar Editor</h3>
              </div>
              <div className="operation-steps">
                <div className="operation-step">
                  <div className="step-number">1</div>
                  <p>Haz clic en <strong>"Archivo"</strong> en la barra superior</p>
                </div>
                <div className="operation-step">
                  <div className="step-number">2</div>
                  <p>Selecciona <strong>"Limpiar Editor"</strong></p>
                </div>
                <div className="operation-step">
                  <div className="step-number">3</div>
                  <p>El editor se vaciará completamente</p>
                </div>
              </div>
              <div className="file-tips">
                <strong>⚠️ Atención:</strong> Esta acción no se puede deshacer
              </div>
            </div>
          </div>

          <div className="file-examples">
            <h3>📝 Ejemplos de Archivos</h3>
            <div className="example-files">
              <div className="example-file">
                <h4>Pensum Simple</h4>
                <pre><code>{`Carrera: "Ingeniería" [
    Semestre: 01 {
        Curso: 101 {
            Nombre: "Matemática";
            Creditos: 4;
        }
    }
]`}</code></pre>
              </div>
              <div className="example-file">
                <h4>Pensum Completo</h4>
                <pre><code>{`Carrera: "Ciencias y Sistemas" [
    Semestre: 01 {
        Curso: 101 {
            Nombre: "Matemática Básica 1";
            Codigo: "MAT101";
            Creditos: 4;
            Area: "Matemática";
            Prerrequisitos: ();
            Obligatorio: true;
        }
    }
]`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'errores',
      title: 'Errores',
      icon: <FaExclamationTriangle />,
      content: (
        <div className="manual-section">
          <h2>🚨 Solución de Errores</h2>
          <p>Aquí te explico los <strong>errores más comunes</strong> y cómo solucionarlos:</p>
          
          <div className="error-guide">
            <div className="error-category">
              <h3>⚠️ Errores de Sintaxis</h3>
              <div className="error-examples">
                <div className="error-example">
                  <div className="error-title">Cadena No Terminada</div>
                  <div className="error-code">
                    <code>Nombre: "Matemática Básica"</code>
                  </div>
                  <div className="error-solution">
                    <strong>Solución:</strong> Agrega la comilla de cierre
                    <code>Nombre: "Matemática Básica"</code>
                  </div>
                </div>
                <div className="error-example">
                  <div className="error-title">Brackets Desbalanceados</div>
                  <div className="error-code">
                    <code>Carrera: "Ingeniería" [ {'{'}</code>
                  </div>
                  <div className="error-solution">
                    <strong>Solución:</strong> Cierra todos los brackets
                    <code>Carrera: "Ingeniería" [ {'{ } ]'}</code>
                  </div>
                </div>
                <div className="error-example">
                  <div className="error-title">Carácter Inválido</div>
                  <div className="error-code">
                    <code>Curso: @101 {'{'}</code>
                  </div>
                  <div className="error-solution">
                    <strong>Solución:</strong> Usa solo caracteres válidos
                    <code>Curso: 101 {'{'}</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="error-category">
              <h3>🔧 Errores de Estructura</h3>
              <div className="error-examples">
                <div className="error-example">
                  <div className="error-title">Falta Punto y Coma</div>
                  <div className="error-code">
                    <code>Nombre: "Matemática"</code>
                  </div>
                  <div className="error-solution">
                    <strong>Solución:</strong> Agrega punto y coma al final
                    <code>Nombre: "Matemática";</code>
                  </div>
                </div>
                <div className="error-example">
                  <div className="error-title">Palabra Reservada Incorrecta</div>
                  <div className="error-code">
                    <code>curso: 101 {'{'}</code>
                  </div>
                  <div className="error-solution">
                    <strong>Solución:</strong> Usa mayúsculas para palabras reservadas
                    <code>Curso: 101 {'{'}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="error-tips">
            <h3>💡 Consejos para Evitar Errores</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">📝</div>
                <h4>Revisa la Sintaxis</h4>
                <p>Usa el resaltado de colores como guía visual</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🔍</div>
                <h4>Lee los Mensajes</h4>
                <p>Los errores te dicen exactamente qué está mal</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">⚡</div>
                <h4>Analiza Frecuentemente</h4>
                <p>No esperes a terminar todo para revisar</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">📚</div>
                <h4>Usa Ejemplos</h4>
                <p>Basarte en código que ya funciona</p>
              </div>
            </div>
          </div>

          <div className="error-workflow">
            <h3>🔄 Flujo de Corrección</h3>
            <div className="workflow-steps">
              <div className="workflow-step">
                <div className="workflow-number">1</div>
                <p>Lee el mensaje de error completo</p>
              </div>
              <div className="workflow-arrow">→</div>
              <div className="workflow-step">
                <div className="workflow-number">2</div>
                <p>Ve a la línea y columna indicada</p>
              </div>
              <div className="workflow-arrow">→</div>
              <div className="workflow-step">
                <div className="workflow-number">3</div>
                <p>Identifica el problema específico</p>
              </div>
              <div className="workflow-arrow">→</div>
              <div className="workflow-step">
                <div className="workflow-number">4</div>
                <p>Corrige el error</p>
              </div>
              <div className="workflow-arrow">→</div>
              <div className="workflow-step">
                <div className="workflow-number">5</div>
                <p>Vuelve a analizar</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'consejos',
      title: 'Consejos',
      icon: <FaLightbulb />,
      content: (
        <div className="manual-section">
          <h2>💡 Consejos y Mejores Prácticas</h2>
          <p>Aquí tienes <strong>consejos útiles</strong> para aprovechar al máximo la aplicación:</p>
          
          <div className="tips-sections">
            <div className="tips-section">
              <h3>🎨 Organización del Código</h3>
              <div className="tips-list">
                <div className="tip-item">
                  <div className="tip-icon">📋</div>
                  <div>
                    <strong>Usa indentación consistente</strong>
                    <p>Mantén una estructura clara y legible</p>
                  </div>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">🏷️</div>
                  <div>
                    <strong>Nombra descriptivamente</strong>
                    <p>Usa nombres claros para cursos y carreras</p>
                  </div>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">📝</div>
                  <div>
                    <strong>Agrega descripciones</strong>
                    <p>Incluye información útil en cada curso</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tips-section">
              <h3>⚡ Productividad</h3>
              <div className="tips-list">
                <div className="tip-item">
                  <div className="tip-icon">💾</div>
                  <div>
                    <strong>Guarda frecuentemente</strong>
                    <p>No pierdas tu trabajo</p>
                  </div>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">🔍</div>
                  <div>
                    <strong>Analiza en pequeños pasos</strong>
                    <p>Es más fácil corregir errores pequeños</p>
                  </div>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">📚</div>
                  <div>
                    <strong>Usa plantillas</strong>
                    <p>Crea plantillas para reutilizar</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tips-section">
              <h3>🎯 Uso Eficiente</h3>
              <div className="tips-list">
                <div className="tip-item">
                  <div className="tip-icon">🎨</div>
                  <div>
                    <strong>Aprovecha el resaltado</strong>
                    <p>Los colores te ayudan a identificar elementos</p>
                  </div>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">📊</div>
                  <div>
                    <strong>Revisa la tabla de tokens</strong>
                    <p>Verifica que todo se reconozca correctamente</p>
                  </div>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">🔄</div>
                  <div>
                    <strong>Itera y mejora</strong>
                    <p>Refina tu código paso a paso</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="advanced-tips">
            <h3>🚀 Consejos Avanzados</h3>
            <div className="advanced-tips-grid">
              <div className="advanced-tip">
                <h4>📁 Organización de Archivos</h4>
                <ul>
                  <li>Crea un archivo por carrera</li>
                  <li>Usa nombres descriptivos</li>
                  <li>Mantén una estructura consistente</li>
                </ul>
              </div>
              <div className="advanced-tip">
                <h4>🔧 Optimización</h4>
                <ul>
                  <li>Elimina código innecesario</li>
                  <li>Usa abreviaciones cuando sea posible</li>
                  <li>Mantén el código limpio</li>
                </ul>
              </div>
              <div className="advanced-tip">
                <h4>📈 Escalabilidad</h4>
                <ul>
                  <li>Planifica la estructura desde el inicio</li>
                  <li>Usa patrones consistentes</li>
                  <li>Documenta tus decisiones</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="manual-footer">
            <h3>🎉 ¡Disfruta Usando la Aplicación!</h3>
            <p>Con estos consejos, podrás crear pensums increíbles de forma rápida y eficiente.</p>
            <div className="footer-tips">
              <p><strong>💡 Recuerda:</strong> La práctica hace al maestro. ¡Sigue experimentando!</p>
              <p><strong>📞 Soporte:</strong> Si tienes dudas, revisa este manual o el manual técnico.</p>
            </div>
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

  if (!showUserManual) return null;

  return (
    <div className="user-manual-overlay">
      <div className="user-manual-modal">
        <div className="manual-header">
          <div className="manual-title">
            <FaUser /> Manual de Usuario - Analizador Léxico
          </div>
          <button 
            onClick={() => setShowUserManual(false)}
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

export default UserManual; 