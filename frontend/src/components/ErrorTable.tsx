import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
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
      <table className="pensum-errors-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Tipo</th>
            <th>Fila</th>
            <th>Columna</th>
            <th>Mensaje</th>
            <th>Origen</th>
          </tr>
        </thead>
        <tbody>
          {allErrors.map((error, index) => (
            <tr key={`${error.source}-${error.id || index}`} className={`error-row error-${error.source}`}>
              <td>{index + 1}</td>
              <td>
                <span className={`error-type error-type-${error.source}`}>
                  {error.source === 'lexer' ? <FaExclamationTriangle /> : <FaTimes />}
                  {error.type}
                </span>
              </td>
              <td>{error.line > 0 ? error.line : '-'}</td>
              <td>{error.column > 0 ? error.column : '-'}</td>
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
    </div>
  );
};

export default ErrorTable; 