"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useCallback, useMemo } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Brain,
  Lock,
  Scale,
  Zap,
  Thermometer,
  MessageSquare,
  ShieldAlert,
  AlertTriangle,
  Eye,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Sparkles,
  FileWarning,
  Search,
  Globe,
  Box,
  Layers,
  Info,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface CheckpointQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface SectionData {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgLight: string;
  subsections: SubSection[];
}

interface SubSection {
  id: string;
  title: string;
  content: React.ReactNode;
  checkpoint?: CheckpointQuestion;
}

// ─── Interactive Demos ──────────────────────────────────────────────────────

function TokenDemo() {
  const [input, setInput] = useState("El profesor explicó la");
  const predictions = useMemo(() => {
    const map: Record<string, { tokens: string[]; probs: number[] }> = {
      default: { tokens: ["lección", "materia", "clase", "teoría", "actividad"], probs: [32, 24, 18, 14, 12] },
    };
    if (/matem/i.test(input)) return { tokens: ["ecuación", "fórmula", "operación", "geometría", "álgebra"], probs: [28, 25, 20, 15, 12] };
    if (/historia/i.test(input)) return { tokens: ["guerra", "revolución", "época", "civilización", "batalla"], probs: [26, 22, 20, 18, 14] };
    if (/cocin/i.test(input)) return { tokens: ["receta", "comida", "ingredientes", "pasta", "ensalada"], probs: [30, 25, 20, 15, 10] };
    return map.default;
  }, [input]);

  return (
    <div className="bg-gray-900 rounded-xl p-5 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-yellow-400" />
        <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Demo: Predicción de Tokens</span>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Escribe una frase incompleta y observa cómo la IA "predice" la siguiente palabra más probable. No "sabe" la respuesta — calcula probabilidades.
      </p>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
          placeholder="Escribe una frase incompleta..."
        />
        <span className="text-gray-500 text-lg">→</span>
      </div>
      <div className="space-y-2">
        {predictions.tokens.map((token, i) => (
          <div key={token} className="flex items-center gap-3">
            <div className="w-24 text-right">
              <span className="text-sm font-mono text-emerald-400">"{token}"</span>
            </div>
            <div className="flex-1 h-5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${predictions.probs[i]}%`,
                  backgroundColor: i === 0 ? "#34d399" : i === 1 ? "#60a5fa" : "#6b7280",
                  opacity: 1 - i * 0.15,
                }}
              />
            </div>
            <span className="text-xs text-gray-400 font-mono w-10 text-right">{predictions.probs[i]}%</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-gray-500 mt-3 italic">
        * Simulación simplificada. Los LLMs reales calculan probabilidades sobre ~50,000+ tokens simultáneamente.
      </p>
    </div>
  );
}

function TemperatureDemo() {
  const [temp, setTemp] = useState(0.3);

  const outputs = useMemo(() => {
    if (temp <= 0.3) return {
      label: "Determinista",
      color: "#3b82f6",
      responses: [
        "La fotosíntesis es el proceso por el cual las plantas convierten la luz solar en energía química.",
        "La fotosíntesis es el proceso por el cual las plantas convierten la luz solar en energía química.",
        "La fotosíntesis es el proceso por el cual las plantas convierten la luz solar en energía química.",
      ],
      note: "Respuestas casi idénticas. Ideal para: definiciones, datos factuales, evaluación.",
    };
    if (temp <= 0.6) return {
      label: "Equilibrado",
      color: "#f59e0b",
      responses: [
        "La fotosíntesis es el proceso mediante el cual los organismos vegetales transforman la energía lumínica en compuestos orgánicos.",
        "Las plantas realizan fotosíntesis: capturan luz solar y CO₂ para fabricar glucosa y liberar oxígeno.",
        "La fotosíntesis convierte energía solar en alimento para la planta, usando agua y dióxido de carbono como ingredientes.",
      ],
      note: "Variedad controlada. Cada respuesta es diferente pero correcta. Ideal para: materiales didácticos.",
    };
    return {
      label: "Creativo",
      color: "#ef4444",
      responses: [
        "¡Imagina que las hojas son paneles solares verdes! Absorben rayos de sol y los mezclan con agua para cocinar su propia comida.",
        "La fotosíntesis es como una cocina microscópica dentro de cada hoja: la receta usa luz, agua y aire para hornear azúcar.",
        "Si las plantas tuvieran Instagram, su bio diría: 'Transformo luz en vida. Gratis. Sin enchufes. Desde hace 2.500 millones de años.'",
      ],
      note: "Muy variado y creativo. Puede generar analogías brillantes O errores. Ideal para: lluvia de ideas, escritura creativa.",
    };
  }, [temp]);

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Thermometer className="w-4 h-4 text-orange-500" />
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Demo: Parámetro de Temperatura</span>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Prompt: "Explica la fotosíntesis a un alumno de 6º de Primaria." — Mueve el slider para ver cómo cambia la respuesta.
      </p>

      <div className="flex items-center gap-4 mb-4">
        <span className="text-xs text-blue-600 font-medium">0.0</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={temp}
          onChange={(e) => setTemp(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gradient-to-r from-blue-400 via-amber-400 to-red-400 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
        />
        <span className="text-xs text-red-600 font-medium">1.0</span>
      </div>

      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-2xl font-bold tabular-nums" style={{ color: outputs.color }}>{temp.toFixed(1)}</span>
        <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: outputs.color + "18", color: outputs.color }}>
          {outputs.label}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        {outputs.responses.map((r, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <span className="text-[10px] text-gray-400 font-mono">Intento {i + 1}:</span>
            <p className="text-sm text-gray-800 leading-relaxed mt-1">{r}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 italic">{outputs.note}</p>
    </div>
  );
}

function ContextWindowDemo() {
  const [messages, setMessages] = useState([
    "Soy profesor de Biología de 3º ESO.",
    "Necesito actividades sobre la célula.",
    "Mis alumnos tienen nivel heterogéneo.",
    "Hay 3 alumnos con TDAH en el grupo.",
    "Prefiero actividades manipulativas.",
  ]);
  const windowSize = 3;
  const visible = messages.slice(-windowSize);
  const forgotten = messages.slice(0, Math.max(0, messages.length - windowSize));

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-violet-500" />
        <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">Demo: Ventana de Contexto</span>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        La IA solo "recuerda" los mensajes más recientes dentro de su ventana de contexto. Lo anterior se pierde. Por eso es importante incluir todo el contexto relevante en cada mensaje.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">❌ Fuera de la ventana (olvidado)</p>
          <div className="space-y-1.5">
            {forgotten.map((m, i) => (
              <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-2.5 opacity-50">
                <p className="text-xs text-red-400 line-through">{m}</p>
              </div>
            ))}
            {forgotten.length === 0 && <p className="text-xs text-gray-400 italic">Todo está en la ventana</p>}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">✅ Dentro de la ventana (visible)</p>
          <div className="space-y-1.5">
            {visible.map((m, i) => (
              <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                <p className="text-xs text-emerald-800">{m}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-[11px] text-gray-500 mt-3 italic">
        * Simplificación didáctica. La ventana real es de ~8,000 a 200,000 tokens según el modelo (GPT-4o, Claude, Gemini).
      </p>
    </div>
  );
}

function PrivacyTrafficLight() {
  const categories = [
    {
      color: "#DC2626",
      label: "NUNCA ingresar",
      bg: "bg-red-50",
      border: "border-red-200",
      items: [
        "Nombre completo del alumno",
        "Diagnósticos médicos o psicopedagógicos",
        "Dirección o datos de contacto familiar",
        "Calificaciones individuales con nombre",
        "Situación socioeconómica identificable",
        "Fotos o imágenes de alumnos",
        "Informes psicológicos o de orientación",
      ],
    },
    {
      color: "#D97706",
      label: "Con precaución (anonimizar)",
      bg: "bg-amber-50",
      border: "border-amber-200",
      items: [
        "Trabajos de alumnos → sin nombre, usar 'Alumno A'",
        "Características del grupo → sin datos individuales",
        "Necesidades educativas → tipo general, sin diagnóstico específico",
        "Datos de rendimiento → agregados, nunca individuales",
      ],
    },
    {
      color: "#059669",
      label: "Seguro de usar",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      items: [
        "Nivel educativo y asignatura",
        "Marco curricular (LOMLOE, etc.)",
        "Contenidos del temario",
        "Metodologías y estrategias didácticas",
        "Materiales publicados y recursos abiertos",
        "Ejemplos ficticios creados por ti",
      ],
    },
  ];

  return (
    <div className="space-y-3">
      {categories.map((cat) => (
        <div key={cat.label} className={`${cat.bg} ${cat.border} border rounded-xl p-4`}>
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: cat.color }}>
              {cat.label}
            </span>
          </div>
          <ul className="space-y-1">
            {cat.items.map((item, i) => (
              <li key={i} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                <span className="text-gray-400 mt-1">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function BiasAuditExercise() {
  const [revealed, setRevealed] = useState(false);

  const prompt = 'Prompt: "Genera una imagen de un médico atendiendo a un paciente"';
  const biases = [
    { found: "El médico es representado como hombre blanco de mediana edad", category: "Género + Raza" },
    { found: "El entorno es un hospital occidental moderno", category: "Cultural" },
    { found: "El paciente está en posición pasiva, sin agencia", category: "Poder" },
    { found: "No hay diversidad en el personal sanitario de fondo", category: "Representación" },
  ];

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Search className="w-4 h-4 text-rose-500" />
        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Ejercicio: Auditoría de Sesgo</span>
      </div>
      <div className="bg-gray-100 rounded-lg p-3 mb-4 font-mono text-sm text-gray-800">{prompt}</div>
      <p className="text-xs text-gray-500 mb-4">
        La IA genera una imagen típica. ¿Qué sesgos podrías encontrar? Piensa antes de revelar.
      </p>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-sm hover:bg-rose-700 transition-colors"
        >
          Revelar sesgos detectados
        </button>
      ) : (
        <div className="space-y-2">
          {biases.map((b, i) => (
            <div key={i} className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-lg p-3">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{b.category}</span>
                <p className="text-sm text-gray-800">{b.found}</p>
              </div>
            </div>
          ))}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>Prompt mejorado:</strong> "Genera una imagen de un equipo médico diverso (género, edad, etnia) atendiendo a un paciente en un entorno sanitario. Incluye personal de diferentes roles (enfermería, medicina, auxiliar). El paciente participa activamente en la conversación."
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Checkpoint Component ───────────────────────────────────────────────────

function Checkpoint({ question, onComplete }: { question: CheckpointQuestion; onComplete: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleCheck = () => {
    setRevealed(true);
    if (selected === question.correctIndex) onComplete();
  };

  const isCorrect = selected === question.correctIndex;

  return (
    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-5 my-6">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Checkpoint de Comprensión</span>
      </div>
      <p className="text-[15px] md:text-base font-semibold text-gray-900 mb-4 leading-relaxed">{question.question}</p>

      <div className="space-y-2 mb-4">
        {question.options.map((opt, i) => {
          let classes = "border-gray-200 bg-white";
          if (revealed) {
            if (i === question.correctIndex) classes = "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200";
            else if (i === selected) classes = "border-red-400 bg-red-50 ring-2 ring-red-200";
            else classes = "border-gray-200 bg-gray-50 text-gray-600";
          } else if (i === selected) {
            classes = "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200";
          }

          return (
            <button
              key={i}
              onClick={() => !revealed && setSelected(i)}
              disabled={revealed}
              className={`w-full text-left rounded-lg border-2 p-4 text-[15px] md:text-base text-gray-900 leading-relaxed transition-all ${classes}`}
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
          className={`w-full py-3 rounded-xl font-semibold text-base transition-all ${
            selected !== null ? "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Verificar
        </button>
      ) : (
        <div className={`rounded-lg p-3 ${isCorrect ? "bg-emerald-100 border border-emerald-300" : "bg-amber-100 border border-amber-300"}`}>
          <p className="text-[15px] md:text-base leading-relaxed" style={{ color: isCorrect ? "#064e3b" : "#78350f" }}>
            {isCorrect ? "✓ " : "✗ "}{question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Section Content Definitions ────────────────────────────────────────────

function buildSections(): SectionData[] {
  return [
    {
      id: "llm",
      title: "Anatomía de un Modelo de Lenguaje",
      icon: <Brain className="w-5 h-5" />,
      color: "#4F46E5",
      bgLight: "bg-indigo-50",
      subsections: [
        {
          id: "what-is-llm",
          title: "¿Qué es (y qué NO es) un LLM?",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Un Modelo de Lenguaje Grande (LLM) es un sistema estadístico entrenado con enormes cantidades de texto para <strong>predecir la siguiente palabra más probable</strong> en una secuencia. Esto es fundamental: la IA no "sabe" cosas, no "comprende" preguntas y no "piensa" respuestas.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">❌ Lo que NO es</p>
                  <ul className="space-y-1.5 text-sm text-red-900">
                    <li>· Una base de datos de conocimiento</li>
                    <li>· Un buscador de internet</li>
                    <li>· Un ser que comprende o razona</li>
                    <li>· Una fuente fiable de datos</li>
                    <li>· Un sustituto del criterio docente</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">✅ Lo que SÍ es</p>
                  <ul className="space-y-1.5 text-sm text-emerald-900">
                    <li>· Un predictor estadístico de texto</li>
                    <li>· Una herramienta de generación</li>
                    <li>· Un asistente que necesita guía</li>
                    <li>· Un amplificador de tu expertise</li>
                    <li>· Una "grúa cognitiva" (no un arquitecto)</li>
                  </ul>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 leading-relaxed">
                  <strong>¿Por qué importa?</strong> Comprender que la IA predice (no sabe) es el antídoto contra dos errores comunes: confiar ciegamente en sus respuestas o rechazarla por "no ser inteligente de verdad". Es una herramienta poderosa — cuando sabes cómo funciona.
                </p>
              </div>
            </div>
          ),
          checkpoint: {
            question: "Cuando ChatGPT responde a una pregunta, ¿qué está haciendo realmente?",
            options: [
              "Buscando la respuesta en una base de datos verificada",
              "Calculando qué secuencia de palabras es más probable dada la entrada",
              "Comprendiendo la pregunta y aplicando lógica formal",
              "Consultando fuentes en internet en tiempo real",
            ],
            correctIndex: 1,
            explanation: "Los LLMs generan texto prediciendo el siguiente token más probable. No consultan bases de datos, no navegan internet (salvo que tengan esa función habilitada) y no aplican lógica — calculan probabilidades estadísticas sobre patrones de lenguaje.",
          },
        },
        {
          id: "tokens",
          title: "Tokens: La unidad básica de la IA",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                La IA no lee "palabras" como tú. Lee <strong>tokens</strong>: fragmentos de texto que pueden ser una palabra completa, parte de una palabra, un signo de puntuación o un espacio. En español, una palabra larga como "transformación" se divide en varios tokens ("trans", "form", "ación").
              </p>
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Esto tiene implicaciones prácticas: los modelos tienen un <strong>límite de tokens</strong> por conversación (la "ventana de contexto"). Si tu prompt es muy largo, la IA puede "olvidar" el inicio. Si pides una respuesta muy extensa, puede cortarse.
              </p>
              <TokenDemo />
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900 leading-relaxed">
                  <strong>Regla práctica:</strong> 1 token ≈ ¾ de una palabra en español. Un prompt de 200 palabras ≈ ~270 tokens. La ventana de GPT-4o es ~128K tokens (~96,000 palabras) y la de Claude es ~200K tokens (~150,000 palabras).
                </p>
              </div>
            </div>
          ),
        },
        {
          id: "temperature",
          title: "Temperatura: Creatividad vs. Precisión",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                La <strong>temperatura</strong> es un parámetro que controla cuánto "riesgo" toma la IA al elegir el siguiente token. No controla la longitud ni la calidad — controla la <strong>variabilidad</strong>.
              </p>
              <TemperatureDemo />
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">💡 Guía rápida para docentes</p>
                <div className="grid sm:grid-cols-3 gap-2 text-sm">
                  <div className="bg-white rounded-lg p-2.5 border border-amber-100">
                    <p className="font-bold text-blue-600 text-xs">Temp. baja (0-0.3)</p>
                    <p className="text-gray-600 text-xs mt-1">Evaluación, rúbricas, datos factuales, respuestas tipo</p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-amber-100">
                    <p className="font-bold text-amber-600 text-xs">Temp. media (0.4-0.6)</p>
                    <p className="text-gray-600 text-xs mt-1">Materiales didácticos, explicaciones, adaptaciones</p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-amber-100">
                    <p className="font-bold text-red-600 text-xs">Temp. alta (0.7-1.0)</p>
                    <p className="text-gray-600 text-xs mt-1">Lluvia de ideas, escritura creativa, analogías</p>
                  </div>
                </div>
              </div>
            </div>
          ),
          checkpoint: {
            question: "Un docente quiere generar una rúbrica de evaluación consistente. ¿Qué temperatura debería usar?",
            options: [
              "Temperatura alta (0.8-1.0) para obtener criterios más creativos",
              "Temperatura baja (0.1-0.3) para obtener resultados consistentes y replicables",
              "No importa la temperatura, el resultado siempre será el mismo",
              "Temperatura media (0.5) porque es la opción por defecto",
            ],
            correctIndex: 1,
            explanation: "Para rúbricas y evaluaciones necesitas consistencia — que el mismo prompt genere resultados similares cada vez. Temperatura baja (0.1-0.3) minimiza la aleatoriedad. Temperatura alta generaría rúbricas diferentes cada vez, lo cual no es deseable.",
          },
        },
        {
          id: "context-window",
          title: "Ventana de Contexto: La 'memoria' de la IA",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                La IA no tiene memoria entre conversaciones. Cada nueva conversación empieza de cero. Dentro de una conversación, solo "recuerda" lo que cabe en su <strong>ventana de contexto</strong> — como una pizarra de tamaño fijo donde lo más antiguo se borra cuando se llena.
              </p>
              <ContextWindowDemo />
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 leading-relaxed">
                  <strong>Implicación práctica:</strong> Si estás teniendo una conversación larga con la IA y notas que "olvida" instrucciones del inicio, no es un error — es una limitación de diseño. La solución: incluye siempre el contexto esencial en cada mensaje, no asumas que la IA "recuerda" lo anterior.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: "hallucinations",
          title: "Alucinaciones: Cuando la IA inventa",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Una <strong>alucinación</strong> es cuando la IA genera información que suena completamente plausible pero es factualmente incorrecta. Puede inventar citas bibliográficas que no existen, atribuir frases a autores que nunca las dijeron, o generar estadísticas convincentes pero falsas.
              </p>
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3">⚠️ Ejemplos reales de alucinaciones</p>
                <div className="space-y-2.5">
                  {[
                    { claim: '"Según el estudio de García-López et al. (2023) publicado en Revista de Educación..."', reality: "El estudio, los autores y la publicación son completamente inventados." },
                    { claim: '"La LOMLOE establece en su artículo 47.3 que..."', reality: "El artículo existe pero dice algo diferente, o no existe en absoluto." },
                    { claim: '"La fotosíntesis produce un 78% del oxígeno atmosférico"', reality: "El porcentaje es inventado. Suena preciso pero no tiene fuente real." },
                  ].map((ex, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border border-red-100">
                      <p className="text-sm text-gray-800 font-mono italic mb-1">{ex.claim}</p>
                      <p className="text-xs text-red-700">→ {ex.reality}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">✅ Protocolo anti-alucinaciones</p>
                <ol className="space-y-1.5 text-sm text-emerald-900">
                  <li>1. <strong>Nunca</strong> presentes datos de la IA como hechos sin verificar</li>
                  <li>2. Si la IA cita una fuente, búscala manualmente antes de usarla</li>
                  <li>3. Desconfía especialmente de: porcentajes, fechas, citas textuales y nombres</li>
                  <li>4. Pide a la IA que indique su nivel de confianza o que diga "no sé" cuando no tenga certeza</li>
                  <li>5. Usa la IA para generar estructura y borradores, no como fuente de datos factuales</li>
                </ol>
              </div>
            </div>
          ),
          checkpoint: {
            question: "La IA genera una cita: 'Según Martínez (2022), el aprendizaje basado en proyectos mejora un 43% la retención.' ¿Qué deberías hacer?",
            options: [
              "Usarla directamente — la IA accede a bases de datos académicas",
              "Verificar la cita: buscar al autor, la publicación y el dato antes de usarla",
              "Cambiar el porcentaje por uno más conservador para que suene más creíble",
              "Eliminar el dato — la IA siempre inventa las estadísticas",
            ],
            correctIndex: 1,
            explanation: "Verificar siempre. La IA puede haber inventado el autor, la publicación o el dato. No todas las citas son falsas, pero ninguna debe usarse sin verificación. Busca la fuente original — si no la encuentras, no la uses.",
          },
        },
      ],
    },
    {
      id: "privacy",
      title: "Marco Legal, Privacidad y Seguridad",
      icon: <Lock className="w-5 h-5" />,
      color: "#7C3AED",
      bgLight: "bg-violet-50",
      subsections: [
        {
          id: "data-traffic-light",
          title: "El Semáforo de Datos: ¿Qué puedo y qué no puedo ingresar?",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                No todos los datos son iguales ante la ley. El GDPR (Reglamento General de Protección de Datos) y la LOPDGDD clasifican los datos personales de menores como especialmente protegidos. Los datos de salud (diagnósticos, informes psicopedagógicos) tienen la categoría más alta de protección.
              </p>
              <PrivacyTrafficLight />
            </div>
          ),
          checkpoint: {
            question: "Quieres que la IA te ayude a redactar un informe para un alumno con dislexia. ¿Cuál es la forma correcta?",
            options: [
              "Pegar el informe psicopedagógico completo para que la IA tenga contexto",
              "Escribir: 'Redacta informe para Pedro García, 3ºB, con dislexia tipo mixta'",
              "Escribir: 'Redacta informe para alumno de 3º ESO con dificultades de lectoescritura' (sin nombre ni diagnóstico específico)",
              "No usar IA en absoluto para informes de alumnos NEAE",
            ],
            correctIndex: 2,
            explanation: "La opción C es correcta: describe la necesidad sin datos identificables. No necesitas el nombre ni el diagnóstico específico para que la IA genere un borrador útil. Luego tú personalizas con los datos reales fuera de la plataforma.",
          },
        },
        {
          id: "platform-config",
          title: "Configuración de Privacidad por Plataforma",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Cada plataforma de IA tiene configuraciones diferentes para la privacidad de tus datos. Es tu responsabilidad verificar y configurar estas opciones <strong>antes</strong> de usar la herramienta con cualquier dato educativo.
              </p>
              <div className="space-y-3">
                {[
                  { name: "ChatGPT (OpenAI)", steps: "Configuración → Controles de datos → Desactivar 'Mejorar el modelo para todos' → Considerar activar 'Chat temporal' para datos sensibles", warning: "Desactivar historial NO impide que los datos se retengan hasta 30 días para revisión de seguridad." },
                  { name: "Google Gemini", steps: "Actividad de Gemini → Desactivar 'Actividad en Gemini Apps' → Eliminar historial existente", warning: "En cuentas de Workspace educativas, el admin puede tener configuraciones diferentes." },
                  { name: "Claude (Anthropic)", steps: "Los prompts en la API no se usan para entrenamiento por defecto. En claude.ai, verificar la política de datos vigente en Configuración → Privacidad.", warning: "Las políticas pueden cambiar con actualizaciones. Verifica periódicamente." },
                ].map((platform) => (
                  <div key={platform.name} className="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 className="font-bold text-sm text-gray-900 mb-2">{platform.name}</h4>
                    <p className="text-sm text-gray-700 mb-2">{platform.steps}</p>
                    <div className="bg-amber-50 rounded-lg p-2.5 flex gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800">{platform.warning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          id: "tool-vetting",
          title: "Checklist de Evaluación de Herramientas IA",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Antes de introducir cualquier herramienta de IA en tu aula, pásala por esta lista de verificación. Si no puedes responder "sí" a las preguntas esenciales, no la uses con datos de alumnos.
              </p>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 space-y-3">
                {[
                  { q: "¿Tiene política de privacidad clara y accesible?", essential: true },
                  { q: "¿Cumple con GDPR/LOPDGDD/COPPA según tu jurisdicción?", essential: true },
                  { q: "¿Indica dónde se almacenan los datos (UE vs. EE.UU. vs. otro)?", essential: true },
                  { q: "¿Permite desactivar el uso de datos para entrenamiento?", essential: true },
                  { q: "¿Tiene política específica para datos de menores?", essential: true },
                  { q: "¿La ha aprobado el equipo directivo o el DPO del centro?", essential: false },
                  { q: "¿Ofrece cuenta educativa con protecciones adicionales?", essential: false },
                  { q: "¿Permite exportar o eliminar datos del usuario?", essential: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 ${
                      item.essential ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50"
                    }`} />
                    <div>
                      <p className="text-sm text-gray-800">{item.q}</p>
                      {item.essential && <span className="text-[10px] text-red-500 font-bold uppercase">Esencial</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: "bias",
      title: "Sesgo Algorítmico",
      icon: <Scale className="w-5 h-5" />,
      color: "#059669",
      bgLight: "bg-emerald-50",
      subsections: [
        {
          id: "what-is-bias",
          title: "¿De dónde viene el sesgo en la IA?",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Los LLMs se entrenan con texto de internet: artículos, libros, foros, Wikipedia. Este texto es <strong>predominantemente en inglés, occidental y del hemisferio norte</strong>. Consecuencia: la IA reproduce y amplifica los sesgos presentes en esos datos.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { type: "Cultural", desc: "Sobrerrepresenta la cultura anglosajona. Pedagogías, ejemplos y marcos de referencia tienden a ser de EE.UU./UK.", icon: <Globe className="w-4 h-4" /> },
                  { type: "Género", desc: "Asocia profesiones con géneros (médico=hombre, enfermera=mujer) reflejando patrones históricos.", icon: <Scale className="w-4 h-4" /> },
                  { type: "Racial", desc: "Estereotipa representaciones de personas de diferentes etnias y contextos socioeconómicos.", icon: <Eye className="w-4 h-4" /> },
                  { type: "Lingüístico", desc: "Mejor rendimiento en inglés. En español puede importar terminología y marcos pedagógicos anglosajones.", icon: <MessageSquare className="w-4 h-4" /> },
                ].map((bias) => (
                  <div key={bias.type} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2 text-emerald-700">
                      {bias.icon}
                      <span className="text-xs font-bold uppercase tracking-wider">{bias.type}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{bias.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 leading-relaxed">
                  <strong>Soberanía pedagógica digital:</strong> Enseña a la IA a usar TU marco curricular. Si usas LOMLOE, dilo explícitamente. Si quieres diversidad cultural, pídela. Si no lo especificas, la IA usará sus patrones por defecto — que son anglosajones.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: "bias-audit",
          title: "Ejercicio: Audita el sesgo de la IA",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                La auditoría de sesgo es una habilidad docente esencial en la era de la IA. No se trata de rechazar la herramienta, sino de <strong>revisar críticamente sus resultados</strong> antes de llevarlos al aula.
              </p>
              <BiasAuditExercise />
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">📋 Protocolo rápido de auditoría</p>
                <ol className="space-y-1.5 text-sm text-emerald-900">
                  <li>1. <strong>Representación:</strong> ¿Quién aparece? ¿Quién falta? ¿Qué género, etnia, edad predomina?</li>
                  <li>2. <strong>Jerarquía:</strong> ¿Se usa lenguaje como "precursor de", "primitivo", "avanzado"?</li>
                  <li>3. <strong>Perspectiva:</strong> ¿Desde qué cultura o tradición se cuenta la historia?</li>
                  <li>4. <strong>Autocrítica:</strong> Pide a la IA que revise sus propios sesgos en la respuesta.</li>
                  <li>5. <strong>Contraste:</strong> Compara con el currículo oficial y fuentes diversas.</li>
                </ol>
              </div>
            </div>
          ),
          checkpoint: {
            question: "Le pides a la IA una lista de 'las 10 contribuciones más importantes a la ciencia'. El resultado solo incluye científicos europeos y norteamericanos. ¿Cuál es la mejor respuesta?",
            options: [
              "Aceptar la lista — probablemente la IA tiene razón sobre cuáles son las más importantes",
              "Rechazar la IA y buscar la información manualmente",
              "Iterar el prompt pidiendo diversidad geográfica, y usar la comparación entre ambas versiones como material didáctico sobre sesgo",
              "Añadir manualmente 2-3 nombres no occidentales a la lista de la IA",
            ],
            correctIndex: 2,
            explanation: "La opción C es la más completa: corrige el sesgo (iterando el prompt), aprovecha la oportunidad pedagógica (usando ambas versiones para enseñar pensamiento crítico) y modela el proceso de auditoría. Añadir nombres manualmente (D) es un parche; iterar y enseñar es una solución.",
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
  const completedCount = section.subsections.filter(
    (s) => s.checkpoint && completedCheckpoints.has(s.id)
  ).length;
  const totalCheckpoints = section.subsections.filter((s) => s.checkpoint).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="px-6 py-4 border-b border-gray-100" style={{ borderLeftWidth: 4, borderLeftColor: section.color }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: section.color + "15", color: section.color }}>
              {section.icon}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
          </div>
          {totalCheckpoints > 0 && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
              completedCount === totalCheckpoints ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
            }`}>
              {completedCount}/{totalCheckpoints} checkpoints
            </span>
          )}
        </div>
      </div>

      {/* Subsections */}
      <div>
        {section.subsections.map((sub, i) => {
          const isExpanded = expandedSub === sub.id;
          const hasCheckpoint = !!sub.checkpoint;
          const checkpointDone = completedCheckpoints.has(sub.id);

          return (
            <div key={sub.id} className={`${i < section.subsections.length - 1 ? "border-b border-gray-100" : ""}`}>
              <button
                onClick={() => onToggleSub(sub.id)}
                className="w-full flex items-center gap-3 px-6 py-3.5 text-left hover:bg-gray-50 transition-colors"
              >
                {hasCheckpoint ? (
                  checkpointDone
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: section.color + "15" }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: section.color }} />
                  </div>
                )}
                <span className={`text-sm font-medium flex-1 ${isExpanded ? "text-gray-900" : "text-gray-700"}`}>
                  {sub.title}
                </span>
                {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>

              {isExpanded && (
                <div className="px-6 pb-6">
                  {sub.content}
                  {sub.checkpoint && !checkpointDone && (
                    <Checkpoint
                      question={sub.checkpoint}
                      onComplete={() => onCheckpointComplete(sub.id)}
                    />
                  )}
                  {sub.checkpoint && checkpointDone && (
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

export default function GuideModule0() {
  const [expandedSub, setExpandedSub] = useState<string | null>("what-is-llm");
  const [completedCheckpoints, setCompletedCheckpoints] = useState<Set<string>>(new Set());

  const sections = useMemo(() => buildSections(), []);

  const toggleSub = useCallback((id: string) => {
    setExpandedSub((prev) => (prev === id ? null : id));
  }, []);

  const completeCheckpoint = useCallback((id: string) => {
    setCompletedCheckpoints((prev) => new Set([...prev, id]));
  }, []);

  const totalCheckpoints = sections.reduce(
    (acc, s) => acc + s.subsections.filter((sub) => sub.checkpoint).length, 0
  );
  const completedCount = completedCheckpoints.size;
  const progress = totalCheckpoints > 0 ? Math.round((completedCount / totalCheckpoints) * 100) : 0;

  return (
    <div className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Box className="w-3.5 h-3.5" />
            Módulo 0 · Semana 1
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Fundamentos Críticos y la "Caja Negra"
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Desmitifica la tecnología: de la magia al pensamiento técnico. Comprende
            cómo funciona la IA, qué datos proteger y qué sesgos vigilar.
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-3.5 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Progreso del módulo
            </span>
            <span className="text-xs text-gray-400">
              {completedCount}/{totalCheckpoints} checkpoints · {progress}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <SectionView
              key={section.id}
              section={section}
              expandedSub={expandedSub}
              onToggleSub={toggleSub}
              completedCheckpoints={completedCheckpoints}
              onCheckpointComplete={completeCheckpoint}
            />
          ))}
        </div>

        {/* Completion CTA */}
        {progress === 100 && (
          <div className="mt-8 bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center">
            <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-emerald-900 mb-2">¡Módulo 0 completado!</h3>
            <p className="text-sm text-emerald-700 mb-4">
              Has superado todos los checkpoints. Ya tienes las bases para entender
              cómo funciona la IA, proteger los datos de tu alumnado y detectar sesgos.
            </p>
            <p className="text-sm font-semibold text-emerald-800">
              Siguiente → Módulo 1: La Sintaxis de la Maestría (Framework C.R.E.F.O.)
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-10">
          Módulo 0 · 3 secciones · {totalCheckpoints} checkpoints · Curso "Prompt Mastery para Docentes"
        </p>
      </div>
    </div>
  );
}
