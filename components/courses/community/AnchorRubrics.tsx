"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useCallback, useMemo } from "react";
import {
  Award,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Eye,
  Lightbulb,
  Star,
  Target,
  BookOpen,
  Copy,
  Check,
  ArrowRight,
  RotateCcw,
  BarChart3,
  User,
  Sparkles,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface AnchorExample {
  text: string;
  annotation: string;
}

interface RubricCell {
  descriptor: string;
  anchor?: AnchorExample;
}

interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  levels: [RubricCell, RubricCell, RubricCell, RubricCell]; // [Excelente, Bueno, Suficiente, Insuficiente]
}

interface Rubric {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  module: string;
  description: string;
  criteria: RubricCriterion[];
}

type LevelIndex = 0 | 1 | 2 | 3;

// ─── Data ───────────────────────────────────────────────────────────────────

const levelConfig = [
  { label: "Excelente", score: 4, color: "#059669", bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
  { label: "Bueno", score: 3, color: "#2563EB", bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
  { label: "Suficiente", score: 2, color: "#D97706", bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700" },
  { label: "Insuficiente", score: 1, color: "#DC2626", bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700" },
];

const rubrics: Rubric[] = [
  {
    id: "prompt-quality",
    title: "Calidad del Prompt Pedagógico",
    subtitle: "Evalúa la construcción de prompts usando C.R.E.F.O.",
    color: "#D97706",
    module: "Módulos 1-2",
    description: "Rúbrica para evaluar la calidad técnica y pedagógica de un prompt construido con el framework C.R.E.F.O. Aplícala a los prompts que generes en tus actividades prácticas.",
    criteria: [
      {
        id: "pq1", name: "Contexto (C)", description: "Definición del escenario educativo", weight: 20,
        levels: [
          { descriptor: "Define nivel educativo, asignatura, nº alumnos, marco curricular, características del grupo incluyendo NEAE, y recursos disponibles. El contexto es tan completo que cualquier docente reproduciría el mismo escenario.",
            anchor: { text: "Clase de 3º ESO, 28 alumnos, Biología LOMLOE (Comunidad de Madrid). Grupo heterogéneo: 3 alumnos con TDAH (adaptación metodológica), 1 alumna con altas capacidades. Colegio concertado urbano con laboratorio básico. Fin de la unidad 'Aparato circulatorio'.", annotation: "Incluye: nivel + asignatura + marco + grupo + NEAE + recursos + temporalización. Cualquier docente podría situar el escenario exacto." } },
          { descriptor: "Define nivel educativo, asignatura y alguna característica del grupo. Falta marco curricular o detalles de NEAE.",
            anchor: { text: "Para una clase de 3º de ESO de Biología, unos 28 alumnos, tema del aparato circulatorio.", annotation: "Tiene nivel y asignatura pero falta marco curricular, características del grupo y recursos." } },
          { descriptor: "Menciona el nivel educativo o la asignatura, pero sin detalles del grupo ni del contexto institucional.",
            anchor: { text: "Para Secundaria, tema de Biología.", annotation: "Muy genérico. No especifica curso, grupo ni contexto." } },
          { descriptor: "No incluye contexto educativo o el contexto es irrelevante.",
            anchor: { text: "(Sin contexto, directamente la tarea)", annotation: "La IA no sabe si es Primaria, ESO o universidad." } },
        ],
      },
      {
        id: "pq2", name: "Rol (R)", description: "Asignación de identidad profesional a la IA", weight: 15,
        levels: [
          { descriptor: "Asigna un rol con disciplina específica, nivel de expertise, años de experiencia y contexto profesional concreto. El rol orienta hacia un registro de conocimiento preciso.",
            anchor: { text: "Actúa como un experto en didáctica de las ciencias naturales con 20 años de experiencia en educación secundaria pública, especializado en metodología indagatoria y evaluación por competencias LOMLOE.", annotation: "Disciplina + experiencia + contexto + especialización. Muy preciso." } },
          { descriptor: "Asigna un rol con disciplina y algún nivel de expertise, pero sin contexto profesional específico.",
            anchor: { text: "Actúa como un profesor de Biología con experiencia.", annotation: "Tiene disciplina y experiencia genérica pero no especifica nivel educativo ni especialización." } },
          { descriptor: "Asigna un rol genérico sin especificar disciplina ni expertise.",
            anchor: { text: "Eres un profesor.", annotation: "Demasiado genérico. No orienta a la IA hacia ningún registro concreto." } },
          { descriptor: "No asigna rol o asigna un rol contraproducente.",
            anchor: { text: "Actúa como un profesor muy estricto que solo pone exámenes difíciles.", annotation: "El rol orienta hacia contenido punitivo, no pedagógico." } },
        ],
      },
      {
        id: "pq3", name: "Especificidad (E)", description: "Tarea definida con verbos de acción y alcance", weight: 25,
        levels: [
          { descriptor: "Usa verbos de la taxonomía de Bloom del nivel adecuado. Define cantidad, duración, nivel cognitivo y alcance exacto. La tarea es inambigua y medible.",
            anchor: { text: "Diseña 6 actividades manipulativas sobre la célula animal (30 min cada una): 2 de nivel Recordar (identificar orgánulos), 2 de Aplicar (modelar funciones) y 2 de Analizar (comparar célula animal/vegetal). Incluye lista de materiales para cada una.", annotation: "Verbo Bloom + cantidad + duración + niveles cognitivos + alcance + entregable adicional." } },
          { descriptor: "Usa verbos de acción con cierta precisión. Define cantidad o duración, pero no ambos. El nivel cognitivo no está explícito.",
            anchor: { text: "Crea 6 actividades sobre la célula, que incluyan trabajo manipulativo.", annotation: "Buen verbo y cantidad, pero sin temporalización, niveles Bloom ni alcance detallado." } },
          { descriptor: "Usa verbos genéricos ('hazme', 'dame'). La tarea es amplia sin alcance definido.",
            anchor: { text: "Hazme actividades sobre la célula.", annotation: "'Hazme' no es un verbo pedagógico. Sin cantidad, tipo ni nivel." } },
          { descriptor: "La tarea es ambigua, contradictoria o imposible de interpretar.",
            anchor: { text: "Quiero algo sobre ciencias para mis alumnos.", annotation: "Ni siquiera queda claro qué tipo de output se espera." } },
        ],
      },
      {
        id: "pq4", name: "Formato (F)", description: "Estructura explícita de la salida esperada", weight: 20,
        levels: [
          { descriptor: "Define la estructura exacta con tipo de formato, columnas/campos específicos, extensión y organización interna. La IA sabe exactamente qué producir.",
            anchor: { text: "Presenta cada actividad en formato tabla:\n| Nombre | Duración | Materiales (<3€) | Pasos numerados | Adaptación NEAE | Evaluación formativa |\nMáximo 1 página por actividad.", annotation: "Tipo (tabla) + columnas específicas + restricción de extensión. Formato completamente replicable." } },
          { descriptor: "Indica el tipo de formato general (tabla, lista) pero sin especificar columnas o campos exactos.",
            anchor: { text: "Preséntalo en una tabla organizada.", annotation: "Sabe que quiere tabla pero la IA elegirá las columnas." } },
          { descriptor: "Menciona vagamente el formato o da instrucciones contradictorias.",
            anchor: { text: "Que esté bien organizado.", annotation: "'Bien organizado' es subjetivo. La IA interpretará libremente." } },
          { descriptor: "No indica formato alguno." },
        ],
      },
      {
        id: "pq5", name: "Objetivos y Restricciones (O)", description: "Límites éticos, de contenido y de calidad", weight: 20,
        levels: [
          { descriptor: "Define al menos 2 restricciones de contenido, 1 de tono/accesibilidad, 1 ética/inclusiva y 1 de extensión. Las restricciones son concretas y verificables.",
            anchor: { text: "DEBE: Materiales <5€, adaptación TDAH en cada actividad, instrucciones legibles por alumno solo.\nNO DEBE: Productos químicos, vocabulario universitario, estereotipos culturales.\nTono: Instrucciones tipo receta, máx 2 páginas total.", annotation: "Múltiples restricciones verificables: coste, accesibilidad, seguridad, lenguaje, extensión, ética." } },
          { descriptor: "Define 2-3 restricciones pero alguna es vaga o falta alguna dimensión importante (ética, accesibilidad).",
            anchor: { text: "No uses vocabulario difícil. Que sea breve.", annotation: "Dos restricciones pero vagas ('difícil' y 'breve' son subjetivos)." } },
          { descriptor: "Define 1 restricción genérica o las restricciones son irrelevantes.",
            anchor: { text: "Que esté bien hecho.", annotation: "No es una restricción operativa." } },
          { descriptor: "No incluye restricciones o incluye restricciones contraproducentes." },
        ],
      },
    ],
  },
  {
    id: "critical-use",
    title: "Uso Crítico y Ético de la IA",
    subtitle: "Evalúa la aplicación responsable de IA en el aula",
    color: "#7C3AED",
    module: "Módulos 0, 3",
    description: "Rúbrica para evaluar cómo aplicas los principios de privacidad, sesgo y verificación en tu práctica con IA. Aplícala a tu reflexión sobre casos éticos.",
    criteria: [
      {
        id: "cu1", name: "Protección de datos", description: "Aplicación de GDPR y privacidad en prompts", weight: 30,
        levels: [
          { descriptor: "Todos los prompts están completamente anonimizados. Demuestra conocimiento del proceso de anonimización (eliminar PII, generalizar diagnósticos, usar identificadores genéricos). Configura la herramienta para máxima privacidad antes de usarla." },
          { descriptor: "Los prompts están mayoritariamente anonimizados. Puede tener algún dato generalizable no identificable. Conoce las configuraciones de privacidad." },
          { descriptor: "Intenta anonimizar pero deja datos que podrían ser identificables en combinación (ej: 'alumna de 3ºB con síndrome de Down' — en un grupo pequeño es identificable)." },
          { descriptor: "Incluye datos personales identificables (nombres, diagnósticos específicos, calificaciones con nombre) sin anonimizar." },
        ],
      },
      {
        id: "cu2", name: "Detección de sesgo", description: "Capacidad de identificar y corregir sesgos", weight: 25,
        levels: [
          { descriptor: "Identifica sesgos en múltiples dimensiones (género, cultural, lingüístico, poder). Aplica protocolo de auditoría sistemático. Itera el prompt para corregir sesgos detectados y documenta la mejora." },
          { descriptor: "Identifica sesgos en al menos 2 dimensiones. Sugiere correcciones pero no siempre las implementa o documenta." },
          { descriptor: "Identifica sesgos obvios (género o cultural) pero no detecta sesgos sutiles (poder, lingüístico). No tiene protocolo sistemático." },
          { descriptor: "No identifica sesgos o no considera la auditoría de sesgo como parte del proceso." },
        ],
      },
      {
        id: "cu3", name: "Verificación de información", description: "Protocolo anti-alucinaciones", weight: 25,
        levels: [
          { descriptor: "Verifica todas las citas, datos y estadísticas generadas por IA antes de usarlas. Distingue entre contenido generativo (borradores, ideas) y factual (datos que requieren verificación). Documenta fuentes de verificación." },
          { descriptor: "Verifica la mayoría de datos factuales. Reconoce el concepto de alucinación pero puede no verificar sistemáticamente." },
          { descriptor: "Verifica esporádicamente. No distingue claramente entre contenido que necesita verificación y el que no." },
          { descriptor: "Usa contenido generado por IA sin verificación. Trata la salida de la IA como fuente fiable." },
        ],
      },
      {
        id: "cu4", name: "Reflexión ética", description: "Pensamiento crítico sobre implicaciones", weight: 20,
        levels: [
          { descriptor: "Analiza implicaciones éticas de sus decisiones con IA (impacto en alumnado, equidad, dependencia tecnológica). Articula dilemas sin simplificarlos. Propone soluciones que equilibran innovación y protección." },
          { descriptor: "Reflexiona sobre implicaciones éticas principales. Identifica dilemas pero puede tender a soluciones simples (prohibir vs. permitir)." },
          { descriptor: "Reconoce que existen cuestiones éticas pero la reflexión es superficial o genérica." },
          { descriptor: "No evidencia reflexión ética sobre el uso de IA en educación." },
        ],
      },
    ],
  },
  {
    id: "iteration-process",
    title: "Proceso de Iteración",
    subtitle: "Evalúa la calidad del método Prompt-Test-Iterate",
    color: "#059669",
    module: "Módulos 1-4",
    description: "Rúbrica para evaluar tu proceso de mejora progresiva de prompts. Aplícala a las sesiones de tu Cuaderno de Iteración.",
    criteria: [
      {
        id: "ip1", name: "Documentación del proceso", description: "Calidad del registro de iteraciones", weight: 20,
        levels: [
          { descriptor: "Cada versión documenta: prompt completo, resultado obtenido, análisis específico de qué falla/funciona, y el cambio planificado para la siguiente versión. El registro es replicable por otro docente." },
          { descriptor: "Documenta prompt y resultado. El análisis existe pero es genérico ('mejorar' sin especificar qué)." },
          { descriptor: "Documenta solo los prompts sin registrar resultados ni análisis." },
          { descriptor: "No documenta el proceso de iteración." },
        ],
      },
      {
        id: "ip2", name: "Cambios controlados", description: "Modificar una variable a la vez", weight: 25,
        levels: [
          { descriptor: "Cada iteración modifica UN elemento específico del prompt (añade contexto, cambia formato, ajusta restricciones). Puede identificar qué cambio causó qué mejora." },
          { descriptor: "Modifica 1-2 elementos por iteración. Puede atribuir mejoras a cambios específicos en la mayoría de casos." },
          { descriptor: "Modifica múltiples elementos simultáneamente. No puede identificar qué cambio causó la mejora." },
          { descriptor: "Reescribe el prompt completamente en cada intento sin análisis de qué cambiar." },
        ],
      },
      {
        id: "ip3", name: "Análisis de resultados", description: "Capacidad de evaluar la salida de la IA", weight: 30,
        levels: [
          { descriptor: "Evalúa la salida en múltiples dimensiones: precisión del contenido, adecuación al nivel, formato, inclusión, viabilidad práctica. Identifica tanto fortalezas como debilidades específicas." },
          { descriptor: "Evalúa en 2-3 dimensiones. Identifica problemas principales pero puede pasar por alto aspectos como sesgo o viabilidad." },
          { descriptor: "Evalúa superficialmente ('está bien' / 'no me gusta'). No identifica dimensiones específicas de mejora." },
          { descriptor: "No evalúa la salida o acepta cualquier resultado sin análisis." },
        ],
      },
      {
        id: "ip4", name: "Aprendizaje transferible", description: "Extracción de patrones reutilizables", weight: 25,
        levels: [
          { descriptor: "Al final de cada sesión articula un aprendizaje específico y transferible ('Añadir ejemplos Few-shot mejora la consistencia en rúbricas'). Puede aplicar patrones descubiertos a nuevos contextos." },
          { descriptor: "Identifica aprendizajes generales ('los prompts largos funcionan mejor') pero no siempre son específicos o transferibles." },
          { descriptor: "Reconoce que mejoró pero no puede articular por qué ni qué haría diferente la próxima vez." },
          { descriptor: "No extrae aprendizajes del proceso de iteración." },
        ],
      },
    ],
  },
];

// ─── Components ─────────────────────────────────────────────────────────────

function AnchorModal({ anchor, level, onClose }: { anchor: AnchorExample; level: number; onClose: () => void }) {
  const lc = levelConfig[level];
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${lc.badge}`}>{lc.label} ({lc.score})</span>
            <span className="text-xs text-gray-500">Ejemplo ancla</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ejemplo</span>
            <pre className="mt-1 text-sm text-gray-800 leading-relaxed whitespace-pre-line font-mono bg-gray-50 rounded-lg p-3 border border-gray-100">
              {anchor.text}
            </pre>
          </div>
          <div className={`rounded-lg p-3 ${lc.bg} border ${lc.border}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: lc.color }}>
              ¿Por qué es nivel {lc.label}?
            </span>
            <p className="text-sm leading-relaxed mt-1" style={{ color: lc.color }}>
              {anchor.annotation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RubricCriterionRow({
  criterion,
  selfAssessment,
  onSelfAssess,
}: {
  criterion: RubricCriterion;
  selfAssessment: LevelIndex | null;
  onSelfAssess: (level: LevelIndex) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [anchorModal, setAnchorModal] = useState<{ anchor: AnchorExample; level: number } | null>(null);

  return (
    <>
      <div className="border-b border-gray-100 last:border-b-0">
        <button onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-gray-50 transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{criterion.name}</span>
              <span className="text-[10px] text-gray-400 font-medium">{criterion.weight}%</span>
            </div>
            <p className="text-xs text-gray-500">{criterion.description}</p>
          </div>
          {selfAssessment !== null && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${levelConfig[selfAssessment].badge}`}>
              {levelConfig[selfAssessment].score}
            </span>
          )}
          {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        </button>

        {expanded && (
          <div className="px-5 pb-4">
            <div className="grid gap-2">
              {criterion.levels.map((cell, levelIdx) => {
                const lc = levelConfig[levelIdx];
                const isSelected = selfAssessment === levelIdx;

                return (
                  <div key={levelIdx}
                    className={`rounded-xl border-2 p-3.5 transition-all cursor-pointer ${
                      isSelected ? `${lc.border} ${lc.bg} ring-2` : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={isSelected ? { "--tw-ring-color": lc.color + "40" } as React.CSSProperties : undefined}
                    onClick={() => onSelfAssess(levelIdx as LevelIndex)}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${lc.badge}`}>
                        {lc.label} ({lc.score})
                      </span>
                      {cell.anchor && (
                        <button onClick={(e) => { e.stopPropagation(); setAnchorModal({ anchor: cell.anchor!, level: levelIdx }); }}
                          className="flex items-center gap-1 text-[10px] font-medium text-gray-400 hover:text-gray-700 transition-colors">
                          <Eye className="w-3 h-3" /> Ver ejemplo
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{cell.descriptor}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {anchorModal && (
        <AnchorModal anchor={anchorModal.anchor} level={anchorModal.level} onClose={() => setAnchorModal(null)} />
      )}
    </>
  );
}

function RubricView({
  rubric,
  assessments,
  onAssess,
  expanded,
  onToggle,
}: {
  rubric: Rubric;
  assessments: Record<string, LevelIndex | null>;
  onAssess: (criterionId: string, level: LevelIndex) => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  const score = useMemo(() => {
    let weightedSum = 0;
    let totalWeight = 0;
    rubric.criteria.forEach(c => {
      const level = assessments[c.id];
      if (level !== null && level !== undefined) {
        weightedSum += levelConfig[level].score * c.weight;
        totalWeight += c.weight;
      }
    });
    if (totalWeight === 0) return null;
    return (weightedSum / totalWeight).toFixed(1);
  }, [rubric, assessments]);

  const assessedCount = rubric.criteria.filter(c => assessments[c.id] !== null && assessments[c.id] !== undefined).length;
  const allAssessed = assessedCount === rubric.criteria.length;

  const scoreColor = score !== null
    ? parseFloat(score) >= 3.5 ? "#059669" : parseFloat(score) >= 2.5 ? "#2563EB" : parseFloat(score) >= 1.5 ? "#D97706" : "#DC2626"
    : "#9CA3AF";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <button onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
        style={{ borderLeftWidth: 4, borderLeftColor: rubric.color, borderLeftStyle: "solid" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: rubric.color + "15", color: rubric.color }}>
          <Award className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: rubric.color }}>
              {rubric.module}
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-900">{rubric.title}</h3>
          <p className="text-xs text-gray-500">{rubric.subtitle}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {score !== null && (
            <div className="text-center">
              <p className="text-xl font-bold tabular-nums" style={{ color: scoreColor }}>{score}</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase">/4.0</p>
            </div>
          )}
          <span className="text-xs text-gray-400">{assessedCount}/{rubric.criteria.length}</span>
          {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div>
          {/* Description */}
          <div className="px-5 pb-3">
            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
              {rubric.description}
            </p>
          </div>

          {/* Mode indicator */}
          <div className="px-5 pb-3">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2.5 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <p className="text-xs text-indigo-800">
                <strong>Modo autoevaluación:</strong> Haz clic en el nivel que mejor describe tu trabajo actual en cada criterio.
              </p>
            </div>
          </div>

          {/* Criteria */}
          {rubric.criteria.map(criterion => (
            <RubricCriterionRow key={criterion.id} criterion={criterion}
              selfAssessment={assessments[criterion.id] ?? null}
              onSelfAssess={level => onAssess(criterion.id, level)} />
          ))}

          {/* Score summary */}
          {allAssessed && score !== null && (
            <div className="px-5 py-4 border-t border-gray-100">
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: scoreColor + "10", border: `2px solid ${scoreColor}30` }}>
                <p className="text-3xl font-bold tabular-nums" style={{ color: scoreColor }}>{score} / 4.0</p>
                <p className="text-xs font-bold mt-1" style={{ color: scoreColor }}>
                  {parseFloat(score) >= 3.5 ? "Nivel Excelente — Dominio demostrado" :
                   parseFloat(score) >= 2.5 ? "Nivel Bueno — Sólido con margen de mejora" :
                   parseFloat(score) >= 1.5 ? "Nivel Suficiente — Requiere práctica adicional" :
                   "Nivel Insuficiente — Revisar fundamentos"}
                </p>
                {parseFloat(score) < 3.5 && (
                  <div className="mt-3 text-left">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Áreas prioritarias de mejora:</p>
                    {rubric.criteria
                      .filter(c => assessments[c.id] !== undefined && assessments[c.id] !== null && (assessments[c.id] as number) >= 2)
                      .sort((a, b) => (assessments[a.id] as number) - (assessments[b.id] as number))
                      .slice(-2)
                      .map(c => {
                        const lvl = assessments[c.id] as LevelIndex;
                        return (
                          <p key={c.id} className="text-xs text-gray-700 flex items-center gap-1.5 mb-1">
                            <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ color: levelConfig[lvl].color }} />
                            <strong>{c.name}</strong>: {c.levels[lvl].descriptor.slice(0, 80)}...
                          </p>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function RubricsWithAnchors() {
  const [assessments, setAssessments] = useState<Record<string, LevelIndex | null>>({});
  const [expandedRubric, setExpandedRubric] = useState<string | null>("prompt-quality");

  const handleAssess = useCallback((criterionId: string, level: LevelIndex) => {
    setAssessments(prev => ({
      ...prev,
      [criterionId]: prev[criterionId] === level ? null : level,
    }));
  }, []);

  const resetAll = useCallback(() => { setAssessments({}); }, []);

  return (
    <div className="min-h-screen bg-gray-50/80 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            Evaluación · Herramienta Transversal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Rúbricas con Ejemplos Ancla
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Evalúa tu progreso con rúbricas detalladas. Cada nivel incluye ejemplos concretos
            que calibran tu autoevaluación. Haz clic en "Ver ejemplo" para ver muestras reales.
          </p>
        </div>

        {/* Guide */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
          <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Cómo usar las rúbricas</p>
            <p className="text-xs text-amber-900 leading-relaxed">
              1. Abre una rúbrica. 2. Lee los descriptores de cada criterio. 3. Consulta los ejemplos ancla (botón "Ver ejemplo") para calibrar.
              4. Selecciona el nivel que mejor describe tu trabajo actual. 5. Revisa tu puntuación global y las áreas de mejora.
            </p>
          </div>
        </div>

        {/* Level legend */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {levelConfig.map(lc => (
            <span key={lc.label} className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${lc.badge}`}>
              {lc.label} ({lc.score})
            </span>
          ))}
        </div>

        {/* Rubrics */}
        <div className="space-y-4">
          {rubrics.map(rubric => (
            <RubricView key={rubric.id} rubric={rubric} assessments={assessments}
              onAssess={handleAssess}
              expanded={expandedRubric === rubric.id}
              onToggle={() => setExpandedRubric(prev => prev === rubric.id ? null : rubric.id)} />
          ))}
        </div>

        {/* Reset */}
        <div className="flex justify-center mt-6">
          <button onClick={resetAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
            <RotateCcw className="w-4 h-4" /> Reiniciar evaluaciones
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          3 rúbricas · {rubrics.reduce((a, r) => a + r.criteria.length, 0)} criterios · Ejemplos ancla incluidos · Curso "Prompt Mastery para Docentes"
        </p>
      </div>
    </div>
  );
}
