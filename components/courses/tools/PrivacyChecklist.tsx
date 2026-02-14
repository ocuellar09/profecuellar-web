"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useCallback, useMemo } from "react";
import { usePersistedToolState } from "@/hooks/usePersistedToolState";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  RotateCcw,
  Copy,
  Check,
  FileWarning,
  Settings,
  Users,
  Globe,
  Database,
  Key,
  BookOpen,
  Sparkles,
  ClipboardCheck,
  ArrowRight,
  Info,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type CheckStatus = "done" | "skip" | null;

interface CheckItem {
  id: string;
  label: string;
  description: string;
  priority: "essential" | "recommended" | "optional";
  tip?: string;
}

interface CheckSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  when: string;
  items: CheckItem[];
}

interface AnonymizationExample {
  original: string;
  anonymized: string;
  technique: string;
}

interface ScenarioQuestion {
  id: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────

const priorityConfig = {
  essential: { label: "Esencial", color: "#DC2626", bg: "bg-red-50", badge: "bg-red-100 text-red-700" },
  recommended: { label: "Recomendado", color: "#D97706", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-700" },
  optional: { label: "Opcional", color: "#2563EB", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700" },
};

const sections: CheckSection[] = [
  {
    id: "before-use",
    title: "Antes de Usar la Herramienta",
    icon: <Settings className="w-5 h-5" />,
    color: "#7C3AED",
    when: "Cuando evalúas una herramienta de IA nueva para tu práctica docente",
    items: [
      { id: "b1", label: "Verificar política de privacidad", description: "¿La herramienta tiene política de privacidad clara, accesible y en un idioma que entiendes? ¿Indica qué datos recopila, cómo los usa y cuánto tiempo los retiene?", priority: "essential", tip: "Si la política es vaga o solo está en inglés legal, es una señal de alerta." },
      { id: "b2", label: "Confirmar cumplimiento GDPR/LOPDGDD", description: "¿La herramienta declara cumplimiento con el GDPR europeo? ¿Tiene representante en la UE? ¿Ofrece DPA (Data Processing Agreement)?", priority: "essential", tip: "Busca sellos como 'GDPR compliant' o 'EU data processing'. Si no lo menciona, pregunta directamente." },
      { id: "b3", label: "Ubicar almacenamiento de datos", description: "¿Dónde se almacenan los datos? ¿En servidores dentro de la UE/EEE? Si están fuera (p.ej. EE.UU.), ¿hay cláusulas contractuales tipo?", priority: "essential", tip: "Tras la invalidación de Privacy Shield, la transferencia de datos a EE.UU. requiere garantías adicionales." },
      { id: "b4", label: "Revisar política de datos de menores", description: "¿La herramienta tiene política específica para menores de edad? ¿Cumple con COPPA si es empresa estadounidense? ¿Restringe edades de uso?", priority: "essential" },
      { id: "b5", label: "Comprobar opción de no-entrenamiento", description: "¿Puedes desactivar que tus datos se usen para entrenar el modelo? ¿Es opt-in o opt-out? ¿Dónde se configura exactamente?", priority: "essential", tip: "En ChatGPT: Configuración → Controles de datos → 'Mejorar el modelo'. En Gemini: Actividad de Gemini." },
      { id: "b6", label: "Consultar política institucional del centro", description: "¿Tu centro educativo tiene política sobre uso de IA? ¿El equipo directivo o DPO ha aprobado esta herramienta? ¿Hay lista de herramientas aprobadas?", priority: "recommended", tip: "Si no hay política, propón crear una. Es mejor tener normas claras que navegar en zona gris." },
      { id: "b7", label: "Verificar opciones de exportación/borrado", description: "¿Puedes exportar tus datos? ¿Puedes solicitar borrado completo de tu cuenta y datos? ¿Cuánto tardan en procesarlo?", priority: "recommended" },
      { id: "b8", label: "Comprobar si existe cuenta educativa", description: "¿La herramienta ofrece versión educativa con protecciones adicionales? (ej. ChatGPT Team/Enterprise, Google Workspace for Education)", priority: "optional", tip: "Las cuentas educativas suelen tener mejores garantías de privacidad y opciones de administración." },
    ],
  },
  {
    id: "each-session",
    title: "En Cada Sesión de Trabajo",
    icon: <Shield className="w-5 h-5" />,
    color: "#059669",
    when: "Cada vez que abres la herramienta de IA para trabajar con contenido educativo",
    items: [
      { id: "s1", label: "Activar modo de máxima privacidad", description: "¿Has activado el chat temporal / modo privado? ¿Está desactivada la opción de entrenamiento? Verifica al inicio de cada sesión — las actualizaciones pueden resetear configuraciones.", priority: "essential", tip: "ChatGPT: usa 'Chat temporal'. Claude: verifica en Configuración → Privacidad." },
      { id: "s2", label: "No incluir datos PII (Información Personal Identificable)", description: "Antes de enviar cada prompt, revisa que NO contenga: nombres reales, DNI/NIE, teléfonos, emails, direcciones, fotos, ni cualquier dato que permita identificar a un alumno.", priority: "essential" },
      { id: "s3", label: "Anonimizar antes de pegar", description: "Si necesitas incluir datos de alumnos (trabajos, características), anonimiza ANTES de pegar: sustituye nombres por 'Alumno A/B/C', elimina datos identificables, generaliza diagnósticos.", priority: "essential", tip: "Haz la anonimización en un documento local ANTES de copiar al prompt. Nunca anonimices 'dentro' de la IA." },
      { id: "s4", label: "Verificar que no hay datos en archivos adjuntos", description: "Si subes documentos, ¿has revisado que no contengan metadatos con nombres, datos de autor, o información identificable en encabezados/pies de página?", priority: "recommended", tip: "Los PDFs y DOCX guardan metadatos del autor. Revísalos antes de subir." },
      { id: "s5", label: "No incluir información del expediente académico", description: "Calificaciones, informes de orientación, adaptaciones curriculares con nombre, actas de evaluación — nada de esto debe entrar en un prompt.", priority: "essential" },
      { id: "s6", label: "No compartir contraseñas ni accesos", description: "No incluyas credenciales de plataformas educativas, tokens de API, ni enlaces privados de documentos compartidos en los prompts.", priority: "essential" },
    ],
  },
  {
    id: "with-students",
    title: "Cuando los Alumnos Usan IA",
    icon: <Users className="w-5 h-5" />,
    color: "#2563EB",
    when: "Si tus alumnos van a interactuar directamente con herramientas de IA",
    items: [
      { id: "a1", label: "Verificar edad mínima de la plataforma", description: "La mayoría de herramientas de IA requieren 13+ o 18+ años. ¿Tus alumnos cumplen el requisito? Si son menores, ¿hay versión educativa sin restricción de edad?", priority: "essential", tip: "ChatGPT: 13+ (con permiso parental hasta 18). Gemini: 18+ en cuenta personal, sin límite en Workspace edu." },
      { id: "a2", label: "Obtener consentimiento informado de las familias", description: "¿Has enviado comunicación a las familias explicando: qué herramienta, para qué, qué datos se comparten, qué derechos tienen? ¿Has obtenido consentimiento por escrito?", priority: "essential" },
      { id: "a3", label: "Instruir sobre datos personales", description: "¿Has explicado a tus alumnos qué datos NO deben compartir con la IA? (nombre completo, dirección, fotos, datos familiares, contraseñas)", priority: "essential", tip: "Haz una mini-lección sobre privacidad digital antes de la primera sesión con IA." },
      { id: "a4", label: "Supervisar el uso durante la sesión", description: "¿Puedes ver las pantallas de los alumnos? ¿Hay un adulto supervisando? ¿Los alumnos saben que no deben compartir los prompts/respuestas con datos personales?", priority: "recommended" },
      { id: "a5", label: "Tener alternativa para alumnos sin consentimiento", description: "¿Has preparado una actividad equivalente para alumnos cuyas familias no den consentimiento? No puede haber penalización por no usar IA.", priority: "essential" },
      { id: "a6", label: "Establecer normas de uso claras", description: "¿Los alumnos tienen un documento/poster con las normas de uso de IA en tu aula? (qué SÍ, qué NO, cómo citar, cuándo usar)", priority: "recommended" },
    ],
  },
  {
    id: "after-use",
    title: "Después de la Sesión",
    icon: <Database className="w-5 h-5" />,
    color: "#DC2626",
    when: "Al terminar de trabajar con la herramienta de IA",
    items: [
      { id: "d1", label: "Revisar el contenido generado antes de distribuir", description: "¿Has leído TODO el contenido generado? ¿Hay datos inventados, sesgos o información incorrecta? No distribuyas sin revisión completa.", priority: "essential" },
      { id: "d2", label: "Eliminar conversaciones con datos sensibles", description: "Si accidentalmente incluiste datos identificables, elimina esa conversación inmediatamente. No confíes solo en desactivar el historial — borra activamente.", priority: "essential", tip: "En ChatGPT: tres puntos → Eliminar. En Claude: menú de conversación → Eliminar." },
      { id: "d3", label: "No almacenar prompts con PII en tu nube", description: "Si guardas prompts útiles para reusar, asegúrate de que las versiones guardadas NO contengan datos de alumnos reales. Guarda la plantilla, no el prompt con datos.", priority: "recommended" },
      { id: "d4", label: "Documentar el uso para el centro", description: "¿Mantienes un registro de qué herramientas usas, para qué, y con qué configuración de privacidad? Esto es útil para auditorías y para compartir buenas prácticas.", priority: "optional" },
    ],
  },
];

const anonymizationExamples: AnonymizationExample[] = [
  { original: "Pedro García López, alumno de 3ºB con TDAH y dislexia, tiene calificaciones de 4 en Lengua y 3 en Mates.", anonymized: "Alumno de 3º ESO con dificultades de atención y lectoescritura, rendimiento bajo en áreas instrumentales.", technique: "Eliminar nombre + generalizar diagnóstico + eliminar calificaciones exactas" },
  { original: "María, hija de familia monoparental en riesgo de exclusión social, del barrio de Carabanchel.", anonymized: "Alumna en contexto socioeconómico vulnerable.", technique: "Eliminar nombre + eliminar datos familiares + eliminar ubicación" },
  { original: "El informe psicopedagógico de Juan indica CI de 145 y altas capacidades con disincronía social.", anonymized: "Alumno con altas capacidades intelectuales y necesidades de ajuste socioemocional.", technique: "Eliminar nombre + eliminar dato cuantitativo + generalizar perfil" },
  { original: "La tutora Carmen Ruiz del CEIP San José envió el acta de evaluación del grupo.", anonymized: "La tutora del grupo envió la información de evaluación del aula.", technique: "Eliminar nombres propios (persona y centro)" },
];

const scenarios: ScenarioQuestion[] = [
  {
    id: "sc1",
    scenario: "Quieres que la IA te ayude a redactar comentarios individualizados para los boletines de notas de tus 25 alumnos. ¿Cuál es la forma más segura?",
    options: [
      "Pegar la lista de alumnos con nombres y notas para que la IA personalice cada comentario",
      "Describir perfiles anónimos ('Alumno con rendimiento alto en ciencias, área de mejora en expresión escrita') y generar plantillas de comentario por perfil",
      "No usar IA para boletines — es demasiado arriesgado",
      "Usar ChatGPT con historial desactivado, que así es seguro",
    ],
    correctIndex: 1,
    explanation: "La opción B es la más equilibrada: obtienes ayuda real de la IA sin exponer datos personales. Creas perfiles-tipo anónimos y generas comentarios modelo que luego personalizas tú fuera de la plataforma. Desactivar el historial (D) NO es suficiente.",
  },
  {
    id: "sc2",
    scenario: "Un compañero docente te pide que le enseñes a usar ChatGPT y lo primero que hace es pegar un informe psicopedagógico completo para 'que la IA le ayude a interpretarlo'. ¿Qué haces?",
    options: [
      "Le dices que no pasa nada si tiene el historial desactivado",
      "Le explicas el riesgo, le ayudas a borrar la conversación inmediatamente, y le enseñas la técnica de anonimización",
      "Le dices que deje de usar IA para temas de orientación",
      "Le recomiendas que use Claude en vez de ChatGPT porque es más privado",
    ],
    correctIndex: 1,
    explanation: "Acción inmediata (borrar) + educación (anonimización). No se trata de prohibir el uso sino de enseñar a hacerlo de forma segura. Ninguna plataforma es 'segura' para datos PII sin anonimizar — la privacidad está en el PROCESO, no en la herramienta.",
  },
  {
    id: "sc3",
    scenario: "Tus alumnos de 2º ESO (13-14 años) van a usar Gemini en una actividad de clase. Las familias han sido informadas pero 3 familias no han devuelto el consentimiento firmado. ¿Qué haces?",
    options: [
      "Los 3 alumnos observan mientras los demás trabajan con IA",
      "Asumes consentimiento tácito — no dijeron que no",
      "Preparas una actividad equivalente sin IA para esos 3 alumnos, con los mismos objetivos de aprendizaje",
      "Llamas a las familias para pedir consentimiento verbal",
    ],
    correctIndex: 2,
    explanation: "El GDPR requiere consentimiento explícito (no tácito) para menores. Los 3 alumnos necesitan una alternativa pedagógica equivalente, sin penalización. Observar no es una actividad equivalente. El consentimiento verbal no es verificable.",
  },
];

// ─── Components ─────────────────────────────────────────────────────────────

function CheckItemRow({ item, status, onStatusChange }: { item: CheckItem; status: CheckStatus; onStatusChange: (s: CheckStatus) => void }) {
  const [expanded, setExpanded] = useState(false);
  const pri = priorityConfig[item.priority];

  return (
    <div className={`rounded-xl border-2 transition-all ${
      status === "done" ? "border-emerald-300 bg-emerald-50/30" :
      status === "skip" ? "border-gray-200 bg-gray-50/50 opacity-50" :
      "border-gray-200 bg-white"
    }`}>
      <div className="flex items-start gap-3 p-3.5">
        <button onClick={() => onStatusChange(status === "done" ? null : "done")}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            status === "done" ? "bg-emerald-500 border-emerald-500" : "border-gray-300 hover:border-emerald-400"
          }`}>
          {status === "done" && <Check className="w-3.5 h-3.5 text-white" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${pri.badge}`}>{pri.label}</span>
          </div>
          <p className={`text-sm font-medium leading-relaxed ${status === "done" ? "text-gray-500 line-through" : "text-gray-900"}`}>
            {item.label}
          </p>
          <button onClick={() => setExpanded(!expanded)} className="text-[11px] text-gray-400 hover:text-gray-600 mt-1 flex items-center gap-1">
            {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            {expanded ? "Ocultar" : "Detalles"}
          </button>
          {expanded && (
            <div className="mt-2 space-y-2">
              <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
              {item.tip && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-900 leading-relaxed">{item.tip}</p>
                </div>
              )}
            </div>
          )}
        </div>
        <button onClick={() => onStatusChange(status === "skip" ? null : "skip")}
          className={`text-[10px] font-medium px-2 py-1 rounded-lg transition-all flex-shrink-0 ${
            status === "skip" ? "bg-gray-300 text-white" : "text-gray-400 hover:bg-gray-100"
          }`}>N/A</button>
      </div>
    </div>
  );
}

function SectionBlock({ section, statuses, onStatusChange, expanded, onToggle }: {
  section: CheckSection; statuses: Record<string, CheckStatus>;
  onStatusChange: (id: string, s: CheckStatus) => void; expanded: boolean; onToggle: () => void;
}) {
  const done = section.items.filter(i => statuses[i.id] === "done").length;
  const skip = section.items.filter(i => statuses[i.id] === "skip").length;
  const total = section.items.length;
  const pct = total > 0 ? Math.round(((done + skip) / total) * 100) : 0;
  const allDone = done + skip === total;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <button onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
        style={{ borderLeftWidth: 4, borderLeftColor: section.color, borderLeftStyle: "solid" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: section.color + "15", color: section.color }}>
          {allDone ? <CheckCircle2 className="w-5 h-5" /> : section.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900">{section.title}</h3>
          <p className="text-[11px] text-gray-500">{section.when}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${allDone ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
            {done}/{total}
          </span>
          {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        </div>
      </button>
      {expanded && (
        <div className="px-5 pb-5 space-y-2.5">
          {/* Progress */}
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-400" style={{ width: `${pct}%`, backgroundColor: section.color }} />
          </div>
          {section.items.map(item => (
            <CheckItemRow key={item.id} item={item} status={statuses[item.id] || null}
              onStatusChange={s => onStatusChange(item.id, s)} />
          ))}
        </div>
      )}
    </div>
  );
}

function AnonymizationGuide() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? anonymizationExamples : anonymizationExamples.slice(0, 2);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <EyeOff className="w-5 h-5 text-violet-600" />
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Guía Rápida de Anonimización</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        Antes de incluir cualquier dato de alumnos en un prompt, aplica estas técnicas de anonimización:
      </p>
      <div className="space-y-3">
        {visible.map((ex, i) => (
          <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-red-50 px-4 py-2.5">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">❌ Original (NO enviar)</span>
              <p className="text-xs text-red-800 mt-1 font-mono">{ex.original}</p>
            </div>
            <div className="bg-emerald-50 px-4 py-2.5">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">✅ Anonimizado (seguro)</span>
              <p className="text-xs text-emerald-800 mt-1 font-mono">{ex.anonymized}</p>
            </div>
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
              <p className="text-[10px] text-gray-500"><strong>Técnica:</strong> {ex.technique}</p>
            </div>
          </div>
        ))}
      </div>
      {anonymizationExamples.length > 2 && (
        <button onClick={() => setShowAll(!showAll)}
          className="text-xs font-medium text-violet-600 hover:underline mt-3">
          {showAll ? "Ver menos" : `Ver ${anonymizationExamples.length - 2} ejemplos más`}
        </button>
      )}
    </div>
  );
}

function ScenarioValidator() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const sc = scenarios[current];
  const isLast = current === scenarios.length - 1;
  const isCorrect = selected === sc.correctIndex;

  const handleCheck = () => { setRevealed(true); if (isCorrect) setScore(s => s + 1); };
  const handleNext = () => {
    setCurrent(c => c + 1);
    setSelected(null);
    setRevealed(false);
  };

  if (current >= scenarios.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
        <div className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center ${
          score === scenarios.length ? "bg-emerald-500" : "bg-amber-500"
        }`}>
          <Shield className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {score === scenarios.length ? "¡Criterio impecable!" : "Buen criterio, revisa los errores"}
        </h3>
        <p className="text-sm text-gray-600 mb-4">{score}/{scenarios.length} escenarios correctos</p>
        <button onClick={() => { setCurrent(0); setSelected(null); setRevealed(false); setScore(0); }}
          className="text-sm font-medium text-violet-600 hover:underline flex items-center gap-1 mx-auto">
          <RotateCcw className="w-3.5 h-3.5" /> Repetir escenarios
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileWarning className="w-4 h-4 text-violet-500" />
          <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">Escenario {current + 1}/{scenarios.length}</span>
        </div>
        <span className="text-xs text-gray-400">{score} correctos</span>
      </div>
      <div className="p-5">
        <p className="text-sm font-semibold text-gray-900 leading-relaxed mb-4">{sc.scenario}</p>
        <div className="space-y-2 mb-4">
          {sc.options.map((opt, i) => {
            let cls = "border-gray-200 bg-white hover:border-gray-400";
            if (revealed) {
              if (i === sc.correctIndex) cls = "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200";
              else if (i === selected) cls = "border-red-400 bg-red-50 ring-2 ring-red-200";
              else cls = "border-gray-200 bg-gray-50 opacity-50";
            } else if (i === selected) cls = "border-violet-400 bg-violet-50 ring-2 ring-violet-200";
            return (
              <button key={i} onClick={() => !revealed && setSelected(i)} disabled={revealed}
                className={`w-full text-left rounded-lg border-2 p-3 text-sm transition-all ${cls}`}>
                {opt}
              </button>
            );
          })}
        </div>
        {!revealed ? (
          <button onClick={handleCheck} disabled={selected === null}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
              selected !== null ? "bg-violet-600 text-white hover:bg-violet-700 cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}>Verificar</button>
        ) : (
          <>
            <div className={`rounded-lg p-3 mb-3 ${isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
              <p className="text-sm leading-relaxed" style={{ color: isCorrect ? "#064e3b" : "#78350f" }}>
                {isCorrect ? "✓ " : "✗ "}{sc.explanation}
              </p>
            </div>
            {!isLast && (
              <button onClick={handleNext} className="w-full py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 transition-colors flex items-center justify-center gap-2">
                Siguiente escenario <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {isLast && (
              <button onClick={handleNext} className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors">
                Ver resultados
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function PrivacyChecklist() {
  const [statuses, setStatuses] = usePersistedToolState<Record<string, CheckStatus>>(
    "privacy-checklist",
    {},
  );
  const [expandedSection, setExpandedSection] = useState<string | null>("before-use");
  const [activeTab, setActiveTab] = useState<"checklist" | "anonymize" | "scenarios">("checklist");

  const updateStatus = useCallback((id: string, s: CheckStatus) => {
    setStatuses(prev => ({ ...prev, [id]: s }));
  }, []);

  const resetAll = useCallback(() => {
    setStatuses({});
    setExpandedSection("before-use");
  }, []);

  const allItems = sections.flatMap(s => s.items);
  const essentialItems = allItems.filter(i => i.priority === "essential");
  const doneCount = allItems.filter(i => statuses[i.id] === "done").length;
  const essentialDone = essentialItems.filter(i => statuses[i.id] === "done").length;
  const essentialPending = essentialItems.filter(i => !statuses[i.id]).length;
  const totalPct = allItems.length > 0 ? Math.round((doneCount / allItems.length) * 100) : 0;

  const tabs = [
    { id: "checklist", label: "Checklist", icon: <ClipboardCheck className="w-3.5 h-3.5" /> },
    { id: "anonymize", label: "Anonimización", icon: <EyeOff className="w-3.5 h-3.5" /> },
    { id: "scenarios", label: "Escenarios", icon: <FileWarning className="w-3.5 h-3.5" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            Módulo 0 · Herramienta Práctica
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Checklist de Privacidad y Datos
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Verifica la protección de datos en cada paso de tu uso de IA educativa:
            antes, durante, con alumnos y después.
          </p>
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

        {/* Checklist tab */}
        {activeTab === "checklist" && (
          <>
            {/* Summary bar */}
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Progreso general</span>
                <span className="text-xs text-gray-400">{doneCount}/{allItems.length} completados · {totalPct}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${totalPct}%` }} />
              </div>
              {essentialPending > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-800">
                    <strong>{essentialPending} criterio{essentialPending > 1 ? "s" : ""} esencial{essentialPending > 1 ? "es" : ""}</strong> pendiente{essentialPending > 1 ? "s" : ""}. No uses la herramienta con datos de alumnos hasta completarlos.
                  </p>
                </div>
              )}
              {essentialPending === 0 && doneCount > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <p className="text-xs text-emerald-800">
                    Todos los criterios esenciales están completados. Puedes usar la herramienta con confianza.
                  </p>
                </div>
              )}
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {sections.map(section => (
                <SectionBlock key={section.id} section={section} statuses={statuses}
                  onStatusChange={updateStatus}
                  expanded={expandedSection === section.id}
                  onToggle={() => setExpandedSection(prev => prev === section.id ? null : section.id)} />
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button onClick={resetAll}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                <RotateCcw className="w-4 h-4" /> Reiniciar checklist
              </button>
            </div>
          </>
        )}

        {/* Anonymization tab */}
        {activeTab === "anonymize" && <AnonymizationGuide />}

        {/* Scenarios tab */}
        {activeTab === "scenarios" && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-2">
              <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed">
                Pon a prueba tu criterio con estos escenarios reales. Cada uno plantea una situación de privacidad que podrías encontrar en tu práctica docente.
              </p>
            </div>
            <ScenarioValidator />
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-10">
          4 secciones · {allItems.length} criterios · {essentialItems.length} esenciales · Curso "Prompt Mastery para Docentes"
        </p>
      </div>
    </div>
  );
}
