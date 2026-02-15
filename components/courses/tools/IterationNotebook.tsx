"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useCallback, useMemo } from "react";
import { usePersistedToolState } from "@/hooks/usePersistedToolState";
import {
  BookOpen,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  ArrowDown,
  Lightbulb,
  Sparkles,
  FlaskConical,
  FileText,
  Tag,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Save,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Iteration {
  id: string;
  version: number;
  prompt: string;
  result: string;
  analysis: string;
  change: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

interface Session {
  id: string;
  title: string;
  objective: string;
  area: string;
  createdAt: string;
  iterations: Iteration[];
  insight: string;
  status: "active" | "completed";
}

// ─── Utilities ──────────────────────────────────────────────────────────────

let idCounter = 1000;
function uid(): string { return `id-${++idCounter}-${Date.now()}`; }

const areaColors: Record<string, { bg: string; text: string; border: string }> = {
  "Evaluación": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Planificación": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  "Diferenciación": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Recursos": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Feedback": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  "Otro": { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
};

const ratingLabels = ["", "Inaceptable", "Pobre", "Aceptable", "Bueno", "Excelente"];
const ratingColors = ["", "#DC2626", "#EA580C", "#D97706", "#2563EB", "#059669"];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1 text-[10px] font-medium text-gray-400 hover:text-gray-700 transition-colors">
      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
      {copied ? "✓" : "Copiar"}
    </button>
  );
}

// ─── Template Sessions ──────────────────────────────────────────────────────

const templateSessions: Omit<Session, "id" | "createdAt">[] = [
  {
    title: "Mi primer prompt C.R.E.F.O.",
    objective: "Transformar un prompt genérico en uno estructurado usando el framework completo",
    area: "Planificación",
    iterations: [
      {
        id: "t1i1", version: 1,
        prompt: "[Escribe aquí tu prompt inicial — el primero que se te ocurra para la tarea]",
        result: "[Pega o describe el resultado que obtuviste de la IA]",
        analysis: "[¿Qué faltó? ¿El resultado es genérico? ¿Le falta contexto? ¿El formato no es el esperado?]",
        change: "Añadir Contexto (C) y Rol (R) al prompt",
        rating: 2,
      },
      {
        id: "t1i2", version: 2,
        prompt: "[Reescribe añadiendo C y R. Mantén la tarea original pero con contexto y rol]",
        result: "[¿Mejoró? ¿Qué cambió respecto a v1?]",
        analysis: "[¿Es más relevante para tu aula? ¿Qué sigue faltando?]",
        change: "Añadir Especificidad (E) y Formato (F)",
        rating: 3,
      },
    ],
    insight: "",
    status: "active",
  },
  {
    title: "Optimización de rúbrica",
    objective: "Conseguir una rúbrica analítica consistente y específica con evaluación observable",
    area: "Evaluación",
    iterations: [],
    insight: "",
    status: "active",
  },
  {
    title: "Adaptación DUA de material",
    objective: "Generar 3 niveles de accesibilidad del mismo contenido sin perder rigor",
    area: "Diferenciación",
    iterations: [],
    insight: "",
    status: "active",
  },
];

// ─── Iteration Card Component ───────────────────────────────────────────────

function IterationCard({
  iteration,
  isLast,
  onUpdate,
  onDelete,
}: {
  iteration: Iteration;
  isLast: boolean;
  onUpdate: (updated: Iteration) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(isLast);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(iteration);

  const handleSave = () => { onUpdate(draft); setEditing(false); };
  const handleCancel = () => { setDraft(iteration); setEditing(false); };

  const rc = ratingColors[iteration.rating];

  return (
    <div className="relative">
      {/* Version badge & connector */}
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: rc }}>
            v{iteration.version}
          </div>
          {!isLast && <div className="w-0.5 h-6 bg-gray-200 mt-1" />}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-gray-600">
              {expanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
              Versión {iteration.version}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: rc + "18", color: rc }}>
                {ratingLabels[iteration.rating]}
              </span>
              {!editing && (
                <button onClick={() => { setEditing(true); setExpanded(true); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={onDelete} className="text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Expanded content */}
          {expanded && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 mb-3">
              {/* Prompt */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Prompt</span>
                  {!editing && <CopyBtn text={iteration.prompt} />}
                </div>
                {editing ? (
                  <textarea value={draft.prompt} onChange={e => setDraft({ ...draft, prompt: e.target.value })}
                    rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-y" />
                ) : (
                  <pre className="text-sm text-gray-800 leading-relaxed whitespace-pre-line font-mono bg-gray-50 rounded-lg p-3 border border-gray-100">
                    {iteration.prompt}
                  </pre>
                )}
              </div>

              {/* Result */}
              <div>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Resultado obtenido</span>
                {editing ? (
                  <textarea value={draft.result} onChange={e => setDraft({ ...draft, result: e.target.value })}
                    rows={3} className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-y" />
                ) : (
                  <p className="text-sm text-blue-900 bg-blue-50 rounded-lg p-3 border border-blue-100 mt-1 leading-relaxed whitespace-pre-line">
                    {iteration.result || "(sin documentar)"}
                  </p>
                )}
              </div>

              {/* Analysis */}
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Análisis: ¿qué falta/sobra?</span>
                {editing ? (
                  <textarea value={draft.analysis} onChange={e => setDraft({ ...draft, analysis: e.target.value })}
                    rows={2} className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-y" />
                ) : (
                  <p className="text-sm text-amber-900 bg-amber-50 rounded-lg p-3 border border-amber-100 mt-1 leading-relaxed">
                    {iteration.analysis || "(sin documentar)"}
                  </p>
                )}
              </div>

              {/* Change for next */}
              <div>
                <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">Cambio para siguiente versión</span>
                {editing ? (
                  <textarea value={draft.change} onChange={e => setDraft({ ...draft, change: e.target.value })}
                    rows={1} className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-y" />
                ) : (
                  <p className="text-sm text-violet-900 bg-violet-50 rounded-lg p-3 border border-violet-100 mt-1 leading-relaxed flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                    {iteration.change || "(sin documentar)"}
                  </p>
                )}
              </div>

              {/* Rating */}
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Calidad del resultado</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button key={r}
                      onClick={() =>
                        editing
                          ? setDraft({ ...draft, rating: r as Iteration["rating"] })
                          : onUpdate({ ...iteration, rating: r as Iteration["rating"] })
                      }
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        (editing ? draft.rating : iteration.rating) >= r
                          ? "text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      }`}
                      style={(editing ? draft.rating : iteration.rating) >= r ? { backgroundColor: ratingColors[r] } : undefined}>
                      {r}
                    </button>
                  ))}
                  <span className="text-xs text-gray-500 self-center ml-2">
                    {ratingLabels[(editing ? draft.rating : iteration.rating)]}
                  </span>
                </div>
              </div>

              {/* Save/Cancel */}
              {editing && (
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700">
                    <Save className="w-3.5 h-3.5" /> Guardar
                  </button>
                  <button onClick={handleCancel} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5">Cancelar</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Session Card Component ─────────────────────────────────────────────────

function SessionCard({
  session,
  onUpdate,
  onDelete,
  expanded,
  onToggle,
}: {
  session: Session;
  onUpdate: (s: Session) => void;
  onDelete: () => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [editingInsight, setEditingInsight] = useState(false);
  const [insightDraft, setInsightDraft] = useState(session.insight);
  const ac = areaColors[session.area] || areaColors["Otro"];

  const addIteration = () => {
    const newIt: Iteration = {
      id: uid(),
      version: session.iterations.length + 1,
      prompt: "",
      result: "",
      analysis: "",
      change: "",
      rating: 3,
    };
    onUpdate({ ...session, iterations: [...session.iterations, newIt] });
  };

  const updateIteration = (idx: number, updated: Iteration) => {
    const its = [...session.iterations];
    its[idx] = updated;
    onUpdate({ ...session, iterations: its });
  };

  const deleteIteration = (idx: number) => {
    const its = session.iterations.filter((_, i) => i !== idx).map((it, i) => ({ ...it, version: i + 1 }));
    onUpdate({ ...session, iterations: its });
  };

  const toggleStatus = () => {
    onUpdate({ ...session, status: session.status === "active" ? "completed" : "active" });
  };

  const saveInsight = () => {
    onUpdate({ ...session, insight: insightDraft });
    setEditingInsight(false);
  };

  const latestRating = session.iterations.length > 0 ? session.iterations[session.iterations.length - 1].rating : 0;
  const improvementTrend = session.iterations.length >= 2
    ? session.iterations[session.iterations.length - 1].rating - session.iterations[0].rating
    : 0;

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
      session.status === "completed" ? "border-emerald-200" : "border-gray-200"
    }`}>
      {/* Header */}
      <button onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
        {session.status === "completed"
          ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          : <FlaskConical className="w-5 h-5 text-gray-400 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${ac.bg} ${ac.text}`}>
              {session.area}
            </span>
            <span className="text-[10px] text-gray-400">{session.iterations.length} versiones</span>
          </div>
          <h3 className="text-sm font-bold text-gray-900 truncate">{session.title}</h3>
          <p className="text-xs text-gray-500 truncate">{session.objective}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {latestRating > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-md"
              style={{ backgroundColor: ratingColors[latestRating] + "18", color: ratingColors[latestRating] }}>
              {latestRating}/5
            </span>
          )}
          {improvementTrend > 0 && <TrendingUp className="w-4 h-4 text-emerald-500" />}
          {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5">
          {/* Objective */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Objetivo de esta sesión</span>
            <p className="text-sm text-gray-800 mt-1">{session.objective}</p>
          </div>

          {/* Iterations timeline */}
          <div className="space-y-1 mb-4">
            {session.iterations.map((it, idx) => (
              <IterationCard key={it.id} iteration={it}
                isLast={idx === session.iterations.length - 1}
                onUpdate={updated => updateIteration(idx, updated)}
                onDelete={() => deleteIteration(idx)} />
            ))}
          </div>

          {/* Add iteration */}
          <button onClick={addIteration}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 mb-4">
            <Plus className="w-4 h-4" /> Añadir versión {session.iterations.length + 1}
          </button>

          {/* Insight */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Aprendizaje clave</span>
              </div>
              <button onClick={() => { setEditingInsight(true); setInsightDraft(session.insight); }}
                className="text-[10px] text-amber-600 hover:text-amber-800 font-medium">Editar</button>
            </div>
            {editingInsight ? (
              <div className="space-y-2">
                <textarea value={insightDraft} onChange={e => setInsightDraft(e.target.value)}
                  rows={2} placeholder="¿Qué aprendiste de esta sesión de iteración? ¿Qué patrón descubriste?"
                  className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-300 resize-y bg-white" />
                <div className="flex gap-2">
                  <button onClick={saveInsight} className="text-xs font-medium text-amber-700 bg-amber-200 px-3 py-1 rounded-lg hover:bg-amber-300">Guardar</button>
                  <button onClick={() => setEditingInsight(false)} className="text-xs text-gray-500 px-3 py-1">Cancelar</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-amber-900 leading-relaxed">
                {session.insight || "Aún no has registrado el aprendizaje clave. ¡Complétalo cuando termines la iteración!"}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button onClick={toggleStatus}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                session.status === "completed"
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              }`}>
              {session.status === "completed" ? "Reabrir sesión" : "✓ Marcar como completada"}
            </button>
            <button onClick={onDelete} className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 transition-colors">
              Eliminar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── New Session Form ───────────────────────────────────────────────────────

function NewSessionForm({ onSave, onCancel }: { onSave: (s: Session) => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [area, setArea] = useState("Planificación");
  const [fromTemplate, setFromTemplate] = useState<number | null>(null);

  const handleSave = () => {
    if (!title.trim()) return;
    const template = fromTemplate !== null ? templateSessions[fromTemplate] : null;
    const session: Session = {
      id: uid(),
      title: title.trim(),
      objective: objective.trim() || (template?.objective || ""),
      area,
      createdAt: new Date().toISOString(),
      iterations: template?.iterations.map((it, i) => ({ ...it, id: uid(), version: i + 1 })) || [{
        id: uid(), version: 1, prompt: "", result: "", analysis: "", change: "", rating: 3,
      }],
      insight: "",
      status: "active",
    };
    onSave(session);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200 p-5 space-y-4">
      <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
        <Plus className="w-4 h-4" /> Nueva sesión de iteración
      </h3>

      {/* Templates */}
      <div>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Empezar desde plantilla (opcional)</span>
        <div className="flex flex-wrap gap-2">
          {templateSessions.map((t, i) => (
            <button key={i} onClick={() => {
              setFromTemplate(fromTemplate === i ? null : i);
              if (fromTemplate !== i) { setTitle(t.title); setObjective(t.objective); setArea(t.area); }
            }}
              className={`text-xs px-3 py-1.5 rounded-lg border-2 transition-all ${
                fromTemplate === i ? "border-indigo-400 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}>
              {t.title}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1 block">Título</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Optimizar prompt de rúbrica para 4º ESO"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1 block">Objetivo</label>
        <input value={objective} onChange={e => setObjective(e.target.value)} placeholder="¿Qué quieres lograr con esta iteración?"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1 block">Área</label>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(areaColors).map(a => (
            <button key={a} onClick={() => setArea(a)}
              className={`text-xs px-3 py-1.5 rounded-lg border-2 transition-all ${
                area === a ? `${areaColors[a].bg} ${areaColors[a].text} ${areaColors[a].border}` : "border-gray-200 text-gray-500"
              }`}>{a}</button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={handleSave} disabled={!title.trim()}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
            title.trim() ? "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}>
          <Plus className="w-4 h-4" /> Crear sesión
        </button>
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">Cancelar</button>
      </div>
    </div>
  );
}

// ─── Stats Dashboard ────────────────────────────────────────────────────────

function StatsDashboard({ sessions }: { sessions: Session[] }) {
  const totalSessions = sessions.length;
  const totalIterations = sessions.reduce((a, s) => a + s.iterations.length, 0);
  const completedSessions = sessions.filter(s => s.status === "completed").length;
  const avgImprovement = useMemo(() => {
    const improvements = sessions
      .filter(s => s.iterations.length >= 2)
      .map(s => s.iterations[s.iterations.length - 1].rating - s.iterations[0].rating);
    return improvements.length > 0 ? (improvements.reduce((a, b) => a + b, 0) / improvements.length).toFixed(1) : "—";
  }, [sessions]);

  if (totalSessions === 0) return null;

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {[
        { value: totalSessions, label: "Sesiones", color: "#4F46E5" },
        { value: totalIterations, label: "Versiones", color: "#D97706" },
        { value: completedSessions, label: "Completadas", color: "#059669" },
        { value: `+${avgImprovement}`, label: "Mejora media", color: "#7C3AED" },
      ].map(stat => (
        <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function IterationNotebook() {
  const [sessions, setSessions] = usePersistedToolState<Session[]>(
    "iteration-notebook",
    [],
  );
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const addSession = useCallback((s: Session) => {
    setSessions(prev => [s, ...prev]);
    setExpandedSession(s.id);
    setShowNewForm(false);
  }, []);

  const updateSession = useCallback((updated: Session) => {
    setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (expandedSession === id) setExpandedSession(null);
  }, [expandedSession]);

  const filteredSessions = useMemo(() => {
    if (filter === "all") return sessions;
    return sessions.filter(s => s.status === filter);
  }, [sessions, filter]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            Módulo 1 · Herramienta Práctica
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Cuaderno de Iteración
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Documenta tu proceso Prompt-Test-Iterate. Cada sesión registra las versiones
            de tu prompt, los resultados, tu análisis y el aprendizaje clave.
          </p>
        </div>

        {/* Quick guide */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 flex gap-3">
          <FlaskConical className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">Método: Prompt → Test → Iterate</p>
            <p className="text-xs text-indigo-900 leading-relaxed">
              1. Escribe tu prompt (v1). 2. Ejecuta y documenta el resultado. 3. Analiza qué falta o sobra.
              4. Modifica UN elemento. 5. Crea v2 y repite. 6. Al terminar, registra tu aprendizaje clave.
            </p>
          </div>
        </div>

        {/* Stats */}
        <StatsDashboard sessions={sessions} />

        {/* Filter + New */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1.5">
            {(["all", "active", "completed"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                  filter === f ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}>
                {f === "all" ? "Todas" : f === "active" ? "Activas" : "Completadas"}
              </button>
            ))}
          </div>
          {!showNewForm && (
            <button onClick={() => setShowNewForm(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" /> Nueva sesión
            </button>
          )}
        </div>

        {/* New form */}
        {showNewForm && (
          <div className="mb-4">
            <NewSessionForm onSave={addSession} onCancel={() => setShowNewForm(false)} />
          </div>
        )}

        {/* Sessions */}
        <div className="space-y-4">
          {filteredSessions.map(session => (
            <SessionCard key={session.id} session={session}
              onUpdate={updateSession}
              onDelete={() => deleteSession(session.id)}
              expanded={expandedSession === session.id}
              onToggle={() => setExpandedSession(prev => prev === session.id ? null : session.id)} />
          ))}
        </div>

        {/* Empty state */}
        {sessions.length === 0 && !showNewForm && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Tu cuaderno está vacío</h3>
            <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
              Crea tu primera sesión de iteración para empezar a documentar tu aprendizaje como ingeniero de prompts.
            </p>
            <button onClick={() => setShowNewForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" /> Crear primera sesión
            </button>
          </div>
        )}

        {filteredSessions.length === 0 && sessions.length > 0 && (
          <p className="text-center text-sm text-gray-400 py-8">
            No hay sesiones {filter === "active" ? "activas" : "completadas"}
          </p>
        )}

        <p className="text-center text-xs text-gray-400 mt-10">
          Cuaderno de Iteración · Método Prompt-Test-Iterate · Curso "Prompt Mastery para Docentes"
        </p>
      </div>
    </div>
  );
}
