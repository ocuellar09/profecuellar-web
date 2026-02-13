"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useCallback, useMemo } from "react";
import {
  FolderOpen,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Lightbulb,
  Edit3,
  Save,
  Star,
  Award,
  TrendingUp,
  Calendar,
  FileText,
  Copy,
  Check,
  Target,
  BookOpen,
  Sparkles,
  BarChart3,
  Lock,
  Eye,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface PortfolioEntry {
  id: string;
  type: "prompt" | "reflection" | "artifact" | "iteration";
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

interface WeekData {
  week: number;
  title: string;
  module: string;
  color: string;
  guideQuestion: string;
  suggestedEvidence: string[];
  entries: PortfolioEntry[];
  reflection: string;
  completed: boolean;
}

interface CompetencyRating {
  id: string;
  name: string;
  ratings: (number | null)[]; // index = week (0-7), value = 1-5
}

// ─── Helpers ────────────────────────────────────────────────────────────────

let _counter = 5000;
function uid() { return `p-${++_counter}-${Date.now()}`; }

const typeConfig = {
  prompt: { label: "Prompt", color: "#D97706", bg: "bg-amber-50", icon: "💬" },
  reflection: { label: "Reflexión", color: "#7C3AED", bg: "bg-violet-50", icon: "🪞" },
  artifact: { label: "Artefacto", color: "#2563EB", bg: "bg-blue-50", icon: "📄" },
  iteration: { label: "Iteración", color: "#059669", bg: "bg-emerald-50", icon: "🔄" },
};

const tagOptions = ["C.R.E.F.O.", "Privacidad", "Sesgo", "Few-shot", "Zero-shot", "Evaluación", "DUA", "Bloom", "Ética", "Iteración", "Planificación", "Feedback"];

// ─── Initial Data ───────────────────────────────────────────────────────────

function createInitialWeeks(): WeekData[] {
  return [
    { week: 1, title: "La Caja Negra", module: "Módulo 0", color: "#4F46E5",
      guideQuestion: "¿Qué creía sobre la IA antes del curso y qué ha cambiado tras entender cómo funciona un LLM?",
      suggestedEvidence: ["Captura de una alucinación detectada", "Reflexión sobre tokens y ventana de contexto", "Primer prompt con análisis de resultado"],
      entries: [], reflection: "", completed: false },
    { week: 2, title: "Primeros Prompts C.R.E.F.O.", module: "Módulo 1a", color: "#D97706",
      guideQuestion: "¿Cuál es la diferencia más notable entre mi primer prompt y el mismo prompt aplicando C.R.E.F.O.?",
      suggestedEvidence: ["Prompt antes/después de C.R.E.F.O.", "Análisis de qué elemento (C/R/E/F/O) tuvo mayor impacto", "Captura del resultado mejorado"],
      entries: [], reflection: "", completed: false },
    { week: 3, title: "Técnicas de Prompting", module: "Módulo 1b", color: "#D97706",
      guideQuestion: "¿Cuándo es más efectivo usar Few-shot que Zero-shot en mi práctica docente específica?",
      suggestedEvidence: ["Comparación Zero-shot vs Few-shot del mismo prompt", "Sesión documentada del Cuaderno de Iteración", "Prompt con verbos Bloom de nivel superior"],
      entries: [], reflection: "", completed: false },
    { week: 4, title: "Planificación con IA", module: "Módulo 2", color: "#2563EB",
      guideQuestion: "¿Cómo ha cambiado mi proceso de planificación al incorporar IA? ¿Qué hago mejor y qué riesgos debo vigilar?",
      suggestedEvidence: ["Prompt de secuencia didáctica completa", "Material diferenciado (DUA) generado y revisado", "Reflexión sobre tiempo ahorrado vs calidad"],
      entries: [], reflection: "", completed: false },
    { week: 5, title: "Evaluación y Feedback", module: "Módulo 3a", color: "#059669",
      guideQuestion: "¿Puedo confiar en las rúbricas y el feedback generados por IA? ¿Qué ajustes son siempre necesarios?",
      suggestedEvidence: ["Rúbrica generada con auditoría de calidad", "Feedback Few-shot para trabajos de alumnos", "Comparación entre feedback IA vs tu feedback manual"],
      entries: [], reflection: "", completed: false },
    { week: 6, title: "Ética y Sesgo en Práctica", module: "Módulo 3b", color: "#7C3AED",
      guideQuestion: "¿Qué sesgo fue el más difícil de detectar y por qué? ¿Qué protocolo usaré a partir de ahora?",
      suggestedEvidence: ["Auditoría de sesgo completa de un material generado", "Prompt correctivo aplicado con resultado", "Reflexión sobre un dilema ético real"],
      entries: [], reflection: "", completed: false },
    { week: 7, title: "Proyecto Integrador", module: "Módulo 4", color: "#DC2626",
      guideQuestion: "¿Mi proyecto integrador demuestra dominio técnico, criterio pedagógico y responsabilidad ética simultáneamente?",
      suggestedEvidence: ["Prompt final del proyecto con C.R.E.F.O. completo", "Cadena de prompts documentada", "Auditoría de privacidad y sesgo del proyecto"],
      entries: [], reflection: "", completed: false },
    { week: 8, title: "Reflexión Final y Legado", module: "Módulo 5", color: "#111827",
      guideQuestion: "¿Qué consejo le daría a un docente que empieza este mismo camino? ¿Cuál es mi 'manifiesto' de uso de IA?",
      suggestedEvidence: ["Manifiesto personal de uso ético de IA", "3 prompts 'estrella' seleccionados del curso", "Plan de formación continua post-curso"],
      entries: [], reflection: "", completed: false },
  ];
}

function createInitialCompetencies(): CompetencyRating[] {
  return [
    { id: "tech", name: "Dominio técnico (C.R.E.F.O.)", ratings: Array(8).fill(null) },
    { id: "critical", name: "Pensamiento crítico / verificación", ratings: Array(8).fill(null) },
    { id: "ethics", name: "Ética y privacidad", ratings: Array(8).fill(null) },
    { id: "pedagogical", name: "Aplicación pedagógica", ratings: Array(8).fill(null) },
    { id: "iteration", name: "Proceso de iteración", ratings: Array(8).fill(null) },
  ];
}

// ─── Entry Component ────────────────────────────────────────────────────────

function EntryCard({ entry, onUpdate, onDelete }: {
  entry: PortfolioEntry; onUpdate: (e: PortfolioEntry) => void; onDelete: () => void;
}) {
  const [editing, setEditing] = useState(!entry.title);
  const [draft, setDraft] = useState(entry);
  const tc = typeConfig[entry.type];

  const save = () => { if (draft.title.trim()) { onUpdate(draft); setEditing(false); } };
  const cancel = () => { if (!entry.title) { onDelete(); } else { setDraft(entry); setEditing(false); } };

  const toggleTag = (tag: string) => {
    setDraft(d => ({
      ...d,
      tags: d.tags.includes(tag) ? d.tags.filter(t => t !== tag) : [...d.tags, tag],
    }));
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
        <span className="text-sm">{tc.icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: tc.color }}>{tc.label}</span>
        <div className="flex-1" />
        {!editing && (
          <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-gray-600">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}
        <button onClick={onDelete} className="text-gray-300 hover:text-red-500">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3">
        {editing ? (
          <div className="space-y-2">
            <input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })}
              placeholder="Título de la evidencia"
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            <textarea value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })}
              placeholder="Pega tu prompt, reflexión o descripción del artefacto..."
              rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-y" />
            <div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Etiquetas</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {tagOptions.map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)}
                    className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                      draft.tags.includes(tag) ? "bg-indigo-100 text-indigo-700 border-indigo-300" : "bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-400"
                    }`}>{tag}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={save} className="flex items-center gap-1 text-xs font-medium bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">
                <Save className="w-3 h-3" /> Guardar
              </button>
              <button onClick={cancel} className="text-xs text-gray-500 px-3 py-1.5 hover:text-gray-700">Cancelar</button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">{entry.title}</p>
            {entry.content && (
              <pre className="text-xs text-gray-600 leading-relaxed whitespace-pre-line font-mono bg-gray-50 rounded-lg p-2.5 border border-gray-100 max-h-32 overflow-y-auto">
                {entry.content}
              </pre>
            )}
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {entry.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Week Section ───────────────────────────────────────────────────────────

function WeekSection({ week, onUpdate, expanded, onToggle }: {
  week: WeekData; onUpdate: (w: WeekData) => void; expanded: boolean; onToggle: () => void;
}) {
  const [editingReflection, setEditingReflection] = useState(false);
  const [reflDraft, setReflDraft] = useState(week.reflection);

  const addEntry = (type: PortfolioEntry["type"]) => {
    const entry: PortfolioEntry = {
      id: uid(), type, title: "", content: "", tags: [], createdAt: new Date().toISOString(),
    };
    onUpdate({ ...week, entries: [...week.entries, entry] });
  };

  const updateEntry = (idx: number, e: PortfolioEntry) => {
    const entries = [...week.entries]; entries[idx] = e;
    onUpdate({ ...week, entries });
  };

  const deleteEntry = (idx: number) => {
    onUpdate({ ...week, entries: week.entries.filter((_, i) => i !== idx) });
  };

  const saveReflection = () => {
    onUpdate({ ...week, reflection: reflDraft });
    setEditingReflection(false);
  };

  const toggleComplete = () => {
    onUpdate({ ...week, completed: !week.completed });
  };

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
      week.completed ? "border-emerald-200" : "border-gray-200"
    }`}>
      <button onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
        style={{ borderLeftWidth: 4, borderLeftColor: week.color, borderLeftStyle: "solid" }}>
        {week.completed
          ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: week.color }}>
              Semana {week.week}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">{week.module}</span>
          </div>
          <h3 className="text-sm font-bold text-gray-900">{week.title}</h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-400">{week.entries.length} evidencias</span>
          {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5">
          {/* Guide question */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 mb-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Pregunta guía de la semana</span>
                <p className="text-sm text-indigo-900 leading-relaxed mt-0.5">{week.guideQuestion}</p>
              </div>
            </div>
          </div>

          {/* Suggested evidence */}
          <div className="mb-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Evidencias sugeridas</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {week.suggestedEvidence.map((ev, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
                  {ev}
                </span>
              ))}
            </div>
          </div>

          {/* Entries */}
          {week.entries.length > 0 && (
            <div className="space-y-2.5 mb-4">
              {week.entries.map((entry, idx) => (
                <EntryCard key={entry.id} entry={entry}
                  onUpdate={e => updateEntry(idx, e)}
                  onDelete={() => deleteEntry(idx)} />
              ))}
            </div>
          )}

          {/* Add entry buttons */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(Object.keys(typeConfig) as (keyof typeof typeConfig)[]).map(type => {
              const tc = typeConfig[type];
              return (
                <button key={type} onClick={() => addEntry(type)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border-2 border-dashed transition-all hover:border-gray-400"
                  style={{ borderColor: tc.color + "40", color: tc.color }}>
                  <Plus className="w-3 h-3" /> {tc.icon} {tc.label}
                </button>
              );
            })}
          </div>

          {/* Weekly reflection */}
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-600" />
                <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">Reflexión semanal</span>
              </div>
              {!editingReflection && (
                <button onClick={() => { setEditingReflection(true); setReflDraft(week.reflection); }}
                  className="text-[10px] text-violet-600 hover:text-violet-800 font-medium">Editar</button>
              )}
            </div>
            {editingReflection ? (
              <div className="space-y-2">
                <textarea value={reflDraft} onChange={e => setReflDraft(e.target.value)}
                  rows={3} placeholder="Responde a la pregunta guía con tu experiencia real esta semana..."
                  className="w-full rounded-lg border border-violet-300 px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-300 resize-y bg-white" />
                <div className="flex gap-2">
                  <button onClick={saveReflection} className="text-xs font-medium bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700">Guardar</button>
                  <button onClick={() => setEditingReflection(false)} className="text-xs text-gray-500 px-3">Cancelar</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-violet-900 leading-relaxed">
                {week.reflection || "Escribe tu reflexión al final de la semana."}
              </p>
            )}
          </div>

          {/* Complete toggle */}
          <button onClick={toggleComplete}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
              week.completed
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}>
            {week.completed ? "Reabrir semana" : "✓ Marcar semana como completada"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Competency Tracker ─────────────────────────────────────────────────────

function CompetencyTracker({ competencies, onChange }: {
  competencies: CompetencyRating[]; onChange: (c: CompetencyRating[]) => void;
}) {
  const setRating = (compIdx: number, weekIdx: number, value: number) => {
    const updated = competencies.map((c, i) => {
      if (i !== compIdx) return c;
      const ratings = [...c.ratings];
      ratings[weekIdx] = ratings[weekIdx] === value ? null : value;
      return { ...c, ratings };
    });
    onChange(updated);
  };

  const colors = ["", "#DC2626", "#EA580C", "#D97706", "#2563EB", "#059669"];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 overflow-x-auto">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-indigo-600" />
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Tracker de Competencias</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">Puntúa tu nivel percibido (1-5) en cada competencia al final de cada semana. Observa tu evolución.</p>

      <div className="min-w-[600px]">
        {/* Header */}
        <div className="grid grid-cols-[180px_repeat(8,1fr)] gap-1 mb-2">
          <div />
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="text-[9px] font-bold text-gray-400 text-center uppercase">S{i + 1}</span>
          ))}
        </div>

        {/* Rows */}
        {competencies.map((comp, cIdx) => (
          <div key={comp.id} className="grid grid-cols-[180px_repeat(8,1fr)] gap-1 mb-1.5 items-center">
            <span className="text-xs font-medium text-gray-700 truncate pr-2">{comp.name}</span>
            {comp.ratings.map((val, wIdx) => (
              <div key={wIdx} className="flex justify-center">
                <div className="flex gap-px">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button key={r} onClick={() => setRating(cIdx, wIdx, r)}
                      className="w-4 h-4 rounded-sm transition-all"
                      style={{
                        backgroundColor: val !== null && val >= r ? colors[r] : "#f3f4f6",
                        opacity: val !== null && val >= r ? 1 : 0.4,
                      }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-4 justify-center">
        {[1, 2, 3, 4, 5].map(r => (
          <span key={r} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors[r] }} />
            <span className="text-[9px] text-gray-500">{r}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Summary View ───────────────────────────────────────────────────────────

function SummaryView({ weeks, competencies }: { weeks: WeekData[]; competencies: CompetencyRating[] }) {
  const totalEntries = weeks.reduce((a, w) => a + w.entries.length, 0);
  const completedWeeks = weeks.filter(w => w.completed).length;
  const reflections = weeks.filter(w => w.reflection.trim()).length;
  const tagFrequency = useMemo(() => {
    const freq: Record<string, number> = {};
    weeks.forEach(w => w.entries.forEach(e => e.tags.forEach(t => { freq[t] = (freq[t] || 0) + 1; })));
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [weeks]);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { v: completedWeeks, l: "Semanas", max: "/8", c: "#4F46E5" },
          { v: totalEntries, l: "Evidencias", max: "", c: "#D97706" },
          { v: reflections, l: "Reflexiones", max: "/8", c: "#7C3AED" },
          { v: `${Math.round((completedWeeks / 8) * 100)}%`, l: "Progreso", max: "", c: "#059669" },
        ].map(s => (
          <div key={s.l} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <p className="text-xl font-bold" style={{ color: s.c }}>{s.v}<span className="text-xs text-gray-400">{s.max}</span></p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Tag cloud */}
      {tagFrequency.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Temas más frecuentes en tu portafolio</span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tagFrequency.map(([tag, count]) => (
              <span key={tag} className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                {tag} <span className="text-indigo-400">({count})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Milestones */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3 block">Hitos del curso</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Primera auditoría de sesgo", week: 6, icon: "🔍" },
            { label: "Primer prompt C.R.E.F.O. completo", week: 2, icon: "📐" },
            { label: "Iteración de 3+ versiones", week: 3, icon: "🔄" },
            { label: "Proyecto integrador", week: 7, icon: "🏗️" },
            { label: "Reflexión sobre ética", week: 6, icon: "⚖️" },
            { label: "Material DUA generado", week: 4, icon: "🎯" },
            { label: "Manifiesto personal", week: 8, icon: "📜" },
            { label: "Curso completado", week: 8, icon: "🎓" },
          ].map(m => {
            const achieved = weeks[m.week - 1]?.completed;
            return (
              <div key={m.label}
                className={`rounded-xl p-3 text-center border-2 transition-all ${
                  achieved ? "bg-emerald-50 border-emerald-300" : "bg-gray-50 border-gray-200 opacity-50"
                }`}>
                <span className="text-2xl block mb-1">{m.icon}</span>
                <p className="text-[10px] font-medium text-gray-700 leading-tight">{m.label}</p>
                <p className="text-[9px] text-gray-400 mt-0.5">Semana {m.week}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ProgressivePortfolio() {
  const [weeks, setWeeks] = useState<WeekData[]>(createInitialWeeks);
  const [competencies, setCompetencies] = useState<CompetencyRating[]>(createInitialCompetencies);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<"portfolio" | "competencies" | "summary">("portfolio");

  const updateWeek = useCallback((weekNum: number, data: WeekData) => {
    setWeeks(prev => prev.map(w => w.week === weekNum ? data : w));
  }, []);

  const tabs = [
    { id: "portfolio", label: "Portafolio", icon: <FolderOpen className="w-3.5 h-3.5" /> },
    { id: "competencies", label: "Competencias", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: "summary", label: "Resumen", icon: <Award className="w-3.5 h-3.5" /> },
  ] as const;

  const completedWeeks = weeks.filter(w => w.completed).length;
  const totalEntries = weeks.reduce((a, w) => a + w.entries.length, 0);

  return (
    <div className="min-h-screen bg-gray-50/80 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <FolderOpen className="w-3.5 h-3.5" />
            Evaluación Continua · 8 Semanas
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Portafolio Progresivo
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Colecciona evidencias de tu aprendizaje semana a semana: prompts, iteraciones,
            reflexiones y artefactos. Tu portafolio es tu historia como ingeniero de prompts pedagógico.
          </p>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-3.5 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Progreso del curso</span>
            <span className="text-xs text-gray-400">{completedWeeks}/8 semanas · {totalEntries} evidencias</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${(completedWeeks / 8) * 100}%` }} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-6">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Portfolio tab */}
        {activeTab === "portfolio" && (
          <div className="space-y-4">
            {weeks.map(week => (
              <WeekSection key={week.week} week={week}
                onUpdate={w => updateWeek(week.week, w)}
                expanded={expandedWeek === week.week}
                onToggle={() => setExpandedWeek(prev => prev === week.week ? null : week.week)} />
            ))}
          </div>
        )}

        {/* Competencies tab */}
        {activeTab === "competencies" && (
          <CompetencyTracker competencies={competencies} onChange={setCompetencies} />
        )}

        {/* Summary tab */}
        {activeTab === "summary" && (
          <SummaryView weeks={weeks} competencies={competencies} />
        )}

        <p className="text-center text-xs text-gray-400 mt-10">
          8 semanas · 5 competencias · Portafolio progresivo · Curso "Prompt Mastery para Docentes"
        </p>
      </div>
    </div>
  );
}
