"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useCallback, useMemo } from "react";
import {
  BookOpen, ChevronDown, ChevronRight, CheckCircle2, Circle, Lightbulb,
  Sparkles, ArrowRight, Target, Heart, Users, Globe, Compass,
  AlertTriangle, Copy, Check, Star, TrendingUp, Zap, Brain,
  Shield, Eye, FileText, Award, MessageCircle, Edit3, Save,
} from "lucide-react";

// ─── Reusable ───────────────────────────────────────────────────────────────

interface CpQ { question: string; options: string[]; correctIndex: number; explanation: string; }

function Checkpoint({ question, onComplete }: { question: CpQ; onComplete: () => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const [rev, setRev] = useState(false);
  const check = () => { setRev(true); if (sel === question.correctIndex) onComplete(); };
  const ok = sel === question.correctIndex;
  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 my-6">
      <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">✓ Checkpoint</p>
      <p className="text-[15px] md:text-base font-semibold text-gray-900 mb-4 leading-relaxed">{question.question}</p>
      <div className="space-y-2 mb-4">
        {question.options.map((o, i) => {
          let cls = "border-gray-200 bg-white";
          if (rev) { if (i === question.correctIndex) cls = "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200"; else if (i === sel) cls = "border-red-400 bg-red-50 ring-2 ring-red-200"; else cls = "border-gray-200 bg-gray-50 text-gray-600"; }
          else if (i === sel) cls = "border-amber-400 bg-amber-50 ring-2 ring-amber-200";
          return (
            <button
              key={i}
              onClick={() => !rev && setSel(i)}
              disabled={rev}
              className={`w-full text-left rounded-lg border-2 p-4 text-[15px] md:text-base text-gray-900 leading-relaxed transition-all ${cls}`}
            >
              {o}
            </button>
          );
        })}
      </div>
      {!rev ? (
        <button
          onClick={check}
          disabled={sel === null}
          className={`w-full py-3 rounded-xl font-semibold text-base transition-all ${sel !== null ? "bg-amber-600 text-white hover:bg-amber-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
        >
          Verificar
        </button>
      ) : (
        <div className={`rounded-lg p-3 ${ok ? "bg-emerald-100 border border-emerald-300" : "bg-red-100 border border-red-300"}`}>
          <p className="text-[15px] md:text-base leading-relaxed" style={{ color: ok ? "#064e3b" : "#7f1d1d" }}>
            {ok ? "✓ " : "✗ "}{question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Manifesto Builder ──────────────────────────────────────────────────────

function ManifestoBuilder() {
  const prompts = [
    { id: "purpose", label: "Mi propósito", prompt: "Uso la IA en educación para...", placeholder: "...potenciar el aprendizaje personalizado sin perder la conexión humana con mis alumnos.", color: "#4F46E5" },
    { id: "redlines", label: "Mis líneas rojas", prompt: "Nunca usaré la IA para...", placeholder: "...sustituir la relación personal con mis alumnos, ni para evaluar sin revisar, ni para compartir datos de menores.", color: "#DC2626" },
    { id: "commitment", label: "Mi compromiso de calidad", prompt: "Antes de usar cualquier contenido generado por IA, siempre...", placeholder: "...verificaré su precisión, pasaré la auditoría de sesgo y comprobaré su viabilidad en mi contexto real.", color: "#D97706" },
    { id: "growth", label: "Mi plan de crecimiento", prompt: "Para seguir desarrollándome como docente que usa IA...", placeholder: "...participaré en comunidades de práctica, experimentaré con nuevas técnicas y compartiré mis aprendizajes.", color: "#059669" },
    { id: "legacy", label: "Mi legado", prompt: "Quiero que mis alumnos aprendan de mi ejemplo que la IA...", placeholder: "...es una herramienta poderosa que requiere pensamiento crítico, ética y criterio humano para usarse bien.", color: "#7C3AED" },
  ];
  const [values, setValues] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>("purpose");

  const filled = Object.values(values).filter(v => v.trim()).length;
  const allFilled = filled === prompts.length;

  const fullManifesto = prompts
    .map(p => `${p.label.toUpperCase()}\n${p.prompt} ${values[p.id] || "(pendiente)"}`)
    .join("\n\n");

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Constructor de Manifiesto Personal</span>
        </div>
        <span className="text-xs text-gray-400">{filled}/{prompts.length} completados</span>
      </div>

      <div className="p-5 space-y-3">
        {prompts.map(p => {
          const isEditing = editing === p.id;
          const val = values[p.id] || "";
          return (
            <div key={p.id} className="rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setEditing(isEditing ? null : p.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: val.trim() ? p.color : "#e5e7eb", color: val.trim() ? "#fff" : "#9ca3af" }}>
                  {val.trim() ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3 h-3" />}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: p.color }}>{p.label}</span>
                  <p className="text-sm text-gray-700">{p.prompt} <span className="text-gray-400">{val.trim() ? val.slice(0, 60) + (val.length > 60 ? "..." : "") : ""}</span></p>
                </div>
                {isEditing ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>
              {isEditing && (
                <div className="px-4 pb-4">
                  <textarea
                    value={val}
                    onChange={e => setValues(v => ({ ...v, [p.id]: e.target.value }))}
                    rows={2}
                    placeholder={p.placeholder}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 resize-y"
                    style={{ "--tw-ring-color": p.color + "60" } as React.CSSProperties}
                  />
                </div>
              )}
            </div>
          );
        })}

        {allFilled && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Tu Manifiesto Completo</span>
              <button onClick={() => { navigator.clipboard.writeText(fullManifesto); }}
                className="flex items-center gap-1 text-[10px] font-medium text-indigo-500 hover:text-indigo-700">
                <Copy className="w-3 h-3" /> Copiar
              </button>
            </div>
            <pre className="text-xs text-indigo-900 leading-relaxed whitespace-pre-line font-mono">{fullManifesto}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Competency Radar (simplified visual) ───────────────────────────────────

function CompetencyRadar() {
  const competencies = [
    { id: "crefo", label: "C.R.E.F.O.", color: "#D97706" },
    { id: "iteration", label: "Iteración", color: "#059669" },
    { id: "ethics", label: "Ética y Privacidad", color: "#7C3AED" },
    { id: "bias", label: "Detección de Sesgo", color: "#DC2626" },
    { id: "pedagogy", label: "Aplicación Pedagógica", color: "#2563EB" },
    { id: "critical", label: "Pensamiento Crítico", color: "#EA580C" },
  ];
  const [ratings, setRatings] = useState<Record<string, number>>({});

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-indigo-600" />
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Autoevaluación Final de Competencias</span>
      </div>
      <p className="text-xs text-gray-500 mb-4">Puntúa honestamente tu nivel actual (1-5) en cada competencia del curso.</p>
      <div className="space-y-3">
        {competencies.map(c => {
          const val = ratings[c.id] || 0;
          return (
            <div key={c.id} className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-700 w-40 flex-shrink-0">{c.label}</span>
              <div className="flex gap-1 flex-1">
                {[1, 2, 3, 4, 5].map(r => (
                  <button key={r} onClick={() => setRatings(prev => ({ ...prev, [c.id]: prev[c.id] === r ? 0 : r }))}
                    className="flex-1 h-8 rounded-lg text-xs font-bold transition-all"
                    style={{
                      backgroundColor: val >= r ? c.color : "#f3f4f6",
                      color: val >= r ? "#fff" : "#9ca3af",
                    }}>
                    {r}
                  </button>
                ))}
              </div>
              {val > 0 && (
                <span className="text-[10px] font-bold text-gray-500 w-16 text-right">
                  {val <= 2 ? "En desarrollo" : val <= 3 ? "Competente" : val <= 4 ? "Avanzado" : "Experto"}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {Object.keys(ratings).length === competencies.length && (
        <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <p className="text-xs text-indigo-800">
            <strong>Media:</strong> {(Object.values(ratings).reduce((a, b) => a + b, 0) / competencies.length).toFixed(1)}/5 — 
            {" "}{Object.values(ratings).reduce((a, b) => a + b, 0) / competencies.length >= 4 ? "Nivel avanzado. Estás preparado/a para liderar la implementación de IA en tu centro." :
              Object.values(ratings).reduce((a, b) => a + b, 0) / competencies.length >= 3 ? "Nivel competente. Base sólida para seguir creciendo con la práctica." :
              "En desarrollo. Continúa practicando con las herramientas del curso."}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Future Scenarios ───────────────────────────────────────────────────────

function FutureScenarios() {
  const [active, setActive] = useState(0);
  const scenarios = [
    { label: "Tutores IA personalizados", timeframe: "1-2 años", color: "#4F46E5",
      description: "Cada alumno tendrá acceso a un tutor IA que se adapta a su ritmo, estilo de aprendizaje y nivel. El docente pasará de explicar contenido a diseñar experiencias, supervisar la IA y gestionar las emociones del aprendizaje.",
      teacherRole: "Diseñador de experiencias + supervisor de calidad + referente emocional",
      skill: "Dominar el prompt engineering para configurar y auditar tutores IA" },
    { label: "Evaluación continua automatizada", timeframe: "2-3 años", color: "#059669",
      description: "La evaluación formativa será en tiempo real: la IA analizará el trabajo del alumno mientras lo hace y ofrecerá feedback instantáneo. El docente definirá los criterios, auditará la equidad y gestionará los casos complejos.",
      teacherRole: "Diseñador de criterios + auditor de equidad + gestor de excepciones",
      skill: "Diseñar rúbricas auditables y protocolos de verificación de sesgo evaluativo" },
    { label: "Contenido generativo adaptativo", timeframe: "2-4 años", color: "#D97706",
      description: "Los materiales didácticos se generarán en tiempo real según el progreso de cada alumno. No habrá un 'libro de texto' fijo sino un flujo adaptativo. El docente será el curador y verificador.",
      teacherRole: "Curador de contenido + verificador de calidad + diseñador de trayectorias",
      skill: "Auditoría de sesgo a escala, verificación de precisión y diseño de trayectorias de aprendizaje" },
    { label: "IA como co-docente", timeframe: "3-5 años", color: "#7C3AED",
      description: "La IA gestionará parte de la instrucción directa, la práctica guiada y el feedback. El docente se especializará en lo que la IA no puede: inspirar, emocionar, mediar conflictos, detectar problemas emocionales.",
      teacherRole: "Líder pedagógico + referente humano + diseñador de cultura de aula",
      skill: "Todas las del curso + liderazgo en integración tecnológica + inteligencia emocional amplificada" },
  ];
  const s = scenarios[active];

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100">
        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Escenarios Futuros de la IA en Educación</span>
      </div>
      <div className="flex border-b border-gray-200">
        {scenarios.map((sc, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`flex-1 py-2.5 text-[10px] font-bold transition-all text-center ${active === i ? "text-white" : "text-gray-400 bg-gray-50"}`}
            style={active === i ? { backgroundColor: sc.color } : undefined}>
            {sc.label}
          </button>
        ))}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: s.color }}>{s.timeframe}</span>
          <h4 className="text-sm font-bold text-gray-900">{s.label}</h4>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{s.description}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-lg p-3 border" style={{ backgroundColor: s.color + "08", borderColor: s.color + "25" }}>
            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: s.color }}>Rol del docente</span>
            <p className="text-xs text-gray-800 mt-1">{s.teacherRole}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Competencia clave</span>
            <p className="text-xs text-gray-800 mt-1">{s.skill}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Learning Roadmap ───────────────────────────────────────────────────────

function LearningRoadmap() {
  const [done, setDone] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setDone(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const items = [
    { period: "Mes 1-2", action: "Practica C.R.E.F.O. diariamente con una tarea de aula real por semana", icon: "📐" },
    { period: "Mes 1-2", action: "Crea tu banco personal de prompts 'estrella' organizados por uso", icon: "💎" },
    { period: "Mes 3-4", action: "Experimenta con Prompt Chaining para secuencias didácticas completas", icon: "🔗" },
    { period: "Mes 3-4", action: "Comparte un caso de éxito (y uno de fracaso) con compañeros", icon: "🗣️" },
    { period: "Mes 5-6", action: "Explora una herramienta de IA nueva que no usaste en el curso", icon: "🔭" },
    { period: "Mes 5-6", action: "Haz de mentor/a informal de un compañero/a que empiece con IA", icon: "🤝" },
    { period: "Mes 7-9", action: "Publica o presenta tu experiencia (blog, jornada, claustro)", icon: "📢" },
    { period: "Mes 7-9", action: "Revisa y actualiza tu manifiesto personal de uso de IA", icon: "📜" },
    { period: "Mes 10-12", action: "Lidera un grupo de trabajo sobre IA en tu centro", icon: "🏫" },
    { period: "Mes 10-12", action: "Evalúa tu evolución: repite la autoevaluación de competencias", icon: "📊" },
  ];

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Compass className="w-5 h-5 text-emerald-600" />
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Hoja de Ruta Post-Curso (12 meses)</span>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <button key={i} onClick={() => toggle(i)}
            className={`w-full flex items-center gap-3 rounded-lg p-2.5 text-left transition-all border ${done.has(i) ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200 hover:border-gray-400"}`}>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${done.has(i) ? "bg-emerald-500 border-emerald-500" : "border-gray-300"}`}>
              {done.has(i) && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm">{item.icon}</span>
            <div className="flex-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase">{item.period}</span>
              <p className={`text-xs ${done.has(i) ? "text-gray-500 line-through" : "text-gray-800"}`}>{item.action}</p>
            </div>
          </button>
        ))}
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
      id: "manifesto", title: "Tu Manifiesto de IA Educativa", icon: <Heart className="w-5 h-5" />, color: "#DC2626",
      subsections: [
        { id: "build-manifesto", title: "Construye tu declaración de principios",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Al final de este curso, no solo sabes CÓMO usar la IA — sabes POR QUÉ, CUÁNDO y CON QUÉ LÍMITES.
                Tu manifiesto personal articula tus principios: es tu brújula para cuando la tecnología avance más rápido que las normas.
              </p>
              <ManifestoBuilder />
            </div>
          ),
          checkpoint: {
            question: "¿Por qué es útil tener un manifiesto personal de uso de IA si las políticas institucionales cambiarán?",
            options: [
              "No es útil — las políticas son lo que importa",
              "Porque las políticas tardan en llegar y tu manifiesto te guía en la zona gris. Además, tus principios éticos son más estables que cualquier tecnología o política.",
              "Para impresionar a la dirección del centro",
              "Porque es un requisito del curso",
            ],
            correctIndex: 1,
            explanation: "Las políticas son reactivas (llegan después de los problemas). Tu manifiesto es proactivo: te permite tomar decisiones éticas en tiempo real, incluso cuando no hay norma que te guíe. Tus principios perduran; las herramientas y las políticas cambian.",
          },
        },
      ],
    },
    {
      id: "assessment", title: "Evaluación y Crecimiento", icon: <TrendingUp className="w-5 h-5" />, color: "#4F46E5",
      subsections: [
        { id: "self-assess", title: "¿Dónde estás ahora?",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Después de 8 semanas, es momento de medir honestamente tu crecimiento. Esta autoevaluación no es para una nota — es para que
                identifiques tus fortalezas y tus áreas de desarrollo continuo.
              </p>
              <CompetencyRadar />
            </div>
          ),
        },
        { id: "roadmap", title: "Los próximos 12 meses",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                El curso termina pero tu aprendizaje no. Esta hoja de ruta te da acciones concretas para los próximos 12 meses:
                desde práctica diaria hasta liderazgo en tu centro.
              </p>
              <LearningRoadmap />
            </div>
          ),
          checkpoint: {
            question: "¿Cuál es la acción más efectiva para consolidar lo aprendido en el curso?",
            options: [
              "Releer todos los materiales del curso",
              "Esperar a que el centro compre licencias de IA",
              "Aplicar C.R.E.F.O. a una tarea real de aula cada semana y documentar los resultados",
              "Hacer otro curso online sobre IA",
            ],
            correctIndex: 2,
            explanation: "La práctica deliberada y regular es lo que consolida las competencias. Un prompt real por semana, documentado, es más valioso que 100 horas de teoría adicional. Además, documentar crea tu banco personal de prompts estrella.",
          },
        },
      ],
    },
    {
      id: "future", title: "El Futuro de la IA Educativa", icon: <Globe className="w-5 h-5" />, color: "#059669",
      subsections: [
        { id: "scenarios", title: "4 escenarios en los próximos 5 años",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                La IA educativa va a cambiar radicalmente en los próximos años. No sabemos exactamente cómo, pero podemos prepararnos
                entendiendo las tendencias. Lo que NO va a cambiar: la necesidad de criterio pedagógico, ética y humanidad. Eso es lo que este curso te ha dado.
              </p>
              <FutureScenarios />
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex gap-3">
                <Brain className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">La constante en todos los escenarios</p>
                  <p className="text-sm text-indigo-900 leading-relaxed">
                    En todos los futuros posibles, el docente que sabe <strong>diseñar, auditar y humanizar</strong> la IA será más valioso,
                    no menos. Las herramientas cambiarán. Tu criterio pedagógico y ético es lo que perdura.
                  </p>
                </div>
              </div>
            </div>
          ),
          checkpoint: {
            question: "¿Qué competencia del curso será MÁS relevante en los próximos 5 años, independientemente de cómo cambie la tecnología?",
            options: [
              "Saber usar ChatGPT específicamente",
              "Memorizar los 5 elementos de C.R.E.F.O.",
              "La capacidad de auditar, verificar y humanizar cualquier output de IA — pensamiento crítico aplicado",
              "Generar contenido rápidamente",
            ],
            correctIndex: 2,
            explanation: "ChatGPT puede ser reemplazado. C.R.E.F.O. puede evolucionar. Pero la capacidad de evaluar críticamente lo que genera una IA, detectar sesgos, proteger a tu alumnado y añadir la dimensión humana — eso es una meta-competencia que trasciende cualquier herramienta.",
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
        const isExp = expandedSub === sub.id;
        return (
          <div key={sub.id} className={i < section.subsections.length - 1 ? "border-b border-gray-100" : ""}>
            <button onClick={() => onToggleSub(sub.id)} className="w-full flex items-center gap-3 px-6 py-3.5 text-left hover:bg-gray-50 transition-colors">
              {sub.checkpoint ? (completedCp.has(sub.id) ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-gray-300" />) :
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: section.color + "15" }}><div className="w-2 h-2 rounded-full" style={{ backgroundColor: section.color }} /></div>}
              <span className={`text-sm font-medium flex-1 ${isExp ? "text-gray-900" : "text-gray-700"}`}>{sub.title}</span>
              {isExp ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
            </button>
            {isExp && (
              <div className="px-6 pb-6">
                {sub.content}
                {sub.checkpoint && !completedCp.has(sub.id) && <Checkpoint question={sub.checkpoint} onComplete={() => onCpComplete(sub.id)} />}
                {sub.checkpoint && completedCp.has(sub.id) && (
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

export default function GuideModule5() {
  const [expandedSub, setExpandedSub] = useState<string | null>("build-manifesto");
  const [completedCp, setCompletedCp] = useState<Set<string>>(new Set());
  const sections = useMemo(() => buildSections(), []);
  const toggleSub = useCallback((id: string) => setExpandedSub(p => p === id ? null : id), []);
  const completeCp = useCallback((id: string) => setCompletedCp(p => new Set([...p, id])), []);
  const totalCp = sections.reduce((a, s) => a + s.subsections.filter(sub => sub.checkpoint).length, 0);
  const doneCp = completedCp.size;
  const pct = totalCp > 0 ? Math.round((doneCp / totalCp) * 100) : 0;

  return (
    <div className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Módulo 5 · Semana 8
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Reflexión, Legado y Futuro</h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Consolida tu aprendizaje con un manifiesto personal, evalúa tu crecimiento,
            traza tu hoja de ruta y mira hacia el futuro de la IA educativa.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-3.5 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Progreso</span>
            <span className="text-xs text-gray-400">{doneCp}/{totalCp} checkpoints · {pct}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gray-800 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="space-y-6">
          {sections.map(s => <SectionView key={s.id} section={s} expandedSub={expandedSub} onToggleSub={toggleSub} completedCp={completedCp} onCpComplete={completeCp} />)}
        </div>
        {pct === 100 && (
          <div className="mt-8 bg-gradient-to-br from-indigo-50 to-violet-50 border-2 border-indigo-300 rounded-2xl p-8 text-center">
            <Award className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-indigo-900 mb-2">🎓 ¡Curso Completado!</h3>
            <p className="text-sm text-indigo-700 leading-relaxed max-w-md mx-auto mb-4">
              Has completado "Prompt Mastery para Docentes". Tienes las herramientas técnicas,
              el criterio pedagógico y la brújula ética para usar la IA de forma profesional y responsable.
            </p>
            <p className="text-lg font-bold text-indigo-900">
              La IA es la herramienta. Tú eres el maestro.
            </p>
          </div>
        )}
        <p className="text-center text-xs text-gray-400 mt-10">Módulo 5 · 3 secciones · {totalCp} checkpoints · Curso "Prompt Mastery para Docentes"</p>
      </div>
    </div>
  );
}
