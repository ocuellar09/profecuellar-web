"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useCallback, useMemo } from "react";
import {
  BookOpen, ChevronDown, ChevronRight, CheckCircle2, Circle, Lightbulb,
  Sparkles, ArrowRight, Target, Layers, Zap, Copy, Check,
  AlertTriangle, Settings, Shield, Eye, Search, FileText, Box,
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
        <button onClick={check} disabled={sel === null} className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${sel !== null ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>Verificar</button>
      ) : (
        <div className={`rounded-lg p-3 ${ok ? "bg-emerald-100 border border-emerald-300" : "bg-red-100 border border-red-300"}`}>
          <p className="text-sm leading-relaxed" style={{ color: ok ? "#064e3b" : "#7f1d1d" }}>{ok ? "✓ " : "✗ "}{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

// ─── Project Pipeline ───────────────────────────────────────────────────────

function ProjectPipeline() {
  const [active, setActive] = useState(0);
  const stages = [
    { label: "Diseño", icon: "📐", color: "#4F46E5",
      title: "1. Diseñar la cadena de prompts",
      content: "Define los prompts encadenados que necesitarás. Usa diseño inverso: objetivos → evaluación → actividades → materiales → adaptaciones.",
      deliverable: "Mapa de prompts con dependencias (qué output alimenta a qué input)",
      tools: "Constructor C.R.E.F.O., Guía Módulo 2 (Prompt Chaining)" },
    { label: "Generación", icon: "⚡", color: "#D97706",
      title: "2. Ejecutar e iterar cada prompt",
      content: "Ejecuta cada prompt de la cadena. Para cada uno: evalúa el resultado, identifica fallos, itera. Documenta cada versión en tu Cuaderno de Iteración.",
      deliverable: "Outputs de cada prompt con al menos 2 iteraciones documentadas",
      tools: "Cuaderno de Iteración, Banco de Prompts Rotos (para diagnosticar fallos)" },
    { label: "Auditoría", icon: "🔍", color: "#7C3AED",
      title: "3. Auditar calidad, sesgo y privacidad",
      content: "Pasa TODO el contenido generado por el triple filtro: auditoría de sesgo (5 categorías), checklist de privacidad, y verificación de viabilidad.",
      deliverable: "Informe de auditoría con sesgos detectados y correcciones aplicadas",
      tools: "Kit de Auditoría de Sesgo, Checklist de Privacidad, Checklist de Viabilidad" },
    { label: "Refinamiento", icon: "✨", color: "#059669",
      title: "4. Refinar y personalizar",
      content: "Aplica los prompts correctivos para los sesgos detectados. Añade la personalización que la IA no puede dar: tu voz, tu contexto, tus alumnos reales.",
      deliverable: "Material final revisado, corregido y personalizado",
      tools: "Prompts correctivos del Kit de Sesgo, Modelo Híbrido de Feedback" },
    { label: "Documentación", icon: "📝", color: "#DC2626",
      title: "5. Documentar el proceso completo",
      content: "Registra en tu Portafolio: los prompts usados, las iteraciones, los aprendizajes, las decisiones pedagógicas y las auditorías realizadas.",
      deliverable: "Entrada completa en el Portafolio con reflexión y aprendizaje clave",
      tools: "Portafolio Progresivo, Rúbricas con Ejemplos Ancla (para autoevaluación)" },
  ];
  const s = stages[active];

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Pipeline del Proyecto Integrador</span>
      </div>
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {stages.map((st, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`flex-1 min-w-0 py-2.5 text-center transition-all ${active === i ? "text-white" : "text-gray-400 bg-gray-50"}`}
            style={active === i ? { backgroundColor: st.color } : undefined}>
            <span className="text-sm block">{st.icon}</span>
            <span className="text-[9px] font-bold uppercase block">{st.label}</span>
          </button>
        ))}
      </div>
      <div className="p-5">
        <h4 className="text-sm font-bold mb-2" style={{ color: s.color }}>{s.title}</h4>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{s.content}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Entregable</span>
            <p className="text-xs text-gray-800 mt-1">{s.deliverable}</p>
          </div>
          <div className="rounded-lg p-3 border" style={{ backgroundColor: s.color + "08", borderColor: s.color + "25" }}>
            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: s.color }}>Herramientas del curso</span>
            <p className="text-xs text-gray-800 mt-1">{s.tools}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Quality Gate Checklist ─────────────────────────────────────────────────

function QualityGate() {
  const [done, setDone] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setDone(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const gates = [
    { cat: "C.R.E.F.O.", q: "¿Todos los prompts tienen los 5 elementos?", icon: "📐" },
    { cat: "Iteración", q: "¿Cada prompt tiene al menos 2 versiones documentadas?", icon: "🔄" },
    { cat: "Sesgo", q: "¿Se ha pasado auditoría de sesgo al material final?", icon: "⚖️" },
    { cat: "Privacidad", q: "¿Todo el contenido está libre de datos PII?", icon: "🔒" },
    { cat: "Viabilidad", q: "¿El material es implementable en mi aula real?", icon: "🏫" },
    { cat: "Verificación", q: "¿Se han verificado datos, citas y respuestas correctas?", icon: "✅" },
    { cat: "DUA", q: "¿Hay adaptaciones reales (no solo vocabulario) para NEAE?", icon: "🎯" },
    { cat: "Documentación", q: "¿El proceso completo está documentado en el Portafolio?", icon: "📝" },
  ];
  const pct = Math.round((done.size / gates.length) * 100);

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider">🚦 Quality Gate — Puerta de Calidad</span>
        <span className="text-xs text-gray-400">{done.size}/{gates.length}</span>
      </div>
      <p className="text-xs text-gray-500 mb-3">Tu proyecto NO está listo hasta que todos los checks estén verdes.</p>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "#059669" : pct >= 50 ? "#D97706" : "#DC2626" }} />
      </div>
      <div className="space-y-1.5">
        {gates.map((g, i) => (
          <button key={i} onClick={() => toggle(i)}
            className={`w-full flex items-center gap-3 rounded-lg p-2.5 text-left transition-all border ${done.has(i) ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200 hover:border-gray-400"}`}>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${done.has(i) ? "bg-emerald-500 border-emerald-500" : "border-gray-300"}`}>
              {done.has(i) && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm">{g.icon}</span>
            <div className="flex-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase">{g.cat}</span>
              <p className={`text-xs ${done.has(i) ? "text-gray-500 line-through" : "text-gray-800"}`}>{g.q}</p>
            </div>
          </button>
        ))}
      </div>
      {pct === 100 && (
        <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
          <p className="text-sm font-bold text-emerald-700">🎉 ¡Quality Gate superado! Tu proyecto está listo para entregar.</p>
        </div>
      )}
    </div>
  );
}

// ─── Section Data ───────────────────────────────────────────────────────────

interface SubSec { id: string; title: string; content: React.ReactNode; checkpoint?: CpQ; }
interface SectionD { id: string; title: string; icon: React.ReactNode; color: string; subsections: SubSec[]; }

function buildSections(): SectionD[] {
  return [
    {
      id: "pipeline", title: "El Pipeline del Proyecto", icon: <Layers className="w-5 h-5" />, color: "#4F46E5",
      subsections: [
        { id: "stages", title: "5 fases del proyecto integrador",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                El proyecto integrador demuestra que puedes aplicar <strong>todas las competencias del curso en un flujo completo</strong>:
                desde el diseño del prompt hasta el material final auditado y documentado. No es "usar IA una vez" — es orquestar un proceso profesional.
              </p>
              <ProjectPipeline />
            </div>
          ),
          checkpoint: {
            question: "¿Cuál es el orden correcto del pipeline del proyecto?",
            options: [
              "Generar → Diseñar → Auditar → Documentar → Refinar",
              "Diseñar → Generar/Iterar → Auditar → Refinar → Documentar",
              "Auditar → Diseñar → Generar → Refinar → Documentar",
              "Documentar → Diseñar → Generar → Auditar → Refinar",
            ],
            correctIndex: 1,
            explanation: "Primero DISEÑAS la cadena de prompts (mapa), luego GENERAS e ITERAS cada prompt, después AUDITAS calidad/sesgo/privacidad, REFINAS con correcciones y personalización, y finalmente DOCUMENTAS todo el proceso.",
          },
        },
      ],
    },
    {
      id: "quality", title: "Control de Calidad", icon: <Shield className="w-5 h-5" />, color: "#DC2626",
      subsections: [
        { id: "gate", title: "La puerta de calidad: 8 checks irrenunciables",
          content: (
            <div className="space-y-4">
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Tu proyecto pasa por una <strong>Quality Gate</strong>: 8 verificaciones que cubren todas las competencias del curso.
                Si alguna falla, el proyecto no está listo. No es rigidez — es profesionalismo.
              </p>
              <QualityGate />
            </div>
          ),
          checkpoint: {
            question: "Tu proyecto tiene prompts C.R.E.F.O. excelentes y material pedagógico brillante, pero no has pasado la auditoría de sesgo. ¿Está listo?",
            options: [
              "Sí — lo pedagógico es lo importante",
              "No — la Quality Gate requiere TODOS los checks, incluyendo sesgo. Un material brillante con sesgo oculto puede hacer más daño que uno mediocre sin sesgo.",
              "Depende del tipo de material",
              "Sí, si el tiempo apremia",
            ],
            correctIndex: 1,
            explanation: "La Quality Gate es binaria: todos los checks o no está listo. Un material pedagógicamente excelente pero con sesgo cultural puede dañar a tu alumnado. La auditoría de sesgo no es opcional — es parte integral de la calidad profesional.",
          },
        },
      ],
    },
    {
      id: "common-errors", title: "Errores Comunes y Soluciones", icon: <AlertTriangle className="w-5 h-5" />, color: "#D97706",
      subsections: [
        { id: "pitfalls", title: "Los 5 errores más frecuentes en proyectos",
          content: (
            <div className="space-y-3">
              {[
                { error: "Generar todo con un solo prompt gigante", solution: "Usa Prompt Chaining: 4-5 prompts encadenados dan mejor resultado que 1 prompt de 500 palabras.", icon: "1️⃣" },
                { error: "No iterar ('el primer resultado está bien')", solution: "Mínimo 2 versiones por prompt. Documenta qué cambió y por qué mejoró.", icon: "2️⃣" },
                { error: "Adaptaciones DUA superficiales (solo vocabulario)", solution: "Adapta representación, acción/expresión y engagement. No solo el texto.", icon: "3️⃣" },
                { error: "Olvidar la auditoría de sesgo ('no tiene sesgo obvio')", solution: "El sesgo más peligroso es el invisible. Pasa las 5 categorías del Kit de Auditoría.", icon: "4️⃣" },
                { error: "Documentar solo el resultado, no el proceso", solution: "El portafolio debe mostrar tu PROCESO de pensamiento, no solo el material final.", icon: "5️⃣" },
              ].map((e, i) => (
                <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-red-50 px-4 py-2 flex items-center gap-2">
                    <span>{e.icon}</span>
                    <span className="text-xs font-bold text-red-700">Error: {e.error}</span>
                  </div>
                  <div className="bg-emerald-50 px-4 py-2 flex items-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="text-xs text-emerald-800">{e.solution}</span>
                  </div>
                </div>
              ))}
            </div>
          ),
          checkpoint: {
            question: "¿Por qué es mejor documentar el PROCESO de iteración y no solo el material final?",
            options: [
              "Para demostrar que trabajaste mucho",
              "Porque el proceso muestra tu pensamiento pedagógico, tu capacidad de análisis crítico y tus aprendizajes transferibles — habilidades más valiosas que el material en sí",
              "Porque el tutor necesita ver todos los pasos",
              "Para poder repetirlo exactamente igual",
            ],
            correctIndex: 1,
            explanation: "El material final puede ser replicado por cualquiera que copie tu prompt. Lo que NO se puede copiar es tu proceso de pensamiento: por qué tomaste cada decisión, qué aprendiste de cada iteración, y cómo tu criterio pedagógico guió a la IA. ESO es la competencia real.",
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

export default function GuideModule4() {
  const [expandedSub, setExpandedSub] = useState<string | null>("stages");
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
          <div className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Box className="w-3.5 h-3.5" /> Módulo 4 · Semana 7
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Proyecto Integrador</h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Combina todas las competencias en un proyecto completo: diseño, generación,
            auditoría, refinamiento y documentación profesional.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-3.5 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Progreso</span>
            <span className="text-xs text-gray-400">{doneCp}/{totalCp} checkpoints · {pct}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="space-y-6">
          {sections.map(s => <SectionView key={s.id} section={s} expandedSub={expandedSub} onToggleSub={toggleSub} completedCp={completedCp} onCpComplete={completeCp} />)}
        </div>
        {pct === 100 && (
          <div className="mt-8 bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center">
            <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-emerald-900 mb-2">¡Módulo 4 completado!</h3>
            <p className="text-sm text-emerald-700">Conoces el pipeline completo del proyecto integrador y la Quality Gate.</p>
            <p className="text-sm font-semibold text-emerald-800 mt-2">Siguiente → Módulo 5: Reflexión Final y Comunidad</p>
          </div>
        )}
        <p className="text-center text-xs text-gray-400 mt-10">Módulo 4 · 3 secciones · {totalCp} checkpoints · Curso "Prompt Mastery para Docentes"</p>
      </div>
    </div>
  );
}
