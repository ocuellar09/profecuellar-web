import { useState, useMemo, useCallback } from "react";
/* eslint-disable react/no-unescaped-entities */

function CrefoExplorer() {
  const [a, setA] = useState("C");
  const els = [
    { l: "C", n: "Contexto", c: "#2563EB", what: "Nivel educativo, asignatura, grupo, marco curricular.", ex: "3º ESO, 28 alumnos, Biología, LOMLOE, 3 NEAE", anti: "(sin contexto)", q: "¿Alguien externo entendería tu aula?" },
    { l: "R", n: "Rol", c: "#7C3AED", what: "Identidad profesional: disciplina + expertise + contexto.", ex: "Experto en didáctica de ciencias con 20 años en secundaria", anti: "Eres un profesor.", q: "¿Incluye disciplina + experiencia + contexto?" },
    { l: "E", n: "Especificidad", c: "#D97706", what: "Verbos de acción + alcance + cantidad + nivel cognitivo.", ex: "Diseña 6 actividades manipulativas, 30 min c/u, niveles Bloom", anti: "Hazme actividades.", q: "¿Verbos precisos? ¿Cantidades y tiempos?" },
    { l: "F", n: "Formato", c: "#059669", what: "Estructura exacta: tabla, lista, narrativa, con columnas definidas.", ex: "Tabla: [Nombre | Duración | Materiales | Pasos | Evaluación]", anti: "(sin formato)", q: "¿Sabría exactamente la estructura de salida?" },
    { l: "O", n: "Objetivos/Restricciones", c: "#DC2626", what: "Lo que DEBE lograr y NO debe contener. Límites éticos, tono.", ex: "NO químicos peligrosos. SÍ adaptación TDAH. Máx 2 páginas.", anti: "(sin restricciones)", q: "¿Al menos 2 SÍ y 2 NO?" },
  ];
  const el = els.find(e => e.l === a);
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "2px solid #e5e7eb", overflow: "hidden" }}>
      <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
        {els.map(e => (
          <button key={e.l} onClick={() => setA(e.l)} style={{ flex: 1, padding: "10px 0", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", color: a === e.l ? "#fff" : "#9ca3af", background: a === e.l ? e.c : "#f9fafb", transition: "all 0.2s" }}>{e.l}</button>
        ))}
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: el.c, color: "#fff", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{el.l}</span>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>{el.l} · {el.n}</h3>
        </div>
        <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 12px 0" }}>{el.what}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          <div style={{ background: "#fef2f2", border: "1px solid #fecdd3", borderRadius: 10, padding: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", margin: "0 0 4px 0" }}>❌ Sin {el.n}</p>
            <p style={{ fontSize: 12, color: "#7f1d1d", fontFamily: "monospace", fontStyle: "italic", margin: 0 }}>{el.anti}</p>
          </div>
          <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 10, padding: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#059669", margin: "0 0 4px 0" }}>✅ Con {el.n}</p>
            <p style={{ fontSize: 12, color: "#064e3b", fontFamily: "monospace", margin: 0 }}>{el.ex}</p>
          </div>
        </div>
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: 10, display: "flex", gap: 6 }}>
          <span>💡</span>
          <p style={{ fontSize: 12, color: "#78350f", margin: 0 }}><strong>Autocheck:</strong> {el.q}</p>
        </div>
      </div>
    </div>
  );
}

function FewShotDemo() {
  const [m, setM] = useState("zero");
  const d = m === "zero"
    ? { p: "Genera 3 preguntas de comprensión lectora sobre un texto narrativo.", o: "1. ¿Cuál es el tema principal?\n2. ¿Qué personajes aparecen?\n3. ¿Cómo termina?", q: "Genérica, nivel bajo (Recordar)" }
    : { p: 'Genera 3 preguntas siguiendo estos ejemplos:\n\nEj 1: "¿Por qué el protagonista no reveló la verdad? Justifica con evidencia."\nNivel: Inferencial (Analizar)\n\nEj 2: "Si cambiaras una decisión del protagonista, ¿cuál y por qué?"\nNivel: Crítica (Evaluar)\n\nAhora genera 3 nuevas:', o: '1. "¿Qué nos revela la metáfora \'el silencio era más pesado que cualquier palabra\'? Cita otra expresión de apoyo."\nNivel: Analizar\n\n2. "¿La reacción de Sara refleja los valores del inicio? Argumenta con 2 evidencias."\nNivel: Evaluar\n\n3. "Si la historia fuera en tu comunidad, ¿qué cambiaría? ¿Por qué?"\nNivel: Crear', q: "Específica, multinivel, con evidencia" };
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "2px solid #e5e7eb", overflow: "hidden" }}>
      <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
        <button onClick={() => setM("zero")} style={{ flex: 1, padding: 10, fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer", background: m === "zero" ? "#111827" : "#f9fafb", color: m === "zero" ? "#fff" : "#6b7280" }}>Zero-shot (sin ejemplos)</button>
        <button onClick={() => setM("few")} style={{ flex: 1, padding: 10, fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer", background: m === "few" ? "#4f46e5" : "#f9fafb", color: m === "few" ? "#fff" : "#6b7280" }}>Few-shot (con ejemplos)</button>
      </div>
      <div style={{ padding: 18 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px 0" }}>Prompt</p>
        <pre style={{ fontSize: 12, color: "#1f2937", lineHeight: 1.6, whiteSpace: "pre-line", fontFamily: "monospace", background: "#f9fafb", borderRadius: 8, padding: 10, border: "1px solid #f3f4f6", maxHeight: 140, overflow: "auto", margin: "0 0 12px 0" }}>{d.p}</pre>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px 0" }}>Resultado</p>
        <pre style={{ fontSize: 12, color: "#1f2937", lineHeight: 1.6, whiteSpace: "pre-line", fontFamily: "monospace", background: "#eff6ff", borderRadius: 8, padding: 10, border: "1px solid #bfdbfe", maxHeight: 160, overflow: "auto", margin: "0 0 8px 0" }}>{d.o}</pre>
        <div style={{ borderRadius: 8, padding: 8, background: m === "zero" ? "#fef2f2" : "#ecfdf5", border: `1px solid ${m === "zero" ? "#fecdd3" : "#a7f3d0"}` }}>
          <p style={{ fontSize: 12, color: m === "zero" ? "#7f1d1d" : "#064e3b", margin: 0 }}>{m === "zero" ? "⚠️" : "✨"} <strong>Calidad:</strong> {d.q}</p>
        </div>
      </div>
    </div>
  );
}

function IterLab() {
  const [s, setS] = useState(0);
  const its = [
    { v: "v1 — Inicial", p: "Hazme una actividad sobre fracciones.", r: "Lista genérica de 10 ejercicios sin contexto.", a: "Sin C, F, O.", ch: "Añadir C + E" },
    { v: "v2 — +C+E", p: "Para 5º Primaria, diseña 5 actividades manipulativas sobre fracciones equivalentes.", r: "5 actividades, pero algunas con materiales caros y sin temporalización.", a: "Tiene C y E. Falta F y O.", ch: "Añadir F + O" },
    { v: "v3 — +F+O", p: "Para 5º Primaria, 5 actividades manipulativas sobre fracciones equivalentes.\nTabla: [Nombre | Duración | Materiales | Pasos | Evaluación]\nMateriales <3€, sin tijeras, máx 20 min.", r: "Tabla organizada, materiales económicos. Falta profundidad pedagógica.", a: "Estructura clara. Falta R.", ch: "Añadir R experto" },
    { v: "v4 — C.R.E.F.O. completo", p: "Actúa como experto en didáctica de mates, modelo CPA.\nContexto: 5º Primaria, 26 alumnos, 2 discalculia.\nDiseña 5 actividades CPA sobre fracciones equivalentes.\nTabla: [Nombre | Fase CPA | Duración | Materiales <3€ | Pasos | Adaptación NEAE | Evaluación]\nSin tijeras. Máx 20 min. Instrucciones legibles por alumno.", r: "Excelente: secuencia CPA, adaptaciones para discalculia, evaluación formativa integrada.", a: "C.R.E.F.O. completo. Cada elemento aporta.", ch: null },
  ];
  const it = its[s];
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "2px solid #e5e7eb", overflow: "hidden" }}>
      <div style={{ padding: "10px 18px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 1 }}>🧪 Lab de Iteración</span>
        <span style={{ fontSize: 11, color: "#9ca3af" }}>Paso {s + 1}/4</span>
      </div>
      <div style={{ padding: 18 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 10px 0" }}>{it.v}</h4>
        <pre style={{ fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-line", fontFamily: "monospace", background: "#f9fafb", borderRadius: 8, padding: 10, border: "1px solid #f3f4f6", margin: "0 0 8px 0" }}>{it.p}</pre>
        <p style={{ fontSize: 12, background: "#eff6ff", borderRadius: 8, padding: 10, border: "1px solid #bfdbfe", color: "#1e3a5f", margin: "0 0 8px 0" }}>{it.r}</p>
        <p style={{ fontSize: 12, background: "#fffbeb", borderRadius: 8, padding: 10, border: "1px solid #fde68a", color: "#78350f", margin: "0 0 8px 0" }}>{it.a}</p>
        {it.ch && <p style={{ fontSize: 12, background: "#f5f3ff", borderRadius: 8, padding: 10, border: "1px solid #ddd6fe", color: "#5b21b6", fontWeight: 500, margin: 0 }}>→ Siguiente: {it.ch}</p>}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
          <button onClick={() => setS(Math.max(0, s - 1))} disabled={s === 0} style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontSize: 13, cursor: s > 0 ? "pointer" : "default", color: s > 0 ? "#374151" : "#d1d5db", background: "none" }}>← Anterior</button>
          <div style={{ display: "flex", gap: 4 }}>
            {its.map((_, i) => <span key={i} style={{ width: 8, height: 8, borderRadius: 99, background: i === s ? "#7c3aed" : i < s ? "#c4b5fd" : "#e5e7eb", cursor: "pointer" }} onClick={() => setS(i)} />)}
          </div>
          <button onClick={() => setS(Math.min(3, s + 1))} disabled={s === 3} style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontSize: 13, cursor: s < 3 ? "pointer" : "default", background: s < 3 ? "#7c3aed" : "#e5e7eb", color: s < 3 ? "#fff" : "#9ca3af" }}>Siguiente →</button>
        </div>
      </div>
    </div>
  );
}

function Checkpoint({ q, opts, correct, expl, done, onDone }) {
  const [sel, setSel] = useState(null);
  const [rev, setRev] = useState(false);
  if (done) return <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 10, padding: 10, margin: "14px 0", display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: "#10b981" }}>✓</span><span style={{ fontSize: 13, color: "#047857", fontWeight: 500 }}>Checkpoint completado</span></div>;
  const check = () => { setRev(true); if (sel === correct) onDone(); };
  return (
    <div style={{ background: "#fffbeb", border: "2px solid #fde68a", borderRadius: 12, padding: 16, margin: "14px 0" }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: "#b45309", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px 0" }}>✓ Checkpoint</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: "0 0 10px 0" }}>{q}</p>
      <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
        {opts.map((o, i) => {
          let bg = "#fff", border = "#e5e7eb";
          if (rev) { if (i === correct) { bg = "#ecfdf5"; border = "#6ee7b7"; } else if (i === sel) { bg = "#fef2f2"; border = "#fca5a5"; } else { bg = "#f9fafb"; } }
          else if (i === sel) { bg = "#fffbeb"; border = "#fbbf24"; }
          return <button key={i} onClick={() => !rev && setSel(i)} disabled={rev} style={{ textAlign: "left", borderRadius: 8, border: `2px solid ${border}`, padding: 10, background: bg, fontSize: 13, cursor: rev ? "default" : "pointer", opacity: rev && i !== correct && i !== sel ? 0.45 : 1 }}>{o}</button>;
        })}
      </div>
      {!rev ? <button onClick={check} disabled={sel === null} style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", fontWeight: 600, fontSize: 13, background: sel !== null ? "#b45309" : "#e5e7eb", color: sel !== null ? "#fff" : "#9ca3af", cursor: sel !== null ? "pointer" : "default" }}>Verificar</button>
      : <div style={{ borderRadius: 8, padding: 10, background: sel === correct ? "#d1fae5" : "#fef3c7", border: `1px solid ${sel === correct ? "#6ee7b7" : "#fcd34d"}` }}><p style={{ fontSize: 13, color: sel === correct ? "#064e3b" : "#78350f", margin: 0, lineHeight: 1.6 }}>{sel === correct ? "✓ " : "✗ "}{expl}</p></div>}
    </div>
  );
}

export default function GuideModule1() {
  const [done, setDone] = useState(new Set());
  const complete = id => setDone(p => new Set([...p, id]));
  const total = 4, completed = done.size, pct = Math.round((completed / total) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "40px 16px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ display: "inline-flex", background: "#d97706", color: "#fff", fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 99, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14 }}>🎯 Módulo 1 · Semanas 2-3</span>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>La Sintaxis de la Maestría</h1>
          <p style={{ color: "#6b7280", maxWidth: 480, margin: "0 auto", lineHeight: 1.6, fontSize: 15 }}>Framework C.R.E.F.O., Zero-shot vs Few-shot, y método de iteración controlada.</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", padding: "12px 18px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Progreso</span>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>{completed}/{total} · {pct}%</span>
          </div>
          <div style={{ height: 6, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#d97706", borderRadius: 99, width: `${pct}%`, transition: "width 0.4s" }} />
          </div>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          {/* CREFO Section */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", borderLeft: "4px solid #D97706", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6" }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>📐 El Framework C.R.E.F.O.</h2>
            </div>
            <div style={{ padding: 20 }}>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 14px 0" }}>
                C.R.E.F.O. es un <strong>checklist mental</strong> — no una plantilla rígida. Puedes escribir los elementos en cualquier orden, pero asegúrate de que todos estén.
              </p>
              <CrefoExplorer />
              <Checkpoint q="'Crea actividades de Lengua para mis alumnos.' ¿Qué le falta?" opts={["Solo Formato","Todos menos Especificidad","Contexto, Rol, Formato y Objetivos (C,R,F,O)","Está completo"]} correct={2} expl="Le faltan 4 de 5: sin Contexto, Rol, Formato ni Restricciones. La Especificidad es débil pero al menos indica una tarea." done={done.has("q1")} onDone={() => complete("q1")} />
            </div>
          </div>

          {/* Techniques */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", borderLeft: "4px solid #4F46E5", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6" }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>⚡ Técnicas Fundamentales</h2>
            </div>
            <div style={{ padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 8px 0" }}>Zero-shot vs. Few-shot</h3>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 14px 0" }}>
                <strong>Zero-shot</strong>: sin ejemplos, para tareas simples. <strong>Few-shot</strong>: con 2-3 ejemplos, para consistencia y formato preciso.
              </p>
              <FewShotDemo />
              <Checkpoint q="Necesitas feedback consistente para 15 trabajos. ¿Qué técnica?" opts={["Zero-shot detallado","Few-shot: 2-3 ejemplos del feedback ideal","Cada feedback en conversación diferente","Que la IA invente su estilo"]} correct={1} expl="Few-shot garantiza CONSISTENCIA. Tus ejemplos 'gold standard' son más efectivos que describir el estilo con palabras." done={done.has("q2")} onDone={() => complete("q2")} />

              <h3 style={{ fontSize: 15, fontWeight: 600, margin: "20px 0 8px 0" }}>Prompt-Test-Iterate</h3>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 14px 0" }}>
                Método científico del prompting: formula, observa, analiza, ajusta <strong>una variable a la vez</strong>.
              </p>
              <IterLab />
              <Checkpoint q="Prompt mediocre. ¿Mejor estrategia?" opts={["Reescribir todo desde cero","Añadir 'hazlo mejor'","Analizar qué falla y ajustar un elemento a la vez","Cambiar de modelo"]} correct={2} expl="Iteración controlada: identifica qué falla, ajusta UN elemento, ejecuta de nuevo. Es el método científico." done={done.has("q3")} onDone={() => complete("q3")} />
            </div>
          </div>

          {/* Bloom */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", borderLeft: "4px solid #059669", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6" }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>🎯 Verbos de Bloom para Prompts</h2>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: "grid", gap: 6 }}>
                {[{ l: "Recordar", c: "#DC2626", v: "Lista, Define, Identifica", p: "'Lista los 5 reinos con un ejemplo'" },
                  { l: "Comprender", c: "#EA580C", v: "Explica, Resume, Clasifica", p: "'Explica fotosíntesis para 10 años'" },
                  { l: "Aplicar", c: "#D97706", v: "Aplica, Calcula, Resuelve", p: "'3 problemas de Pitágoras cotidianos'" },
                  { l: "Analizar", c: "#059669", v: "Compara, Contrasta, Categoriza", p: "'Compara mitosis y meiosis en tabla'" },
                  { l: "Evaluar", c: "#2563EB", v: "Evalúa, Argumenta, Critica", p: "'Evalúa pros/contras de 3 metodologías'" },
                  { l: "Crear", c: "#7C3AED", v: "Diseña, Genera, Propón", p: "'Diseña proyecto mates+arte'" }
                ].map(b => (
                  <div key={b.l} style={{ display: "flex", alignItems: "flex-start", gap: 10, borderRadius: 10, border: "1px solid #e5e7eb", padding: 10 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 6, background: b.c, color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{b.l.slice(0,2).toUpperCase()}</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0 }}>{b.l}</p>
                      <p style={{ fontSize: 11, color: "#6b7280", margin: "1px 0" }}>{b.v}</p>
                      <p style={{ fontSize: 11, color: "#374151", fontFamily: "monospace", background: "#f9fafb", borderRadius: 4, padding: "2px 6px", display: "inline-block", margin: 0 }}>{b.p}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Checkpoint q="Preguntas de pensamiento crítico. ¿Qué verbo?" opts={["'Hazme preguntas'","'Lista preguntas' (Recordar)","'Genera preguntas que evalúen y argumenten con evidencia' (Evaluar)","'Resume preguntas' (Comprender)"]} correct={2} expl="Pensamiento crítico = niveles superiores de Bloom. 'Evaluar y argumentar con evidencia' fuerza preguntas de alto nivel." done={done.has("q4")} onDone={() => complete("q4")} />
            </div>
          </div>
        </div>

        {pct === 100 && (
          <div style={{ marginTop: 24, background: "#ecfdf5", border: "2px solid #86efac", borderRadius: 16, padding: 24, textAlign: "center" }}>
            <p style={{ fontSize: 28, margin: "0 0 8px 0" }}>✨</p>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#064e3b", margin: "0 0 6px 0" }}>¡Módulo 1 completado!</h3>
            <p style={{ fontSize: 13, color: "#047857", margin: 0 }}>Dominas C.R.E.F.O., Zero/Few-shot e iteración. Practica con el Constructor y el Banco de Prompts Rotos.</p>
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 32 }}>Módulo 1 · 3 secciones · 4 checkpoints · Curso "Prompt Mastery para Docentes"</p>
      </div>
    </div>
  );
}
