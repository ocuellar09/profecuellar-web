import { useState, useMemo } from "react";

const fields = [
  { key: "contexto", letter: "C", label: "Contexto", color: "#2563EB", bg: "#eff6ff",
    help: "Define el escenario: nivel educativo, asignatura, marco curricular, grupo.",
    placeholder: "Ej: Clase de 3º ESO, 28 alumnos, Biología, LOMLOE...",
    examples: ["Clase de 4º Primaria, 25 alumnos, Matemáticas, colegio público urbano", "2º Bachillerato, Historia de España, preparación EBAU, 30 alumnos"] },
  { key: "rol", letter: "R", label: "Rol", color: "#7C3AED", bg: "#f5f3ff",
    help: "Asigna identidad a la IA: disciplina + experiencia + contexto.",
    placeholder: "Ej: Actúa como experto en didáctica de ciencias naturales con 20 años de experiencia...",
    examples: ["Actúa como profesor de Lengua especializado en escritura creativa para adolescentes", "Eres un diseñador instruccional experto en DUA"] },
  { key: "especificidad", letter: "E", label: "Especificidad (Tarea)", color: "#D97706", bg: "#fffbeb",
    help: "Verbos de acción precisos: Diseña, Analiza, Genera. Define alcance y cantidad.",
    placeholder: "Ej: Diseña 5 actividades progresivas sobre el ciclo del agua, 15 min cada una...",
    examples: ["Diseña 8 preguntas: 3 literales, 3 inferenciales, 2 críticas", "Crea rúbrica analítica con 4 criterios y 4 niveles de desempeño"] },
  { key: "formato", letter: "F", label: "Formato", color: "#059669", bg: "#ecfdf5",
    help: "Define cómo quieres la salida: tabla, lista, narrativa, JSON, rúbrica...",
    placeholder: "Ej: Tabla con columnas [Actividad | Duración | Materiales | Objetivo]...",
    examples: ["Tabla: [Criterio | Excelente (4) | Bueno (3) | Suficiente (2) | Insuficiente (1)]", "Lista numerada: [Pregunta] — [Respuesta esperada] — [Nivel Bloom]"] },
  { key: "objetivos", letter: "O", label: "Objetivos y Restricciones", color: "#DC2626", bg: "#fef2f2",
    help: "Lo que SÍ debe lograr y lo que NO debe hacer. Límites éticos y de contenido.",
    placeholder: "Ej: NO uses vocabulario universitario. Asegúrate de que sea realizable sin laboratorio...",
    examples: ["NO estereotipos culturales. Representación diversa. Lenguaje inclusivo", "Actividades sin ordenador. Máx. 2 páginas. Cita fuentes verificables"] },
];

const templates = [
  { id: "exam", name: "Examen", emoji: "📝",
    values: { contexto: "Clase de [nivel], asignatura de [asignatura], [nº] alumnos. Unidad sobre [tema].",
      rol: "Actúa como experto en evaluación formativa de [asignatura] con experiencia en pruebas por competencias.",
      especificidad: "Diseña un examen de [duración] min con [nº] preguntas progresivas:\n- [nº] opción múltiple\n- [nº] desarrollo breve\n- [nº] aplicación",
      formato: "Tabla: [Nº | Enunciado | Tipo | Nivel Bloom | Puntuación]\nClave de respuestas al final.",
      objetivos: "Sin lenguaje ambiguo. Evita preguntas trampa. Opciones incorrectas plausibles." } },
  { id: "lesson", name: "Secuencia Didáctica", emoji: "📚",
    values: { contexto: "Clase de [nivel], [nº] alumnos, [asignatura]. Duración: [nº] sesiones de [min] min.",
      rol: "Actúa como diseñador instruccional especializado en metodologías activas y diseño inverso (UbD).",
      especificidad: "Diseña secuencia sobre [tema] con diseño inverso:\n1. 3 objetivos (Bloom: Analizar/Evaluar/Crear)\n2. Evidencias de evaluación por objetivo\n3. Sesiones con actividad principal cada una",
      formato: "Tabla resumen: [Sesión | Objetivo | Actividad | Recursos | Evaluación]\nDesarrollo detallado con temporalización interna.",
      objetivos: "Recursos de centro público. Adaptación NEAE por sesión. No solo exposición." } },
  { id: "rubric", name: "Rúbrica", emoji: "📊",
    values: { contexto: "Para evaluar [tipo de tarea] de [nivel] en [asignatura].",
      rol: "Actúa como experto en evaluación criterial y rúbricas analíticas competenciales.",
      especificidad: "Crea rúbrica analítica:\n- 4 criterios observables\n- 4 niveles: Excelente (4), Bueno (3), Suficiente (2), Insuficiente (1)\n- Descriptores específicos con indicador observable",
      formato: "Tabla: [Criterio | Excelente | Bueno | Suficiente | Insuficiente | Peso %]",
      objetivos: "Verbos observables (identifica, aplica). NO vagos (comprende, sabe). Diferencia clara entre niveles." } },
  { id: "empty", name: "Desde cero", emoji: "✨", values: { contexto: "", rol: "", especificidad: "", formato: "", objetivos: "" } },
];

function calcQuality(v) {
  let score = 0; const fb = [];
  if (v.contexto.length > 20) { score += 20; } else fb.push("Contexto: describe el escenario");
  if (v.rol.length > 15) { score += 20; } else fb.push("Rol: asigna identidad profesional");
  if (v.especificidad.length > 30) { score += 20; if (/\d/.test(v.especificidad)) score += 5; } else fb.push("Especificidad: tarea con verbos de acción");
  if (v.formato.length > 15) { score += 20; } else fb.push("Formato: define la estructura de salida");
  if (v.objetivos.length > 15) { score += 15; } else fb.push("Objetivos: define restricciones");
  return { score: Math.min(score, 100), feedback: fb.slice(0, 3) };
}

function FieldEditor({ f, value, onChange, expanded, onToggle }) {
  const [showEx, setShowEx] = useState(false);
  const filled = value.trim().length > 10;
  return (
    <div style={{ borderRadius: 12, border: `2px solid ${expanded ? f.color + "60" : filled ? "#d1d5db" : "#e5e7eb"}`, overflow: "hidden", transition: "all 0.2s" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: f.color, color: "#fff", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{f.letter}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{f.label}</span>
            {filled && !expanded && <span style={{ color: "#10b981", fontSize: 14 }}>✓</span>}
          </div>
          {!expanded && value && <p style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: "2px 0 0 0" }}>{value}</p>}
        </div>
        <span style={{ color: "#9ca3af", fontSize: 12 }}>{expanded ? "▾" : "▸"}</span>
      </button>
      {expanded && (
        <div style={{ padding: "0 14px 14px", display: "grid", gap: 8 }}>
          <p style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5, margin: 0 }}>{f.help}</p>
          <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={f.placeholder}
            rows={4} style={{ width: "100%", borderRadius: 8, border: `1px solid ${f.color}40`, padding: "10px 12px", fontSize: 13, lineHeight: 1.6, color: "#1f2937", resize: "vertical", outline: "none", fontFamily: "inherit" }} />
          <button onClick={() => setShowEx(!showEx)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, color: f.color, textAlign: "left", display: "flex", alignItems: "center", gap: 4 }}>
            💡 {showEx ? "Ocultar" : "Ver"} ejemplos
          </button>
          {showEx && (
            <div style={{ background: f.bg, borderRadius: 8, padding: 10, display: "grid", gap: 6 }}>
              {f.examples.map((ex, i) => (
                <button key={i} onClick={() => onChange(ex)} style={{ textAlign: "left", fontSize: 12, color: "#374151", padding: 8, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 600, color: f.color }}>Usar → </span>{ex}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CrefoBuilder() {
  const [values, setValues] = useState({ contexto: "", rol: "", especificidad: "", formato: "", objetivos: "" });
  const [expanded, setExpanded] = useState("contexto");
  const [showTpl, setShowTpl] = useState(true);
  const [copied, setCopied] = useState(false);

  const update = (k, v) => setValues(p => ({ ...p, [k]: v }));
  const loadTpl = (t) => { setValues(t.values); setShowTpl(false); setExpanded("contexto"); };
  const reset = () => { setValues({ contexto: "", rol: "", especificidad: "", formato: "", objetivos: "" }); setExpanded("contexto"); setShowTpl(true); };

  const prompt = useMemo(() => {
    const p = [];
    if (values.rol.trim()) p.push(values.rol.trim());
    if (values.contexto.trim()) p.push(`\nContexto: ${values.contexto.trim()}`);
    if (values.especificidad.trim()) p.push(`\nTarea: ${values.especificidad.trim()}`);
    if (values.formato.trim()) p.push(`\nFormato de salida: ${values.formato.trim()}`);
    if (values.objetivos.trim()) p.push(`\nRestricciones: ${values.objetivos.trim()}`);
    return p.join("\n");
  }, [values]);

  const quality = useMemo(() => calcQuality(values), [values]);
  const filled = fields.filter(f => values[f.key].trim().length > 10).length;

  const barColor = quality.score >= 80 ? "#059669" : quality.score >= 60 ? "#2563EB" : quality.score >= 40 ? "#D97706" : "#DC2626";
  const barLabel = quality.score >= 80 ? "Excelente" : quality.score >= 60 ? "Bueno" : quality.score >= 40 ? "Mejorable" : "Incompleto";

  const doCopy = () => { navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 2500); };

  const tips = [
    "Empieza eligiendo una plantilla o escribe directamente en cada sección.",
    "Un prompt con 1 sección producirá resultados genéricos. Completa al menos C, E y F.",
    "Añade el Formato para controlar exactamente cómo quieres la salida.",
    "Ya tienes un prompt funcional. Las Restricciones (O) marcan la diferencia.",
    "Casi completo. Revisa que los verbos sean precisos y el Formato explícito.",
    "¡Prompt completo! Cópialo, pruébalo en tu LLM, y documenta el resultado.",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "40px 16px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#111827", color: "#fff", fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 99, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14 }}>
            🪄 Módulo 1 · Herramienta Práctica
          </span>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>Constructor C.R.E.F.O.</h1>
          <p style={{ color: "#6b7280", maxWidth: 480, margin: "0 auto", lineHeight: 1.6, fontSize: 15 }}>
            Construye prompts paso a paso. Completa cada sección y obtén un prompt listo para copiar.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20, alignItems: "start" }}>
          {/* Left */}
          <div style={{ display: "grid", gap: 14 }}>
            {showTpl && (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px 0" }}>📖 Empieza con una plantilla</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {templates.map(t => (
                    <button key={t.id} onClick={() => loadTpl(t)} style={{ textAlign: "left", borderRadius: 10, border: "2px solid #e5e7eb", padding: 12, background: "#fff", cursor: "pointer", transition: "all 0.2s" }}>
                      <span style={{ fontSize: 18, display: "block", marginBottom: 4 }}>{t.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quality */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "12px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>Calidad del prompt</span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{filled}/5</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 6, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 99, background: barColor, width: `${quality.score}%`, transition: "all 0.4s" }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: barColor }}>{quality.score}% {barLabel}</span>
              </div>
              {quality.feedback.length > 0 && (
                <div style={{ marginTop: 8, display: "grid", gap: 2 }}>
                  {quality.feedback.map((f, i) => <p key={i} style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>ℹ️ {f}</p>)}
                </div>
              )}
            </div>

            {/* Fields */}
            <div style={{ display: "grid", gap: 8 }}>
              {fields.map(f => (
                <FieldEditor key={f.key} f={f} value={values[f.key]} onChange={v => update(f.key, v)}
                  expanded={expanded === f.key} onToggle={() => setExpanded(expanded === f.key ? null : f.key)} />
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={reset} style={{ padding: "10px 16px", borderRadius: 10, border: "2px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#4b5563" }}>🔄 Limpiar</button>
              {!showTpl && <button onClick={() => setShowTpl(true)} style={{ padding: "10px 16px", borderRadius: 10, border: "2px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#4b5563" }}>📖 Plantillas</button>}
            </div>
          </div>

          {/* Right: Preview */}
          <div style={{ position: "sticky", top: 20 }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <div style={{ padding: "12px 18px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>✨</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>Prompt generado</span>
              </div>
              <div style={{ padding: 18 }}>
                {prompt.trim() ? (
                  <>
                    <pre style={{ fontSize: 13, color: "#1f2937", lineHeight: 1.7, whiteSpace: "pre-line", fontFamily: "monospace", background: "#f9fafb", borderRadius: 10, padding: 14, border: "1px solid #e5e7eb", maxHeight: "50vh", overflow: "auto", margin: 0 }}>{prompt}</pre>
                    <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>{prompt.split(/\s+/).length} palabras</span>
                      <button onClick={doCopy} style={{
                        padding: "8px 16px", borderRadius: 10, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer",
                        background: copied ? "#dcfce7" : "#111827", color: copied ? "#047857" : "#fff", transition: "all 0.2s",
                      }}>{copied ? "✓ ¡Copiado!" : "📋 Copiar prompt"}</button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <p style={{ fontSize: 36, marginBottom: 8 }}>🪄</p>
                    <p style={{ fontSize: 13, color: "#9ca3af" }}>Completa las secciones para<br/>generar tu prompt aquí</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: 14, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 16, padding: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px 0" }}>💡 Consejo</p>
              <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.6, margin: 0 }}>{tips[filled]}</p>
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 32 }}>Framework C.R.E.F.O. · Curso &quot;Prompt Mastery para Docentes&quot;</p>
      </div>
    </div>
  );
}
