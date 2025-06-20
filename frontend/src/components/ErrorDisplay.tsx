import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

const ErrorDisplay: React.FC = () => {
  const { state: { apiErrors }, clearApiErrors } = useAppContext();

  if (apiErrors.length === 0) {
    return null;
  }

  return (
    <div className="error-display">
      <div className="error-display__header">
        <FaExclamationTriangle className="error-display__icon" />
        <span className="error-display__title">Errores de API ({apiErrors.length})</span>
        <button 
          onClick={clearApiErrors}
          className="error-display__clear-btn"
          title="Limpiar errores"
        >
          <FaTimes />
        </button>
      </div>
      <div className="error-display__content">
        {apiErrors.map((error, index) => (
          <div key={index} className="error-display__item">
            <span className="error-display__message">{error}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorDisplay; 