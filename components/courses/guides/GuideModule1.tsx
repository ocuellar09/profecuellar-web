"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useCallback, useMemo } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Layers,
  User,
  Target,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
  Lightbulb,
  Sparkles,
  Eye,
  GitCompare,
  FlaskConical,
  RotateCcw,
  Box,
  Copy,
  Check,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface CheckpointQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// ─── Reusable Components ────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-gray-700 transition-colors">
      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

function Checkpoint({ question, onComplete }: { question: CheckpointQuestion; onComplete: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleCheck = () => { setRevealed(true); if (selected === question.correctIndex) onComplete(); };
  const isCorrect = selected === question.correctIndex;

  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 my-6">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="w-4 h-4 text-amber-600" />
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Checkpoint</span>
      </div>
      <p className="text-[15px] md:text-base font-semibold text-gray-900 mb-4 leading-relaxed">{question.question}</p>
      <div className="space-y-2 mb-4">
        {question.options.map((opt, i) => {
          let cls = "border-gray-200 bg-white";
          if (revealed) {
            if (i === question.correctIndex) cls = "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200";
            else if (i === selected) cls = "border-red-400 bg-red-50 ring-2 ring-red-200";
            else cls = "border-gray-200 bg-gray-50 text-gray-600";
          } else if (i === selected) cls = "border-amber-400 bg-amber-50 ring-2 ring-amber-200";
          return (
            <button
              key={i}
              onClick={() => !revealed && setSelected(i)}
              disabled={revealed}
              className={`w-full text-left rounded-lg border-2 p-4 text-[15px] md:text-base text-gray-900 leading-relaxed transition-all ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {!revealed ? (
        <button
          onClick={handleCheck}
          disabled={selected === null}
          className={`w-full py-3 rounded-xl font-semibold text-base transition-all ${selected !== null ? "bg-amber-600 text-white hover:bg-amber-700 cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
        >
          Verificar
        </button>
      ) : (
        <div className={`rounded-lg p-3 ${isCorrect ? "bg-emerald-100 border border-emerald-300" : "bg-red-100 border border-red-300"}`}>
          <p className="text-[15px] md:text-base leading-relaxed" style={{ color: isCorrect ? "#064e3b" : "#7f1d1d" }}>
            {isCorrect ? "✓ " : "✗ "}{question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

function BeforeAfter({ before, after, label }: { before: string; after: string; label: string }) {
  const [showAfter, setShowAfter] = useState(false);
  return (
    <div className="rounded-xl border-2 border-gray-200 overflow-hidden my-4">
      <div className="flex border-b border-gray-200">
        <button onClick={() => setShowAfter(false)}
          className={`flex-1 text-xs font-bold py-2.5 px-4 transition-colors ${!showAfter ? "bg-red-50 text-red-700 border-b-2 border-red-500" : "bg-gray-50 text-gray-500"}`}>
          ❌ Antes
        </button>
        <button onClick={() => setShowAfter(true)}
          className={`flex-1 text-xs font-bold py-2.5 px-4 transition-colors ${showAfter ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500" : "bg-gray-50 text-gray-500"}`}>
          ✅ Después
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
          <CopyBtn text={showAfter ? after : before} />
        </div>
        <pre className="text-sm text-gray-800 leading-relaxed whitespace-pre-line font-mono bg-gray-50 rounded-lg p-3 border border-gray-100">
          {showAfter ? after : before}
        </pre>
      </div>
    </div>
  );
}

// ─── Interactive CREFO Explorer ─────────────────────────────────────────────

function CrefoExplorer() {
  const [active, setActive] = useState<string>("C");

  const elements = [
    { letter: "C", name: "Contexto", color: "#2563EB", icon: <Layers className="w-5 h-5" />,
      what: "El escenario completo: nivel educativo, asignatura, características del grupo, marco curricular.",
      why: "Sin contexto, la IA no sabe si habla con un profesor de Primaria o de Bachillerato. El mismo tema se explica de forma completamente diferente según el nivel.",
      example: "Clase de 3º de ESO, 28 alumnos, Biología y Geología. 3 alumnos con TDAH. Colegio concertado urbano. Currículo LOMLOE, Comunidad de Madrid.",
      antiExample: "(sin contexto alguno)",
      keyQuestion: "¿Podría alguien que no conoce tu aula entender el escenario con lo que has escrito?" },
    { letter: "R", name: "Rol", color: "#7C3AED", icon: <User className="w-5 h-5" />,
      what: "La identidad profesional que asignas a la IA: disciplina, nivel de expertise y contexto de experiencia.",
      why: "Un 'profesor' genérico produce resultados genéricos. Un 'experto en didáctica de ciencias con 20 años en secundaria' produce resultados específicos y relevantes.",
      example: "Actúa como un diseñador instruccional especializado en aprendizaje activo para ciencias en Secundaria, con experiencia en laboratorios escolares de bajo coste.",
      antiExample: "Eres un profesor.",
      keyQuestion: "¿El rol incluye disciplina + nivel de expertise + contexto específico?" },
    { letter: "E", name: "Especificidad", color: "#D97706", icon: <Target className="w-5 h-5" />,
      what: "La tarea concreta con verbos de acción precisos (taxonomía de Bloom), alcance cuantificado y nivel cognitivo definido.",
      why: "'Hazme algo sobre la célula' es como pedirle a un arquitecto 'hazme un edificio'. Sin verbo específico, cantidad, duración o nivel de profundidad, la IA adivinará — y probablemente mal.",
      example: "Diseña 6 actividades manipulativas sobre la célula animal (30 min cada una). 2 de nivel recordar, 2 de aplicar y 2 de analizar (Bloom). Incluye lista de materiales para cada una.",
      antiExample: "Hazme actividades sobre la célula.",
      keyQuestion: "¿Has usado un verbo de acción preciso? ¿Hay cantidades, tiempos y niveles definidos?" },
    { letter: "F", name: "Formato", color: "#059669", icon: <FileText className="w-5 h-5" />,
      what: "La estructura exacta de la salida: tabla, lista, narrativa, rúbrica, JSON, guion, etc. Con columnas, campos o secciones especificados.",
      why: "Sin formato, la IA elige uno por defecto (generalmente un muro de texto o una lista genérica). Definir el formato te ahorra reformatear después y garantiza que el resultado sea usable directamente.",
      example: "Presenta cada actividad en formato tabla:\n| Campo | Contenido |\n|-------|----------|\n| Nombre | Título atractivo |\n| Duración | Minutos |\n| Materiales | Lista con precios estimados |\n| Procedimiento | Pasos numerados |\n| Evaluación | Criterio observable |",
      antiExample: "(sin indicar formato)",
      keyQuestion: "Si alguien lee solo el formato, ¿sabría exactamente qué estructura tendrá la salida?" },
    { letter: "O", name: "Objetivos y Restricciones", color: "#DC2626", icon: <ShieldCheck className="w-5 h-5" />,
      what: "Lo que la salida DEBE lograr (objetivo) y lo que NO debe contener (restricciones). Incluye límites éticos, de extensión, tono y contenido.",
      why: "Las restricciones son lo que separa un prompt 'bueno' de uno 'excelente'. Sin ellas, la IA puede usar vocabulario inadecuado, incluir sesgos, o producir contenido inapropiado para tu contexto.",
      example: "DEBE: Usar solo materiales que cuesten menos de 5€. Incluir adaptación para alumnado con TDAH.\nNO DEBE: Usar productos químicos peligrosos. Requerir microscopio. Superar 2 páginas por actividad.\nTono: Instrucciones claras tipo receta, aptas para que un alumno las siga solo.",
      antiExample: "(sin restricciones)",
      keyQuestion: "¿Has definido al menos 2 cosas que SÍ debe hacer y 2 que NO debe hacer?" },
  ];

  const el = elements.find(e => e.letter === active)!;

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
      {/* Letter tabs */}
      <div className="flex border-b border-gray-200">
        {elements.map(e => (
          <button key={e.letter} onClick={() => setActive(e.letter)}
            className={`flex-1 py-3 text-center font-bold text-sm transition-all ${active === e.letter ? "text-white" : "text-gray-400 hover:text-gray-600 bg-gray-50"}`}
            style={active === e.letter ? { backgroundColor: e.color } : undefined}>
            {e.letter}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: el.color }}>
            {el.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{el.letter} · {el.name}</h3>
          </div>
        </div>

        {/* What */}
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">¿Qué es?</p>
          <p className="text-[15px] text-gray-700 leading-relaxed">{el.what}</p>
        </div>

        {/* Why */}
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">¿Por qué importa?</p>
          <p className="text-[15px] text-gray-700 leading-relaxed">{el.why}</p>
        </div>

        {/* Good vs Bad Example */}
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">❌ Sin {el.name}</p>
            <p className="text-sm text-red-800 font-mono italic">{el.antiExample}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">✅ Con {el.name}</p>
            <p className="text-sm text-emerald-800 font-mono whitespace-pre-line">{el.example}</p>
          </div>
        </div>

        {/* Key question */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed">
            <strong>Pregunta de autocomprobación:</strong> {el.keyQuestion}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Few-shot Demo ──────────────────────────────────────────────────────────

function FewShotDemo() {
  const [mode, setMode] = useState<"zero" | "few">("zero");

  const zeroShot = {
    prompt: "Genera 3 preguntas de comprensión lectora sobre un texto narrativo.",
    output: "1. ¿Cuál es el tema principal del texto?\n2. ¿Qué personajes aparecen?\n3. ¿Cómo termina la historia?",
    quality: "Genérica, superficial, nivel bajo (Recordar)",
  };

  const fewShot = {
    prompt: `Genera 3 preguntas de comprensión lectora sobre un texto narrativo.

Sigue estos ejemplos de calidad:

Ejemplo 1:
Pregunta: "¿Por qué crees que el protagonista decidió no revelar la verdad a su amigo? Justifica con evidencia del texto."
Nivel: Inferencial (Analizar)
Tipo: Abierta con evidencia

Ejemplo 2:
Pregunta: "Si pudieras cambiar una decisión del protagonista, ¿cuál sería y cómo cambiaría el desenlace?"
Nivel: Crítica (Evaluar)
Tipo: Respuesta personal argumentada

Ahora genera 3 preguntas nuevas siguiendo este patrón:`,
    output: '1. "El narrador dice que \'el silencio era más pesado que cualquier palabra\'. ¿Qué nos revela esta metáfora sobre el estado emocional del personaje? Cita otra expresión del texto que apoye tu interpretación."\nNivel: Inferencial (Analizar)\n\n2. "¿En qué medida la reacción de Sara ante el conflicto refleja los valores que se mencionan al inicio del relato? Argumenta con al menos dos evidencias textuales."\nNivel: Crítica (Evaluar)\n\n3. "Imagina que la historia está ambientada en tu comunidad. ¿Cómo cambiarían las decisiones de los personajes? ¿Por qué?"\nNivel: Creativa (Crear)',
    quality: "Específica, multinivel, con evidencia textual",
  };

  const current = mode === "zero" ? zeroShot : fewShot;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <div className="flex border-b border-gray-200">
        <button onClick={() => setMode("zero")}
          className={`flex-1 py-3 text-xs font-bold transition-colors ${mode === "zero" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-500"}`}>
          Zero-shot (sin ejemplos)
        </button>
        <button onClick={() => setMode("few")}
          className={`flex-1 py-3 text-xs font-bold transition-colors ${mode === "few" ? "bg-indigo-600 text-white" : "bg-gray-50 text-gray-500"}`}>
          Few-shot (con ejemplos)
        </button>
      </div>
      <div className="p-5">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prompt</span>
            <CopyBtn text={current.prompt} />
          </div>
          <pre className="text-sm text-gray-800 leading-relaxed whitespace-pre-line font-mono bg-gray-50 rounded-lg p-3 border border-gray-100 max-h-48 overflow-y-auto">
            {current.prompt}
          </pre>
        </div>
        <div className="mb-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Resultado típico</span>
          <pre className="text-sm text-gray-800 leading-relaxed whitespace-pre-line font-mono bg-blue-50 rounded-lg p-3 border border-blue-100 mt-2 max-h-48 overflow-y-auto">
            {current.output}
          </pre>
        </div>
        <div className={`rounded-lg p-3 flex gap-2 ${mode === "zero" ? "bg-red-50 border border-red-200" : "bg-emerald-50 border border-emerald-200"}`}>
          <span className="text-sm">{mode === "zero" ? "⚠️" : "✨"}</span>
          <p className="text-xs leading-relaxed" style={{ color: mode === "zero" ? "#7f1d1d" : "#064e3b" }}>
            <strong>Calidad:</strong> {current.quality}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Iteration Lab ──────────────────────────────────────────────────────────

function IterationLab() {
  const [step, setStep] = useState(0);

  const iterations = [
    {
      version: "v1 — Prompt inicial",
      prompt: "Hazme una actividad sobre fracciones.",
      result: "Resultado genérico: una lista de 10 ejercicios de sumas de fracciones sin contexto.",
      analysis: "Problema: sin contexto, sin formato, sin nivel, sin restricciones.",
      change: "Siguiente paso: añadir Contexto (C) y Especificidad (E).",
    },
    {
      version: "v2 — Añadimos C + E",
      prompt: "Para una clase de 5º de Primaria, diseña 5 actividades manipulativas sobre fracciones equivalentes.",
      result: "Mejor: 5 actividades con materiales, pero algunas requieren materiales caros y no tienen temporalización.",
      analysis: "Mejora: tiene contexto y tarea específica. Falta: formato, restricciones de materiales.",
      change: "Siguiente paso: añadir Formato (F) y Restricciones (O).",
    },
    {
      version: "v3 — Añadimos F + O",
      prompt: "Para 5º Primaria, diseña 5 actividades manipulativas sobre fracciones equivalentes.\n\nFormato tabla: [Nombre | Duración | Materiales | Pasos | Evaluación]\n\nRestricciones: materiales de menos de 3€, sin tijeras afiladas, cada actividad de 20 min máximo.",
      result: "Mucho mejor: tabla organizada, materiales económicos, actividades realizables. Pero le falta profundidad pedagógica.",
      analysis: "Mejora: estructura clara y restricciones prácticas. Falta: Rol experto que eleve la calidad pedagógica.",
      change: "Siguiente paso: añadir Rol (R) con expertise.",
    },
    {
      version: "v4 — Prompt C.R.E.F.O. completo",
      prompt: "Actúa como un experto en didáctica de matemáticas para Primaria con experiencia en aprendizaje manipulativo y modelo CPA (Concreto-Pictórico-Abstracto).\n\nContexto: Clase de 5º Primaria, 26 alumnos, 2 con discalculia. Colegio público.\n\nTarea: Diseña 5 actividades manipulativas sobre fracciones equivalentes, progresivas según el modelo CPA.\n\nFormato:\n| Nombre | Fase CPA | Duración | Materiales (<3€) | Pasos | Adaptación NEAE | Evaluación formativa |\n\nRestricciones:\n- Sin tijeras afiladas ni materiales peligrosos\n- Cada actividad: máximo 20 minutos\n- Incluir adaptación para discalculia en cada actividad\n- Lenguaje de instrucciones que el alumno pueda leer solo",
      result: "Excelente: secuencia CPA coherente, adaptaciones específicas para discalculia, evaluación formativa integrada, materiales económicos y seguros.",
      analysis: "Las 5 dimensiones de C.R.E.F.O. trabajan en sinergia. El Rol elevó la calidad pedagógica. Las Restricciones aseguraron inclusión y viabilidad.",
      change: "El prompt está completo. Ahora: pruébalo 3 veces, compara resultados, ajusta si es necesario.",
    },
  ];

  const it = iterations[step];

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-violet-500" />
          <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">Laboratorio de Iteración</span>
        </div>
        <span className="text-xs text-gray-400">Paso {step + 1} de {iterations.length}</span>
      </div>

      <div className="p-5">
        <h4 className="text-sm font-bold text-gray-900 mb-3">{it.version}</h4>

        <div className="mb-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prompt</span>
          <pre className="mt-1 text-sm text-gray-800 leading-relaxed whitespace-pre-line font-mono bg-gray-50 rounded-lg p-3 border border-gray-100">
            {it.prompt}
          </pre>
        </div>

        <div className="mb-3">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Resultado</span>
          <p className="mt-1 text-sm text-blue-900 bg-blue-50 rounded-lg p-3 border border-blue-100 leading-relaxed">
            {it.result}
          </p>
        </div>

        <div className="mb-3">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Análisis</span>
          <p className="mt-1 text-sm text-amber-900 bg-amber-50 rounded-lg p-3 border border-amber-100 leading-relaxed">
            {it.analysis}
          </p>
        </div>

        {it.change && (
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 flex gap-2">
            <ArrowRight className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-violet-900 leading-relaxed font-medium">{it.change}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${step > 0 ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 cursor-not-allowed"}`}>
            ← Anterior
          </button>
          <div className="flex gap-1.5">
            {iterations.map((_, i) => (
              <button key={i} onClick={() => setStep(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === step ? "bg-violet-500 scale-125" : i < step ? "bg-violet-300" : "bg-gray-200"}`} />
            ))}
          </div>
          <button onClick={() => setStep(Math.min(iterations.length - 1, step + 1))} disabled={step === iterations.length - 1}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${step < iterations.length - 1 ? "bg-violet-600 text-white hover:bg-violet-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section Content ────────────────────────────────────────────────────────

interface SectionData {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  subsections: { id: string; title: string; content: React.ReactNode; checkpoint?: CheckpointQuestion }[];
}

function buildSections(): SectionData[] {
  return [
    {
      id: "crefo",
      title: "El Framework C.R.E.F.O.",
      icon: <Layers className="w-5 h-5" />,
      color: "#D97706",
      subsections: [
        {
          id: "crefo-overview",
          title: "Los 5 elementos del prompt pedagógico",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                C.R.E.F.O. es un framework mnemotécnico diseñado para que ningún elemento esencial se quede fuera de tu prompt. No es una plantilla rígida — es un <strong>checklist mental</strong>. Puedes escribir los elementos en cualquier orden, pero asegúrate de que todos estén presentes.
              </p>
              <CrefoExplorer />
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 leading-relaxed">
                  <strong>No necesitas memorizar el orden.</strong> Usa C.R.E.F.O. como el checklist de un piloto antes de despegar: lo importante es que no falte ningún elemento, no en qué orden los revisas.
                </p>
              </div>
            </div>
          ),
          checkpoint: {
            question: "Un prompt dice: 'Crea actividades de Lengua para mis alumnos.' ¿Cuáles elementos C.R.E.F.O. le faltan?",
            options: [
              "Solo le falta el Formato (F)",
              "Le faltan todos menos la Especificidad (E)",
              "Le faltan Contexto, Rol, Formato y Objetivos (C, R, F, O)",
              "Está completo — tiene la tarea (E) y el contexto implícito (C)",
            ],
            correctIndex: 2,
            explanation: "Le faltan 4 de 5: no tiene Contexto (¿qué nivel? ¿cuántos alumnos?), Rol (¿qué expertise?), Formato (¿tabla, lista, narrativa?) ni Objetivos/Restricciones (¿qué evitar?). La Especificidad es débil ('crea actividades' es vago, pero al menos indica una tarea).",
          },
        },
        {
          id: "crefo-practice",
          title: "Ejemplo completo: de prompt roto a C.R.E.F.O.",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Observa la transformación de un prompt real aplicando C.R.E.F.O. paso a paso. Alterna entre las pestañas para ver el contraste.
              </p>
              <BeforeAfter
                label="Prompt de planificación"
                before="Hazme un examen de ciencias para mis alumnos de la ESO."
                after={`Actúa como un profesor de Biología de 3º de ESO con experiencia en evaluación por competencias (R).

Contexto: Clase de 28 alumnos, nivel heterogéneo, 3 alumnos con adaptación curricular significativa. Fin de la unidad sobre "Aparato circulatorio". Marco LOMLOE (C).

Tarea: Diseña un examen de 50 minutos con 12 preguntas:
- 4 de opción múltiple (nivel Recordar)
- 4 de respuesta corta (nivel Comprender/Aplicar)
- 2 de análisis de diagrama (nivel Analizar)
- 2 preguntas adaptadas para ACS (mismos conceptos, menor complejidad lingüística) (E)

Formato: Tabla con columnas [Nº | Enunciado | Tipo | Nivel Bloom | Puntuación | ¿Adaptada?]
Incluye clave de respuestas con rúbrica breve por pregunta (F).

Restricciones:
- Vocabulario accesible (no universitario)
- Diagramas descritos en texto (no puedo generar imágenes)
- Sin preguntas trampa
- Las 2 preguntas adaptadas cubren los mismos conceptos que las estándar (O).`}
              />
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>Observa:</strong> el prompt pasó de 13 palabras a ~150. Esto no es "escribir más por escribir" — cada palabra añadida aporta información que reduce la ambigüedad y mejora el resultado. La regla: un buen prompt pedagógico tiene entre 80-200 palabras.
                </p>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: "techniques",
      title: "Técnicas Fundamentales",
      icon: <Zap className="w-5 h-5" />,
      color: "#4F46E5",
      subsections: [
        {
          id: "zero-few",
          title: "Zero-shot vs. Few-shot: Cuándo usar cada uno",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                <strong>Zero-shot</strong>: Le das instrucciones sin ejemplos. Funciona para tareas simples o cuando quieres creatividad máxima.
              </p>
              <p className="text-[15px] text-gray-700 leading-relaxed">
                <strong>Few-shot</strong>: Incluyes 2-3 ejemplos del resultado que esperas. La IA replica el patrón de tus ejemplos con alta fidelidad. Funciona para tareas donde necesitas consistencia, estilo específico o formato preciso.
              </p>
              <FewShotDemo />
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">💡 ¿Cuándo usar cuál?</p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-amber-100">
                    <p className="font-bold text-gray-900 mb-1">Zero-shot es suficiente para:</p>
                    <p className="text-gray-600 text-xs leading-relaxed">Lluvia de ideas, borradores iniciales, definiciones, resúmenes simples, traducciones.</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-amber-100">
                    <p className="font-bold text-gray-900 mb-1">Few-shot es necesario para:</p>
                    <p className="text-gray-600 text-xs leading-relaxed">Evaluación consistente, formato específico, tono/estilo particular, preguntas de calidad, rúbricas.</p>
                  </div>
                </div>
              </div>
            </div>
          ),
          checkpoint: {
            question: "Necesitas que la IA genere feedback para 15 trabajos con el mismo estilo y estructura. ¿Qué técnica usas?",
            options: [
              "Zero-shot con instrucciones muy detalladas",
              "Few-shot: incluir 2-3 ejemplos del feedback ideal antes de pedir los nuevos",
              "Generar cada feedback por separado en conversaciones diferentes",
              "Pedir a la IA que invente su propio estilo de feedback",
            ],
            correctIndex: 1,
            explanation: "Few-shot es ideal cuando necesitas CONSISTENCIA en formato, estilo y profundidad. Incluir 2-3 ejemplos de feedback 'gold standard' es más efectivo que describir el estilo con palabras. La IA replicará el patrón de tus ejemplos.",
          },
        },
        {
          id: "iteration",
          title: "Prompt-Test-Iterate: El método científico del prompting",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Ningún prompt sale perfecto a la primera. La metodología <strong>Prompt-Test-Iterate</strong> aplica el método científico: formula una hipótesis (el prompt), observa el resultado, analiza qué falla y ajusta <strong>una variable a la vez</strong>.
              </p>
              <IterationLab />
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                <p className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-2">📝 Documenta tus iteraciones</p>
                <p className="text-sm text-violet-900 leading-relaxed">
                  Cada iteración te enseña algo. Documenta: <strong>v1 → Resultado → Análisis → Cambio → v2</strong>. Este "diario de prompts" es tu mejor recurso de aprendizaje y puedes compartirlo con tu departamento.
                </p>
              </div>
            </div>
          ),
          checkpoint: {
            question: "Tu prompt genera resultados mediocres. ¿Cuál es la mejor estrategia?",
            options: [
              "Reescribir todo el prompt desde cero",
              "Añadir 'por favor hazlo mejor' al final",
              "Analizar qué falla específicamente y ajustar un elemento a la vez",
              "Cambiar a otro modelo de IA",
            ],
            correctIndex: 2,
            explanation: "La iteración controlada es la clave: identifica qué falla (¿contexto? ¿formato? ¿restricciones?), ajusta UN elemento, y ejecuta de nuevo. Cambiar todo no te permite saber qué causó la mejora. Es el método científico del prompting.",
          },
        },
      ],
    },
    {
      id: "taxonomy",
      title: "Verbos de Bloom para Prompts",
      icon: <Target className="w-5 h-5" />,
      color: "#059669",
      subsections: [
        {
          id: "bloom-verbs",
          title: "Conectar taxonomía de Bloom con la 'E' de C.R.E.F.O.",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                La <strong>E (Especificidad)</strong> de C.R.E.F.O. depende de usar verbos de acción precisos. La taxonomía de Bloom te da un vocabulario profesional para pedir exactamente el nivel cognitivo que necesitas.
              </p>
              <div className="space-y-2">
                {[
                  { level: "Recordar", color: "#DC2626", verbs: "Lista, Define, Identifica, Nombra, Reproduce", prompt: "'Lista los 5 reinos de seres vivos con un ejemplo de cada uno'" },
                  { level: "Comprender", color: "#EA580C", verbs: "Explica, Resume, Parafrasea, Clasifica, Describe", prompt: "'Explica la fotosíntesis como si hablaras con un alumno de 10 años'" },
                  { level: "Aplicar", color: "#D97706", verbs: "Aplica, Demuestra, Calcula, Resuelve, Usa", prompt: "'Diseña 3 problemas donde el alumno aplique el teorema de Pitágoras a situaciones cotidianas'" },
                  { level: "Analizar", color: "#059669", verbs: "Compara, Contrasta, Diferencia, Categoriza, Examina", prompt: "'Compara la mitosis y la meiosis en una tabla con 5 criterios de diferenciación'" },
                  { level: "Evaluar", color: "#2563EB", verbs: "Evalúa, Juzga, Argumenta, Defiende, Critica", prompt: "'Evalúa los pros y contras de 3 metodologías de enseñanza de idiomas según la evidencia científica'" },
                  { level: "Crear", color: "#7C3AED", verbs: "Diseña, Genera, Propón, Inventa, Compone", prompt: "'Diseña un proyecto interdisciplinar que conecte matemáticas con arte a través de la proporción áurea'" },
                ].map((b) => (
                  <div key={b.level} className="flex items-start gap-3 rounded-xl border border-gray-200 p-3.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: b.color }}>
                      {b.level.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{b.level}</p>
                      <p className="text-xs text-gray-500 mb-1">Verbos: {b.verbs}</p>
                      <p className="text-xs text-gray-700 font-mono bg-gray-50 rounded px-2 py-1">{b.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 leading-relaxed">
                  <strong>Regla práctica:</strong> Si tu prompt usa "Hazme" o "Dame", estás en el nivel más bajo. Sustituye por un verbo de Bloom del nivel que realmente necesitas. "Hazme actividades" → "Diseña actividades que requieran analizar..." Saltas 4 niveles de calidad.
                </p>
              </div>
            </div>
          ),
          checkpoint: {
            question: "Quieres que la IA genere preguntas que requieran pensamiento crítico. ¿Qué verbo usarías?",
            options: [
              "'Hazme preguntas' (genérico)",
              "'Lista preguntas sobre el tema' (Recordar)",
              "'Genera preguntas que requieran evaluar y argumentar con evidencia' (Evaluar)",
              "'Resume las preguntas principales' (Comprender)",
            ],
            correctIndex: 2,
            explanation: "El pensamiento crítico está en los niveles superiores de Bloom: Analizar, Evaluar, Crear. 'Evaluar y argumentar con evidencia' es un verbo preciso que fuerza a la IA a generar preguntas de alto nivel cognitivo.",
          },
        },
      ],
    },
  ];
}

// ─── Section Component ──────────────────────────────────────────────────────

function SectionView({
  section,
  expandedSub,
  onToggleSub,
  completedCheckpoints,
  onCheckpointComplete,
}: {
  section: SectionData;
  expandedSub: string | null;
  onToggleSub: (id: string) => void;
  completedCheckpoints: Set<string>;
  onCheckpointComplete: (id: string) => void;
}) {
  const cCount = section.subsections.filter(s => s.checkpoint).length;
  const cDone = section.subsections.filter(s => s.checkpoint && completedCheckpoints.has(s.id)).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100" style={{ borderLeftWidth: 4, borderLeftColor: section.color }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: section.color + "15", color: section.color }}>
              {section.icon}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
          </div>
          {cCount > 0 && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${cDone === cCount ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
              {cDone}/{cCount} ✓
            </span>
          )}
        </div>
      </div>
      <div>
        {section.subsections.map((sub, i) => {
          const isExp = expandedSub === sub.id;
          const hasCp = !!sub.checkpoint;
          const cpDone = completedCheckpoints.has(sub.id);
          return (
            <div key={sub.id} className={i < section.subsections.length - 1 ? "border-b border-gray-100" : ""}>
              <button onClick={() => onToggleSub(sub.id)} className="w-full flex items-center gap-3 px-6 py-3.5 text-left hover:bg-gray-50 transition-colors">
                {hasCp ? (cpDone ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />) : (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: section.color + "15" }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: section.color }} />
                  </div>
                )}
                <span className={`text-sm font-medium flex-1 ${isExp ? "text-gray-900" : "text-gray-700"}`}>{sub.title}</span>
                {isExp ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>
              {isExp && (
                <div className="px-6 pb-6">
                  {sub.content}
                  {sub.checkpoint && !cpDone && <Checkpoint question={sub.checkpoint} onComplete={() => onCheckpointComplete(sub.id)} />}
                  {sub.checkpoint && cpDone && (
                    <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-emerald-700 font-medium">Checkpoint completado</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function GuideModule1() {
  const [expandedSub, setExpandedSub] = useState<string | null>("crefo-overview");
  const [completedCheckpoints, setCompletedCheckpoints] = useState<Set<string>>(new Set());

  const sections = useMemo(() => buildSections(), []);
  const toggleSub = useCallback((id: string) => setExpandedSub(prev => prev === id ? null : id), []);
  const completeCp = useCallback((id: string) => setCompletedCheckpoints(prev => new Set([...prev, id])), []);

  const totalCp = sections.reduce((a, s) => a + s.subsections.filter(sub => sub.checkpoint).length, 0);
  const doneCp = completedCheckpoints.size;
  const pct = totalCp > 0 ? Math.round((doneCp / totalCp) * 100) : 0;

  return (
    <div className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            Módulo 1 · Semanas 2-3
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            La Sintaxis de la Maestría
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Domina el framework C.R.E.F.O., las técnicas Zero-shot y Few-shot,
            y el método de iteración controlada para crear prompts pedagógicos de alto impacto.
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-3.5 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Progreso del módulo</span>
            <span className="text-xs text-gray-400">{doneCp}/{totalCp} checkpoints · {pct}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="space-y-6">
          {sections.map(section => (
            <SectionView key={section.id} section={section} expandedSub={expandedSub}
              onToggleSub={toggleSub} completedCheckpoints={completedCheckpoints} onCheckpointComplete={completeCp} />
          ))}
        </div>

        {pct === 100 && (
          <div className="mt-8 bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center">
            <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-emerald-900 mb-2">¡Módulo 1 completado!</h3>
            <p className="text-sm text-emerald-700 mb-4">
              Dominas C.R.E.F.O., sabes cuándo usar Zero-shot vs Few-shot, y tienes un método de iteración.
              Ahora practica con el Constructor C.R.E.F.O. y el Banco de Prompts Rotos.
            </p>
            <p className="text-sm font-semibold text-emerald-800">
              Siguiente → Módulo 2: La Arquitectura del Aula (Planificación con IA)
            </p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-10">
          Módulo 1 · 3 secciones · {totalCp} checkpoints · Curso "Prompt Mastery para Docentes"
        </p>
      </div>
    </div>
  );
}
