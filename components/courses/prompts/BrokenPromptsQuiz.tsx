"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Bug,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronDown,
  Eye,
  Award,
  Lightbulb,
  AlertTriangle,
  Stethoscope,
  Sparkles,
  BookOpen,
  Copy,
  Check,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type CrefoCategory = "contexto" | "rol" | "especificidad" | "formato" | "objetivos";

interface Diagnosis {
  id: string;
  category: CrefoCategory;
  label: string;
  description: string;
}

interface BrokenPrompt {
  id: string;
  difficulty: "basico" | "intermedio" | "avanzado";
  area: string;
  brokenPrompt: string;
  correctDiagnoses: string[];
  allDiagnoses: Diagnosis[];
  explanation: string;
  fixedPrompt: string;
  tip: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────

const crefoColors: Record<CrefoCategory, { bg: string; text: string; border: string; label: string }> = {
  contexto: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "C · Contexto" },
  rol: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", label: "R · Rol" },
  especificidad: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "E · Especificidad" },
  formato: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "F · Formato" },
  objetivos: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", label: "O · Objetivos" },
};

const difficultyConfig = {
  basico: { label: "Básico", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dots: 1 },
  intermedio: { label: "Intermedio", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", dots: 2 },
  avanzado: { label: "Avanzado", color: "text-red-700", bg: "bg-red-50", border: "border-red-200", dots: 3 },
};

const prompts: BrokenPrompt[] = [
  {
    id: "p1",
    difficulty: "basico",
    area: "Planificación",
    brokenPrompt: "Hazme un examen de matemáticas.",
    correctDiagnoses: ["d1", "d2", "d3"],
    allDiagnoses: [
      { id: "d1", category: "contexto", label: "Falta nivel educativo", description: "No especifica para qué curso, edad o nivel de competencia es el examen." },
      { id: "d2", category: "especificidad", label: "Verbo vago e impreciso", description: "'Hazme' no indica qué tipo de examen, cuántas preguntas, qué temas o qué estándares evalúa." },
      { id: "d3", category: "formato", label: "Sin formato de salida", description: "No indica si quiere opción múltiple, desarrollo, problemas, tabla, ni cómo estructurar el resultado." },
      { id: "d4", category: "rol", label: "Tono demasiado informal", description: "Aunque el tono no es el problema principal, no afecta la calidad del resultado en este caso." },
    ],
    explanation: "Este es el prompt 'página en blanco' clásico. Sin contexto (¿2º de Primaria o Bachillerato?), sin especificidad (¿álgebra, geometría, estadística?) y sin formato (¿opción múltiple o problemas abiertos?), la IA devolverá algo genérico e inútil. Es como pedirle a un cocinero 'hazme comida'.",
    fixedPrompt: "Actúa como un profesor de matemáticas de 3º de ESO. Diseña un examen de 45 minutos sobre ecuaciones de segundo grado con los siguientes requisitos:\n\n- 10 preguntas en dificultad progresiva (3 básicas, 4 intermedias, 3 avanzadas)\n- Incluye: 4 de opción múltiple (4 opciones, solo 1 correcta) y 6 de resolución con procedimiento\n- Alineado con el bloque de Álgebra de la LOMLOE\n- Formato: tabla con columnas [Nº | Enunciado | Tipo | Puntuación]\n- No uses contextos que requieran conocimiento cultural específico\n- Incluye la clave de respuestas al final",
    tip: "La regla de oro: si tu prompt cabe en un tuit, probablemente le falta información. Un buen prompt de planificación suele tener entre 80-150 palabras.",
  },
  {
    id: "p2",
    difficulty: "basico",
    area: "Evaluación",
    brokenPrompt: "Corrige este trabajo de mi alumno Juan García Pérez, que tiene TDAH y está en el programa de diversificación. Aquí está su redacción: [texto del alumno]",
    correctDiagnoses: ["d1", "d3"],
    allDiagnoses: [
      { id: "d1", category: "objetivos", label: "Violación de privacidad (PII)", description: "Incluye nombre completo real y diagnóstico médico del alumno. Estos son datos sensibles protegidos por GDPR/LOPDGDD." },
      { id: "d2", category: "especificidad", label: "Falta criterio de evaluación", description: "No especifica rúbrica ni criterios de corrección, aunque este no es el problema más grave aquí." },
      { id: "d3", category: "objetivos", label: "Sin restricción de uso de datos", description: "No indica que la IA no debe almacenar estos datos ni usarlos para entrenamiento." },
      { id: "d4", category: "contexto", label: "Falta el nivel de exigencia", description: "No queda claro qué estándar de evaluación aplicar." },
    ],
    explanation: "⚠️ ALERTA DE PRIVACIDAD. Este prompt contiene datos personales identificables (PII) de un menor: nombre completo y diagnóstico médico. Bajo el GDPR, los datos de salud de menores son de categoría especial. Subir esto a ChatGPT (con entrenamiento activado) expone al centro educativo a sanciones graves. NUNCA se deben incluir datos reales de alumnos en prompts.",
    fixedPrompt: "Actúa como un especialista en evaluación formativa de Lengua Castellana.\n\nRevisa la siguiente redacción de un alumno de 3º ESO (programa de diversificación) aplicando estos criterios:\n- Coherencia y cohesión textual\n- Corrección ortográfica y gramatical\n- Riqueza léxica apropiada al nivel\n\nGenera feedback en formato:\n1. Dos fortalezas específicas del texto\n2. Dos áreas de mejora con ejemplos concretos del texto\n3. Una sugerencia de siguiente paso\n\nTono: Motivador y constructivo. Usa lenguaje directo y sencillo.\nNO incluyas calificación numérica.\n\n[Texto del alumno anonimizado]",
    tip: "Regla de privacidad: antes de pegar cualquier dato en la IA, pregúntate: '¿Podría identificar a un alumno con esta información?' Si sí, anonimiza o elimina.",
  },
  {
    id: "p3",
    difficulty: "basico",
    area: "Recursos",
    brokenPrompt: "Necesito ideas creativas para enseñar la fotosíntesis de forma divertida.",
    correctDiagnoses: ["d1", "d2", "d4"],
    allDiagnoses: [
      { id: "d1", category: "contexto", label: "Sin nivel educativo ni grupo", description: "No es lo mismo enseñar fotosíntesis en 5º Primaria que en Bachillerato de Ciencias." },
      { id: "d2", category: "formato", label: "Sin estructura de salida", description: "'Ideas creativas' es ambiguo. ¿Quiere una lista, una secuencia didáctica, actividades detalladas?" },
      { id: "d3", category: "rol", label: "Sin rol asignado a la IA", description: "No asignar rol no es crítico aquí, pero podría mejorar la relevancia del resultado." },
      { id: "d4", category: "especificidad", label: "'Creativas' y 'divertidas' son subjetivos", description: "Estos adjetivos no le dicen nada concreto a la IA. ¿Gamificación? ¿Experimentos? ¿Teatro?" },
    ],
    explanation: "El problema central es la vaguedad. 'Ideas creativas' y 'de forma divertida' son instrucciones vacías para una IA. Sin saber la edad del grupo, los recursos disponibles y qué tipo de actividad busca (manipulativa, digital, colaborativa), la IA generará una lista genérica de Pinterest. El formato tampoco está definido: ¿quiere 3 ideas o 20? ¿Con materiales necesarios o solo el concepto?",
    fixedPrompt: "Actúa como un experto en didáctica de las ciencias naturales con experiencia en aprendizaje activo.\n\nDiseña 5 actividades para enseñar la fotosíntesis a alumnos de 6º de Primaria (11-12 años). Requisitos:\n\n- 2 actividades manipulativas (con materiales de bajo coste)\n- 2 actividades digitales (usando herramientas gratuitas)\n- 1 actividad de evaluación formativa gamificada\n\nPara cada actividad incluye:\n| Campo | Contenido |\n|-------|----------|\n| Nombre | Título atractivo |\n| Duración | Minutos estimados |\n| Materiales | Lista específica |\n| Desarrollo | Pasos numerados |\n| Conexión curricular | Estándar LOMLOE que trabaja |\n\nEvita actividades que requieran laboratorio o materiales especializados.",
    tip: "Sustituye adjetivos vagos (creativo, divertido, interesante) por criterios observables (manipulativo, colaborativo, de 15 minutos, con materiales reciclados).",
  },
  {
    id: "p4",
    difficulty: "intermedio",
    area: "Diferenciación",
    brokenPrompt: "Adapta este texto sobre el sistema solar para un alumno con necesidades especiales:\n\n[Texto de 500 palabras sobre planetas]",
    correctDiagnoses: ["d1", "d2", "d3"],
    allDiagnoses: [
      { id: "d1", category: "contexto", label: "'Necesidades especiales' es demasiado genérico", description: "¿TEA? ¿TDAH? ¿Dislexia? ¿Discapacidad visual? Cada necesidad requiere adaptaciones completamente diferentes." },
      { id: "d2", category: "especificidad", label: "'Adapta' sin criterios de adaptación", description: "No indica si debe simplificar vocabulario, acortar párrafos, añadir apoyos visuales, o cambiar la estructura." },
      { id: "d3", category: "formato", label: "Sin nivel de lectura objetivo", description: "No define a qué nivel de comprensión lectora debe llegar el texto adaptado (A1, A2, B1...)." },
      { id: "d4", category: "objetivos", label: "Asume que una sola adaptación sirve", description: "Aunque relacionado, el problema principal no es de restricciones sino de falta de especificidad." },
    ],
    explanation: "Este prompt revela un error conceptual común: tratar 'necesidades especiales' como una categoría homogénea. Un alumno con TEA necesita estructura visual y literalidad. Un alumno con TDAH necesita textos cortos con puntos de enganche frecuentes. Un alumno con dislexia necesita tipografía específica y frases cortas. 'Adapta' sin criterios es como decirle a un médico 'cúrale' sin decir qué tiene el paciente.",
    fixedPrompt: "Actúa como un especialista en Diseño Universal para el Aprendizaje (DUA).\n\nAdapta el siguiente texto sobre el sistema solar para un alumno de 5º Primaria con TDAH que tiene nivel de lectura A2. Aplica estas estrategias de adaptación:\n\n1. **Estructura**: Divide en secciones de máximo 3 frases. Usa subtítulos-pregunta (ej. '¿Qué tamaño tiene Júpiter?')\n2. **Vocabulario**: Nivel A2 (frases simples, vocabulario cotidiano). Si necesitas un término técnico, defínelo entre paréntesis.\n3. **Enganche**: Añade un dato curioso 🌟 cada 2 párrafos y una pregunta de reflexión al final de cada sección.\n4. **Visual**: Indica entre [corchetes] dónde insertar imágenes de apoyo.\n\nFormato: Markdown con emojis de sección.\nExtensión: Máximo 300 palabras.\n\n[Texto original]",
    tip: "En diferenciación, la especificidad es inclusión. Cuanto más precisa sea tu descripción de la necesidad, más útil será la adaptación.",
  },
  {
    id: "p5",
    difficulty: "intermedio",
    area: "Evaluación",
    brokenPrompt: "Eres un profesor muy estricto y exigente. Evalúa estos 5 trabajos de mis alumnos y ponles nota del 1 al 10. Sé duro con las calificaciones, no regales notas.\n\n[Trabajos de 5 alumnos]",
    correctDiagnoses: ["d1", "d2", "d3"],
    allDiagnoses: [
      { id: "d1", category: "rol", label: "Rol contraproducente", description: "Pedir a la IA que sea 'estricta' y 'dura' sesga la evaluación hacia la penalización, no hacia la valoración justa." },
      { id: "d2", category: "objetivos", label: "Sin rúbrica ni criterios", description: "Evaluar sin criterios explícitos genera notas arbitrarias. La IA inventará sus propios estándares." },
      { id: "d3", category: "especificidad", label: "Nota numérica sin cualificación", description: "Un número del 1-10 sin descriptores no proporciona información útil para el aprendizaje del alumno." },
      { id: "d4", category: "formato", label: "Falta formato de feedback", description: "Aunque relacionado, el problema principal es la ausencia de criterios, no del formato en sí." },
    ],
    explanation: "Este prompt tiene un problema de diseño en tres niveles. Primero, el ROL: pedir que sea 'estricto' y 'duro' introduce un sesgo de severidad artificial que no mide aprendizaje. Segundo, los OBJETIVOS: sin rúbrica, cada trabajo será evaluado con criterios inventados por la IA, lo cual es arbitrario y no replicable. Tercero, la ESPECIFICIDAD: una nota numérica sin cualificación es el tipo de evaluación menos informativa que existe — no le dice al alumno qué hizo bien ni qué mejorar.",
    fixedPrompt: "Actúa como un evaluador formativo especializado en escritura académica de Secundaria.\n\nAnaliza el siguiente trabajo de un alumno de 4º ESO usando esta rúbrica:\n\n| Criterio | Excelente (4) | Bueno (3) | Suficiente (2) | Insuficiente (1) |\n|----------|--------------|-----------|----------------|------------------|\n| Tesis clara | Tesis original y bien formulada | Tesis clara pero predecible | Tesis implícita | Sin tesis identificable |\n| Evidencias | 3+ evidencias relevantes y analizadas | 2 evidencias con análisis | Evidencias sin análisis | Sin evidencias |\n| Estructura | Introducción-desarrollo-conclusión fluida | Estructura completa pero rígida | Estructura parcial | Sin estructura reconocible |\n| Expresión | Vocabulario variado, sin errores | Vocabulario adecuado, errores menores | Vocabulario limitado | Errores que dificultan comprensión |\n\nGenera:\n1. Puntuación por criterio con justificación de una línea\n2. Una fortaleza destacada (cita del texto)\n3. Un área de mejora prioritaria con sugerencia concreta\n4. Nota orientativa (escala 1-10) basada en la rúbrica\n\nTono: Profesional y constructivo. Prioriza el aprendizaje sobre la calificación.\n\n[Trabajo del alumno - anonimizado]",
    tip: "Nunca dejes que la IA evalúe sin rúbrica. Sin criterios explícitos, la IA inventa los suyos — y no serán los tuyos.",
  },
  {
    id: "p6",
    difficulty: "intermedio",
    area: "Planificación",
    brokenPrompt: "Crea una unidad didáctica completa sobre la Guerra Civil Española para Bachillerato. Incluye todos los contenidos, actividades, evaluación, temporalización, competencias clave, criterios de evaluación, estándares de aprendizaje, materiales, adaptaciones para NEAE y recursos TIC. Que sea innovadora y motivadora.",
    correctDiagnoses: ["d2", "d3"],
    allDiagnoses: [
      { id: "d1", category: "contexto", label: "Falta el marco curricular específico", description: "Aunque dice Bachillerato, no especifica si es 1º o 2º, ni la comunidad autónoma." },
      { id: "d2", category: "especificidad", label: "Sobrecarga de requisitos en un solo prompt", description: "Pide 10+ elementos complejos en una sola instrucción. La IA producirá todo de forma superficial en vez de algo en profundidad." },
      { id: "d3", category: "objetivos", label: "Sin restricciones de alcance", description: "No limita la extensión, el enfoque temático ni la profundidad. 'Todos los contenidos' de la Guerra Civil podría ser un libro." },
      { id: "d4", category: "formato", label: "Sin formato definido", description: "No es el error principal, pero contribuye a la ambigüedad general." },
    ],
    explanation: "Este prompt sufre de lo que se llama 'sobrecarga cognitiva del prompt'. Al pedir todo de golpe (contenidos + actividades + evaluación + temporalización + competencias + adaptaciones + recursos...), la IA intentará cubrir todo superficialmente en vez de desarrollar algo con profundidad. Es el equivalente a pedirle a alguien que escriba un libro en un párrafo. La solución es el PROMPT CHAINING: dividir en prompts encadenados donde la salida de uno alimenta al siguiente.",
    fixedPrompt: "Este prompt se resuelve con ENCADENAMIENTO (3-4 prompts secuenciales):\n\n--- PROMPT 1: Marco y objetivos ---\nActúa como un experto en didáctica de Historia de España para 2º Bachillerato (LOMLOE).\nDefine el marco para una unidad didáctica sobre la Guerra Civil Española (1936-1939) enfocada en causas y bandos:\n- 3 objetivos de aprendizaje (verbos de Bloom nivel Analizar/Evaluar)\n- Competencias clave implicadas\n- Temporalización: 8 sesiones de 55 minutos\nFormato: tabla\n\n--- PROMPT 2: Actividades (usa la salida del P1) ---\nUsando los objetivos de la respuesta anterior, diseña la secuencia de 8 sesiones con una actividad principal por sesión...\n\n--- PROMPT 3: Evaluación ---\nDiseña la evaluación formativa y sumativa alineada con los objetivos anteriores...\n\n--- PROMPT 4: Adaptaciones ---\nA partir de la unidad desarrollada, propón adaptaciones para un alumno con TDAH y otro con altas capacidades...",
    tip: "Si tu prompt tiene más de 3 elementos complejos, divídelo en cadena. La regla: un prompt = un objetivo cognitivo principal.",
  },
  {
    id: "p7",
    difficulty: "avanzado",
    area: "Recursos",
    brokenPrompt: "Crea un cuento infantil sobre una niña latina que vive en un barrio pobre y aprende el valor del esfuerzo para salir de la pobreza gracias a la educación.",
    correctDiagnoses: ["d1", "d3"],
    allDiagnoses: [
      { id: "d1", category: "objetivos", label: "Estereotipo cultural implícito", description: "Asocia 'latina' con 'barrio pobre' y reduce la narrativa a la meritocracia individual, ignorando barreras sistémicas." },
      { id: "d2", category: "contexto", label: "Falta edad del público objetivo", description: "No especifica para qué edad es el cuento, pero este no es el problema más grave." },
      { id: "d3", category: "objetivos", label: "Narrativa condescendiente", description: "El marco 'esfuerzo para salir de la pobreza' reproduce un enfoque asistencialista que puede resultar dañino para alumnos en esa situación." },
      { id: "d4", category: "formato", label: "Sin extensión ni estructura", description: "No define longitud ni estructura del cuento, pero es secundario frente al problema ético." },
    ],
    explanation: "Este prompt es técnicamente funcional pero éticamente problemático. Contiene dos sesgos implícitos graves: 1) Asociar automáticamente 'latina' con 'pobreza' reproduce un estereotipo dañino. 2) La narrativa de 'salir de la pobreza con esfuerzo' es una versión simplificada de la meritocracia que ignora barreras estructurales y puede hacer sentir responsables de su situación a los alumnos que la viven. En un aula diversa, este cuento puede ser microagresivo.",
    fixedPrompt: "Actúa como un autor de literatura infantil especializado en representación diversa y narrativas empoderantes.\n\nEscribe un cuento corto (400 palabras) para niños de 8-9 años con una protagonista llamada Valentina que vive en Bogotá. El cuento debe:\n\n- Mostrar a Valentina resolviendo un problema comunitario usando su creatividad y el apoyo de su red (familia, vecinos, amigos)\n- Representar su entorno con riqueza cultural (no como carencia)\n- Evitar narrativas de 'salvación por esfuerzo individual' o 'escapar de su entorno'\n- Incluir al menos un elemento de su cultura como fortaleza (gastronomía, música, tradición oral)\n\nTono: Alegre, empoderador, con humor.\nEstructura: Inicio-nudo-desenlace claro.\n\nNO uses estereotipos de pobreza, violencia ni condescendencia. La comunidad de Valentina es un lugar con desafíos pero también con recursos, alegría y dignidad.",
    tip: "Antes de describir a un personaje de una cultura diferente a la tuya, pregúntate: '¿Describiría así a un personaje de mi propia cultura?' Si no, revisa los estereotipos implícitos.",
  },
  {
    id: "p8",
    difficulty: "avanzado",
    area: "Razonamiento",
    brokenPrompt: "Diseña un proyecto interdisciplinar para 4º de ESO que integre Matemáticas, Lengua, Tecnología e Historia. Que sea sobre cambio climático y dure todo el trimestre.",
    correctDiagnoses: ["d1", "d2", "d4"],
    allDiagnoses: [
      { id: "d1", category: "especificidad", label: "Sin producto final definido", description: "Un proyecto necesita un entregable claro. ¿Presentación? ¿Web? ¿Informe? ¿Campaña? Sin esto, el proyecto no tiene dirección." },
      { id: "d2", category: "contexto", label: "Sin metodología de proyecto", description: "No indica si es ABP, ABR, Design Thinking, Aprendizaje-Servicio... Cada metodología genera un diseño radicalmente diferente." },
      { id: "d3", category: "formato", label: "Sin estructura de entrega", description: "Aunque necesario, el formato es secundario frente a la falta de metodología." },
      { id: "d4", category: "objetivos", label: "Integración forzada sin justificación", description: "Nombra 4 asignaturas sin explicar POR QUÉ cada una aporta al tema. La IA forzará conexiones artificiales." },
    ],
    explanation: "El prompt comete el error clásico del 'proyecto interdisciplinar de nombre': nombra asignaturas sin justificar la integración. La IA producirá actividades sueltas por materia disfrazadas de interdisciplinariedad. Además, sin producto final ni metodología, 'todo el trimestre' es tiempo sin dirección. El Chain-of-Thought es esencial aquí: primero definir la pregunta motriz, luego el producto, luego las conexiones disciplinares, y finalmente la secuencia.",
    fixedPrompt: "Actúa como un diseñador de proyectos interdisciplinares con experiencia en ABP (Aprendizaje Basado en Proyectos) para Secundaria.\n\nPiensa paso a paso:\n\n1. **Pregunta motriz**: Formula una pregunta auténtica sobre cambio climático que requiera NECESARIAMENTE matemáticas (análisis de datos), lengua (argumentación), tecnología (herramienta digital) e historia (contexto de industrialización).\n\n2. **Producto final**: Propón un entregable tangible y público (no un examen) que integre las 4 materias de forma orgánica.\n\n3. **Conexiones disciplinares**: Para cada asignatura, define:\n   - Qué aporta al proyecto (no al revés)\n   - Qué competencia específica desarrolla\n   - Qué entregable parcial produce\n\n4. **Secuencia trimestral**: Divide en 3 fases (Investigación → Desarrollo → Presentación) con hitos evaluables.\n\nFormato: Esquema visual con tablas.\nRestricciones: Que sea viable con recursos reales de un instituto público español.",
    tip: "En proyectos interdisciplinares, usa Chain-of-Thought: haz que la IA piense paso a paso en vez de saltar directamente al diseño. Primero la pregunta, luego el producto, después la integración.",
  },
  {
    id: "p9",
    difficulty: "avanzado",
    area: "Diferenciación",
    brokenPrompt: "Dame una explicación de la fotosíntesis adaptada a 3 niveles diferentes de comprensión.",
    correctDiagnoses: ["d1", "d2", "d3"],
    allDiagnoses: [
      { id: "d1", category: "contexto", label: "Niveles sin definir", description: "'3 niveles' es ambiguo. ¿Se refiere a edad, competencia lectora, dominio del contenido, nivel de idioma?" },
      { id: "d2", category: "formato", label: "Sin extensión ni soporte visual", description: "No define si cada nivel debe tener la misma extensión, si debe incluir analogías, vocabulario resaltado, etc." },
      { id: "d3", category: "especificidad", label: "Sin criterio de diferenciación observable", description: "No indica qué cambia entre niveles: ¿vocabulario? ¿complejidad sintáctica? ¿profundidad conceptual? ¿todo?" },
      { id: "d4", category: "rol", label: "Sin perspectiva disciplinar", description: "No asigna un enfoque (biología pura, medioambiental, cotidiano), pero es secundario." },
    ],
    explanation: "El prompt parece razonable pero produce resultados mediocres porque 'niveles diferentes' no le dice nada operativo a la IA. Sin definir QUÉ varía entre niveles (vocabulario, estructura, profundidad, apoyos visuales) y CUÁNTO (nivel A1 vs C1, Primaria vs Bachillerato), la IA tomará decisiones arbitrarias. La diferenciación real requiere criterios observables y medibles en cada nivel.",
    fixedPrompt: "Actúa como un especialista en DUA (Diseño Universal para el Aprendizaje) y didáctica de ciencias.\n\nCrea 3 versiones de una explicación de la fotosíntesis, diferenciadas según estos criterios específicos:\n\n**Nivel 1 (accesibilidad alta)**\n- Vocabulario: Solo palabras del uso cotidiano. Términos técnicos solo 'planta', 'sol', 'agua'\n- Sintaxis: Frases de máximo 10 palabras. Solo estructura S+V+O\n- Extensión: 80 palabras máximo\n- Apoyo: Incluye una analogía con cocina (la planta 'cocina' su comida)\n- Marcadores: Usa 🌱☀️💧 como apoyos visuales\n\n**Nivel 2 (estándar)**\n- Vocabulario: Introduce 'clorofila', 'dióxido de carbono', 'glucosa' (definidos al usarlos)\n- Sintaxis: Frases compuestas permitidas. Conectores causales (porque, por lo tanto)\n- Extensión: 150 palabras\n- Apoyo: Incluye un esquema en texto (→ indica proceso)\n\n**Nivel 3 (ampliación)**\n- Vocabulario: Terminología científica completa (estomas, tilacoides, ciclo de Calvin)\n- Sintaxis: Sin restricción\n- Extensión: 250 palabras\n- Conexión: Relaciona con respiración celular y ciclo del carbono\n\nFormato: Cada nivel en un bloque separado con encabezado claro.",
    tip: "La diferenciación efectiva se define con métricas: nº de palabras, complejidad sintáctica, términos técnicos permitidos. 'Más fácil' no es un criterio — '80 palabras, frases de 10 palabras máximo' sí lo es.",
  },
  {
    id: "p10",
    difficulty: "avanzado",
    area: "Ética",
    brokenPrompt: "Crea un sistema de detección de plagio con IA para mi instituto. Quiero que analice todos los trabajos que entreguen los alumnos, los compare con bases de datos de ChatGPT y me avise automáticamente si un alumno ha copiado. Incluye un protocolo de sanción escalonada.",
    correctDiagnoses: ["d1", "d2", "d3"],
    allDiagnoses: [
      { id: "d1", category: "objetivos", label: "Enfoque punitivo contraproducente", description: "Construye un sistema de vigilancia en lugar de un sistema de aprendizaje. Prioriza sancionar sobre educar." },
      { id: "d2", category: "objetivos", label: "Asume fiabilidad de detectores", description: "Los detectores de IA tienen tasas de error del 10-30%. Un sistema automático de sanción basado en herramientas poco fiables generará falsos positivos injustos." },
      { id: "d3", category: "contexto", label: "Ignora el marco legal", description: "Analizar automáticamente todos los trabajos plantea cuestiones de protección de datos (GDPR) y proporcionalidad. No contempla el derecho del alumno a ser informado." },
      { id: "d4", category: "formato", label: "Sin estructura del protocolo", description: "No define fases del protocolo, pero es el menor de los problemas." },
    ],
    explanation: "Este prompt revela una concepción errónea de la integridad académica: la 'guerra armamentista' de detección vs. evasión. Los problemas son múltiples: 1) Los detectores NO son fiables y generan falsos positivos que perjudican especialmente a alumnos no nativos y de alto rendimiento. 2) Un sistema de vigilancia automatizada crea un clima de desconfianza que inhibe la innovación. 3) 'Sancionar automáticamente' sin intervención humana viola principios pedagógicos y legales. 4) No aborda la causa raíz: ¿por qué los alumnos recurren a la IA? ¿Las tareas son 'a prueba de IA'? El curso propone transitar de la DETECCIÓN a la DECLARACIÓN.",
    fixedPrompt: "Actúa como un experto en integridad académica y cultura institucional con enfoque restaurativo.\n\nDiseña un 'Marco de Integridad Académica en la Era de la IA' para un instituto de Secundaria. El marco debe incluir:\n\n1. **Política de uso declarado** (el 'Semáforo de IA'):\n   - 🟢 Usos permitidos sin declarar\n   - 🟡 Usos permitidos con declaración obligatoria\n   - 🔴 Usos no permitidos\n   Incluye 3 ejemplos concretos por color.\n\n2. **Diseño de tareas 'IA-resilientes'**: 5 estrategias para diseñar evaluaciones donde la IA sea herramienta, no sustituta (ej. defensa oral, portafolio de proceso, análisis de contexto local).\n\n3. **Protocolo de conversación** (no sanción): Pasos cuando se sospecha uso no declarado, priorizando el diálogo y el aprendizaje sobre la penalización.\n\n4. **Formación para docentes**: 3 talleres cortos para que el profesorado entienda las limitaciones de los detectores.\n\nFormato: Documento estructurado con tablas.\nTono: Constructivo. El objetivo es crear cultura de honestidad, no de vigilancia.",
    tip: "En integridad académica con IA, el enfoque más efectivo no es detectar mejor, sino diseñar tareas donde declarar el uso de IA sea más fácil que ocultarlo. De la detección a la declaración.",
  },
];

// ─── Components ─────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

function DiagnosisChip({
  diagnosis,
  selected,
  correct,
  revealed,
  onClick,
}: {
  diagnosis: Diagnosis;
  selected: boolean;
  correct: boolean;
  revealed: boolean;
  onClick: () => void;
}) {
  const cat = crefoColors[diagnosis.category];

  let stateClasses = "";
  if (revealed) {
    if (correct && selected) stateClasses = "ring-2 ring-emerald-500 bg-emerald-50 border-emerald-300";
    else if (correct && !selected) stateClasses = "ring-2 ring-amber-400 bg-amber-50 border-amber-300";
    else if (!correct && selected) stateClasses = "ring-2 ring-red-400 bg-red-50 border-red-300";
    else stateClasses = "opacity-50";
  } else {
    stateClasses = selected
      ? "ring-2 ring-gray-900 bg-gray-50 border-gray-400"
      : "hover:border-gray-400 hover:shadow-sm bg-white border-gray-200";
  }

  return (
    <button
      onClick={onClick}
      disabled={revealed}
      className={`w-full text-left rounded-xl border-2 p-4 transition-all duration-200 ${stateClasses}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${cat.bg} ${cat.text}`}>
              {cat.label}
            </span>
            {revealed && correct && selected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {revealed && correct && !selected && <AlertTriangle className="w-4 h-4 text-amber-500" />}
            {revealed && !correct && selected && <XCircle className="w-4 h-4 text-red-500" />}
          </div>
          <p className="font-semibold text-gray-900 text-sm">{diagnosis.label}</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{diagnosis.description}</p>
        </div>
        {!revealed && (
          <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-1 transition-colors ${
            selected ? "bg-gray-900 border-gray-900" : "border-gray-300"
          }`}>
            {selected && <Check className="w-4 h-4 text-white" />}
          </div>
        )}
      </div>
    </button>
  );
}

function PromptCard({
  prompt,
  index,
  onScoreUpdate,
}: {
  prompt: BrokenPrompt;
  index: number;
  onScoreUpdate: (id: string, correct: boolean) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [showFixed, setShowFixed] = useState(false);

  const diff = difficultyConfig[prompt.difficulty];

  const toggleDiagnosis = useCallback((id: string) => {
    if (revealed) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, [revealed]);

  const handleReveal = useCallback(() => {
    setRevealed(true);
    const correctSet = new Set(prompt.correctDiagnoses);
    const selectedCorrect = [...selectedIds].filter((id) => correctSet.has(id)).length;
    const selectedWrong = [...selectedIds].filter((id) => !correctSet.has(id)).length;
    const perfect = selectedCorrect === prompt.correctDiagnoses.length && selectedWrong === 0;
    onScoreUpdate(prompt.id, perfect);
  }, [selectedIds, prompt, onScoreUpdate]);

  const scoreDetails = useMemo(() => {
    if (!revealed) return null;
    const correctSet = new Set(prompt.correctDiagnoses);
    const hits = [...selectedIds].filter((id) => correctSet.has(id)).length;
    const misses = [...selectedIds].filter((id) => !correctSet.has(id)).length;
    const missed = prompt.correctDiagnoses.filter((id) => !selectedIds.has(id)).length;
    return { hits, misses, missed, total: prompt.correctDiagnoses.length };
  }, [revealed, selectedIds, prompt]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-400 tabular-nums">#{index + 1}</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${diff.bg} ${diff.color} ${diff.border} border`}>
            {"●".repeat(diff.dots)}{"○".repeat(3 - diff.dots)} {diff.label}
          </span>
          <span className="text-xs text-gray-400 font-medium">{prompt.area}</span>
        </div>
        {revealed && scoreDetails && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
            scoreDetails.hits === scoreDetails.total && scoreDetails.misses === 0
              ? "bg-emerald-50 text-emerald-700"
              : scoreDetails.hits > 0
              ? "bg-amber-50 text-amber-700"
              : "bg-red-50 text-red-700"
          }`}>
            {scoreDetails.hits}/{scoreDetails.total} correctas
            {scoreDetails.misses > 0 && ` · ${scoreDetails.misses} falsa${scoreDetails.misses > 1 ? "s" : ""}`}
          </span>
        )}
      </div>

      <div className="p-6">
        {/* Broken prompt display */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Bug className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Prompt con problemas</span>
          </div>
          <div className="bg-red-50/60 border-2 border-red-200 border-dashed rounded-xl p-4">
            <p className="text-gray-800 text-[15px] leading-relaxed font-mono whitespace-pre-line">{prompt.brokenPrompt}</p>
          </div>
        </div>

        {/* Diagnosis selection */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Tu diagnóstico — selecciona los problemas que detectes
            </span>
          </div>
          <div className="grid gap-2.5">
            {prompt.allDiagnoses.map((d) => (
              <DiagnosisChip
                key={d.id}
                diagnosis={d}
                selected={selectedIds.has(d.id)}
                correct={prompt.correctDiagnoses.includes(d.id)}
                revealed={revealed}
                onClick={() => toggleDiagnosis(d.id)}
              />
            ))}
          </div>
        </div>

        {/* Reveal button */}
        {!revealed && (
          <button
            onClick={handleReveal}
            disabled={selectedIds.size === 0}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
              selectedIds.size > 0
                ? "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Eye className="w-4 h-4" />
            Verificar diagnóstico
          </button>
        )}

        {/* Feedback after reveal */}
        {revealed && (
          <div className="space-y-4 mt-5 pt-5 border-t border-gray-100">
            {/* Explanation */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Análisis</span>
              </div>
              <p className="text-blue-900 text-sm leading-relaxed">{prompt.explanation}</p>
            </div>

            {/* Fixed prompt */}
            <div>
              <button
                onClick={() => setShowFixed(!showFixed)}
                className="flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors mb-2"
              >
                {showFixed ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <Sparkles className="w-4 h-4" />
                Ver prompt corregido
              </button>
              {showFixed && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Versión mejorada</span>
                    <CopyButton text={prompt.fixedPrompt} />
                  </div>
                  <pre className="text-emerald-900 text-sm leading-relaxed whitespace-pre-line font-mono">{prompt.fixedPrompt}</pre>
                </div>
              )}
            </div>

            {/* Tip */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Consejo clave</span>
                <p className="text-amber-900 text-sm leading-relaxed mt-1">{prompt.tip}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function BrokenPromptsQuiz() {
  const [scores, setScores] = useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const handleScore = useCallback((id: string, correct: boolean) => {
    setScores((prev) => ({ ...prev, [id]: correct }));
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return prompts;
    return prompts.filter((p) => p.difficulty === activeFilter);
  }, [activeFilter]);

  const totalAnswered = Object.keys(scores).length;
  const totalPerfect = Object.values(scores).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50/80 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Bug className="w-3.5 h-3.5" />
            Módulo 1 · Laboratorio Diagnóstico
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Banco de Prompts Rotos
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Cada prompt tiene problemas. Tu trabajo: diagnosticar qué falla usando
            el framework C.R.E.F.O. Selecciona los fallos, verifica tu diagnóstico
            y aprende del prompt corregido.
          </p>
        </div>

        {/* C.R.E.F.O. legend */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {(Object.entries(crefoColors) as [CrefoCategory, typeof crefoColors[CrefoCategory]][]).map(([key, val]) => (
            <span key={key} className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${val.bg} ${val.text}`}>
              {val.label}
            </span>
          ))}
        </div>

        {/* Stats + Filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {totalAnswered > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="w-4 h-4" />
                <span>
                  <span className="font-bold text-gray-900">{totalPerfect}</span>/{totalAnswered} diagnósticos perfectos
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-1.5">
            {[
              { key: "all", label: "Todos" },
              { key: "basico", label: "Básico" },
              { key: "intermedio", label: "Intermedio" },
              { key: "avanzado", label: "Avanzado" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  activeFilter === f.key
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompts */}
        <div className="space-y-6">
          {filtered.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              index={prompts.indexOf(prompt)}
              onScoreUpdate={handleScore}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-xs text-gray-400">
            10 prompts diagnósticos · Framework C.R.E.F.O. · Curso &quot;Prompt Mastery para Docentes&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
