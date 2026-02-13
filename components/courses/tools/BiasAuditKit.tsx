"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useCallback, useMemo } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Globe,
  Users,
  MessageSquare,
  Crown,
  Palette,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  RotateCcw,
  Search,
  FileText,
  Sparkles,
  ClipboardList,
  ArrowRight,
  BookOpen,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface AuditItem {
  id: string;
  question: string;
  description: string;
  severity: "critical" | "important" | "recommended";
  examples: string[];
}

interface BiasCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgLight: string;
  description: string;
  items: AuditItem[];
  correctivePrompt: string;
}

type AuditStatus = "pass" | "fail" | "na" | null;

// ─── Data ───────────────────────────────────────────────────────────────────

const severityConfig = {
  critical: { label: "Crítico", color: "#DC2626", bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700" },
  important: { label: "Importante", color: "#D97706", bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700" },
  recommended: { label: "Recomendado", color: "#2563EB", bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
};

const categories: BiasCategory[] = [
  {
    id: "representation",
    name: "Representación y Diversidad",
    icon: <Users className="w-5 h-5" />,
    color: "#7C3AED",
    bgLight: "bg-violet-50",
    description: "¿Quién aparece en el contenido generado? ¿Quién falta? ¿Hay diversidad real o tokenismo?",
    items: [
      {
        id: "rep1",
        question: "¿Los personajes/ejemplos incluyen diversidad de género?",
        description: "Verifica que no todos los protagonistas o ejemplos sean del mismo género. ¿Hay mujeres en roles de liderazgo, ciencia, deporte? ¿Hay hombres en roles de cuidado?",
        severity: "critical",
        examples: [
          "❌ Todos los científicos mencionados son hombres",
          "❌ Las profesiones de cuidado solo se asignan a mujeres",
          "✅ Mezcla de géneros en todas las profesiones y roles",
        ],
      },
      {
        id: "rep2",
        question: "¿Hay diversidad étnica y cultural en los ejemplos?",
        description: "¿Los nombres, contextos y situaciones reflejan la diversidad real de tu aula? ¿O todos los ejemplos asumen un contexto cultural dominante?",
        severity: "critical",
        examples: [
          "❌ Solo nombres anglosajones o de una cultura",
          "❌ Todos los contextos familiares son nucleares biparentales",
          "✅ Variedad de nombres, estructuras familiares y contextos",
        ],
      },
      {
        id: "rep3",
        question: "¿Las personas con discapacidad aparecen con agencia?",
        description: "Si se mencionan personas con discapacidad, ¿tienen rol activo o solo son receptoras de ayuda? ¿Se evita el lenguaje capacitista?",
        severity: "important",
        examples: [
          "❌ 'A pesar de su discapacidad, logró...' (narrativa de superación forzada)",
          "❌ Personas con discapacidad solo como receptoras de caridad",
          "✅ Personas con discapacidad como protagonistas con objetivos propios",
        ],
      },
      {
        id: "rep4",
        question: "¿Se evita la representación única (tokenismo)?",
        description: "¿Hay un solo personaje 'diverso' rodeado de personajes del grupo dominante? La diversidad real es sistémica, no un personaje simbólico.",
        severity: "recommended",
        examples: [
          "❌ Un grupo de 8 personajes donde solo 1 es de otra cultura",
          "✅ Diversidad distribuida de forma natural en todo el contenido",
        ],
      },
    ],
    correctivePrompt: `Revisa el contenido generado y aplica estas correcciones de representación:

1. GÉNERO: Asegúrate de que haya equilibrio de género en todos los roles. Si hay científicos, incluye mujeres. Si hay cuidadores, incluye hombres.

2. DIVERSIDAD CULTURAL: Usa nombres de al menos 3 tradiciones culturales diferentes. Incluye contextos familiares variados (monoparental, extendida, reconstituida).

3. DISCAPACIDAD: Si aparecen personas con discapacidad, deben tener agencia y objetivos propios. Evita narrativas de "superación heroica" o "inspiración".

4. DISTRIBUCIÓN: La diversidad debe ser sistémica, no un personaje simbólico. Revisa que la representación sea natural y no forzada.

Reescribe el contenido manteniendo el mismo objetivo pedagógico pero corrigiendo los sesgos de representación detectados.`,
  },
  {
    id: "cultural",
    name: "Sesgo Cultural y Geográfico",
    icon: <Globe className="w-5 h-5" />,
    color: "#059669",
    bgLight: "bg-emerald-50",
    description: "¿El contenido asume una perspectiva cultural dominante? ¿Respeta la diversidad de tradiciones, conocimientos y cosmovisiones?",
    items: [
      {
        id: "cul1",
        question: "¿Se presentan múltiples perspectivas culturales?",
        description: "¿La historia, ciencia o literatura se cuenta solo desde la perspectiva occidental/europea? ¿Se incluyen contribuciones de otras civilizaciones?",
        severity: "critical",
        examples: [
          "❌ 'Los griegos inventaron la democracia' (ignora sistemas participativos no occidentales)",
          "❌ Solo autores europeos en la lista de literatura",
          "✅ 'Varios sistemas de gobierno participativo surgieron en distintas civilizaciones...'",
        ],
      },
      {
        id: "cul2",
        question: "¿Se evitan estereotipos culturales?",
        description: "¿Se asocian culturas con estereotipos (latinoamericanos = pobreza, asiáticos = matemáticas, africanos = tribalismo)? ¿Se muestra la riqueza y complejidad de cada cultura?",
        severity: "critical",
        examples: [
          "❌ 'En los países africanos, las tribus...' (reduce un continente a un estereotipo)",
          "❌ 'La cultura japonesa se basa en la disciplina y la obediencia'",
          "✅ Representaciones multidimensionales que evitan generalizaciones",
        ],
      },
      {
        id: "cul3",
        question: "¿El marco pedagógico es culturalmente apropiado?",
        description: "¿Se usa solo terminología y marcos de referencia anglosajones? ¿Se ha adaptado al contexto curricular local (LOMLOE, etc.)?",
        severity: "important",
        examples: [
          "❌ Referencias a 'Common Core', 'K-12', 'SAT' en contexto español",
          "❌ Uso de sistemas de medida imperiales",
          "✅ Marco LOMLOE, competencias clave del sistema educativo español",
        ],
      },
      {
        id: "cul4",
        question: "¿Las situaciones cotidianas son universalmente accesibles?",
        description: "¿Los problemas matemáticos asumen un contexto socioeconómico, geográfico o cultural específico que excluye a parte del alumnado?",
        severity: "important",
        examples: [
          "❌ 'Tu familia tiene una casa con jardín y dos coches...' (asume nivel socioeconómico)",
          "❌ 'Cuando vas a esquiar en vacaciones...' (asume geografía y economía)",
          "✅ Situaciones variadas que reflejan diferentes realidades",
        ],
      },
    ],
    correctivePrompt: `Revisa el contenido y corrige los sesgos culturales y geográficos:

1. PERSPECTIVA: Incluye contribuciones de al menos 3 tradiciones culturales diferentes al tema tratado. No presentes la perspectiva occidental como "la historia" y las demás como "alternativas".

2. ESTEREOTIPOS: Elimina asociaciones simplistas entre culturas y características. Muestra la complejidad y diversidad interna de cada cultura mencionada.

3. MARCO PEDAGÓGICO: Adapta toda la terminología al contexto educativo español (LOMLOE, competencias clave). Elimina referencias a sistemas educativos anglosajones.

4. CONTEXTO: Los ejemplos y problemas deben ser accesibles para alumnado de diferentes contextos socioeconómicos. Varía las situaciones para no asumir un nivel de vida específico.

Reescribe manteniendo el objetivo pedagógico pero con perspectiva intercultural real.`,
  },
  {
    id: "language",
    name: "Sesgo Lingüístico",
    icon: <MessageSquare className="w-5 h-5" />,
    color: "#2563EB",
    bgLight: "bg-blue-50",
    description: "¿El lenguaje es inclusivo, accesible y libre de sesgos implícitos? ¿Refleja la diversidad lingüística del aula?",
    items: [
      {
        id: "lang1",
        question: "¿Se usa lenguaje inclusivo de género?",
        description: "¿Se utiliza el masculino genérico exclusivamente? ¿Hay alternativas inclusivas (alumnado vs. alumnos, profesorado vs. profesores)?",
        severity: "important",
        examples: [
          "❌ 'Los alumnos deben entregar sus trabajos' (exclusivo)",
          "✅ 'El alumnado debe entregar sus trabajos' (inclusivo)",
          "✅ 'Los alumnos y alumnas...' o 'Cada estudiante...' (alternativas válidas)",
        ],
      },
      {
        id: "lang2",
        question: "¿Se evitan expresiones con carga valorativa oculta?",
        description: "¿Hay expresiones como 'países desarrollados vs. subdesarrollados', 'civilizado vs. primitivo', 'normal vs. especial'?",
        severity: "critical",
        examples: [
          "❌ 'Países del tercer mundo' o 'países subdesarrollados'",
          "❌ 'Alumnos normales y alumnos con necesidades especiales'",
          "✅ 'Países de renta alta/media/baja', 'alumnado con y sin NEAE'",
        ],
      },
      {
        id: "lang3",
        question: "¿El vocabulario es accesible para el nivel del alumnado?",
        description: "¿Hay tecnicismos innecesarios? ¿El lenguaje es apropiado para la edad y competencia lingüística del grupo, incluyendo alumnos ELE?",
        severity: "important",
        examples: [
          "❌ Vocabulario universitario en material de ESO",
          "❌ Frases de más de 30 palabras para Primaria",
          "✅ Vocabulario adaptado al nivel con definiciones para términos técnicos",
        ],
      },
      {
        id: "lang4",
        question: "¿Se evita el lenguaje capacitista?",
        description: "¿Se usan expresiones como 'sufre de', 'padece', 'confinado a una silla de ruedas', 'persona normal'?",
        severity: "important",
        examples: [
          "❌ 'Sufre de autismo', 'víctima de parálisis cerebral'",
          "❌ 'A pesar de ser ciego, consiguió...'",
          "✅ 'Persona con autismo', 'persona usuaria de silla de ruedas'",
        ],
      },
    ],
    correctivePrompt: `Revisa el lenguaje del contenido generado:

1. GÉNERO: Sustituye el masculino genérico por formas inclusivas: "alumnado" en lugar de "alumnos", "profesorado" en lugar de "profesores", "cada estudiante" en lugar de "el alumno".

2. EXPRESIONES VALORATIVAS: Sustituye:
   - "subdesarrollado" → "de renta baja"
   - "tercer mundo" → "países del Sur Global" o "en vías de desarrollo"
   - "normal" (referido a personas) → "neurotípico" o eliminar
   - "primitivo" → "de tradición oral" o contexto específico

3. ACCESIBILIDAD: Ajusta al nivel de lectura del grupo. Frases máximo [X] palabras. Define términos técnicos al usarlos.

4. CAPACITISMO: Usa lenguaje persona-primero ("persona con discapacidad") excepto donde la comunidad prefiera identidad-primero ("persona autista"). Elimina narrativas de superación forzada.

Reescribe manteniendo el contenido pero con lenguaje inclusivo y accesible.`,
  },
  {
    id: "power",
    name: "Dinámicas de Poder y Narrativa",
    icon: <Crown className="w-5 h-5" />,
    color: "#DC2626",
    bgLight: "bg-red-50",
    description: "¿Quién tiene voz en el contenido? ¿Quién es agente y quién es receptor? ¿Qué narrativas se privilegian?",
    items: [
      {
        id: "pow1",
        question: "¿Los grupos históricamente marginados tienen agencia?",
        description: "¿Se presenta a mujeres, minorías o pueblos colonizados como agentes de su propia historia o solo como víctimas/receptores?",
        severity: "critical",
        examples: [
          "❌ 'Los españoles descubrieron América' (borra la agencia de los pueblos originarios)",
          "❌ Historia de la mujer solo como 'lucha por derechos' (solo como víctima)",
          "✅ 'El encuentro entre civilizaciones europeas y americanas...'",
        ],
      },
      {
        id: "pow2",
        question: "¿Se cuestionan las narrativas de progreso lineal?",
        description: "¿Se presenta 'la historia' como un avance lineal desde lo 'primitivo' a lo 'civilizado'? ¿Se reconocen pérdidas, retrocesos y perspectivas alternativas?",
        severity: "important",
        examples: [
          "❌ 'Gracias a la colonización, estos pueblos accedieron a la civilización'",
          "❌ 'La revolución industrial fue un gran avance para la humanidad' (sin matices)",
          "✅ Análisis multidimensional que incluye impactos positivos y negativos",
        ],
      },
      {
        id: "pow3",
        question: "¿Se evitan narrativas de salvación?",
        description: "¿Hay patrones de 'el grupo dominante salva al grupo subordinado'? ¿Se muestra a las comunidades con recursos propios?",
        severity: "important",
        examples: [
          "❌ 'La ONG salvó a los niños africanos' (narrativa de salvación)",
          "❌ 'La tecnología occidental modernizó las sociedades rurales'",
          "✅ 'La comunidad desarrolló soluciones propias con apoyo externo'",
        ],
      },
      {
        id: "pow4",
        question: "¿Las voces citadas son diversas?",
        description: "Si hay citas, referencias o expertos mencionados, ¿provienen de diferentes géneros, culturas y tradiciones académicas?",
        severity: "recommended",
        examples: [
          "❌ Todas las citas son de académicos hombres europeos/norteamericanos",
          "✅ Mezcla de voces de diferentes contextos, géneros y tradiciones",
        ],
      },
    ],
    correctivePrompt: `Revisa las dinámicas de poder en el contenido generado:

1. AGENCIA: Reescribe para que los grupos históricamente marginados sean AGENTES, no solo víctimas o receptores. Usa voz activa para sus acciones.

2. NARRATIVA: Evita el marco de "progreso lineal". Incluye múltiples perspectivas sobre los eventos, incluyendo costes y beneficios para diferentes grupos.

3. SALVACIÓN: Elimina patrones donde un grupo "salva" o "civiliza" a otro. Muestra a todas las comunidades con recursos, conocimientos y agencia propios.

4. VOCES: Incluye referencias y citas de personas de diferentes géneros, culturas y tradiciones académicas. Si mencionas expertos, incluye diversidad.

Reescribe preservando la precisión histórica pero con equilibrio de perspectivas y agencia distribuida.`,
  },
  {
    id: "visual",
    name: "Sesgo en Contenido Visual",
    icon: <Palette className="w-5 h-5" />,
    color: "#EA580C",
    bgLight: "bg-orange-50",
    description: "Si el contenido incluye indicaciones para imágenes o si se generaron imágenes con IA, ¿qué sesgos visuales hay?",
    items: [
      {
        id: "vis1",
        question: "¿Las indicaciones de imagen incluyen diversidad explícita?",
        description: "Si el contenido indica [insertar imagen aquí], ¿se especifica diversidad de género, etnia y edad en las personas representadas?",
        severity: "important",
        examples: [
          "❌ 'Imagen de un doctor' (la IA generará hombre blanco)",
          "✅ 'Imagen de equipo médico diverso (género, edad, etnia)'",
        ],
      },
      {
        id: "vis2",
        question: "¿Los entornos visuales reflejan diversidad?",
        description: "¿Todos los escenarios son de clase media occidental? ¿Hay variedad de contextos geográficos, arquitectónicos y socioeconómicos?",
        severity: "recommended",
        examples: [
          "❌ Todas las 'casas' son chalets con jardín",
          "❌ Todas las 'escuelas' son edificios modernos europeos",
          "✅ Variedad de contextos que reflejan la diversidad real",
        ],
      },
      {
        id: "vis3",
        question: "¿Se evitan asociaciones visuales estereotipadas?",
        description: "¿Las imágenes refuerzan estereotipos (mujeres en cocina, hombres en laboratorio, personas racializadas en roles de servicio)?",
        severity: "critical",
        examples: [
          "❌ Todas las imágenes de liderazgo muestran hombres blancos",
          "❌ Las imágenes de 'pobreza' siempre muestran personas racializadas",
          "✅ Representaciones que desafían estereotipos visuales activamente",
        ],
      },
    ],
    correctivePrompt: `Revisa las indicaciones visuales del contenido:

1. DIVERSIDAD: Toda indicación de imagen con personas debe incluir: "diverso en género, edad y etnia". Ejemplo: "Imagen de equipo docente diverso colaborando".

2. ENTORNOS: Varía los entornos visuales. No todos los contextos deben ser de clase media occidental. Incluye diversidad arquitectónica y geográfica.

3. ANTI-ESTEREOTIPOS: Incluye intencionalmente representaciones contra-estereotípicas: mujeres en STEM, hombres en cuidado, personas racializadas en roles de liderazgo.

Reescribe las indicaciones visuales con instrucciones explícitas de diversidad e inclusión.`,
  },
];

// ─── Copy Button ────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copiado" : "Copiar prompt"}
    </button>
  );
}

// ─── Audit Item Component ───────────────────────────────────────────────────

function AuditItemCard({
  item,
  status,
  onStatusChange,
}: {
  item: AuditItem;
  status: AuditStatus;
  onStatusChange: (status: AuditStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const sev = severityConfig[item.severity];

  return (
    <div className={`rounded-xl border-2 transition-all ${
      status === "fail" ? "border-red-300 bg-red-50/50" :
      status === "pass" ? "border-emerald-300 bg-emerald-50/30" :
      status === "na" ? "border-gray-200 bg-gray-50/50 opacity-60" :
      "border-gray-200 bg-white"
    }`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${sev.badge}`}>
                {sev.label}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-900 leading-relaxed">{item.question}</p>
          </div>

          {/* Status buttons */}
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={() => onStatusChange(status === "pass" ? null : "pass")}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                status === "pass" ? "bg-emerald-500 text-white ring-2 ring-emerald-300" : "bg-gray-100 text-gray-400 hover:bg-emerald-100 hover:text-emerald-600"
              }`} title="Sin sesgo detectado">✓</button>
            <button onClick={() => onStatusChange(status === "fail" ? null : "fail")}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                status === "fail" ? "bg-red-500 text-white ring-2 ring-red-300" : "bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600"
              }`} title="Sesgo detectado">✗</button>
            <button onClick={() => onStatusChange(status === "na" ? null : "na")}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                status === "na" ? "bg-gray-500 text-white ring-2 ring-gray-300" : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              }`} title="No aplica">N/A</button>
          </div>
        </div>

        {/* Expand for details */}
        <button onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-gray-600 mt-2 transition-colors">
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          {expanded ? "Ocultar detalles" : "Ver detalles y ejemplos"}
        </button>

        {expanded && (
          <div className="mt-3 space-y-2.5">
            <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
            <div className="space-y-1">
              {item.examples.map((ex, i) => (
                <p key={i} className={`text-xs leading-relaxed px-2.5 py-1.5 rounded-lg ${
                  ex.startsWith("❌") ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"
                }`}>{ex}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Category Section ───────────────────────────────────────────────────────

function CategorySection({
  category,
  statuses,
  onStatusChange,
  expanded,
  onToggle,
}: {
  category: BiasCategory;
  statuses: Record<string, AuditStatus>;
  onStatusChange: (itemId: string, status: AuditStatus) => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [showPrompt, setShowPrompt] = useState(false);

  const stats = useMemo(() => {
    const total = category.items.length;
    const pass = category.items.filter(i => statuses[i.id] === "pass").length;
    const fail = category.items.filter(i => statuses[i.id] === "fail").length;
    const na = category.items.filter(i => statuses[i.id] === "na").length;
    const pending = total - pass - fail - na;
    return { total, pass, fail, na, pending };
  }, [category, statuses]);

  const statusColor = stats.fail > 0 ? "#DC2626" : stats.pending > 0 ? "#D97706" : "#059669";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <button onClick={onToggle}
        className="w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
        style={{ borderLeftWidth: 4, borderLeftColor: category.color, borderLeftStyle: "solid" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: category.color + "15", color: category.color }}>
          {category.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900">{category.name}</h3>
          <p className="text-xs text-gray-500 truncate">{category.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {stats.fail > 0 && <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-md">{stats.fail} ⚠</span>}
          {stats.pass > 0 && <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">{stats.pass} ✓</span>}
          <span className="text-xs text-gray-400">{stats.pass + stats.fail + stats.na}/{stats.total}</span>
          {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-5 space-y-3">
          {/* Audit items */}
          {category.items.map(item => (
            <AuditItemCard
              key={item.id}
              item={item}
              status={statuses[item.id] || null}
              onStatusChange={(s) => onStatusChange(item.id, s)}
            />
          ))}

          {/* Corrective prompt */}
          {stats.fail > 0 && (
            <div className="mt-4">
              <button onClick={() => setShowPrompt(!showPrompt)}
                className="flex items-center gap-2 text-sm font-semibold transition-colors" style={{ color: category.color }}>
                {showPrompt ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <Sparkles className="w-4 h-4" />
                Prompt correctivo para esta categoría
              </button>
              {showPrompt && (
                <div className="mt-2 rounded-xl p-4" style={{ backgroundColor: category.color + "08", border: `1px solid ${category.color}30` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: category.color }}>
                      Pega este prompt después del contenido con sesgo
                    </span>
                    <CopyButton text={category.correctivePrompt} />
                  </div>
                  <pre className="text-sm text-gray-800 leading-relaxed whitespace-pre-line font-mono">
                    {category.correctivePrompt}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Audit Summary ──────────────────────────────────────────────────────────

function AuditSummary({ statuses }: { statuses: Record<string, AuditStatus> }) {
  const allItems = categories.flatMap(c => c.items);
  const total = allItems.length;
  const pass = allItems.filter(i => statuses[i.id] === "pass").length;
  const fail = allItems.filter(i => statuses[i.id] === "fail").length;
  const na = allItems.filter(i => statuses[i.id] === "na").length;
  const pending = total - pass - fail - na;
  const reviewed = pass + fail + na;

  const criticalFails = allItems.filter(i => statuses[i.id] === "fail" && i.severity === "critical");

  if (reviewed === 0) return null;

  const score = total - na > 0 ? Math.round((pass / (total - na)) * 100) : 0;
  const scoreColor = score >= 80 ? "#059669" : score >= 60 ? "#D97706" : "#DC2626";
  const scoreLabel = score >= 80 ? "Bajo riesgo de sesgo" : score >= 60 ? "Sesgo moderado — corregir" : "Alto riesgo de sesgo";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-5 h-5 text-gray-600" />
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Resumen de Auditoría</h3>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center p-3 bg-emerald-50 rounded-xl">
          <p className="text-2xl font-bold text-emerald-700">{pass}</p>
          <p className="text-[10px] font-bold text-emerald-600 uppercase">Sin sesgo</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-xl">
          <p className="text-2xl font-bold text-red-700">{fail}</p>
          <p className="text-[10px] font-bold text-red-600 uppercase">Con sesgo</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <p className="text-2xl font-bold text-gray-500">{na}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase">N/A</p>
        </div>
        <div className="text-center p-3 bg-amber-50 rounded-xl">
          <p className="text-2xl font-bold text-amber-600">{pending}</p>
          <p className="text-[10px] font-bold text-amber-500 uppercase">Pendiente</p>
        </div>
      </div>

      {/* Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold" style={{ color: scoreColor }}>{scoreLabel}</span>
          <span className="text-xs font-bold tabular-nums" style={{ color: scoreColor }}>{score}%</span>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: scoreColor }} />
        </div>
      </div>

      {/* Critical alerts */}
      {criticalFails.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
              Sesgos críticos detectados ({criticalFails.length})
            </span>
          </div>
          <ul className="space-y-1">
            {criticalFails.map(item => (
              <li key={item.id} className="text-xs text-red-800 leading-relaxed flex items-start gap-1.5">
                <span className="text-red-400 mt-0.5">·</span>
                {item.question}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function BiasAuditKit() {
  const [statuses, setStatuses] = useState<Record<string, AuditStatus>>({});
  const [expandedCat, setExpandedCat] = useState<string | null>("representation");

  const updateStatus = useCallback((itemId: string, status: AuditStatus) => {
    setStatuses(prev => ({ ...prev, [itemId]: status }));
  }, []);

  const resetAll = useCallback(() => {
    setStatuses({});
    setExpandedCat("representation");
  }, []);

  const toggleCat = useCallback((id: string) => {
    setExpandedCat(prev => prev === id ? null : id);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/80 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            Módulo 3 · Herramienta Práctica
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Kit de Auditoría de Sesgo
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Revisa cualquier contenido generado por IA antes de llevarlo al aula.
            Marca cada criterio como ✓ (sin sesgo), ✗ (sesgo detectado) o N/A.
            Si detectas sesgo, copia el prompt correctivo.
          </p>
        </div>

        {/* Quick guide */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
          <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Cómo usar este kit</p>
            <p className="text-xs text-amber-900 leading-relaxed">
              1. Genera contenido con IA como siempre. 2. Antes de usarlo en clase, pasa por cada categoría de esta checklist.
              3. Marca ✓ si no hay problema, ✗ si detectas sesgo, o N/A si no aplica.
              4. Para cada categoría con sesgo, copia el prompt correctivo y pégalo en la IA junto con el contenido a corregir.
            </p>
          </div>
        </div>

        {/* Severity legend */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {Object.entries(severityConfig).map(([key, val]) => (
            <span key={key} className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${val.badge}`}>
              {val.label}
            </span>
          ))}
        </div>

        {/* Summary */}
        <AuditSummary statuses={statuses} />

        {/* Categories */}
        <div className="space-y-4 mt-6">
          {categories.map(cat => (
            <CategorySection
              key={cat.id}
              category={cat}
              statuses={statuses}
              onStatusChange={updateStatus}
              expanded={expandedCat === cat.id}
              onToggle={() => toggleCat(cat.id)}
            />
          ))}
        </div>

        {/* Reset */}
        <div className="flex justify-center mt-6">
          <button onClick={resetAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
            <RotateCcw className="w-4 h-4" />
            Reiniciar auditoría
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-10">
          5 categorías · 19 criterios · Prompts correctivos incluidos · Curso "Prompt Mastery para Docentes"
        </p>
      </div>
    </div>
  );
}
