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

interface MultiCareerPensum {
  careers: Pensum[];
}

const PensumView: React.FC = () => {
  const {
    state: { editorContent, selectedCourse },
    setCurrentView,
    setSelectedCourse,
  } = useAppContext();

  // Función para parsear múltiples carreras del texto del editor
  const parseMultiCareerPensumFromText = (text: string): MultiCareerPensum | null => {
    try {
      console.log('Parsing text:', text.substring(0, 200) + '...');
      const lines = text.split('\n');
      const multiCareerPensum: MultiCareerPensum = {
        careers: []
      };

      let currentPensum: Pensum | null = null;
      let currentSemestre: number | null = null;
      let currentCurso: Curso | null = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Buscar nueva carrera
        if (line.startsWith('Carrera:')) {
          console.log('Found career:', line);
          // Si ya teníamos una carrera, guardarla
          if (currentPensum) {
            console.log('Saving previous career:', currentPensum.carrera);
            multiCareerPensum.careers.push(currentPensum);
          }
          
          const match = line.match(/Carrera:\s*"([^"]+)"/);
          if (match) {
            currentPensum = {
              carrera: match[1],
              semestres: [],
              cursos: []
            };
            currentSemestre = null;
            currentCurso = null;
            console.log('Created new career:', match[1]);
          }
        }
        
        // Si no tenemos una carrera actual, continuar
        if (!currentPensum) {
          continue;
        }
        
        // Buscar semestre
        if (line.startsWith('Semestre:')) {
          const match = line.match(/Semestre:\s*(\d+)/);
          if (match) {
            currentSemestre = parseInt(match[1]);
            currentPensum.semestres.push({
              semestre: currentSemestre,
              cursos: []
            });
            console.log('Found semester:', currentSemestre);
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
            console.log('Found course:', match[1]);
          }
        }
        
        // Buscar nombre del curso
        if (line.startsWith('Nombre:') && currentCurso) {
          const match = line.match(/Nombre:\s*"([^"]+)"/);
          if (match) {
            currentCurso.nombre = match[1];
            console.log('Course name:', match[1]);
          }
        }
        
        // Buscar área/créditos
        if ((line.startsWith('Area:') || line.startsWith('Creditos:')) && currentCurso) {
          const match = line.match(/(?:Area|Creditos):\s*(\d+)/);
          if (match) {
            currentCurso.creditos = parseInt(match[1]);
            console.log('Course credits/area:', match[1]);
          }
        }
        
        // Buscar prerrequisitos
        if (line.startsWith('Prerrequisitos:') && currentCurso) {
          const match = line.match(/Prerrequisitos:\s*\(([^)]*)\)/);
          if (match && match[1].trim()) {
            currentCurso.prerrequisitos = match[1].split(',').map(p => p.trim()).filter(p => p);
            console.log('Course prerequisites:', currentCurso.prerrequisitos);
          }
        }
        
        // Si encontramos el cierre del curso, agregarlo
        if (line === '}' && currentCurso) {
          currentPensum.cursos.push(currentCurso);
          const semestreIndex = currentPensum.semestres.findIndex(s => s.semestre === currentSemestre);
          if (semestreIndex !== -1) {
            currentPensum.semestres[semestreIndex].cursos.push(currentCurso);
          }
          console.log('Added course:', currentCurso.codigo, 'to semester:', currentSemestre);
          currentCurso = null;
        }
      }

      // Agregar la última carrera si existe
      if (currentPensum) {
        console.log('Saving last career:', currentPensum.carrera);
        multiCareerPensum.careers.push(currentPensum);
      }

      console.log('Final result:', multiCareerPensum);
      return multiCareerPensum.careers.length > 0 ? multiCareerPensum : null;
    } catch (error) {
      console.error('Error parsing multi-career pensum:', error);
      return null;
    }
  };

  const multiCareerPensum = parseMultiCareerPensumFromText(editorContent);

  // Debug: Show what we're working with
  console.log('Editor content length:', editorContent.length);
  console.log('Multi career pensum result:', multiCareerPensum);

  if (!multiCareerPensum) {
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
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary>Debug Info</summary>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '5px',
                fontSize: '12px',
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                Content length: {editorContent.length}
                First 500 chars: {editorContent.substring(0, 500)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    );
  }

  // Crear un mapa de cursos para búsqueda rápida (todos los cursos de todas las carreras)
  const cursosMap = new Map<string, Curso>();
  multiCareerPensum.careers.forEach(career => {
    career.cursos.forEach(curso => {
      cursosMap.set(curso.codigo, curso);
    });
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
    let csvContent = 'Carrera,Semestre,Código,Nombre,Créditos,Prerrequisitos\n';
    
    multiCareerPensum.careers.forEach(career => {
      const semestres = career.semestres.sort((a, b) => a.semestre - b.semestre);
      semestres.forEach(semestre => {
        semestre.cursos.forEach(curso => {
          const prerrequisitos = curso.prerrequisitos.length > 0 
            ? curso.prerrequisitos.join(', ') 
            : 'Ninguno';
          csvContent += `"${career.carrera}",${semestre.semestre},${curso.codigo},"${curso.nombre}",${curso.creditos || 0},"${prerrequisitos}"\n`;
        });
      });
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pensum_multiple_carreras.csv`);
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
          <h2>Pensum: {multiCareerPensum.careers.length} Carrera{multiCareerPensum.careers.length > 1 ? 's' : ''}</h2>
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
        
        <div className="careers-container">
          {multiCareerPensum.careers.map((career, careerIndex) => {
            const semestres = career.semestres.sort((a, b) => a.semestre - b.semestre);
            
            return (
              <div key={careerIndex} className="career-section">
                <div className="career-header">
                  <h3>{career.carrera}</h3>
                </div>
                
                <div className="pensum-grid-container">
                  {semestres.map(semestre => (
                    <div key={semestre.semestre} className="semestre-section">
                      <div className="semestre-header">
                        <h4>Semestre {semestre.semestre.toString().padStart(2, '0')}</h4>
                      </div>
                      <div className="cursos-grid">
                        {semestre.cursos.map((curso, index) => {
                          const isResaltado = isCursoResaltado(curso.codigo);
                          const isSelected = selectedCourse === curso.codigo;
                          
                          return (
                            <div 
                              key={`${careerIndex}-${semestre.semestre}-${index}`}
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
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PensumView; 