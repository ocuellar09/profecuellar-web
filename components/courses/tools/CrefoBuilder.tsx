"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Layers,
  User,
  Target,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Lightbulb,
  BookOpen,
  Eye,
  EyeOff,
  Wand2,
  Info,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface CrefoField {
  key: CrefoKey;
  label: string;
  fullLabel: string;
  letter: string;
  icon: React.ReactNode;
  color: string;
  bgLight: string;
  borderColor: string;
  placeholder: string;
  helpText: string;
  examples: string[];
}

type CrefoKey = "contexto" | "rol" | "especificidad" | "formato" | "objetivos";

interface PromptTemplate {
  id: string;
  name: string;
  area: string;
  emoji: string;
  values: Record<CrefoKey, string>;
}

// ─── Field Definitions ──────────────────────────────────────────────────────

const crefoFields: CrefoField[] = [
  {
    key: "contexto",
    label: "Contexto",
    fullLabel: "Contexto",
    letter: "C",
    icon: <Layers className="w-4 h-4" />,
    color: "#2563EB",
    bgLight: "bg-blue-50",
    borderColor: "border-blue-300",
    placeholder: "Ej: Clase de 3º de ESO, 28 alumnos, asignatura de Biología, currículo LOMLOE, nivel heterogéneo con 3 alumnos NEAE...",
    helpText: "Define el escenario completo: nivel educativo, asignatura, marco curricular, características del grupo, recursos disponibles.",
    examples: [
      "Clase de 4º de Primaria, 25 alumnos, Matemáticas, colegio público urbano",
      "2º Bachillerato, Historia de España, preparación EBAU, 30 alumnos",
      "Grupo de FP Grado Medio, módulo de Ofimática, 18 alumnos adultos",
    ],
  },
  {
    key: "rol",
    label: "Rol",
    fullLabel: "Rol",
    letter: "R",
    icon: <User className="w-4 h-4" />,
    color: "#7C3AED",
    bgLight: "bg-violet-50",
    borderColor: "border-violet-300",
    placeholder: "Ej: Actúa como un experto en didáctica de las ciencias naturales con 20 años de experiencia en educación secundaria...",
    helpText: "Asigna una identidad a la IA: disciplina + nivel de experiencia + contexto específico. Cuanto más preciso, mejor resultado.",
    examples: [
      "Actúa como un profesor de Lengua especializado en escritura creativa para adolescentes",
      "Eres un diseñador instruccional experto en Diseño Universal para el Aprendizaje (DUA)",
      "Actúa como un orientador educativo con experiencia en alumnado con altas capacidades",
    ],
  },
  {
    key: "especificidad",
    label: "Especificidad",
    fullLabel: "Especificidad (Tarea)",
    letter: "E",
    icon: <Target className="w-4 h-4" />,
    color: "#D97706",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-300",
    placeholder: "Ej: Diseña una secuencia de 5 actividades progresivas sobre el ciclo del agua, cada una de 15 minutos, usando verbos de la taxonomía de Bloom...",
    helpText: "Usa verbos de acción precisos (Diseña, Analiza, Contrasta, Genera, Evalúa). Define alcance, cantidad, duración, nivel cognitivo.",
    examples: [
      "Diseña 8 preguntas de comprensión lectora: 3 literales, 3 inferenciales, 2 críticas",
      "Analiza este texto y genera un resumen de 150 palabras + 5 preguntas de discusión",
      "Crea una rúbrica analítica con 4 criterios y 4 niveles de desempeño para evaluar presentaciones orales",
    ],
  },
  {
    key: "formato",
    label: "Formato",
    fullLabel: "Formato",
    letter: "F",
    icon: <FileText className="w-4 h-4" />,
    color: "#059669",
    bgLight: "bg-emerald-50",
    borderColor: "border-emerald-300",
    placeholder: "Ej: Presenta el resultado en una tabla Markdown con columnas [Actividad | Duración | Materiales | Objetivo de aprendizaje]...",
    helpText: "Define exactamente cómo quieres la salida: tabla, lista numerada, narrativa, código, JSON, rúbrica, guion, etc.",
    examples: [
      "Formato: tabla con columnas [Criterio | Excelente (4) | Bueno (3) | Suficiente (2) | Insuficiente (1)]",
      "Presenta como lista numerada con cada ítem en formato: [Pregunta] — [Respuesta esperada] — [Nivel Bloom]",
      "Redacta en formato carta formal dirigida a las familias, tono cálido pero profesional, máximo 300 palabras",
    ],
  },
  {
    key: "objetivos",
    label: "Objetivos",
    fullLabel: "Objetivos y Restricciones",
    letter: "O",
    icon: <ShieldCheck className="w-4 h-4" />,
    color: "#DC2626",
    bgLight: "bg-red-50",
    borderColor: "border-red-300",
    placeholder: "Ej: NO uses vocabulario universitario. NO incluyas nombres reales de alumnos. Asegúrate de que las actividades sean realizables sin laboratorio...",
    helpText: "Lo que SÍ debe lograr y lo que NO debe hacer. Restricciones de contenido, tono, extensión, y límites éticos.",
    examples: [
      "NO uses estereotipos culturales. Incluye representación diversa. Evita terminología sexista",
      "Las actividades deben ser realizables en un aula sin ordenadores. Máximo 2 páginas de extensión",
      "Cita fuentes verificables. No inventes datos estadísticos. Usa lenguaje inclusivo",
    ],
  },
];

// ─── Templates ──────────────────────────────────────────────────────────────

const templates: PromptTemplate[] = [
  {
    id: "exam",
    name: "Examen / Evaluación",
    area: "Evaluación",
    emoji: "📝",
    values: {
      contexto: "Clase de [nivel educativo], asignatura de [asignatura], [nº] alumnos. Unidad sobre [tema]. Marco curricular: [LOMLOE/otro].",
      rol: "Actúa como un experto en evaluación formativa de [asignatura] con experiencia en diseño de pruebas alineadas con competencias clave.",
      especificidad: "Diseña un examen de [duración] minutos con [nº] preguntas en dificultad progresiva:\n- [nº] preguntas de opción múltiple (4 opciones, 1 correcta)\n- [nº] preguntas de desarrollo breve\n- [nº] problemas/preguntas de aplicación\nAlineado con los estándares de aprendizaje de [bloque curricular].",
      formato: "Formato tabla con columnas: [Nº | Enunciado | Tipo | Nivel Bloom | Puntuación]\nIncluye clave de respuestas al final con justificación breve.",
      objetivos: "No uses lenguaje ambiguo en los enunciados. Evita preguntas trampa. Las opciones incorrectas deben ser plausibles pero claramente erróneas. No requieras conocimiento fuera del currículo trabajado.",
    },
  },
  {
    id: "lesson",
    name: "Secuencia Didáctica",
    area: "Planificación",
    emoji: "📚",
    values: {
      contexto: "Clase de [nivel educativo], [nº] alumnos, asignatura de [asignatura]. Incluye [nº] alumnos con [tipo de NEAE]. Duración: [nº] sesiones de [minutos] minutos.",
      rol: "Actúa como un diseñador instruccional especializado en [asignatura] con experiencia en metodologías activas y diseño inverso (UbD).",
      especificidad: "Diseña una secuencia didáctica sobre [tema] siguiendo el diseño inverso:\n1. Define 3 objetivos de aprendizaje (verbos Bloom: Analizar/Evaluar/Crear)\n2. Propón la evidencia de evaluación para cada objetivo\n3. Desarrolla la secuencia de sesiones con una actividad principal por sesión\nIncluye actividades variadas: individual, parejas y grupo.",
      formato: "Presenta en formato:\n- Tabla resumen: [Sesión | Objetivo | Actividad | Recursos | Evaluación]\n- Desarrollo detallado de cada sesión con temporalización interna (minutos)",
      objetivos: "Las actividades deben ser realizables con recursos reales de un centro público. Incluye una adaptación para alumnado con NEAE en cada sesión. No uses metodología exclusivamente expositiva.",
    },
  },
  {
    id: "rubric",
    name: "Rúbrica de Evaluación",
    area: "Evaluación",
    emoji: "📊",
    values: {
      contexto: "Para evaluar [tipo de tarea/producto] de alumnos de [nivel educativo] en la asignatura de [asignatura]. Competencia clave: [competencia].",
      rol: "Actúa como un experto en evaluación criterial y diseño de rúbricas analíticas alineadas con el currículo competencial.",
      especificidad: "Crea una rúbrica analítica con:\n- [4-5] criterios de evaluación observables y medibles\n- 4 niveles de desempeño: Excelente (4), Bueno (3), Suficiente (2), Insuficiente (1)\n- Descriptores específicos y diferenciados para cada celda (no genéricos)\nCada descriptor debe incluir un indicador observable concreto.",
      formato: "Tabla con columnas: [Criterio | Excelente (4) | Bueno (3) | Suficiente (2) | Insuficiente (1) | Peso %]\nIncluir fila final de puntuación total.",
      objetivos: "Los descriptores deben usar verbos observables (identifica, aplica, argumenta), NO verbos vagos (comprende, sabe, entiende). La diferencia entre niveles debe ser clara y gradual. Incluye un ejemplo de trabajo en nivel 'Bueno' para calibrar.",
    },
  },
  {
    id: "differentiation",
    name: "Material Diferenciado (DUA)",
    area: "Diferenciación",
    emoji: "🎯",
    values: {
      contexto: "Texto/recurso original sobre [tema] para [nivel educativo]. El grupo incluye alumnos con niveles de competencia lectora variados (A2 a C1) y [nº] alumnos con [tipo NEAE].",
      rol: "Actúa como un especialista en Diseño Universal para el Aprendizaje (DUA) con experiencia en adaptación de materiales para aulas inclusivas.",
      especificidad: "Adapta el siguiente texto/recurso a 3 niveles de accesibilidad:\n\nNivel 1 (Alta accesibilidad): Vocabulario básico, frases máx. 10 palabras, apoyos visuales con emoji, analogías cotidianas. Máx. [nº] palabras.\n\nNivel 2 (Estándar): Vocabulario con términos técnicos definidos al usarlos, frases compuestas, conectores causales. Máx. [nº] palabras.\n\nNivel 3 (Ampliación): Vocabulario técnico completo, conexiones interdisciplinares, preguntas de extensión. Máx. [nº] palabras.",
      formato: "Cada nivel en un bloque separado con encabezado claro. Incluir para cada nivel:\n- El texto adaptado\n- 2 preguntas de comprensión ajustadas al nivel\n- [Indicación de imagen] donde convenga apoyo visual",
      objetivos: "El contenido conceptual DEBE ser el mismo en los 3 niveles — solo cambia la forma de presentarlo. No simplifiques las ideas, simplifica el lenguaje. Evita tono infantilizante en el Nivel 1.",
    },
  },
  {
    id: "feedback",
    name: "Feedback de Trabajo",
    area: "Evaluación",
    emoji: "💬",
    values: {
      contexto: "Trabajo de un alumno de [nivel educativo] en [asignatura]. Tipo de tarea: [descripción]. El alumno tiene perfil de [descripción general sin PII].",
      rol: "Actúa como un evaluador formativo especializado en retroalimentación cualitativa centrada en el crecimiento del alumno.",
      especificidad: "Analiza el siguiente trabajo aplicando estos criterios: [criterio 1], [criterio 2], [criterio 3].\n\nGenera un feedback estructurado que incluya:\n1. Dos fortalezas específicas (con cita textual del trabajo)\n2. Dos áreas de mejora con sugerencia concreta de siguiente paso\n3. Una pregunta de reflexión para el alumno",
      formato: "Formato:\n🌟 Fortalezas:\n  1. [fortaleza + cita]\n  2. [fortaleza + cita]\n\n🔧 Áreas de mejora:\n  1. [área + sugerencia]\n  2. [área + sugerencia]\n\n🤔 Para reflexionar:\n  [pregunta]",
      objetivos: "Tono motivador y constructivo. NO incluyas calificación numérica. NO uses lenguaje negativo ('mal', 'incorrecto', 'falta'). Usa lenguaje de crecimiento ('puedes mejorar', 'el siguiente paso sería'). IMPORTANTE: el trabajo debe estar ANONIMIZADO — sin nombres reales.",
    },
  },
  {
    id: "empty",
    name: "Empezar desde cero",
    area: "Personalizado",
    emoji: "✨",
    values: {
      contexto: "",
      rol: "",
      especificidad: "",
      formato: "",
      objetivos: "",
    },
  },
];

// ─── Quality Score ──────────────────────────────────────────────────────────

function calculateQuality(values: Record<CrefoKey, string>): { score: number; feedback: string[] } {
  const feedback: string[] = [];
  let score = 0;

  // Contexto checks
  if (values.contexto.length > 20) {
    score += 15;
    if (/\d/.test(values.contexto)) score += 5; // has numbers (grade level, qty)
    else feedback.push("Contexto: añade datos concretos (nivel educativo, nº alumnos)");
  } else {
    feedback.push("Contexto: describe el escenario (nivel, asignatura, grupo)");
  }

  // Rol checks
  if (values.rol.length > 15) {
    score += 15;
    if (/experto|especialista|profesor|diseñador|orientador/i.test(values.rol)) score += 5;
    else feedback.push("Rol: especifica la expertise (ej. 'experto en didáctica de...')");
  } else {
    feedback.push("Rol: asigna una identidad profesional a la IA");
  }

  // Especificidad checks
  if (values.especificidad.length > 30) {
    score += 15;
    if (/diseña|crea|analiza|genera|evalúa|contrasta|desarrolla|propón/i.test(values.especificidad)) score += 5;
    else feedback.push("Especificidad: usa verbos de acción precisos (Diseña, Analiza, Genera)");
    if (/\d/.test(values.especificidad)) score += 5;
    else feedback.push("Especificidad: añade cantidades concretas (nº de preguntas, duración)");
  } else {
    feedback.push("Especificidad: describe la tarea con verbos de acción y alcance claro");
  }

  // Formato checks
  if (values.formato.length > 15) {
    score += 15;
    if (/tabla|lista|formato|columna|markdown|json|estructura/i.test(values.formato)) score += 5;
    else feedback.push("Formato: especifica la estructura exacta (tabla, lista, narrativa)");
  } else {
    feedback.push("Formato: define cómo quieres la salida");
  }

  // Objetivos checks
  if (values.objetivos.length > 15) {
    score += 10;
    if (/no |evita|sin |nunca/i.test(values.objetivos)) score += 5;
    else feedback.push("Objetivos: añade restricciones explícitas (lo que NO debe hacer)");
  } else {
    feedback.push("Objetivos: define lo que sí y lo que no debe hacer la IA");
  }

  return { score: Math.min(score, 100), feedback: feedback.slice(0, 3) };
}

function QualityMeter({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 80) return { bar: "#059669", text: "text-emerald-700", label: "Excelente" };
    if (score >= 60) return { bar: "#2563EB", text: "text-blue-700", label: "Bueno" };
    if (score >= 40) return { bar: "#D97706", text: "text-amber-700", label: "Mejorable" };
    return { bar: "#DC2626", text: "text-red-700", label: "Incompleto" };
  };

  const c = getColor();

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${score}%`, backgroundColor: c.bar }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums ${c.text}`}>
        {score}% — {c.label}
      </span>
    </div>
  );
}

// ─── Copy Button ────────────────────────────────────────────────────────────

function CopyButton({ text, label = "Copiar prompt" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      disabled={text.trim().length === 0}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
        copied
          ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
          : text.trim().length > 0
          ? "bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-900 cursor-pointer"
          : "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed"
      }`}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? "¡Copiado!" : label}
    </button>
  );
}

// ─── Field Editor ───────────────────────────────────────────────────────────

function FieldEditor({
  field,
  value,
  onChange,
  expanded,
  onToggle,
}: {
  field: CrefoField;
  value: string;
  onChange: (val: string) => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [showExamples, setShowExamples] = useState(false);
  const filled = value.trim().length > 10;

  return (
    <div className={`rounded-xl border-2 transition-all duration-200 overflow-hidden ${
      expanded ? field.borderColor : filled ? "border-gray-300 bg-gray-50/50" : "border-gray-200"
    }`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: field.color }}
        >
          {field.letter}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 text-sm">{field.fullLabel}</span>
            {filled && !expanded && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          </div>
          {!expanded && value && (
            <p className="text-xs text-gray-500 truncate mt-0.5">{value}</p>
          )}
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-xs text-gray-500 leading-relaxed">{field.helpText}</p>

          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-800 leading-relaxed placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-y"
            style={{ "--tw-ring-color": field.color } as React.CSSProperties}
          />

          {/* Examples toggle */}
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-1.5 text-xs font-medium hover:underline"
            style={{ color: field.color }}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {showExamples ? "Ocultar ejemplos" : "Ver ejemplos"}
          </button>

          {showExamples && (
            <div className={`rounded-lg p-3 space-y-2 ${field.bgLight}`}>
              {field.examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => onChange(ex)}
                  className="w-full text-left text-xs text-gray-700 leading-relaxed p-2 rounded-md hover:bg-white/60 transition-colors cursor-pointer"
                >
                  <span className="font-medium" style={{ color: field.color }}>Usar → </span>{ex}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function CrefoBuilder() {
  const [values, setValues] = useState<Record<CrefoKey, string>>({
    contexto: "",
    rol: "",
    especificidad: "",
    formato: "",
    objetivos: "",
  });
  const [expandedField, setExpandedField] = useState<CrefoKey | null>("contexto");
  const [showPreview, setShowPreview] = useState(true);
  const [showTemplates, setShowTemplates] = useState(true);

  const updateField = useCallback((key: CrefoKey, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  }, []);

  const loadTemplate = useCallback((template: PromptTemplate) => {
    setValues(template.values);
    setShowTemplates(false);
    setExpandedField("contexto");
  }, []);

  const resetAll = useCallback(() => {
    setValues({ contexto: "", rol: "", especificidad: "", formato: "", objetivos: "" });
    setExpandedField("contexto");
    setShowTemplates(true);
  }, []);

  const toggleField = useCallback((key: CrefoKey) => {
    setExpandedField((prev) => (prev === key ? null : key));
  }, []);

  // Build the final prompt
  const assembledPrompt = useMemo(() => {
    const parts: string[] = [];

    if (values.rol.trim()) parts.push(values.rol.trim());
    if (values.contexto.trim()) parts.push(`\nContexto: ${values.contexto.trim()}`);
    if (values.especificidad.trim()) parts.push(`\nTarea: ${values.especificidad.trim()}`);
    if (values.formato.trim()) parts.push(`\nFormato de salida: ${values.formato.trim()}`);
    if (values.objetivos.trim()) parts.push(`\nRestricciones: ${values.objetivos.trim()}`);

    return parts.join("\n");
  }, [values]);

  const quality = useMemo(() => calculateQuality(values), [values]);

  const filledCount = crefoFields.filter((f) => values[f.key].trim().length > 10).length;

  return (
    <div className="min-h-screen bg-gray-50/80 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Wand2 className="w-3.5 h-3.5" />
            Módulo 1 · Herramienta Práctica
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Constructor C.R.E.F.O.
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Construye prompts estructurados paso a paso. Completa cada sección del
            framework y obtén un prompt listo para copiar y usar.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Builder */}
          <div className="lg:col-span-3 space-y-4">
            {/* Templates */}
            {showTemplates && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Empieza con una plantilla o desde cero
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => loadTemplate(t)}
                      className="text-left rounded-xl border-2 border-gray-200 p-3 hover:border-gray-400 hover:shadow-sm transition-all bg-white"
                    >
                      <span className="text-lg mb-1 block">{t.emoji}</span>
                      <span className="text-sm font-semibold text-gray-900 block">{t.name}</span>
                      <span className="text-[11px] text-gray-400">{t.area}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Progress bar */}
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Calidad del prompt
                </span>
                <span className="text-xs text-gray-400">{filledCount}/5 secciones</span>
              </div>
              <QualityMeter score={quality.score} />
              {quality.feedback.length > 0 && (
                <div className="mt-2.5 space-y-1">
                  {quality.feedback.map((f, i) => (
                    <p key={i} className="text-[11px] text-gray-500 flex items-start gap-1.5">
                      <Info className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Fields */}
            <div className="space-y-2.5">
              {crefoFields.map((field) => (
                <FieldEditor
                  key={field.key}
                  field={field}
                  value={values[field.key]}
                  onChange={(val) => updateField(field.key, val)}
                  expanded={expandedField === field.key}
                  onToggle={() => toggleField(field.key)}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={resetAll}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Limpiar todo
              </button>
              {!showTemplates && (
                <button
                  onClick={() => setShowTemplates(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Ver plantillas
                </button>
              )}
            </div>
          </div>

          {/* Right: Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Prompt generado
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {showPreview && (
                  <div className="p-5">
                    {assembledPrompt.trim() ? (
                      <>
                        <pre className="text-sm text-gray-800 leading-relaxed whitespace-pre-line font-mono bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-[60vh] overflow-y-auto">
                          {assembledPrompt}
                        </pre>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[11px] text-gray-400">
                            {assembledPrompt.split(/\s+/).length} palabras
                          </span>
                          <CopyButton text={assembledPrompt} />
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-10">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                          <Wand2 className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">
                          Completa las secciones C.R.E.F.O. para
                          <br />
                          generar tu prompt aquí
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tips card */}
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Consejo rápido
                  </span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {filledCount === 0 && "Empieza eligiendo una plantilla o escribe directamente en cada sección. No hay orden obligatorio."}
                  {filledCount === 1 && "Buen inicio. Un prompt con solo 1 sección producirá resultados genéricos. Completa al menos C, E y F."}
                  {filledCount === 2 && "Vas bien. Añade el Formato para controlar exactamente cómo quieres la salida."}
                  {filledCount === 3 && "Ya tienes un prompt funcional. Las Restricciones (O) son las que marcan la diferencia entre 'bien' y 'excelente'."}
                  {filledCount === 4 && "Casi completo. Revisa que los verbos de la Especificidad sean precisos y que el Formato sea explícito."}
                  {filledCount === 5 && "¡Prompt completo! Cópialo, pruébalo en tu LLM favorito, y documenta el resultado en tu cuaderno de iteración."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-10">
          Framework C.R.E.F.O. · Curso &quot;Prompt Mastery para Docentes&quot;
        </p>
      </div>
    </div>
  );
}
