import React from 'react';
import { FaExclamationTriangle, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

interface ErrorItem {
  message: string;
  line: number;
  column: number;
  type: string;
  source: string;
  id?: number;
}

const ErrorTable: React.FC = () => {
  const { state: { lexerErrors, apiErrors } } = useAppContext();

  const allErrors: ErrorItem[] = [
    ...lexerErrors.map(error => ({
      ...error,
      type: 'Lexer Error',
      source: 'lexer'
    })),
    ...apiErrors.map((error, index) => ({
      message: error,
      line: 0,
      column: 0,
      type: 'API Error',
      source: 'api',
      id: index
    }))
  ];

  if (allErrors.length === 0) {
    return (
      <div className="table-container">
        <div className="table-placeholder">
          <div className="placeholder-icon">✅</div>
          <h3>No hay errores</h3>
          <p>El código se analizó correctamente sin errores</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="errors-summary">
        <h3>Errores Encontrados ({allErrors.length})</h3>
        <p>Revisa la tabla para ver los detalles de cada error</p>
      </div>
      
      <table className="pensum-errors-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Tipo</th>
            <th>Ubicación</th>
            <th>Mensaje</th>
            <th>Origen</th>
          </tr>
        </thead>
        <tbody>
          {allErrors.map((error, index) => (
            <tr key={`${error.source}-${error.id || index}`} className={`error-row error-${error.source}`}>
              <td className="error-number">{index + 1}</td>
              <td>
                <span className={`error-type error-type-${error.source}`}>
                  {error.source === 'lexer' ? <FaExclamationTriangle /> : <FaTimes />}
                  {error.type}
                </span>
              </td>
              <td className="error-location">
                {error.line > 0 && error.column > 0 ? (
                  <span className="location-badge">
                    <FaMapMarkerAlt />
                    Línea {error.line}, Columna {error.column}
                  </span>
                ) : (
                  <span className="location-unknown">Ubicación desconocida</span>
                )}
              </td>
              <td className="error-message">{error.message}</td>
              <td>
                <span className={`error-source error-source-${error.source}`}>
                  {error.source === 'lexer' ? 'Análisis Léxico' : 'API'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="errors-debug">
        <details>
          <summary>Información de Depuración</summary>
          <pre>{JSON.stringify(allErrors, null, 2)}</pre>
        </details>
      </div>
    </div>
  );
};

export default ErrorTable; 