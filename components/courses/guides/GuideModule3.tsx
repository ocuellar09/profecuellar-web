"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useCallback, useMemo } from "react";
import {
  BookOpen, ChevronDown, ChevronRight, CheckCircle2, Circle, Lightbulb,
  Sparkles, ArrowRight, Target, FileText, Zap, MessageSquare, Copy, Check,
  AlertTriangle, Star, Users, Eye, BarChart3, Layers, Scale,
} from "lucide-react";

// ─── Reusable ───────────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }}
      className="flex items-center gap-1 text-[10px] font-medium text-gray-400 hover:text-gray-700 transition-colors">
      {c ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}{c ? "✓" : "Copiar"}
    </button>
  );
}

interface CpQ { question: string; options: string[]; correctIndex: number; explanation: string; }

function Checkpoint({ question, onComplete }: { question: CpQ; onComplete: () => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const [rev, setRev] = useState(false);
  const check = () => { setRev(true); if (sel === question.correctIndex) onComplete(); };
  const ok = sel === question.correctIndex;
  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 my-6">
      <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">✓ Checkpoint</p>
      <p className="text-sm font-semibold text-gray-900 mb-4">{question.question}</p>
      <div className="space-y-2 mb-4">
        {question.options.map((o, i) => {
          let cls = "border-gray-200 bg-white";
          if (rev) { if (i === question.correctIndex) cls = "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200"; else if (i === sel) cls = "border-red-400 bg-red-50 ring-2 ring-red-200"; else cls = "border-gray-200 bg-gray-50 opacity-50"; }
          else if (i === sel) cls = "border-amber-400 bg-amber-50 ring-2 ring-amber-200";
          return <button key={i} onClick={() => !rev && setSel(i)} disabled={rev} className={`w-full text-left rounded-lg border-2 p-3 text-sm transition-all ${cls}`}>{o}</button>;
        })}
      </div>
      {!rev ? (
        <button onClick={check} disabled={sel === null} className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${sel !== null ? "bg-amber-600 text-white hover:bg-amber-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>Verificar</button>
      ) : (
        <div className={`rounded-lg p-3 ${ok ? "bg-emerald-100 border border-emerald-300" : "bg-red-100 border border-red-300"}`}>
          <p className="text-sm leading-relaxed" style={{ color: ok ? "#064e3b" : "#7f1d1d" }}>{ok ? "✓ " : "✗ "}{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

// ─── Rubric Quality Analyzer ────────────────────────────────────────────────

function RubricAnalyzer() {
  const [view, setView] = useState<"bad" | "good">("bad");
  const bad = {
    label: "Rúbrica genérica (IA sin guía)",
    criteria: [
      { name: "Contenido", levels: ["Excelente contenido", "Buen contenido", "Contenido aceptable", "Contenido insuficiente"] },
      { name: "Presentación", levels: ["Muy buena presentación", "Buena presentación", "Presentación regular", "Mala presentación"] },
      { name: "Esfuerzo", levels: ["Gran esfuerzo", "Buen esfuerzo", "Algo de esfuerzo", "Poco esfuerzo"] },
    ],
    problems: ["Descriptores circulares (repiten el nombre del nivel)", "No son observables ni medibles", "'Esfuerzo' no es un criterio evaluable", "Un alumno no sabría qué hacer para mejorar"],
  };
  const good = {
    label: "Rúbrica con C.R.E.F.O. + Few-shot",
    criteria: [
      { name: "Argumentación", levels: [
        "Presenta tesis clara + 3 argumentos con evidencia textual + contraargumento refutado",
        "Presenta tesis clara + 2 argumentos con evidencia + mención de contraargumento",
        "Presenta tesis + 1-2 argumentos sin evidencia textual",
        "No presenta tesis o los argumentos no se relacionan con ella",
      ] },
      { name: "Uso de fuentes", levels: [
        "Cita 3+ fuentes fiables, integradas en el argumento, con formato APA correcto",
        "Cita 2 fuentes fiables, mayormente integradas, formato APA con errores menores",
        "Cita 1 fuente o las fuentes no son fiables o no están integradas",
        "No cita fuentes o las fuentes son inventadas/irrelevantes",
      ] },
    ],
    strengths: ["Criterios observables y medibles", "Descriptores específicos (números, acciones concretas)", "Un alumno sabe exactamente qué hacer para subir de nivel", "Cada nivel es distinguible del anterior"],
  };
  const data = view === "bad" ? bad : good;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <div className="flex border-b border-gray-200">
        <button onClick={() => setView("bad")} className={`flex-1 py-2.5 text-xs font-bold transition-all ${view === "bad" ? "bg-red-50 text-red-700 border-b-2 border-red-500" : "bg-gray-50 text-gray-500"}`}>❌ Sin guía</button>
        <button onClick={() => setView("good")} className={`flex-1 py-2.5 text-xs font-bold transition-all ${view === "good" ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500" : "bg-gray-50 text-gray-500"}`}>✅ Con C.R.E.F.O.</button>
      </div>
      <div className="p-5">
        <h4 className="text-sm font-bold text-gray-900 mb-3">{data.label}</h4>
        <div className="space-y-2 mb-4">
          {data.criteria.map((c, i) => (
            <div key={i} className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-3 py-1.5"><span className="text-xs font-bold text-gray-700">{c.name}</span></div>
              <div className="grid grid-cols-4 gap-px bg-gray-200">
                {c.levels.map((l, j) => (
                  <div key={j} className="bg-white p-2"><p className="text-[10px] text-gray-600 leading-tight">{l}</p></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {"problems" in data ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Problemas detectados</span>
            {data.problems.map((p, i) => <p key={i} className="text-xs text-red-800 flex items-start gap-1.5 mt-1"><span className="text-red-400">·</span>{p}</p>)}
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Fortalezas</span>
            {data.strengths.map((s, i) => <p key={i} className="text-xs text-emerald-800 flex items-start gap-1.5 mt-1"><span className="text-emerald-400">✓</span>{s}</p>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Feedback Hybrid Model ──────────────────────────────────────────────────

function HybridFeedbackModel() {
  const [phase, setPhase] = useState(0);
  const phases = [
    { label: "1. IA genera borrador", color: "#4F46E5", icon: "🤖",
      content: "La IA analiza el trabajo según los criterios de la rúbrica y genera feedback estructurado: fortalezas, áreas de mejora y preguntas de reflexión.",
      example: "Fortaleza: Tu argumento central está bien definido.\nMejora: Los párrafos 2 y 3 necesitan evidencia textual.\nReflexión: ¿Qué cita del texto apoyaría tu punto sobre la justicia?",
      note: "Este paso ahorra el 60-70% del tiempo. La IA es buena en estructura y criterios." },
    { label: "2. Docente personaliza", color: "#D97706", icon: "👩‍🏫",
      content: "El docente revisa el borrador de la IA y añade: observaciones personales, conexiones con el proceso del alumno, tono adecuado a la relación, y ajustes de nivel.",
      example: "Fortaleza: Tu argumento central está bien definido — ¡se nota que las sesiones de debate te ayudaron!\nMejora: Los párrafos 2 y 3 necesitan evidencia. Recuerda la técnica PEEL que practicamos.\nReflexión: ¿Qué cita del texto apoyaría tu punto? Revisa las que subrayamos en clase el martes.",
      note: "Este paso aporta la autenticidad y la relación personal que la IA no puede generar." },
    { label: "3. Alumno actúa", color: "#059669", icon: "🎒",
      content: "El alumno recibe feedback personalizado, responde a las preguntas de reflexión y revisa su trabajo. El feedback no es un veredicto — es un diálogo.",
      example: "El alumno revisa párrafos 2 y 3, añade citas textuales, responde la pregunta de reflexión y entrega la versión revisada.",
      note: "El feedback solo es útil si genera acción. Sin este paso, todo lo anterior es inútil." },
  ];
  const p = phases[phase];

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Modelo Híbrido de Feedback</span>
        <span className="text-xs text-gray-400">{phase + 1}/3</span>
      </div>
      <div className="flex border-b border-gray-200">
        {phases.map((ph, i) => (
          <button key={i} onClick={() => setPhase(i)}
            className={`flex-1 py-2.5 text-[10px] font-bold transition-all ${phase === i ? "text-white" : "text-gray-400 bg-gray-50"}`}
            style={phase === i ? { backgroundColor: ph.color } : undefined}>
            {ph.icon} Paso {i + 1}
          </button>
        ))}
      </div>
      <div className="p-5">
        <h4 className="text-sm font-bold mb-2" style={{ color: p.color }}>{p.label}</h4>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{p.content}</p>
        <div className="rounded-lg p-3 mb-3" style={{ backgroundColor: p.color + "08", border: `1px solid ${p.color}25` }}>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: p.color }}>Ejemplo</span>
          <pre className="text-xs text-gray-800 leading-relaxed whitespace-pre-line font-mono mt-1">{p.example}</pre>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900">{p.note}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Feedback Consistency Demo ──────────────────────────────────────────────

function FeedbackConsistencyDemo() {
  const [mode, setMode] = useState<"without" | "with">("without");
  const without = {
    feedbacks: [
      { student: "Alumno A", fb: "Buen trabajo. Tu ensayo muestra comprensión del tema." },
      { student: "Alumno B", fb: "Interesante perspectiva. Podrías mejorar la estructura." },
      { student: "Alumno C", fb: "Necesitas trabajar más en la argumentación y las fuentes." },
    ],
    problem: "Cada feedback tiene estructura, tono y profundidad diferentes. No hay criterios consistentes.",
  };
  const withEx = {
    feedbacks: [
      { student: "Alumno A", fb: "FORTALEZA: Tesis clara y 2 argumentos con evidencia.\nMEJORA: El contraargumento no está refutado (párr. 4).\nACCIÓN: Añade 1 frase que responda al contraargumento." },
      { student: "Alumno B", fb: "FORTALEZA: Uso de 3 fuentes correctamente citadas.\nMEJORA: La tesis es ambigua — no queda claro tu posición.\nACCIÓN: Reescribe la tesis en 1 frase afirmativa." },
      { student: "Alumno C", fb: "FORTALEZA: Estructura clara con intro-desarrollo-conclusión.\nMEJORA: Solo 1 fuente citada (se requieren 3 mínimo).\nACCIÓN: Añade 2 fuentes del dossier de clase." },
    ],
    strength: "Misma estructura (Fortaleza → Mejora → Acción), mismo nivel de detalle, criterios consistentes.",
  };
  const data = mode === "without" ? without : withEx;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <div className="flex border-b border-gray-200">
        <button onClick={() => setMode("without")} className={`flex-1 py-2.5 text-xs font-bold ${mode === "without" ? "bg-red-50 text-red-700 border-b-2 border-red-500" : "bg-gray-50 text-gray-500"}`}>❌ Zero-shot</button>
        <button onClick={() => setMode("with")} className={`flex-1 py-2.5 text-xs font-bold ${mode === "with" ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500" : "bg-gray-50 text-gray-500"}`}>✅ Few-shot</button>
      </div>
      <div className="p-5">
        <div className="space-y-2 mb-3">
          {data.feedbacks.map((f, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase">{f.student}</span>
              <pre className="text-xs text-gray-800 leading-relaxed whitespace-pre-line font-mono mt-1">{f.fb}</pre>
            </div>
          ))}
        </div>
        {"problem" in data ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-800">{data.problem}</p>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-800">{data.strength}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section Data ───────────────────────────────────────────────────────────

interface SubSec { id: string; title: string; content: React.ReactNode; checkpoint?: CpQ; }
interface SectionD { id: string; title: string; icon: React.ReactNode; color: string; subsections: SubSec[]; }

function buildSections(): SectionD[] {
  return [
    {
      id: "rubrics", title: "Rúbricas con IA", icon: <BarChart3 className="w-5 h-5" />, color: "#7C3AED",
      subsections: [
        { id: "rubric-quality", title: "El problema de las rúbricas genéricas",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Si le pides a la IA "hazme una rúbrica", obtendrás descriptores circulares: "Excelente = excelente trabajo".
                Una rúbrica útil tiene descriptores <strong>observables, medibles y distinguibles entre niveles</strong>.
                La diferencia entre una rúbrica genérica y una profesional está en el prompt.
              </p>
              <RubricAnalyzer />
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                <p className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-2">Prompt clave para rúbricas</p>
                <div className="flex justify-between items-start">
                  <pre className="text-xs text-violet-900 font-mono leading-relaxed whitespace-pre-line flex-1">
{`[ROL] Experto en evaluación formativa y diseño de rúbricas analíticas.

Cada descriptor debe:
- Ser OBSERVABLE (qué se ve/lee en el trabajo)
- Incluir CANTIDAD o FRECUENCIA (números concretos)
- Ser DISTINGUIBLE del nivel anterior y posterior
- Permitir que el ALUMNO sepa qué hacer para subir de nivel

NO uses: "bueno", "excelente", "adecuado", "suficiente" como descriptores.
SÍ usa: verbos de acción + cantidad + criterio observable.`}</pre>
                  <CopyBtn text={`[ROL] Experto en evaluación formativa y diseño de rúbricas analíticas.\n\nCada descriptor debe:\n- Ser OBSERVABLE\n- Incluir CANTIDAD o FRECUENCIA\n- Ser DISTINGUIBLE del nivel anterior y posterior\n- Permitir que el ALUMNO sepa qué hacer para subir de nivel\n\nNO uses: "bueno", "excelente", "adecuado", "suficiente".\nSÍ usa: verbos de acción + cantidad + criterio observable.`} />
                </div>
              </div>
            </div>
          ),
          checkpoint: {
            question: "Una rúbrica generada por IA dice: 'Nivel Bueno: El alumno muestra buen dominio del tema.' ¿Cuál es el problema principal?",
            options: [
              "Es demasiado corta",
              "Es un descriptor circular: 'bueno = bueno'. No es observable ni medible. El alumno no sabe qué hacer para mejorar.",
              "Debería decir 'Excelente' en vez de 'Bueno'",
              "Le falta vocabulario técnico",
            ],
            correctIndex: 1,
            explanation: "Los descriptores circulares repiten el nombre del nivel sin definir qué se observa concretamente. Un descriptor útil sería: 'Desarrolla 2 argumentos con evidencia textual y estructura lógica.' Eso SÍ es observable y accionable.",
          },
        },
      ],
    },
    {
      id: "feedback", title: "Feedback Efectivo con IA", icon: <MessageSquare className="w-5 h-5" />, color: "#D97706",
      subsections: [
        { id: "consistency", title: "Few-shot para feedback consistente",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                El mayor reto de dar feedback a 25+ alumnos no es la calidad de cada comentario, sino la <strong>consistencia</strong>:
                que todos reciban el mismo nivel de detalle, estructura y criterios. Few-shot resuelve esto: tus ejemplos "gold standard"
                se replican con alta fidelidad.
              </p>
              <FeedbackConsistencyDemo />
            </div>
          ),
          checkpoint: {
            question: "Generas feedback con IA para 28 trabajos. Tres alumnos notan que sus comentarios son casi idénticos. ¿Qué falló?",
            options: [
              "La IA no puede generar feedback individual",
              "Faltó incluir datos específicos de cada trabajo en el prompt (o la IA solo vio la rúbrica, no el trabajo real)",
              "El Few-shot no funciona para feedback",
              "Necesitas usar otra herramienta de IA",
            ],
            correctIndex: 1,
            explanation: "Si la IA solo tiene la rúbrica pero no el trabajo concreto, genera feedback genérico aplicable a cualquiera. Solución: incluye extractos específicos del trabajo de cada alumno (anonimizado) junto con la rúbrica y los ejemplos Few-shot.",
          },
        },
        { id: "hybrid", title: "El modelo híbrido: IA + Docente",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                La IA no sustituye tu feedback — lo potencia. El modelo más efectivo combina la eficiencia de la IA en estructura y
                criterios con tu conocimiento personal del alumno, su proceso y su contexto emocional.
              </p>
              <HybridFeedbackModel />
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Distribución recomendada</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                    <p className="text-xl font-bold text-blue-600">60%</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">IA genera</p>
                    <p className="text-[10px] text-gray-400">Estructura, criterios, preguntas</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                    <p className="text-xl font-bold text-amber-600">30%</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Docente añade</p>
                    <p className="text-[10px] text-gray-400">Contexto personal, tono, conexiones</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                    <p className="text-xl font-bold text-emerald-600">10%</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Docente verifica</p>
                    <p className="text-[10px] text-gray-400">Precisión, sesgo, tono</p>
                  </div>
                </div>
              </div>
            </div>
          ),
          checkpoint: {
            question: "¿Cuál es el principal valor que aporta el docente al modelo híbrido que la IA NO puede generar?",
            options: [
              "Estructura y organización del feedback",
              "Conocimiento del proceso individual del alumno, su contexto emocional y la relación de confianza",
              "Criterios de evaluación objetivos",
              "Velocidad de generación",
            ],
            correctIndex: 1,
            explanation: "La IA es excelente en estructura, criterios y consistencia. Pero NO conoce al alumno, su proceso, sus emociones ni tu relación con él/ella. Esa personalización auténtica es irreemplazable y es lo que convierte el feedback en herramienta de aprendizaje.",
          },
        },
      ],
    },
    {
      id: "verification", title: "Verificación de Contenido Evaluativo", icon: <Scale className="w-5 h-5" />, color: "#DC2626",
      subsections: [
        { id: "anti-hallucination", title: "Protocolo anti-alucinaciones para evaluación",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                En evaluación, las alucinaciones son especialmente peligrosas: una rúbrica con criterios inventados, un feedback que
                referencia algo que el alumno no escribió, o una pregunta de examen con respuesta incorrecta puede dañar la confianza
                y la equidad evaluativa.
              </p>
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3">⚠️ Alucinaciones comunes en evaluación</p>
                {[
                  { type: "Rúbricas", risk: "Criterios que suenan profesionales pero no miden nada observable" },
                  { type: "Feedback", risk: "Elogia aspectos que no existen en el trabajo del alumno" },
                  { type: "Exámenes", risk: "Preguntas con respuesta 'correcta' que es incorrecta" },
                  { type: "Calificaciones", risk: "Sugiere porcentajes o baremos sin base curricular" },
                ].map((h, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
                    <span className="text-xs font-bold text-red-500 flex-shrink-0 mt-0.5">{h.type}:</span>
                    <p className="text-xs text-red-800">{h.risk}</p>
                  </div>
                ))}
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">✓ Protocolo de verificación en 4 pasos</p>
                {[
                  "RÚBRICAS: ¿Cada descriptor es observable? Haz la prueba: ¿2 evaluadores llegarían a la misma conclusión?",
                  "FEEDBACK: Verifica que cada comentario corresponde a algo REAL del trabajo del alumno",
                  "EXÁMENES: Resuelve tú mismo TODAS las preguntas antes de dar el examen. Verifica la clave de respuestas.",
                  "BAREMOS: Comprueba que los porcentajes y pesos se alinean con tu programación didáctica oficial",
                ].map((step, i) => (
                  <p key={i} className="text-xs text-emerald-900 flex items-start gap-2 mb-1.5 last:mb-0">
                    <span className="font-bold text-emerald-600">{i + 1}.</span>{step}
                  </p>
                ))}
              </div>
            </div>
          ),
          checkpoint: {
            question: "Generas un examen con IA. ¿Cuál es el paso de verificación MÁS importante antes de dárselo a los alumnos?",
            options: [
              "Comprobar la ortografía",
              "Verificar que las preguntas están bien numeradas",
              "Resolver tú mismo TODAS las preguntas y verificar que la clave de respuestas es correcta",
              "Pedir a la IA que revise su propio examen",
            ],
            correctIndex: 2,
            explanation: "La IA puede generar preguntas con respuestas 'correctas' que son incorrectas. Resolver el examen tú mismo es la única forma de verificar. Pedir a la IA que se auto-revise NO funciona — puede repetir el mismo error.",
          },
        },
      ],
    },
  ];
}

// ─── Section Component ──────────────────────────────────────────────────────

function SectionView({ section, expandedSub, onToggleSub, completedCp, onCpComplete }: {
  section: SectionD; expandedSub: string | null; onToggleSub: (id: string) => void;
  completedCp: Set<string>; onCpComplete: (id: string) => void;
}) {
  const cc = section.subsections.filter(s => s.checkpoint).length;
  const cd = section.subsections.filter(s => s.checkpoint && completedCp.has(s.id)).length;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100" style={{ borderLeftWidth: 4, borderLeftColor: section.color }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: section.color + "15", color: section.color }}>{section.icon}</div>
            <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
          </div>
          {cc > 0 && <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${cd === cc ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{cd}/{cc} ✓</span>}
        </div>
      </div>
      {section.subsections.map((sub, i) => {
        const isExp = expandedSub === sub.id; const hasCp = !!sub.checkpoint; const cpDone = completedCp.has(sub.id);
        return (
          <div key={sub.id} className={i < section.subsections.length - 1 ? "border-b border-gray-100" : ""}>
            <button onClick={() => onToggleSub(sub.id)} className="w-full flex items-center gap-3 px-6 py-3.5 text-left hover:bg-gray-50 transition-colors">
              {hasCp ? (cpDone ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-gray-300" />) :
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: section.color + "15" }}><div className="w-2 h-2 rounded-full" style={{ backgroundColor: section.color }} /></div>}
              <span className={`text-sm font-medium flex-1 ${isExp ? "text-gray-900" : "text-gray-700"}`}>{sub.title}</span>
              {isExp ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
            </button>
            {isExp && (
              <div className="px-6 pb-6">
                {sub.content}
                {sub.checkpoint && !cpDone && <Checkpoint question={sub.checkpoint} onComplete={() => onCpComplete(sub.id)} />}
                {sub.checkpoint && cpDone && (
                  <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /><span className="text-sm text-emerald-700 font-medium">Checkpoint completado</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────

export default function GuideModule3() {
  const [expandedSub, setExpandedSub] = useState<string | null>("rubric-quality");
  const [completedCp, setCompletedCp] = useState<Set<string>>(new Set());
  const sections = useMemo(() => buildSections(), []);
  const toggleSub = useCallback((id: string) => setExpandedSub(p => p === id ? null : id), []);
  const completeCp = useCallback((id: string) => setCompletedCp(p => new Set([...p, id])), []);
  const totalCp = sections.reduce((a, s) => a + s.subsections.filter(sub => sub.checkpoint).length, 0);
  const doneCp = completedCp.size;
  const pct = totalCp > 0 ? Math.round((doneCp / totalCp) * 100) : 0;

  return (
    <div className="py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" /> Módulo 3 · Semana 5
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Evaluación y Feedback con IA</h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Rúbricas profesionales, feedback consistente con Few-shot, el modelo híbrido
            IA+docente, y verificación anti-alucinaciones para contenido evaluativo.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-3.5 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Progreso</span>
            <span className="text-xs text-gray-400">{doneCp}/{totalCp} checkpoints · {pct}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="space-y-6">
          {sections.map(s => <SectionView key={s.id} section={s} expandedSub={expandedSub} onToggleSub={toggleSub} completedCp={completedCp} onCpComplete={completeCp} />)}
        </div>
        {pct === 100 && (
          <div className="mt-8 bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center">
            <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-emerald-900 mb-2">¡Módulo 3 completado!</h3>
            <p className="text-sm text-emerald-700">Dominas rúbricas profesionales, feedback híbrido y verificación evaluativa.</p>
            <p className="text-sm font-semibold text-emerald-800 mt-2">Siguiente → Módulo 4: Proyecto Integrador</p>
          </div>
        )}
        <p className="text-center text-xs text-gray-400 mt-10">Módulo 3 · 3 secciones · {totalCp} checkpoints · Curso "Prompt Mastery para Docentes"</p>
      </div>
    </div>
  );
}
