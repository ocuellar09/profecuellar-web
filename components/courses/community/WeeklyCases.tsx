"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useCallback } from "react";
import { usePersistedToolState } from "@/hooks/usePersistedToolState";
import {
  MessageCircle,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Users,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Edit3,
  Save,
  ArrowRight,
  Target,
  Scale,
  Lock,
  Sparkles,
  Eye,
  Zap,
  Brain,
  FileText,
  Award,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Stakeholder {
  role: string;
  position: string;
}

interface DiscussionPrompt {
  question: string;
  depth: "análisis" | "propuesta" | "debate";
}

interface WeeklyCase {
  week: number;
  title: string;
  module: string;
  color: string;
  icon: string;
  category: "ética" | "técnica" | "pedagógica" | "integración";
  scenario: string;
  context: string;
  stakeholders: Stakeholder[];
  tensions: string[];
  prompts: DiscussionPrompt[];
  responseFramework: string[];
  peerReviewCriteria: string[];
}

interface UserResponse {
  caseWeek: number;
  responses: string[];
  completed: boolean;
}

// ─── Data ───────────────────────────────────────────────────────────────────

const categoryConfig = {
  "ética": { color: "#7C3AED", bg: "bg-violet-50", badge: "bg-violet-100 text-violet-700" },
  "técnica": { color: "#D97706", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-700" },
  "pedagógica": { color: "#2563EB", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700" },
  "integración": { color: "#059669", bg: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700" },
};

const depthConfig = {
  "análisis": { color: "#2563EB", label: "Análisis" },
  "propuesta": { color: "#059669", label: "Propuesta" },
  "debate": { color: "#DC2626", label: "Debate" },
};

const cases: WeeklyCase[] = [
  {
    week: 1, title: "La profesora que confió demasiado", module: "Módulo 0", color: "#4F46E5", icon: "🧠",
    category: "técnica",
    scenario: "Carmen, profesora de Historia de 4º ESO, usó ChatGPT para generar un dossier sobre la Revolución Francesa. Lo entregó a sus alumnos sin revisar a fondo. Una alumna descubrió que tres de las citas bibliográficas eran inventadas y que un dato clave (fecha de un tratado) era incorrecto. La alumna lo publicó en el grupo de clase de WhatsApp. Ahora los alumnos cuestionan la credibilidad de los materiales y algunos padres han contactado con dirección.",
    context: "Colegio concertado urbano, 32 alumnos por aula. Carmen tiene 15 años de experiencia pero es nueva en el uso de IA. El centro no tiene protocolo de uso de IA. La inspección educativa ha preguntado al centro sobre su política de uso de herramientas de IA.",
    stakeholders: [
      { role: "Carmen", position: "Quiere seguir usando IA pero siente que ha perdido credibilidad" },
      { role: "Alumnado", position: "Algunos han perdido confianza, otros quieren usar IA ellos también" },
      { role: "Familias", position: "Preocupadas por la calidad de los materiales" },
      { role: "Dirección", position: "Necesita responder a la inspección y a las familias" },
    ],
    tensions: [
      "Innovación vs. rigor: ¿cómo equilibrar la adopción de nuevas herramientas con la verificación?",
      "Transparencia: ¿debe Carmen revelar que usa IA para crear materiales?",
      "Protocolo: ¿debería el centro prohibir, regular o fomentar el uso de IA?",
    ],
    prompts: [
      { question: "¿Qué protocolo de verificación debería haber seguido Carmen antes de entregar el material? Diseña los 5 pasos esenciales.", depth: "propuesta" },
      { question: "¿Debería un docente comunicar a sus alumnos y familias cuándo usa IA para generar materiales? Argumenta tu posición.", depth: "debate" },
      { question: "Si fueras el equipo directivo, ¿qué política de centro propondrías? ¿Prohibición, regulación o libre uso?", depth: "propuesta" },
    ],
    responseFramework: ["Describe tu posición inicial en 2-3 frases", "Argumenta con al menos 2 razones (una pedagógica, una ética)", "Anticipa una objeción a tu posición y respóndela", "Propón una acción concreta y viable"],
    peerReviewCriteria: ["¿La respuesta toma una posición clara?", "¿Incluye argumentos pedagógicos y éticos?", "¿Propone soluciones concretas y viables?", "¿Considera perspectivas diferentes a la propia?"],
  },
  {
    week: 2, title: "El prompt que discriminó sin querer", module: "Módulo 1", color: "#D97706", icon: "📐",
    category: "ética",
    scenario: "David, profesor de Lengua, usó C.R.E.F.O. para generar una actividad de escritura creativa. Su prompt decía: 'Genera 5 personajes diversos para una historia ambientada en un instituto'. La IA generó: un chico español deportista, una chica asiática estudiosa, un chico negro rapero, una chica latina bailarina y un chico árabe misterioso. David lo usó en clase sin darse cuenta de los estereotipos. Una alumna de origen marroquí señaló que el personaje árabe era ofensivo.",
    context: "Instituto público con alta diversidad cultural (42% alumnado de origen migrante). David completó el Módulo 0 y sabe sobre sesgos en teoría, pero no aplicó la auditoría a este material.",
    stakeholders: [
      { role: "David", position: "Se siente mal por el error y quiere corregirlo" },
      { role: "Alumna afectada", position: "Se sintió estereotipada y excluida" },
      { role: "Clase", position: "Algunos alumnos no vieron el problema; otros sí" },
      { role: "Departamento", position: "Preocupado por posibles quejas formales" },
    ],
    tensions: [
      "Intención vs. impacto: David no quería discriminar, pero el efecto fue dañino",
      "Teoría vs. práctica: sabía sobre sesgos pero no aplicó el protocolo",
      "Oportunidad pedagógica: ¿se puede convertir este error en una lección sobre estereotipos?",
    ],
    prompts: [
      { question: "Analiza el prompt de David usando C.R.E.F.O. ¿Qué elemento faltó o fue insuficiente para prevenir este sesgo?", depth: "análisis" },
      { question: "Reescribe el prompt de David incluyendo restricciones anti-sesgo específicas. Incluye las instrucciones exactas que evitarían el estereotipo.", depth: "propuesta" },
      { question: "¿Debería David usar este incidente como material didáctico en clase? ¿Cómo hacerlo sin revictimizar a la alumna afectada?", depth: "debate" },
    ],
    responseFramework: ["Identifica el sesgo con terminología precisa", "Conecta con un elemento de C.R.E.F.O. que habría prevenido el problema", "Propón la corrección técnica (prompt mejorado)", "Propón la respuesta pedagógica (cómo gestionar en el aula)"],
    peerReviewCriteria: ["¿Identifica correctamente el tipo de sesgo?", "¿El prompt corregido resolvería el problema?", "¿La respuesta pedagógica es sensible con la alumna afectada?", "¿Es viable implementar la propuesta?"],
  },
  {
    week: 3, title: "Los datos que escaparon", module: "Módulo 1", color: "#D97706", icon: "🔒",
    category: "ética",
    scenario: "Lucía, orientadora escolar, estaba creando un informe de atención a la diversidad. Para agilizar, pegó en ChatGPT un listado de 12 alumnos con nombre completo, diagnóstico (TDAH, TEA, dislexia), nivel de adaptación curricular y calificaciones del trimestre. Le pidió a la IA que 'organizara los datos y sugiriera intervenciones'. Lucía tiene el historial de ChatGPT activado y no ha configurado la privacidad.",
    context: "Colegio público. Los datos de orientación están bajo el régimen de protección más alto del GDPR (datos de salud de menores). El DPO del centro ha advertido sobre el uso de IA pero no hay formación específica.",
    stakeholders: [
      { role: "Lucía", position: "Necesita eficiencia pero no midió las consecuencias" },
      { role: "Alumnado afectado", position: "Sus datos de salud están ahora en servidores de OpenAI" },
      { role: "Familias", position: "No han dado consentimiento para este uso de datos" },
      { role: "DPO del centro", position: "Debe evaluar si hay que notificar a la AEPD" },
    ],
    tensions: [
      "Eficiencia vs. legalidad: el ahorro de tiempo no justifica la violación de datos",
      "Conocimiento vs. acción: ¿faltó formación o faltó responsabilidad?",
      "Consecuencias legales: ¿es obligatorio notificar a la AEPD? ¿Y a las familias?",
    ],
    prompts: [
      { question: "¿Qué datos de los que Lucía compartió son de categoría especial según el GDPR? Clasifícalos usando el semáforo de datos del curso.", depth: "análisis" },
      { question: "Como DPO del centro, redacta el protocolo de respuesta inmediata: los 6 pasos que deberían seguirse ahora.", depth: "propuesta" },
      { question: "¿Debería el centro notificar a las familias y/o a la AEPD? ¿Cuáles son las implicaciones de cada opción?", depth: "debate" },
    ],
    responseFramework: ["Clasifica los datos afectados por categoría GDPR", "Evalúa la gravedad del incidente (escala baja/media/alta/crítica)", "Propón acciones inmediatas (primeras 24h)", "Propón acciones preventivas (para que no vuelva a ocurrir)"],
    peerReviewCriteria: ["¿Demuestra conocimiento del GDPR?", "¿Las acciones propuestas son legalmente correctas?", "¿El protocolo es realista para un centro educativo?", "¿Incluye prevención, no solo reacción?"],
  },
  {
    week: 4, title: "La secuencia didáctica perfecta (¿o no?)", module: "Módulo 2", color: "#2563EB", icon: "📚",
    category: "pedagógica",
    scenario: "Roberto usó un prompt C.R.E.F.O. impecable para generar una secuencia didáctica de 10 sesiones sobre ecosistemas para 2º ESO. El prompt tenía contexto detallado, rol experto, especificidad con Bloom, formato tabla y restricciones de inclusión. La IA generó algo brillante en papel: actividades variadas, evaluación formativa, adaptaciones DUA. Pero al implementarla, descubrió que: (1) las actividades de laboratorio requerían material que el centro no tenía, (2) la temporalización era irreal (30 minutos para actividades que necesitaban 50), y (3) las 'adaptaciones DUA' eran superficiales (solo simplificaban vocabulario, no la tarea).",
    context: "Instituto público rural con recursos limitados. Roberto es jefe de departamento de Ciencias y quiere convencer a sus compañeros de usar IA para planificación.",
    stakeholders: [
      { role: "Roberto", position: "Frustrado: el prompt era técnicamente bueno pero el resultado no era viable" },
      { role: "Departamento", position: "Escéptico: 'Si un experto en prompts no logra resultados buenos, ¿para qué?'" },
      { role: "Alumnado NEAE", position: "Las adaptaciones superficiales no les sirven realmente" },
    ],
    tensions: [
      "Calidad del prompt vs. calidad pedagógica: un buen prompt no garantiza buen resultado",
      "Revisión experta: ¿cuánto de la salida de la IA debe revisarse/reescribirse?",
      "Expectativas: ¿estamos vendiendo la IA como más capaz de lo que es para planificación?",
    ],
    prompts: [
      { question: "¿Qué le faltó al prompt de Roberto que habría evitado los 3 problemas? Propón restricciones específicas adicionales.", depth: "análisis" },
      { question: "Diseña un 'protocolo de viabilidad' de 5 pasos para verificar que una secuencia didáctica generada por IA es implementable en tu contexto real.", depth: "propuesta" },
      { question: "¿Debemos considerar la salida de la IA como un borrador (que siempre requiere revisión experta) o como un producto (que debería ser usable tal cual)?", depth: "debate" },
    ],
    responseFramework: ["Identifica las limitaciones específicas que la IA no podía conocer", "Propón las restricciones del prompt que habrían ayudado", "Diseña el protocolo de verificación post-generación", "Define las expectativas realistas sobre IA en planificación"],
    peerReviewCriteria: ["¿Identifica correctamente los fallos?", "¿Las restricciones propuestas son concretas y verificables?", "¿El protocolo de viabilidad es práctico?", "¿Las expectativas son realistas sin ser derrotistas?"],
  },
  {
    week: 5, title: "Feedback de IA vs. feedback humano", module: "Módulo 3", color: "#059669", icon: "💬",
    category: "pedagógica",
    scenario: "Ana generó feedback individualizado con IA para 28 trabajos de escritura creativa de 1º Bachillerato. Usó Few-shot con 3 ejemplos gold standard. El feedback era técnicamente correcto: señalaba fortalezas, áreas de mejora y hacía preguntas de reflexión. Pero tres alumnos se quejaron: 'Esto no suena a usted, profe. ¿Lo ha escrito una máquina?' Ana no había revelado el uso de IA. Otro alumno dijo: 'El feedback me dice que mi metáfora es brillante, pero es exactamente la misma que le dice a María.'",
    context: "Ana lleva 8 años con estos alumnos (desde 3º ESO). Tienen una relación de confianza. La escritura creativa es una asignatura donde el feedback personal es especialmente valorado.",
    stakeholders: [
      { role: "Ana", position: "Quería ser más eficiente sin perder calidad, pero siente que rompió la confianza" },
      { role: "Alumnos que detectaron", position: "Se sienten engañados y menos valorados" },
      { role: "Alumnos satisfechos", position: "No notaron diferencia y valoraron la rapidez del feedback" },
    ],
    tensions: [
      "Transparencia: ¿deben saber los alumnos cuándo el feedback usa IA?",
      "Autenticidad: ¿puede el feedback de IA transmitir la relación personal profesor-alumno?",
      "Escala: 28 feedbacks manuales de calidad son inviables en tiempo real. ¿Cuál es la solución?",
    ],
    prompts: [
      { question: "¿Por qué el feedback generado 'sonaba igual' para distintos trabajos? Analiza qué falló en la técnica Few-shot de Ana y propón la corrección.", depth: "análisis" },
      { question: "Diseña un modelo híbrido: ¿qué parte del feedback debería generar la IA y qué parte debería siempre ser manual/personal?", depth: "propuesta" },
      { question: "¿Es éticamente aceptable dar feedback generado por IA sin revelar su origen? Debate considerando contextos diferentes (escritura creativa vs. examen de Física).", depth: "debate" },
    ],
    responseFramework: ["Analiza el fallo técnico del Few-shot", "Propón el modelo híbrido con porcentajes claros", "Toma posición sobre la transparencia", "Considera cómo comunicar el uso de IA al alumnado"],
    peerReviewCriteria: ["¿El análisis técnico es preciso?", "¿El modelo híbrido es viable para 28 alumnos?", "¿La posición sobre transparencia está argumentada?", "¿Se respeta la relación profesor-alumno?"],
  },
  {
    week: 6, title: "El kit de evaluación 'perfecto' con sesgo oculto", module: "Módulo 3", color: "#7C3AED", icon: "⚖️",
    category: "ética",
    scenario: "El departamento de Inglés usó IA para generar un banco de 100 preguntas de comprensión lectora para las evaluaciones trimestrales. Aplicaron C.R.E.F.O. cuidadosamente. Tras el primer examen, notaron que los alumnos de familias migrantes puntuaron significativamente más bajo que el resto. Al analizar las preguntas, descubrieron que muchas asumían conocimiento cultural anglosajón: referencias a Acción de Gracias, cricket, figuras idiomáticas británicas y contextos suburbanos americanos.",
    context: "Instituto con 38% de alumnado de origen migrante. El departamento se enorgullecía de su evaluación 'objetiva' porque las preguntas estaban bien formuladas técnicamente.",
    stakeholders: [
      { role: "Departamento", position: "Las preguntas son técnicamente correctas, el sesgo es cultural" },
      { role: "Alumnado migrante", position: "Penalizados no por competencia en inglés sino por falta de contexto cultural anglosajón" },
      { role: "Familias", position: "Algunas han reclamado que la evaluación no es justa" },
      { role: "Equipo directivo", position: "Necesita garantizar equidad evaluativa" },
    ],
    tensions: [
      "Sesgo invisible: las preguntas eran 'correctas' pero no equitativas",
      "Validez cultural vs. autenticidad lingüística: ¿deben las preguntas de inglés incluir contexto anglosajón?",
      "Responsabilidad: ¿fallo de la IA, del prompt, o de la falta de revisión?",
    ],
    prompts: [
      { question: "Analiza 3 formas en que el sesgo cultural puede infiltrarse en evaluaciones de idiomas generadas por IA, incluso con prompts técnicamente buenos.", depth: "análisis" },
      { question: "Reescribe las restricciones del prompt original para garantizar equidad cultural en evaluaciones de Inglés. Incluye al menos 5 restricciones específicas.", depth: "propuesta" },
      { question: "¿Debería el departamento anular las calificaciones del examen y repetirlo? Argumenta considerando equidad, logística y precedente.", depth: "debate" },
    ],
    responseFramework: ["Identifica los sesgos culturales específicos con ejemplos", "Propón restricciones anti-sesgo para el prompt", "Recomienda acción sobre las calificaciones afectadas", "Diseña protocolo de revisión de equidad para futuros exámenes"],
    peerReviewCriteria: ["¿Identifica sesgos culturales específicos?", "¿Las restricciones propuestas son concretas?", "¿La recomendación sobre calificaciones es justa y viable?", "¿El protocolo previene futuras situaciones similares?"],
  },
  {
    week: 7, title: "El proyecto integrador bajo presión", module: "Módulo 4", color: "#DC2626", icon: "🏗️",
    category: "integración",
    scenario: "Marta necesita entregar su proyecto integrador del curso: una secuencia didáctica completa de 5 sesiones con materiales, evaluación y adaptaciones, todo generado y documentado con IA. Tiene una semana. La tentación es generar todo rápidamente sin el proceso de iteración completo. Su compañera Elena le dice: 'Yo hice 2 prompts rápidos y ya tengo las 5 sesiones. ¿Para qué iterar si el resultado es similar?'",
    context: "Última semana del curso. Marta ha sido rigurosa durante todo el curso pero está agotada. Elena ha tenido un enfoque más pragmático ('lo que funcione'). Ambas son buenas docentes.",
    stakeholders: [
      { role: "Marta", position: "Quiere hacerlo bien pero el tiempo aprieta" },
      { role: "Elena", position: "El resultado final de ambos enfoques puede parecer similar" },
      { role: "El alumnado que usará los materiales", position: "La calidad impacta directamente en su aprendizaje" },
    ],
    tensions: [
      "Proceso vs. producto: ¿importa cómo se llegó al resultado si el producto es bueno?",
      "Rigor vs. pragmatismo: ¿cuándo es suficiente 'suficientemente bueno'?",
      "Autenticidad: ¿el portafolio debe reflejar el proceso real o solo el resultado?",
    ],
    prompts: [
      { question: "Compara los dos enfoques (iteración rigurosa vs. generación rápida). ¿En qué casos el resultado será similar y en cuáles será significativamente diferente?", depth: "análisis" },
      { question: "Diseña un 'protocolo de mínimos' para cuando no hay tiempo para iteración completa: ¿cuáles son los 3 pasos irrenunciables antes de usar un material generado?", depth: "propuesta" },
      { question: "¿El proceso de iteración tiene valor formativo independiente del resultado? ¿O solo importa si produce mejores materiales?", depth: "debate" },
    ],
    responseFramework: ["Compara honestamente ambos enfoques con pros y contras", "Define los mínimos irrenunciables", "Toma posición sobre proceso vs. producto", "Conecta con tu propia experiencia en el curso"],
    peerReviewCriteria: ["¿La comparación es honesta y matizada?", "¿Los mínimos propuestos son realmente 'mínimos' y no una lista exhaustiva?", "¿La posición sobre proceso vs. producto está argumentada?", "¿Hay reflexión personal auténtica?"],
  },
  {
    week: 8, title: "Tu centro adopta IA: ¿qué recomiendas?", module: "Módulo 5", color: "#111827", icon: "🎓",
    category: "integración",
    scenario: "El equipo directivo de tu centro te ha pedido que líderes la implementación de IA en la práctica docente. Tienes que presentar una propuesta al claustro. El 30% del profesorado es entusiasta, el 40% es escéptico pero abierto, y el 30% es contrario. Debes convencer al claustro de una estrategia que sea ambiciosa pero realista, que proteja los datos del alumnado, y que no genere más carga de trabajo.",
    context: "Centro de 45 docentes, Infantil a Bachillerato. Presupuesto limitado. No hay política de IA previa. La Consejería ha publicado recomendaciones pero no obligaciones.",
    stakeholders: [
      { role: "Docentes entusiastas", position: "Quieren libertad para experimentar" },
      { role: "Docentes escépticos", position: "Necesitan ver valor concreto sin carga extra" },
      { role: "Docentes contrarios", position: "Preocupados por ética, empleo y deshumanización" },
      { role: "Familias", position: "Quieren saber cómo se usa y que sus hijos estén protegidos" },
      { role: "Alumnado", position: "Ya usa IA por su cuenta; necesita orientación" },
    ],
    tensions: [
      "Ritmos diferentes: no todos los docentes pueden (ni deben) adoptar IA al mismo ritmo",
      "Política vs. práctica: las normas deben ser claras pero no asfixiantes",
      "Formación: ¿obligatoria o voluntaria? ¿en horario laboral o fuera?",
    ],
    prompts: [
      { question: "Diseña la presentación al claustro en 5 puntos clave. ¿Cómo convences a los escépticos sin alienar a los contrarios?", depth: "propuesta" },
      { question: "Redacta los 10 principios de tu política de uso de IA para el centro. Deben cubrir: privacidad, uso docente, uso del alumnado, formación y evaluación.", depth: "propuesta" },
      { question: "¿La formación en IA debería ser obligatoria para el profesorado? Argumenta considerando autonomía profesional, responsabilidad institucional y derecho del alumnado a una educación actualizada.", depth: "debate" },
    ],
    responseFramework: ["Sintetiza tu aprendizaje del curso en una visión clara", "Propón acciones concretas con plazos y responsables", "Anticipa resistencias y prepara respuestas", "Define indicadores de éxito a 6 meses"],
    peerReviewCriteria: ["¿La propuesta es realista para un centro real?", "¿Aborda las preocupaciones de los tres grupos?", "¿La política de privacidad es robusta?", "¿Incluye indicadores de evaluación?"],
  },
];

// ─── Components ─────────────────────────────────────────────────────────────

function CaseView({
  caseData,
  response,
  onUpdateResponse,
  expanded,
  onToggle,
}: {
  caseData: WeeklyCase;
  response: UserResponse;
  onUpdateResponse: (r: UserResponse) => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const cc = categoryConfig[caseData.category];

  const startEdit = (idx: number) => {
    setEditing(idx);
    setDraft(response.responses[idx] || "");
  };

  const saveEdit = () => {
    if (editing === null) return;
    const responses = [...response.responses];
    responses[editing] = draft;
    onUpdateResponse({ ...response, responses });
    setEditing(null);
  };

  const toggleComplete = () => {
    onUpdateResponse({ ...response, completed: !response.completed });
  };

  const answeredCount = response.responses.filter(r => r.trim()).length;

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
      response.completed ? "border-emerald-200" : "border-gray-200"
    }`}>
      {/* Header */}
      <button onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
        style={{ borderLeftWidth: 4, borderLeftColor: caseData.color, borderLeftStyle: "solid" }}>
        {response.completed
          ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: caseData.color }}>
              Semana {caseData.week}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${cc.badge}`}>
              {caseData.category}
            </span>
            <span className="text-[10px] text-gray-400">{caseData.module}</span>
          </div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <span>{caseData.icon}</span> {caseData.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-400">{answeredCount}/{caseData.prompts.length}</span>
          {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5">
          {/* Scenario */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Escenario</span>
            <p className="text-sm text-gray-800 leading-relaxed mt-1.5">{caseData.scenario}</p>
          </div>

          {/* Context */}
          <div className="bg-blue-50 rounded-xl p-3.5 mb-4 border border-blue-100">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Contexto</span>
            <p className="text-xs text-blue-900 leading-relaxed mt-1">{caseData.context}</p>
          </div>

          {/* Stakeholders */}
          <div className="mb-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Personas implicadas</span>
            <div className="grid sm:grid-cols-2 gap-2">
              {caseData.stakeholders.map((sh, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-2.5">
                  <span className="text-xs font-bold text-gray-900">{sh.role}</span>
                  <p className="text-[11px] text-gray-600 mt-0.5">{sh.position}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tensions */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-2 block">Tensiones a considerar</span>
            {caseData.tensions.map((t, i) => (
              <p key={i} className="text-xs text-amber-900 leading-relaxed flex items-start gap-2 mb-1 last:mb-0">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">⚡</span> {t}
              </p>
            ))}
          </div>

          {/* Discussion prompts */}
          <div className="space-y-3 mb-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Preguntas para el foro</span>
            {caseData.prompts.map((prompt, idx) => {
              const dc = depthConfig[prompt.depth];
              const hasResponse = (response.responses[idx] || "").trim().length > 0;

              return (
                <div key={idx} className="rounded-xl border-2 border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 flex items-start gap-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5" style={{ backgroundColor: dc.color + "15", color: dc.color }}>
                      {dc.label}
                    </span>
                    <p className="text-sm text-gray-800 leading-relaxed flex-1">{prompt.question}</p>
                  </div>

                  {/* Response area */}
                  <div className="px-4 pb-3 border-t border-gray-100 pt-3">
                    {editing === idx ? (
                      <div className="space-y-2">
                        <textarea value={draft} onChange={e => setDraft(e.target.value)}
                          rows={4} placeholder="Escribe tu respuesta para el foro..."
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-y" />
                        <div className="flex gap-2">
                          <button onClick={saveEdit} className="flex items-center gap-1 text-xs font-medium bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">
                            <Save className="w-3 h-3" /> Guardar
                          </button>
                          <button onClick={() => setEditing(null)} className="text-xs text-gray-500 px-3 py-1.5">Cancelar</button>
                        </div>
                      </div>
                    ) : hasResponse ? (
                      <div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{response.responses[idx]}</p>
                        <button onClick={() => startEdit(idx)} className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium mt-2 flex items-center gap-1">
                          <Edit3 className="w-3 h-3" /> Editar
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(idx)}
                        className="w-full text-left text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors flex items-center gap-1.5">
                        <Edit3 className="w-3 h-3" /> Escribir respuesta
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Response framework */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 mb-4">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-2 block">Estructura recomendada para tu respuesta</span>
            {caseData.responseFramework.map((step, i) => (
              <p key={i} className="text-xs text-indigo-900 leading-relaxed flex items-start gap-2 mb-1 last:mb-0">
                <span className="text-indigo-400 font-bold flex-shrink-0">{i + 1}.</span> {step}
              </p>
            ))}
          </div>

          {/* Peer review criteria */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-4">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2 block">Criterios para revisión entre pares</span>
            {caseData.peerReviewCriteria.map((criterion, i) => (
              <p key={i} className="text-xs text-emerald-900 leading-relaxed flex items-start gap-2 mb-1 last:mb-0">
                <span className="text-emerald-400 flex-shrink-0">✓</span> {criterion}
              </p>
            ))}
          </div>

          {/* Complete */}
          <button onClick={toggleComplete}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
              response.completed
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}>
            {response.completed ? "Reabrir caso" : "✓ Marcar caso como completado"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

function createInitialResponses(): Record<number, UserResponse> {
  const init: Record<number, UserResponse> = {};
  cases.forEach(c => { init[c.week] = { caseWeek: c.week, responses: Array(c.prompts.length).fill(""), completed: false }; });
  return init;
}

export default function WeeklyCases() {
  const [responses, setResponses] = usePersistedToolState<Record<number, UserResponse>>(
    "weekly-cases",
    createInitialResponses(),
  );
  const [expandedCase, setExpandedCase] = useState<number | null>(1);
  const [filter, setFilter] = useState<"all" | "ética" | "técnica" | "pedagógica" | "integración">("all");

  const updateResponse = useCallback((week: number, r: UserResponse) => {
    setResponses(prev => ({ ...prev, [week]: r }));
  }, []);

  const filteredCases = filter === "all" ? cases : cases.filter(c => c.category === filter);
  const completedCount = Object.values(responses).filter(r => r.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <MessageCircle className="w-3.5 h-3.5" />
            Evaluación Continua · Foro Semanal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Casos Semanales para Debate
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Un caso real por semana: analiza, argumenta y debate con tu grupo.
            Cada caso incluye escenario, tensiones, preguntas de discusión
            y criterios para revisión entre pares.
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-3.5 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Progreso</span>
            <span className="text-xs text-gray-400">{completedCount}/8 casos completados</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${(completedCount / 8) * 100}%` }} />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1.5 justify-center mb-6">
          {(["all", "ética", "técnica", "pedagógica", "integración"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                filter === f ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
              }`}>
              {f === "all" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Cases */}
        <div className="space-y-4">
          {filteredCases.map(caseData => (
            <CaseView key={caseData.week} caseData={caseData}
              response={responses[caseData.week]}
              onUpdateResponse={r => updateResponse(caseData.week, r)}
              expanded={expandedCase === caseData.week}
              onToggle={() => setExpandedCase(prev => prev === caseData.week ? null : caseData.week)} />
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          8 casos · 24 preguntas de debate · 4 categorías · Curso "Prompt Mastery para Docentes"
        </p>
      </div>
    </div>
  );
}
