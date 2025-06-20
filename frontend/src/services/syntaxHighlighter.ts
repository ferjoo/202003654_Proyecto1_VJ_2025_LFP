/**
 * @file Contiene toda la lógica para el resaltado de sintaxis del editor de código.
 * Este archivo se encarga de definir los colores, asignar colores a los tipos de tokens
 * y procesar el texto para aplicar el resaltado en tiempo real.
 */

// --- Definición de Colores para los Tokens ---

/**
 * Define los nombres de los colores que usaremos para resaltar los tokens.
 * Cada uno de estos nombres corresponde a una clase CSS que define el color real.
 */
export type TokenColor = 'blue' | 'orange' | 'green' | 'purple';

/**
 * Este objeto asocia cada nombre de color (TokenColor) con su clase CSS correspondiente.
 * Por ejemplo, 'blue' se asocia con la clase 'token-blue'.
 * Estas clases están definidas en `src/styles/main.scss`.
 */
export const tokenColorClass: Record<TokenColor, string> = {
  blue: 'token-blue',     // Para palabras reservadas
  orange: 'token-orange', // Para cadenas de texto
  green: 'token-green',   // Para símbolos
  purple: 'token-purple', // Para números
};


// --- Asignación de Colores a los Tipos de Token ---

/**
 * Esta función recibe un tipo de token (ej. "CARRERA", "CADENA") y devuelve el color
 * que le corresponde según las reglas definidas.
 *
 * @param tokenType - El tipo de token que viene del analizador léxico.
 * @returns El nombre del color (TokenColor) o `undefined` si el token no tiene un color especial.
 */
export const getTokenColor = (tokenType: string): TokenColor | undefined => {
  // Convertimos a mayúsculas para asegurar que la comparación no distinga entre mayúsculas y minúsculas.
  switch (tokenType.toUpperCase()) {
    // Palabras reservadas se pintan de azul.
    case 'CARRERA':
    case 'CURSO':
    case 'SEMESTRE':
    case 'NOMBRE':
    case 'CREDITOS':
    case 'PREREQUISITO':
    case 'PREREQUISITOS':
    case 'AREA':
    case 'CODIGO':
    case 'DESCRIPCION':
    case 'OBLIGATORIO':
    case 'ELECTIVO':
      return 'blue';

    // Cadenas de texto se pintan de naranja.
    case 'CADENA':
      return 'orange';

    // Números y valores booleanos se pintan de morado.
    case 'NUMERO':
    case 'BOOLEANO':
      return 'purple';

    // Símbolos y operadores se pintan de verde.
    case 'DOS_PUNTOS':
    case 'PUNTO_COMA':
    case 'IGUAL':
    case 'COMA':
    case 'LLAVE_ABIERTA':
    case 'LLAVE_CERRADA':
    case 'CORCHETE_ABIERTO':
    case 'CORCHETE_CERRADO':
    case 'PARENTESIS_ABIERTO':
    case 'PARENTESIS_CERRADO':
      return 'green';

    // Si el token no coincide con ninguna regla, no se le asigna color.
    default:
      return undefined;
  }
};


// --- Lógica de Resaltado de Sintaxis en Tiempo Real ---

/**
 * Procesa el texto del editor y lo devuelve como HTML con etiquetas <span> para colorear la sintaxis.
 * Esta función es el núcleo del resaltado en tiempo real.
 *
 * @param text - El texto plano que el usuario ha escrito en el editor.
 * @returns Una cadena de texto con formato HTML para mostrar el texto coloreado.
 */
export const highlightText = (text: string): string => {
  // Si el texto está vacío, no hay nada que hacer.
  if (!text.trim()) return text;

  // 1. Definimos las reglas de resaltado usando expresiones regulares.
  // Cada regla tiene un patrón (la expresión regular) y el color que debe aplicar.
  // El orden es importante: las cadenas de texto se buscan primero para evitar
  // que palabras reservadas dentro de ellas se coloreen incorrectamente.
  const patterns: [RegExp, TokenColor][] = [
    // Regla para cadenas de texto (ej. "hola mundo") -> Naranja
    [/"[^"]*"/g, 'orange'],
    // Regla para palabras reservadas (ej. Carrera, Curso) -> Azul
    // La 'i' al final hace que no distinga entre mayúsculas y minúsculas.
    [/\b(Carrera|Semestre|Curso|Nombre|Area|Prerrequisitos?|Creditos|Codigo|Descripcion|Obligatorio|Electivo)\b/gi, 'blue'],
    // Regla para números (ej. 101, 04) -> Morado
    [/\b\d+\b/g, 'purple'],
    // Regla para símbolos (ej. :, ;, {, }) -> Verde
    [/(:|;|=|\[|\]|\{|\}|\(|\)|,)/g, 'green'],
  ];

  // 2. Buscamos todas las coincidencias de nuestras reglas en el texto.
  const allMatches = patterns.flatMap(([regex, color]) => {
    const matches = [];
    let match;
    // Usamos un bucle para encontrar todas las ocurrencias de la regla en el texto.
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        start: match.index, // Posición de inicio de la coincidencia
        end: match.index + match[0].length, // Posición final
        color: color, // Color a aplicar
      });
    }
    return matches;
  });

  // 3. Ordenamos las coincidencias por su posición de inicio.
  // Esto es crucial para construir el HTML en el orden correcto.
  allMatches.sort((a, b) => a.start - b.start);

  // 4. Filtramos las coincidencias que se superponen.
  // Por ejemplo, si una palabra reservada está dentro de una cadena, solo queremos
  // que se aplique el color de la cadena. Nos quedamos con la que empieza primero y es más larga.
  const filteredMatches = [];
  let lastEnd = -1;
  for (const match of allMatches) {
    if (match.start >= lastEnd) {
      filteredMatches.push(match);
      lastEnd = match.end;
    }
  }

  // 5. Construimos la cadena de HTML final.
  let result = '';
  let lastIndex = 0;
  for (const match of filteredMatches) {
    // Agregamos el texto que está entre la última coincidencia y la actual (texto sin color).
    result += text.substring(lastIndex, match.start);
    // Agregamos el texto de la coincidencia, envuelto en un <span> con su clase de color.
    result += `<span class="${tokenColorClass[match.color]}">${text.substring(match.start, match.end)}</span>`;
    // Actualizamos el índice para la siguiente iteración.
    lastIndex = match.end;
  }

  // 6. Agregamos cualquier texto restante después de la última coincidencia.
  result += text.substring(lastIndex);

  return result;
}; 