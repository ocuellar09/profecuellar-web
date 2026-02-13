"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useCallback, useMemo } from "react";
import {
  BookOpen, ChevronDown, ChevronRight, CheckCircle2, Circle, Lightbulb,
  Sparkles, ArrowRight, ArrowDown, Layers, Target, FileText, Zap, RotateCcw,
  AlertTriangle, Copy, Check, Link, Box, Settings, Users, Eye,
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

// ─── Prompt Chain Demo ──────────────────────────────────────────────────────

function PromptChainDemo() {
  const [step, setStep] = useState(0);
  const chain = [
    { label: "Prompt 1: Objetivos", color: "#4F46E5", prompt: "[ROL experto en diseño inverso]\nA partir de los criterios de evaluación de LOMLOE para [asignatura, nivel], genera 3 objetivos de aprendizaje observables para la unidad sobre [tema]. Formato: tabla [Objetivo | Verbo Bloom | Evidencia de logro].", output: "3 objetivos alineados con currículo, verbos Bloom y evidencias." },
    { label: "Prompt 2: Evaluación", color: "#7C3AED", prompt: "Usando los 3 objetivos generados:\n[PEGAR OBJETIVOS]\n\nDiseña la evaluación formativa: 1 instrumento por objetivo. Formato: [Objetivo | Instrumento | Momento | Criterio de éxito].\nRestricciones: instrumentos variados (no todo examen), al menos 1 rúbrica observacional.", output: "3 instrumentos de evaluación alineados con objetivos." },
    { label: "Prompt 3: Secuencia", color: "#D97706", prompt: "Con estos objetivos y evaluaciones:\n[PEGAR OBJETIVOS + EVALUACIONES]\n\nDiseña la secuencia de [N] sesiones usando diseño inverso. Formato:\n| Sesión | Objetivo | Actividad principal | Metodología | Evaluación | Duración |\nRestricciones: variedad metodológica, máx 50% exposición, incluir trabajo cooperativo.", output: "Secuencia completa con alineación objetivo-actividad-evaluación." },
    { label: "Prompt 4: Adaptaciones", color: "#059669", prompt: "Para la secuencia generada:\n[PEGAR SECUENCIA]\n\nAñade adaptaciones DUA para cada sesión:\n- Nivel 1 (alta accesibilidad): vocabulario básico, apoyos visuales, instrucciones paso a paso\n- Nivel 2 (estándar): tal como está\n- Nivel 3 (ampliación): retos adicionales, conexiones interdisciplinares\nFormato: tabla adicional por sesión.", output: "Secuencia con 3 niveles DUA por sesión." },
  ];
  const c = chain[step];

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Demo: Prompt Chaining</span>
        </div>
        <span className="text-xs text-gray-400">Paso {step + 1}/{chain.length}</span>
      </div>

      {/* Visual chain */}
      <div className="flex items-center justify-center gap-1 px-5 py-3 bg-gray-50 border-b border-gray-100">
        {chain.map((ch, i) => (
          <div key={i} className="flex items-center gap-1">
            <button onClick={() => setStep(i)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                i === step ? "text-white scale-110" : i < step ? "text-white opacity-70" : "bg-gray-200 text-gray-400"
              }`}
              style={i <= step ? { backgroundColor: ch.color } : undefined}>
              {i + 1}
            </button>
            {i < chain.length - 1 && <ArrowRight className="w-3 h-3 text-gray-300" />}
          </div>
        ))}
      </div>

      <div className="p-5">
        <h4 className="text-sm font-bold mb-3" style={{ color: c.color }}>{c.label}</h4>
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prompt</span>
            <CopyBtn text={c.prompt} />
          </div>
          <pre className="text-sm text-gray-800 leading-relaxed whitespace-pre-line font-mono bg-gray-50 rounded-lg p-3 border border-gray-100">{c.prompt}</pre>
        </div>
        <div className="rounded-lg p-3 flex gap-2" style={{ backgroundColor: c.color + "10", border: `1px solid ${c.color}30` }}>
          <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: c.color }} />
          <p className="text-xs leading-relaxed" style={{ color: c.color }}><strong>Output esperado:</strong> {c.output}</p>
        </div>

        {step < chain.length - 1 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mt-3 flex gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-900"><strong>Clave:</strong> Antes del siguiente prompt, PEGA el output del anterior. Cada eslabón de la cadena necesita el contexto del anterior.</p>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
            className={`text-sm font-medium px-4 py-2 rounded-lg ${step > 0 ? "text-gray-700 hover:bg-gray-100" : "text-gray-300"}`}>← Anterior</button>
          <button onClick={() => setStep(Math.min(chain.length - 1, step + 1))} disabled={step === chain.length - 1}
            className={`text-sm font-medium px-4 py-2 rounded-lg ${step < chain.length - 1 ? "text-white hover:opacity-90" : "bg-gray-200 text-gray-400"}`}
            style={step < chain.length - 1 ? { backgroundColor: chain[step + 1].color } : undefined}>
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Viability Checker ──────────────────────────────────────────────────────

function ViabilityChecker() {
  const checks = [
    { q: "¿Todos los materiales están disponibles en mi centro?", cat: "Recursos" },
    { q: "¿La temporalización es realista (no más de 50 min por sesión)?", cat: "Tiempo" },
    { q: "¿Las actividades funcionan con MI número de alumnos?", cat: "Grupo" },
    { q: "¿Las adaptaciones NEAE son profundas (no solo simplificar vocabulario)?", cat: "Inclusión" },
    { q: "¿Puedo evaluar lo propuesto con los instrumentos que tengo?", cat: "Evaluación" },
    { q: "¿El contenido está alineado con MI currículo (LOMLOE, CC.AA.)?", cat: "Currículo" },
    { q: "¿He verificado que no hay datos inventados ni citas falsas?", cat: "Veracidad" },
    { q: "¿He pasado la auditoría de sesgo al material generado?", cat: "Sesgo" },
  ];
  const [done, setDone] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setDone(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const pct = Math.round((done.size / checks.length) * 100);

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Settings className="w-4 h-4 text-blue-600" />
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Checklist de Viabilidad Post-Generación</span>
        <span className="text-xs text-gray-400 ml-auto">{done.size}/{checks.length}</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="space-y-2">
        {checks.map((c, i) => (
          <button key={i} onClick={() => toggle(i)}
            className={`w-full flex items-start gap-3 rounded-lg p-2.5 text-left transition-all border ${
              done.has(i) ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200 hover:border-gray-400"
            }`}>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
              done.has(i) ? "bg-emerald-500 border-emerald-500" : "border-gray-300"
            }`}>
              {done.has(i) && <Check className="w-3 h-3 text-white" />}
            </div>
            <div>
              <span className="text-[9px] font-bold text-gray-400 uppercase">{c.cat}</span>
              <p className={`text-sm ${done.has(i) ? "text-gray-500 line-through" : "text-gray-800"}`}>{c.q}</p>
            </div>
          </button>
        ))}
      </div>
      {pct === 100 && (
        <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
          <p className="text-sm font-semibold text-emerald-700">✓ Material listo para el aula</p>
        </div>
      )}
    </div>
  );
}

// ─── DUA Comparator ─────────────────────────────────────────────────────────

function DUAComparator() {
  const [level, setLevel] = useState<1 | 2 | 3>(2);
  const levels = {
    1: { label: "Alta accesibilidad", color: "#059669", bg: "bg-emerald-50",
      text: "Las plantas fabrican su alimento usando la luz del sol ☀️.\n\nNecesitan tres cosas:\n1. Luz del sol\n2. Agua 💧\n3. Aire (CO₂)\n\nCon esto producen:\n→ Azúcar (su comida)\n→ Oxígeno (lo que nosotros respiramos)\n\n📌 Recuerda: las plantas NO comen como nosotros. Fabrican su comida con la luz." },
    2: { label: "Estándar", color: "#2563EB", bg: "bg-blue-50",
      text: "La fotosíntesis es el proceso mediante el cual los organismos vegetales transforman la energía lumínica en energía química.\n\nReactantes: dióxido de carbono (CO₂) + agua (H₂O) + luz solar\nProductos: glucosa (C₆H₁₂O₆) + oxígeno (O₂)\n\nEste proceso ocurre en los cloroplastos, específicamente en la clorofila. Es fundamental para la vida en la Tierra porque produce el oxígeno que respiramos y es la base de las cadenas alimentarias." },
    3: { label: "Ampliación", color: "#7C3AED", bg: "bg-violet-50",
      text: "La fotosíntesis comprende dos fases: la fase luminosa (en los tilacoides) y el ciclo de Calvin (en el estroma).\n\nFase luminosa: la energía fotónica excita electrones en el fotosistema II, generando ATP y NADPH mediante la cadena de transporte de electrones. La fotólisis del agua libera O₂.\n\nCiclo de Calvin: el CO₂ se fija mediante la enzima RuBisCO en una molécula de 3 carbonos (G3P), utilizando el ATP y NADPH generados.\n\n🔗 Conexión interdisciplinar: ¿Cómo se relaciona la fotosíntesis con el cambio climático? Investiga el rol de los sumideros de carbono." },
  };
  const l = levels[level];

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <div className="flex border-b border-gray-200">
        {([1, 2, 3] as const).map(n => (
          <button key={n} onClick={() => setLevel(n)}
            className={`flex-1 py-2.5 text-xs font-bold transition-all ${level === n ? "text-white" : "text-gray-400 bg-gray-50"}`}
            style={level === n ? { backgroundColor: levels[n].color } : undefined}>
            Nivel {n}: {levels[n].label}
          </button>
        ))}
      </div>
      <div className="p-5">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: l.color }}>
          Tema: Fotosíntesis · Nivel {level}
        </p>
        <pre className="text-sm text-gray-800 leading-relaxed whitespace-pre-line font-mono rounded-lg p-4 border border-gray-100" style={{ backgroundColor: l.color + "08" }}>
          {l.text}
        </pre>
        <p className="text-[11px] text-gray-500 mt-2 italic">
          {level === 1 ? "Vocabulario básico, frases cortas, emoji como apoyo visual, instrucciones explícitas." :
           level === 2 ? "Términos técnicos definidos, estructura clara, conectores lógicos." :
           "Vocabulario científico completo, conexiones interdisciplinares, reto de investigación."}
        </p>
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
      id: "backward", title: "Diseño Inverso con IA", icon: <Target className="w-5 h-5" />, color: "#4F46E5",
      subsections: [
        { id: "ubd", title: "El principio: Objetivos → Evaluación → Actividades",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                El Diseño Inverso (Understanding by Design, Wiggins & McTighe) invierte el proceso habitual de planificación.
                En lugar de "¿qué actividades hago?", empiezas por "¿qué quiero que aprendan?" y luego "¿cómo sabré que lo aprendieron?".
              </p>
              <div className="flex items-center justify-center gap-2 py-4">
                {["Objetivos de\naprendizaje", "Evidencias de\nevaluación", "Actividades y\nrecursos"].map((label, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-24 h-20 rounded-xl flex items-center justify-center text-center text-xs font-bold text-white px-2 leading-tight"
                      style={{ backgroundColor: ["#4F46E5", "#7C3AED", "#D97706"][i] }}>
                      {label}
                    </div>
                    {i < 2 && <ArrowRight className="w-4 h-4 text-gray-300" />}
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 leading-relaxed">
                  <strong>Implicación para prompts:</strong> No pidas "actividades" directamente. Primero genera los objetivos alineados con currículo,
                  luego la evaluación, y finalmente las actividades. Cada prompt alimenta al siguiente. Esto es <strong>Prompt Chaining</strong>.
                </p>
              </div>
            </div>
          ),
          checkpoint: {
            question: "¿Cuál es el orden correcto del Diseño Inverso?",
            options: [
              "Actividades → Evaluación → Objetivos",
              "Objetivos → Actividades → Evaluación",
              "Objetivos → Evaluación → Actividades",
              "Evaluación → Objetivos → Actividades",
            ],
            correctIndex: 2,
            explanation: "Primero defines QUÉ quieres que aprendan (objetivos), luego CÓMO sabrás que lo aprendieron (evaluación), y finalmente CÓMO lo van a aprender (actividades). La evaluación se diseña ANTES que las actividades.",
          },
        },
        { id: "chaining", title: "Prompt Chaining: Cadenas de prompts encadenados",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Una secuencia didáctica completa es demasiado compleja para un solo prompt. El <strong>Prompt Chaining</strong> divide
                la tarea en pasos encadenados donde cada prompt usa el output del anterior como input. Esto produce resultados más
                coherentes y te permite verificar cada paso antes de avanzar.
              </p>
              <PromptChainDemo />
            </div>
          ),
          checkpoint: {
            question: "¿Por qué es mejor usar Prompt Chaining que un solo prompt largo para una secuencia didáctica?",
            options: [
              "Porque la IA no puede procesar prompts largos",
              "Porque permite verificar cada paso antes de avanzar y mantiene coherencia entre objetivos-evaluación-actividades",
              "Porque genera resultados más rápido",
              "Porque ahorra tokens",
            ],
            correctIndex: 1,
            explanation: "El Chaining te da control en cada eslabón: puedes verificar que los objetivos son correctos antes de diseñar la evaluación, y que la evaluación mide lo correcto antes de diseñar las actividades. Un solo prompt largo genera todo de golpe sin posibilidad de corrección intermedia.",
          },
        },
      ],
    },
    {
      id: "dua", title: "Diferenciación con DUA", icon: <Users className="w-5 h-5" />, color: "#059669",
      subsections: [
        { id: "dua-levels", title: "Los 3 niveles de accesibilidad",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                El Diseño Universal para el Aprendizaje (DUA) no es "simplificar para los que no pueden". Es ofrecer
                <strong> múltiples vías de acceso al mismo contenido</strong>. Los 3 niveles comparten el mismo concepto central
                pero varían en complejidad lingüística, apoyos visuales y nivel de reto.
              </p>
              <DUAComparator />
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Error común de la IA</p>
                  <p className="text-sm text-red-900 leading-relaxed">
                    La IA tiende a crear "adaptaciones" que solo simplifican el vocabulario pero mantienen la misma tarea.
                    Verdadera diferenciación DUA adapta: representación (cómo se presenta), acción/expresión (cómo el alumno demuestra), y engagement (cómo se motiva).
                  </p>
                </div>
              </div>
            </div>
          ),
          checkpoint: {
            question: "La IA genera una 'adaptación' para un alumno con dificultades lectoras que consiste en el mismo texto con palabras más fáciles. ¿Es DUA real?",
            options: [
              "Sí, simplificar vocabulario es adaptar",
              "No — DUA real adapta representación (apoyos visuales, audio), no solo vocabulario. El contenido conceptual debe ser el mismo, la vía de acceso diferente",
              "No — para DUA hay que crear un contenido completamente diferente",
              "Depende del nivel educativo",
            ],
            correctIndex: 1,
            explanation: "DUA real ofrece MÚLTIPLES VÍAS de acceso: visual, auditivo, manipulativo. Simplificar vocabulario sin cambiar la representación ni los apoyos es una adaptación superficial. El concepto debe ser el mismo; lo que cambia es CÓMO se accede a él.",
          },
        },
      ],
    },
    {
      id: "viability", title: "De la IA al Aula Real", icon: <Settings className="w-5 h-5" />, color: "#DC2626",
      subsections: [
        { id: "check-viability", title: "El paso que la mayoría olvida: verificar viabilidad",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Un prompt perfecto puede generar una secuencia pedagógicamente brillante pero <strong>imposible de implementar</strong>
                en tu aula real. La IA no conoce tus recursos, tu horario, ni las capacidades reales de tu grupo. El checklist
                de viabilidad es el último paso antes de llevar cualquier material al aula.
              </p>
              <ViabilityChecker />
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900 leading-relaxed">
                  <strong>Principio clave:</strong> Trata toda salida de la IA como un borrador profesional, no como un producto terminado.
                  La IA es la grúa que levanta la estructura; tú eres el arquitecto que verifica que se sostiene.
                </p>
              </div>
            </div>
          ),
          checkpoint: {
            question: "La IA genera una secuencia excelente con actividades de laboratorio. Tu centro no tiene laboratorio. ¿Qué haces?",
            options: [
              "Descarto la secuencia y empiezo de nuevo",
              "La uso tal cual y adapto sobre la marcha",
              "Itero el prompt añadiendo la restricción 'sin laboratorio, solo materiales de aula ordinaria con presupuesto de 20€' y regenero",
              "Pido a la IA que 'la haga más sencilla'",
            ],
            correctIndex: 2,
            explanation: "El prompt necesita conocer tus restricciones reales. Añade la limitación de recursos como restricción (O de C.R.E.F.O.) y regenera. 'Más sencilla' es vago; 'sin laboratorio, materiales de 20€' es específico y accionable.",
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

export default function GuideModule2() {
  const [expandedSub, setExpandedSub] = useState<string | null>("ubd");
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
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" /> Módulo 2 · Semana 4
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">La Arquitectura del Aula</h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Planificación con IA: diseño inverso, prompt chaining, diferenciación DUA
            y el paso crucial de verificar la viabilidad antes de llevar al aula.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-3.5 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Progreso</span>
            <span className="text-xs text-gray-400">{doneCp}/{totalCp} checkpoints · {pct}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="space-y-6">
          {sections.map(s => <SectionView key={s.id} section={s} expandedSub={expandedSub} onToggleSub={toggleSub} completedCp={completedCp} onCpComplete={completeCp} />)}
        </div>
        {pct === 100 && (
          <div className="mt-8 bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center">
            <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-emerald-900 mb-2">¡Módulo 2 completado!</h3>
            <p className="text-sm text-emerald-700">Dominas diseño inverso, prompt chaining y diferenciación DUA con verificación de viabilidad.</p>
            <p className="text-sm font-semibold text-emerald-800 mt-2">Siguiente → Módulo 3: Evaluación y Feedback con IA</p>
          </div>
        )}
        <p className="text-center text-xs text-gray-400 mt-10">Módulo 2 · 3 secciones · {totalCp} checkpoints · Curso "Prompt Mastery para Docentes"</p>
      </div>
    </div>
  );
}
