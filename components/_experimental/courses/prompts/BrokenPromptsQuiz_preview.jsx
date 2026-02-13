import { useState, useCallback } from "react";

const crefoColors = {
  contexto: { bg: "#eff6ff", text: "#1d4ed8", label: "C · Contexto" },
  rol: { bg: "#f5f3ff", text: "#6d28d9", label: "R · Rol" },
  especificidad: { bg: "#fffbeb", text: "#b45309", label: "E · Especificidad" },
  formato: { bg: "#ecfdf5", text: "#047857", label: "F · Formato" },
  objetivos: { bg: "#fff1f2", text: "#be123c", label: "O · Objetivos" },
};

const diffCfg = {
  basico: { label: "● ○ ○ Básico", color: "#047857", bg: "#ecfdf5" },
  intermedio: { label: "● ● ○ Intermedio", color: "#b45309", bg: "#fffbeb" },
  avanzado: { label: "● ● ● Avanzado", color: "#be123c", bg: "#fff1f2" },
};

const prompts = [
  {
    id: "p1", difficulty: "basico", area: "Planificación",
    brokenPrompt: "Hazme un examen de matemáticas.",
    correctDiagnoses: ["d1", "d2", "d3"],
    allDiagnoses: [
      { id: "d1", category: "contexto", label: "Falta nivel educativo", description: "No especifica para qué curso, edad o nivel de competencia." },
      { id: "d2", category: "especificidad", label: "Verbo vago e impreciso", description: "'Hazme' no indica tipo de examen, temas ni estándares." },
      { id: "d3", category: "formato", label: "Sin formato de salida", description: "No indica opción múltiple, desarrollo, tabla, etc." },
      { id: "d4", category: "rol", label: "Tono demasiado informal", description: "El tono no afecta la calidad del resultado en este caso." },
    ],
    explanation: "El prompt 'página en blanco' clásico. Sin contexto (¿2º de Primaria o Bachillerato?), sin especificidad (¿álgebra, geometría?) y sin formato (¿opción múltiple o problemas abiertos?), la IA devolverá algo genérico e inútil.",
    fixedPrompt: "Actúa como un profesor de matemáticas de 3º de ESO. Diseña un examen de 45 minutos sobre ecuaciones de segundo grado:\n- 10 preguntas en dificultad progresiva\n- 4 de opción múltiple + 6 de resolución con procedimiento\n- Formato: tabla [Nº | Enunciado | Tipo | Puntuación]\n- Incluye clave de respuestas al final",
    tip: "Si tu prompt cabe en un tuit, probablemente le falta información. Un buen prompt de planificación tiene entre 80-150 palabras.",
  },
  {
    id: "p2", difficulty: "basico", area: "Evaluación",
    brokenPrompt: "Corrige este trabajo de mi alumno Juan García Pérez, que tiene TDAH y está en el programa de diversificación. Aquí está su redacción: [texto]",
    correctDiagnoses: ["d1", "d3"],
    allDiagnoses: [
      { id: "d1", category: "objetivos", label: "Violación de privacidad (PII)", description: "Incluye nombre completo real y diagnóstico médico — datos sensibles protegidos por GDPR." },
      { id: "d2", category: "especificidad", label: "Falta criterio de evaluación", description: "No especifica rúbrica, aunque no es el problema más grave." },
      { id: "d3", category: "objetivos", label: "Sin restricción de uso de datos", description: "No indica que la IA no debe almacenar estos datos." },
      { id: "d4", category: "contexto", label: "Falta el nivel de exigencia", description: "No queda claro qué estándar aplicar." },
    ],
    explanation: "⚠️ ALERTA DE PRIVACIDAD. Contiene datos personales de un menor: nombre completo y diagnóstico médico. Bajo el GDPR, esto es categoría especial. NUNCA incluir datos reales de alumnos en prompts.",
    fixedPrompt: "Actúa como especialista en evaluación formativa de Lengua.\nRevisa esta redacción de un alumno de 3º ESO (diversificación):\n- Criterios: coherencia, ortografía, riqueza léxica\n- Feedback: 2 fortalezas + 2 mejoras + 1 siguiente paso\n- Tono: Motivador. NO calificación numérica.\n[Texto anonimizado]",
    tip: "Antes de pegar datos en la IA, pregúntate: '¿Podría identificar a un alumno con esta información?' Si sí, anonimiza.",
  },
  {
    id: "p3", difficulty: "intermedio", area: "Diferenciación",
    brokenPrompt: "Adapta este texto sobre el sistema solar para un alumno con necesidades especiales:\n\n[Texto de 500 palabras sobre planetas]",
    correctDiagnoses: ["d1", "d2", "d3"],
    allDiagnoses: [
      { id: "d1", category: "contexto", label: "'Necesidades especiales' es genérico", description: "¿TEA? ¿TDAH? ¿Dislexia? Cada necesidad requiere adaptaciones completamente diferentes." },
      { id: "d2", category: "especificidad", label: "'Adapta' sin criterios", description: "No indica si simplificar vocabulario, acortar, añadir apoyos visuales..." },
      { id: "d3", category: "formato", label: "Sin nivel de lectura objetivo", description: "No define a qué nivel debe llegar el texto adaptado." },
      { id: "d4", category: "objetivos", label: "Asume una sola adaptación sirve", description: "El problema principal es de especificidad, no restricciones." },
    ],
    explanation: "Error conceptual: tratar 'necesidades especiales' como categoría homogénea. Un alumno con TEA necesita literalidad; uno con TDAH necesita textos cortos con puntos de enganche; uno con dislexia necesita tipografía específica. 'Adapta' sin criterios es como decirle a un médico 'cúrale' sin decir qué tiene.",
    fixedPrompt: "Adapta este texto para alumno de 5º Primaria con TDAH, nivel de lectura A2:\n1. Secciones de máx. 3 frases con subtítulos-pregunta\n2. Vocabulario A2. Términos técnicos entre paréntesis\n3. Un dato curioso 🌟 cada 2 párrafos\n4. [corchetes] donde insertar imágenes\nMáx. 300 palabras. Formato Markdown con emojis.",
    tip: "En diferenciación, la especificidad es inclusión. Cuanto más precisa la descripción de la necesidad, más útil la adaptación.",
  },
  {
    id: "p4", difficulty: "intermedio", area: "Evaluación",
    brokenPrompt: "Eres un profesor muy estricto y exigente. Evalúa estos 5 trabajos y ponles nota del 1 al 10. Sé duro, no regales notas.\n\n[Trabajos de 5 alumnos]",
    correctDiagnoses: ["d1", "d2", "d3"],
    allDiagnoses: [
      { id: "d1", category: "rol", label: "Rol contraproducente", description: "Pedir 'estricta' y 'dura' sesga la evaluación hacia penalización, no valoración justa." },
      { id: "d2", category: "objetivos", label: "Sin rúbrica ni criterios", description: "La IA inventará sus propios estándares — arbitrarios y no replicables." },
      { id: "d3", category: "especificidad", label: "Nota sin cualificación", description: "Un número 1-10 sin descriptores no da información útil para aprender." },
      { id: "d4", category: "formato", label: "Falta formato de feedback", description: "Relacionado, pero el problema principal es la ausencia de criterios." },
    ],
    explanation: "Tres niveles de problema. ROL: 'estricto' introduce sesgo de severidad artificial. OBJETIVOS: sin rúbrica, cada trabajo se evalúa con criterios inventados. ESPECIFICIDAD: una nota sin cualificación es la evaluación menos informativa que existe.",
    fixedPrompt: "Actúa como evaluador formativo de escritura académica.\nAnaliza el trabajo usando esta rúbrica:\n| Criterio | Excelente (4) | Bueno (3) | Suficiente (2) | Insuficiente (1) |\n[rúbrica detallada]\nGenera: puntuación por criterio + 1 fortaleza + 1 mejora + nota orientativa.\nTono: Profesional y constructivo.",
    tip: "Nunca dejes que la IA evalúe sin rúbrica. Sin criterios explícitos, la IA inventa los suyos — y no serán los tuyos.",
  },
  {
    id: "p5", difficulty: "intermedio", area: "Planificación",
    brokenPrompt: "Crea una unidad didáctica completa sobre la Guerra Civil Española para Bachillerato. Incluye todos los contenidos, actividades, evaluación, temporalización, competencias clave, criterios, estándares, materiales, adaptaciones NEAE y recursos TIC. Que sea innovadora.",
    correctDiagnoses: ["d2", "d3"],
    allDiagnoses: [
      { id: "d1", category: "contexto", label: "Falta marco curricular específico", description: "No especifica 1º o 2º de Bachillerato ni comunidad autónoma." },
      { id: "d2", category: "especificidad", label: "Sobrecarga de requisitos", description: "10+ elementos complejos en una sola instrucción. La IA producirá todo superficialmente." },
      { id: "d3", category: "objetivos", label: "Sin restricciones de alcance", description: "No limita extensión ni enfoque. 'Todos los contenidos' de la Guerra Civil podría ser un libro." },
      { id: "d4", category: "formato", label: "Sin formato definido", description: "Contribuye a la ambigüedad pero no es el error principal." },
    ],
    explanation: "'Sobrecarga cognitiva del prompt'. Al pedir todo de golpe, la IA cubrirá todo superficialmente. La solución: PROMPT CHAINING — dividir en 3-4 prompts encadenados donde la salida de uno alimenta al siguiente.",
    fixedPrompt: "Se resuelve con ENCADENAMIENTO:\nP1: Marco y objetivos (3 objetivos Bloom + temporalización)\nP2: Secuencia de sesiones (usa salida del P1)\nP3: Evaluación alineada con P1\nP4: Adaptaciones para TDAH y altas capacidades",
    tip: "Si tu prompt tiene más de 3 elementos complejos, divídelo en cadena. Un prompt = un objetivo cognitivo principal.",
  },
  {
    id: "p6", difficulty: "avanzado", area: "Recursos",
    brokenPrompt: "Crea un cuento infantil sobre una niña latina que vive en un barrio pobre y aprende el valor del esfuerzo para salir de la pobreza gracias a la educación.",
    correctDiagnoses: ["d1", "d3"],
    allDiagnoses: [
      { id: "d1", category: "objetivos", label: "Estereotipo cultural implícito", description: "Asocia 'latina' con 'barrio pobre' y reduce la narrativa a meritocracia individual." },
      { id: "d2", category: "contexto", label: "Falta edad del público", description: "No especifica para qué edad, pero no es el problema más grave." },
      { id: "d3", category: "objetivos", label: "Narrativa condescendiente", description: "El marco 'salir de la pobreza con esfuerzo' puede ser dañino para alumnos en esa situación." },
      { id: "d4", category: "formato", label: "Sin extensión ni estructura", description: "Secundario frente al problema ético." },
    ],
    explanation: "Técnicamente funcional, éticamente problemático. Dos sesgos graves: 1) Asociar 'latina' con 'pobreza' es un estereotipo. 2) 'Salir de la pobreza con esfuerzo' ignora barreras estructurales y puede ser microagresivo en un aula diversa.",
    fixedPrompt: "Escribe cuento (400 palabras, 8-9 años) sobre Valentina, que vive en Bogotá:\n- Resuelve un problema comunitario con creatividad y apoyo de su red\n- Entorno con riqueza cultural (no como carencia)\n- Sin narrativas de 'salvación individual'\n- Incluir elemento cultural como fortaleza\nNO usar estereotipos de pobreza ni condescendencia.",
    tip: "Antes de describir un personaje de otra cultura, pregúntate: '¿Describiría así a alguien de mi propia cultura?' Si no, revisa los estereotipos.",
  },
  {
    id: "p7", difficulty: "avanzado", area: "Ética",
    brokenPrompt: "Crea un sistema de detección de plagio con IA para mi instituto. Que analice todos los trabajos, los compare con bases de datos de ChatGPT y me avise automáticamente si alguien copió. Incluye protocolo de sanción escalonada.",
    correctDiagnoses: ["d1", "d2", "d3"],
    allDiagnoses: [
      { id: "d1", category: "objetivos", label: "Enfoque punitivo contraproducente", description: "Sistema de vigilancia en lugar de sistema de aprendizaje." },
      { id: "d2", category: "objetivos", label: "Asume fiabilidad de detectores", description: "Tasas de error del 10-30%. Sanción automática basada en herramientas poco fiables = falsos positivos injustos." },
      { id: "d3", category: "contexto", label: "Ignora el marco legal", description: "Analizar todos los trabajos automáticamente plantea cuestiones de GDPR y proporcionalidad." },
      { id: "d4", category: "formato", label: "Sin estructura del protocolo", description: "No define fases, pero es el menor de los problemas." },
    ],
    explanation: "Concepción errónea de integridad académica: la 'guerra armamentista'. Los detectores NO son fiables, la vigilancia crea desconfianza, y la sanción automática viola principios pedagógicos y legales. No aborda la causa raíz: ¿las tareas son 'a prueba de IA'? El enfoque correcto: de la DETECCIÓN a la DECLARACIÓN.",
    fixedPrompt: "Diseña un 'Marco de Integridad Académica en la Era de la IA':\n1. Semáforo de IA: 🟢 permitido / 🟡 con declaración / 🔴 no permitido (3 ejemplos cada uno)\n2. 5 estrategias de tareas 'IA-resilientes'\n3. Protocolo de CONVERSACIÓN (no sanción) ante sospecha\n4. 3 talleres para que docentes entiendan limitaciones de detectores\nObjetivo: cultura de honestidad, no de vigilancia.",
    tip: "El enfoque más efectivo no es detectar mejor, sino diseñar tareas donde declarar el uso de IA sea más fácil que ocultarlo.",
  },
];

function DiagChip({ d, selected, correct, revealed, onClick }) {
  const cat = crefoColors[d.category];
  let border = "#e5e7eb", bg = "#fff", ring = "none";
  if (revealed) {
    if (correct && selected) { border = "#6ee7b7"; bg = "#ecfdf5"; ring = "2px solid #10b981"; }
    else if (correct && !selected) { border = "#fcd34d"; bg = "#fffbeb"; ring = "2px solid #f59e0b"; }
    else if (!correct && selected) { border = "#fca5a5"; bg = "#fef2f2"; ring = "2px solid #ef4444"; }
    else { bg = "#f9fafb"; }
  } else if (selected) { border = "#374151"; bg = "#f9fafb"; ring = "2px solid #111827"; }

  return (
    <button onClick={onClick} disabled={revealed} style={{
      width: "100%", textAlign: "left", borderRadius: 12, border: `2px solid ${border}`,
      padding: 14, background: bg, cursor: revealed ? "default" : "pointer",
      transition: "all 0.2s", outline: ring, outlineOffset: -2,
      opacity: revealed && !correct && !selected ? 0.45 : 1,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, padding: "2px 8px", borderRadius: 6, background: cat.bg, color: cat.text }}>{cat.label}</span>
            {revealed && correct && selected && <span style={{ color: "#10b981" }}>✓</span>}
            {revealed && correct && !selected && <span style={{ color: "#f59e0b" }}>⚠</span>}
            {revealed && !correct && selected && <span style={{ color: "#ef4444" }}>✗</span>}
          </div>
          <p style={{ fontWeight: 600, color: "#111827", fontSize: 14, margin: "0 0 2px 0" }}>{d.label}</p>
          <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5, margin: 0 }}>{d.description}</p>
        </div>
        {!revealed && (
          <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${selected ? "#111827" : "#d1d5db"}`, background: selected ? "#111827" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
            {selected && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
          </div>
        )}
      </div>
    </button>
  );
}

function Card({ prompt, index, onScore }) {
  const [sel, setSel] = useState(new Set());
  const [revealed, setRevealed] = useState(false);
  const [showFix, setShowFix] = useState(false);
  const d = diffCfg[prompt.difficulty];

  const toggle = (id) => {
    if (revealed) return;
    setSel((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const reveal = () => {
    setRevealed(true);
    const cs = new Set(prompt.correctDiagnoses);
    const hits = [...sel].filter(i => cs.has(i)).length;
    const misses = [...sel].filter(i => !cs.has(i)).length;
    onScore(prompt.id, hits === prompt.correctDiagnoses.length && misses === 0);
  };

  const hits = revealed ? [...sel].filter(i => new Set(prompt.correctDiagnoses).has(i)).length : 0;
  const misses = revealed ? [...sel].filter(i => !new Set(prompt.correctDiagnoses).has(i)).length : 0;

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <div style={{ padding: "14px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af" }}>#{index + 1}</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 8, background: d.bg, color: d.color }}>{d.label}</span>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>{prompt.area}</span>
        </div>
        {revealed && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 8,
            background: hits === prompt.correctDiagnoses.length && misses === 0 ? "#ecfdf5" : hits > 0 ? "#fffbeb" : "#fef2f2",
            color: hits === prompt.correctDiagnoses.length && misses === 0 ? "#047857" : hits > 0 ? "#b45309" : "#be123c",
          }}>{hits}/{prompt.correctDiagnoses.length} correctas{misses > 0 ? ` · ${misses} falsa${misses > 1 ? 's' : ''}` : ''}</span>
        )}
      </div>

      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>🐛 Prompt con problemas</p>
          <div style={{ background: "#fef2f2", border: "2px dashed #fca5a5", borderRadius: 12, padding: 16 }}>
            <p style={{ fontFamily: "monospace", fontSize: 14, lineHeight: 1.7, color: "#1f2937", margin: 0, whiteSpace: "pre-line" }}>{prompt.brokenPrompt}</p>
          </div>
        </div>

        <p style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>🩺 Tu diagnóstico — selecciona los problemas</p>
        <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
          {prompt.allDiagnoses.map(diag => (
            <DiagChip key={diag.id} d={diag} selected={sel.has(diag.id)} correct={prompt.correctDiagnoses.includes(diag.id)} revealed={revealed} onClick={() => toggle(diag.id)} />
          ))}
        </div>

        {!revealed && (
          <button onClick={reveal} disabled={sel.size === 0} style={{
            width: "100%", padding: "12px 0", borderRadius: 12, border: "none", fontWeight: 600, fontSize: 14, cursor: sel.size > 0 ? "pointer" : "default",
            background: sel.size > 0 ? "#111827" : "#f3f4f6", color: sel.size > 0 ? "#fff" : "#9ca3af", transition: "all 0.2s",
          }}>👁 Verificar diagnóstico</button>
        )}

        {revealed && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #f3f4f6" }}>
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 6px 0" }}>📖 Análisis</p>
              <p style={{ fontSize: 13, color: "#1e3a5f", lineHeight: 1.7, margin: 0 }}>{prompt.explanation}</p>
            </div>

            <button onClick={() => setShowFix(!showFix)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#047857", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
              {showFix ? "▾" : "▸"} ✨ Ver prompt corregido
            </button>
            {showFix && (
              <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 12, padding: 16, marginBottom: 14 }}>
                <pre style={{ fontSize: 13, color: "#064e3b", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line", fontFamily: "monospace" }}>{prompt.fixedPrompt}</pre>
              </div>
            )}

            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 16, display: "flex", gap: 10 }}>
              <span>💡</span>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px 0" }}>Consejo clave</p>
                <p style={{ fontSize: 13, color: "#78350f", lineHeight: 1.6, margin: 0 }}>{prompt.tip}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrokenPromptsQuiz() {
  const [scores, setScores] = useState({});
  const [filter, setFilter] = useState("all");

  const handleScore = useCallback((id, ok) => setScores(p => ({ ...p, [id]: ok })), []);

  const filtered = filter === "all" ? prompts : prompts.filter(p => p.difficulty === filter);
  const answered = Object.keys(scores).length;
  const perfect = Object.values(scores).filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "40px 16px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#111827", color: "#fff", fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 99, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14 }}>
            🐛 Módulo 1 · Laboratorio Diagnóstico
          </span>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>Banco de Prompts Rotos</h1>
          <p style={{ color: "#6b7280", maxWidth: 500, margin: "0 auto", lineHeight: 1.6, fontSize: 15 }}>
            Cada prompt tiene problemas. Diagnostica qué falla usando el framework C.R.E.F.O.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
          {Object.entries(crefoColors).map(([k, v]) => (
            <span key={k} style={{ fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 8, background: v.bg, color: v.text }}>{v.label}</span>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          {answered > 0 && <span style={{ fontSize: 13, color: "#6b7280" }}>🏅 <strong style={{ color: "#111827" }}>{perfect}</strong>/{answered} perfectos</span>}
          <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
            {[["all", "Todos"], ["basico", "Básico"], ["intermedio", "Intermedio"], ["avanzado", "Avanzado"]].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)} style={{
                fontSize: 12, fontWeight: 500, padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                background: filter === k ? "#111827" : "#f3f4f6", color: filter === k ? "#fff" : "#4b5563",
              }}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          {filtered.map((p) => <Card key={p.id} prompt={p} index={prompts.indexOf(p)} onScore={handleScore} />)}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 36 }}>
          7 prompts diagnósticos · Framework C.R.E.F.O. · Curso &quot;Prompt Mastery para Docentes&quot;
        </p>
      </div>
    </div>
  );
}
