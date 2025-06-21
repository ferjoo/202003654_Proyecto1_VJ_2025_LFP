import React from 'react';
import { FaGraduationCap, FaDownload, FaArrowLeft } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

interface Curso {
  codigo: string;
  nombre: string;
  creditos?: number;
  prerrequisitos: string[];
  semestre: number;
}

interface Semestre {
  semestre: number;
  cursos: Curso[];
}

interface Pensum {
  carrera: string;
  semestres: Semestre[];
  cursos: Curso[];
}

const PensumView: React.FC = () => {
  const {
    state: { editorContent, selectedCourse },
    setCurrentView,
    setSelectedCourse,
  } = useAppContext();

  // Función simple para parsear el texto del editor
  const parsePensumFromText = (text: string): Pensum | null => {
    try {
      const lines = text.split('\n');
      const pensum: Pensum = {
        carrera: '',
        semestres: [],
        cursos: []
      };

      let currentSemestre: number | null = null;
      let currentCurso: Curso | null = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Buscar carrera
        if (line.startsWith('Carrera:')) {
          const match = line.match(/Carrera:\s*"([^"]+)"/);
          if (match) {
            pensum.carrera = match[1];
          }
        }
        
        // Buscar semestre
        if (line.startsWith('Semestre:')) {
          const match = line.match(/Semestre:\s*(\d+)/);
          if (match) {
            currentSemestre = parseInt(match[1]);
            pensum.semestres.push({
              semestre: currentSemestre,
              cursos: []
            });
          }
        }
        
        // Buscar curso
        if (line.startsWith('Curso:')) {
          const match = line.match(/Curso:\s*(\d+)/);
          if (match && currentSemestre !== null) {
            currentCurso = {
              codigo: match[1],
              nombre: '',
              creditos: 0,
              prerrequisitos: [],
              semestre: currentSemestre
            };
          }
        }
        
        // Buscar nombre del curso
        if (line.startsWith('Nombre:') && currentCurso) {
          const match = line.match(/Nombre:\s*"([^"]+)"/);
          if (match) {
            currentCurso.nombre = match[1];
          }
        }
        
        // Buscar área/créditos
        if ((line.startsWith('Area:') || line.startsWith('Creditos:')) && currentCurso) {
          const match = line.match(/(?:Area|Creditos):\s*(\d+)/);
          if (match) {
            currentCurso.creditos = parseInt(match[1]);
          }
        }
        
        // Buscar prerrequisitos
        if (line.startsWith('Prerrequisitos:') && currentCurso) {
          const match = line.match(/Prerrequisitos:\s*\(([^)]*)\)/);
          if (match && match[1].trim()) {
            currentCurso.prerrequisitos = match[1].split(',').map(p => p.trim()).filter(p => p);
          }
        }
        
        // Si encontramos el cierre del curso, agregarlo
        if (line === '}' && currentCurso) {
          pensum.cursos.push(currentCurso);
          const semestreIndex = pensum.semestres.findIndex(s => s.semestre === currentSemestre);
          if (semestreIndex !== -1) {
            pensum.semestres[semestreIndex].cursos.push(currentCurso);
          }
          currentCurso = null;
        }
      }

      return pensum.carrera && pensum.semestres.length > 0 ? pensum : null;
    } catch (error) {
      console.error('Error parsing pensum:', error);
      return null;
    }
  };

  const pensum = parsePensumFromText(editorContent);

  if (!pensum) {
    return (
      <div className="pensum-view-container">
        <div className="pensum-view-header">
          <button 
            onClick={() => setCurrentView('tokens')}
            className="back-button"
          >
            <FaArrowLeft /> Volver
          </button>
          <h2>Pensum</h2>
        </div>
        <div className="pensum-view-content">
          <div className="no-pensum-message">
            <FaGraduationCap />
            <h3>No hay pensum disponible</h3>
            <p>Analiza el código primero para generar el pensum</p>
          </div>
        </div>
      </div>
    );
  }

  // Obtener todos los semestres ordenados
  const semestres = pensum.semestres.sort((a, b) => a.semestre - b.semestre);
  
  // Obtener el número máximo de cursos por semestre para el layout de la tabla
  const maxCursosPorSemestre = Math.max(...semestres.map(s => s.cursos.length));
  
  // Crear un mapa de cursos para búsqueda rápida
  const cursosMap = new Map<string, Curso>();
  pensum.cursos.forEach(curso => {
    cursosMap.set(curso.codigo, curso);
  });

  // Función para obtener todos los prerrequisitos de un curso (incluyendo los de los prerrequisitos)
  const getPrerrequisitosCompletos = (codigoCurso: string, visitados: Set<string> = new Set()): Set<string> => {
    if (visitados.has(codigoCurso)) return new Set();
    
    visitados.add(codigoCurso);
    const curso = cursosMap.get(codigoCurso);
    if (!curso) return new Set();
    
    const prerrequisitos = new Set<string>();
    curso.prerrequisitos.forEach(prereq => {
      prerrequisitos.add(prereq);
      const prereqCompletos = getPrerrequisitosCompletos(prereq, new Set(visitados));
      prereqCompletos.forEach(p => prerrequisitos.add(p));
    });
    
    return prerrequisitos;
  };

  // Función para determinar si un curso debe estar resaltado
  const isCursoResaltado = (codigoCurso: string): boolean => {
    if (!selectedCourse) return false;
    if (codigoCurso === selectedCourse) return true;
    
    const prerrequisitosCompletos = getPrerrequisitosCompletos(selectedCourse);
    return prerrequisitosCompletos.has(codigoCurso);
  };

  // Función para descargar el pensum como CSV
  const descargarPensum = () => {
    let csvContent = 'Semestre,Código,Nombre,Créditos,Prerrequisitos\n';
    
    semestres.forEach(semestre => {
      semestre.cursos.forEach(curso => {
        const prerrequisitos = curso.prerrequisitos.length > 0 
          ? curso.prerrequisitos.join(', ') 
          : 'Ninguno';
        csvContent += `${semestre.semestre},${curso.codigo},"${curso.nombre}",${curso.creditos || 0},"${prerrequisitos}"\n`;
      });
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pensum_${pensum.carrera.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pensum-view-container">
      <div className="pensum-view-header">
        <button 
          onClick={() => setCurrentView('tokens')}
          className="back-button"
        >
          <FaArrowLeft /> Volver
        </button>
        <div className="pensum-view-title">
          <FaGraduationCap />
          <h2>Pensum: {pensum.carrera}</h2>
        </div>
        <button 
          onClick={descargarPensum}
          className="download-button"
        >
          <FaDownload /> Descargar CSV
        </button>
      </div>
      
      <div className="pensum-view-content">
        <div className="pensum-instructions">
          <p>Haz clic en cualquier curso para ver sus prerrequisitos resaltados en verde</p>
        </div>
        
        <div className="pensum-table-container">
          <table className="pensum-table">
            <thead>
              <tr>
                <th>Semestre</th>
                {Array.from({ length: maxCursosPorSemestre }, (_, i) => (
                  <th key={i}>Curso {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {semestres.map(semestre => (
                <tr key={semestre.semestre}>
                  <td className="semestre-cell">
                    <strong>Semestre {semestre.semestre.toString().padStart(2, '0')}</strong>
                  </td>
                  {Array.from({ length: maxCursosPorSemestre }, (_, i) => {
                    const curso = semestre.cursos[i];
                    if (!curso) {
                      return <td key={i} className="empty-cell"></td>;
                    }
                    
                    const isResaltado = isCursoResaltado(curso.codigo);
                    const isSelected = selectedCourse === curso.codigo;
                    
                    return (
                      <td key={i} className="curso-cell">
                        <div 
                          className={`curso-card ${isResaltado ? 'resaltado' : ''} ${isSelected ? 'seleccionado' : ''}`}
                          onClick={() => setSelectedCourse(isSelected ? null : curso.codigo)}
                        >
                          <div className="curso-codigo">{curso.codigo}</div>
                          <div className="curso-nombre">{curso.nombre}</div>
                          {curso.creditos && (
                            <div className="curso-creditos">{curso.creditos} créditos</div>
                          )}
                          {curso.prerrequisitos.length > 0 && (
                            <div className="curso-prerrequisitos">
                              Prerreq: {curso.prerrequisitos.join(', ')}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PensumView; 