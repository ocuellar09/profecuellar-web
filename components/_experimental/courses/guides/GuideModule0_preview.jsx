import { useState, useMemo, useCallback } from "react";
/* eslint-disable react/no-unescaped-entities */

function TokenDemo() {
  const [input, setInput] = useState("El profesor explicó la");
  const preds = useMemo(() => {
    if (/matem/i.test(input)) return [["ecuación",28],["fórmula",25],["operación",20],["geometría",15],["álgebra",12]];
    if (/historia/i.test(input)) return [["guerra",26],["revolución",22],["época",20],["civilización",18],["batalla",14]];
    return [["lección",32],["materia",24],["clase",18],["teoría",14],["actividad",12]];
  }, [input]);
  return (
    <div style={{ background: "#111827", borderRadius: 12, padding: 20, color: "#fff" }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: "#facc15", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px 0" }}>⚡ Demo: Predicción de Tokens</p>
      <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 12px 0" }}>Escribe una frase incompleta y observa las probabilidades.</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <input value={input} onChange={e => setInput(e.target.value)} style={{ flex: 1, background: "#1f2937", border: "1px solid #374151", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none" }} />
        <span style={{ color: "#6b7280", fontSize: 18, alignSelf: "center" }}>→</span>
      </div>
      {preds.map(([t, p], i) => (
        <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ width: 80, textAlign: "right", fontSize: 13, fontFamily: "monospace", color: "#34d399" }}>"{t}"</span>
          <div style={{ flex: 1, height: 16, background: "#1f2937", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, width: `${p}%`, background: i === 0 ? "#34d399" : i === 1 ? "#60a5fa" : "#6b7280", opacity: 1 - i * 0.15, transition: "width 0.4s" }} />
          </div>
          <span style={{ fontSize: 11, color: "#9ca3af", fontFamily: "monospace", width: 32, textAlign: "right" }}>{p}%</span>
        </div>
      ))}
      <p style={{ fontSize: 10, color: "#6b7280", fontStyle: "italic", marginTop: 8 }}>* Simulación. Los LLMs reales calculan sobre ~50,000+ tokens.</p>
    </div>
  );
}

function TempDemo() {
  const [t, setT] = useState(0.3);
  const out = t <= 0.3
    ? { l: "Determinista", c: "#3b82f6", r: ["La fotosíntesis es el proceso por el cual las plantas convierten la luz solar en energía química.","La fotosíntesis es el proceso por el cual las plantas convierten la luz solar en energía química.","La fotosíntesis es el proceso por el cual las plantas convierten la luz solar en energía química."], n: "Respuestas idénticas. Ideal para: evaluación, datos factuales." }
    : t <= 0.6
    ? { l: "Equilibrado", c: "#f59e0b", r: ["La fotosíntesis es el proceso mediante el cual los organismos vegetales transforman la energía lumínica en compuestos orgánicos.","Las plantas capturan luz solar y CO₂ para fabricar glucosa y liberar oxígeno.","La fotosíntesis convierte energía solar en alimento, usando agua y CO₂."], n: "Variedad controlada. Ideal para: materiales didácticos." }
    : { l: "Creativo", c: "#ef4444", r: ["¡Las hojas son paneles solares verdes! Absorben rayos y cocinan su propia comida.","La fotosíntesis es como una cocina microscópica: la receta usa luz, agua y aire para hornear azúcar.","Si las plantas tuvieran Instagram: 'Transformo luz en vida. Gratis. Sin enchufes.'"], n: "Muy variado. Puede generar analogías brillantes O errores." };
  return (
    <div style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: "#ea580c", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px 0" }}>🌡️ Demo: Parámetro de Temperatura</p>
      <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 12px 0" }}>Prompt: "Explica la fotosíntesis a un alumno de 6º Primaria."</p>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600 }}>0.0</span>
        <input type="range" min="0" max="1" step="0.1" value={t} onChange={e => setT(+e.target.value)}
          style={{ flex: 1, accentColor: out.c }} />
        <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>1.0</span>
      </div>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: out.c }}>{t.toFixed(1)}</span>
        <span style={{ fontSize: 11, fontWeight: 700, marginLeft: 8, padding: "2px 8px", borderRadius: 6, background: out.c + "18", color: out.c }}>{out.l}</span>
      </div>
      {out.r.map((r, i) => (
        <div key={i} style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 8, padding: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: "#9ca3af", fontFamily: "monospace" }}>Intento {i + 1}:</span>
          <p style={{ fontSize: 13, color: "#1f2937", lineHeight: 1.6, margin: "4px 0 0 0" }}>{r}</p>
        </div>
      ))}
      <p style={{ fontSize: 11, color: "#9ca3af", fontStyle: "italic", margin: "6px 0 0 0" }}>{out.n}</p>
    </div>
  );
}

function Checkpoint({ q, opts, correct, expl, done, onDone }) {
  const [sel, setSel] = useState(null);
  const [rev, setRev] = useState(false);
  if (done) return (
    <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 12, padding: 12, margin: "16px 0", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "#10b981" }}>✓</span>
      <span style={{ fontSize: 13, color: "#047857", fontWeight: 500 }}>Checkpoint completado</span>
    </div>
  );
  const check = () => { setRev(true); if (sel === correct) onDone(); };
  const ok = sel === correct;
  return (
    <div style={{ background: "#eef2ff", border: "2px solid #c7d2fe", borderRadius: 12, padding: 18, margin: "16px 0" }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: "#4f46e5", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px 0" }}>✓ Checkpoint</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: "0 0 10px 0" }}>{q}</p>
      <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
        {opts.map((o, i) => {
          let bg = "#fff", border = "#e5e7eb";
          if (rev) {
            if (i === correct) { bg = "#ecfdf5"; border = "#6ee7b7"; }
            else if (i === sel) { bg = "#fef2f2"; border = "#fca5a5"; }
            else { bg = "#f9fafb"; }
          } else if (i === sel) { bg = "#eef2ff"; border = "#818cf8"; }
          return (
            <button key={i} onClick={() => !rev && setSel(i)} disabled={rev} style={{
              textAlign: "left", borderRadius: 8, border: `2px solid ${border}`, padding: 10, background: bg,
              fontSize: 13, color: "#1f2937", cursor: rev ? "default" : "pointer", transition: "all 0.2s",
              opacity: rev && i !== correct && i !== sel ? 0.45 : 1,
            }}>{o}</button>
          );
        })}
      </div>
      {!rev ? (
        <button onClick={check} disabled={sel === null} style={{
          width: "100%", padding: "10px 0", borderRadius: 10, border: "none", fontWeight: 600, fontSize: 13,
          background: sel !== null ? "#4f46e5" : "#e5e7eb", color: sel !== null ? "#fff" : "#9ca3af",
          cursor: sel !== null ? "pointer" : "default",
        }}>Verificar</button>
      ) : (
        <div style={{ borderRadius: 8, padding: 10, background: ok ? "#d1fae5" : "#fef3c7", border: `1px solid ${ok ? "#6ee7b7" : "#fcd34d"}` }}>
          <p style={{ fontSize: 13, color: ok ? "#064e3b" : "#78350f", lineHeight: 1.6, margin: 0 }}>{ok ? "✓ " : "✗ "}{expl}</p>
        </div>
      )}
    </div>
  );
}

function Section({ title, color, icon, children, checkCount, checkDone }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", borderLeft: `4px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>{title}</h2>
        </div>
        {checkCount > 0 && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8,
            background: checkDone === checkCount ? "#ecfdf5" : "#f3f4f6",
            color: checkDone === checkCount ? "#047857" : "#6b7280",
          }}>{checkDone}/{checkCount} ✓</span>
        )}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

function SubSection({ title, color, children, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div style={{ marginBottom: 6 }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 0",
        background: "none", border: "none", cursor: "pointer", textAlign: "left",
      }}>
        <span style={{ width: 8, height: 8, borderRadius: 99, background: color, flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#111827" }}>{title}</span>
        <span style={{ color: "#9ca3af", fontSize: 12 }}>{open ? "▾" : "▸"}</span>
      </button>
      {open && <div style={{ paddingLeft: 16, paddingBottom: 12 }}>{children}</div>}
    </div>
  );
}

function TrafficLight() {
  const cats = [
    { c: "#DC2626", l: "NUNCA ingresar", bg: "#fef2f2", items: ["Nombre completo del alumno", "Diagnósticos médicos", "Datos de contacto familiar", "Calificaciones con nombre", "Fotos de alumnos"] },
    { c: "#D97706", l: "Con precaución (anonimizar)", bg: "#fffbeb", items: ["Trabajos → sin nombre, usar 'Alumno A'", "Características del grupo → sin datos individuales", "Necesidades educativas → tipo general"] },
    { c: "#059669", l: "Seguro", bg: "#ecfdf5", items: ["Nivel educativo y asignatura", "Marco curricular (LOMLOE)", "Contenidos del temario", "Ejemplos ficticios creados por ti"] },
  ];
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {cats.map(c => (
        <div key={c.l} style={{ background: c.bg, borderRadius: 10, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 99, background: c.c }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: c.c, textTransform: "uppercase", letterSpacing: 1 }}>{c.l}</span>
          </div>
          {c.items.map((it, i) => <p key={i} style={{ fontSize: 13, color: "#374151", margin: "3px 0 3px 16px", lineHeight: 1.5 }}>· {it}</p>)}
        </div>
      ))}
    </div>
  );
}

function BiasAudit() {
  const [rev, setRev] = useState(false);
  const biases = [
    { cat: "Género + Raza", desc: "Médico representado como hombre blanco de mediana edad" },
    { cat: "Cultural", desc: "Entorno: hospital occidental moderno" },
    { cat: "Poder", desc: "Paciente en posición pasiva, sin agencia" },
    { cat: "Representación", desc: "Sin diversidad en personal sanitario" },
  ];
  return (
    <div style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: "#e11d48", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px 0" }}>🔍 Ejercicio: Auditoría de Sesgo</p>
      <div style={{ background: "#f3f4f6", borderRadius: 8, padding: 10, marginBottom: 12, fontFamily: "monospace", fontSize: 13 }}>
        Prompt: "Genera una imagen de un médico atendiendo a un paciente"
      </div>
      {!rev ? (
        <button onClick={() => setRev(true)} style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "none", background: "#e11d48", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Revelar sesgos detectados</button>
      ) : (
        <div style={{ display: "grid", gap: 6 }}>
          {biases.map((b, i) => (
            <div key={i} style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 8, padding: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#e11d48", textTransform: "uppercase" }}>{b.cat}</span>
              <p style={{ fontSize: 13, color: "#1f2937", margin: "2px 0 0 0" }}>{b.desc}</p>
            </div>
          ))}
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: 10, marginTop: 4 }}>
            <p style={{ fontSize: 12, color: "#1e3a5f", lineHeight: 1.6, margin: 0 }}>
              <strong>Prompt mejorado:</strong> "Genera imagen de equipo médico diverso (género, edad, etnia) atendiendo a un paciente que participa activamente."
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GuideModule0() {
  const [done, setDone] = useState(new Set());
  const complete = id => setDone(p => new Set([...p, id]));
  const total = 4, completed = done.size;
  const pct = Math.round((completed / total) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "40px 16px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#111827", color: "#fff", fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 99, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14 }}>📦 Módulo 0 · Semana 1</span>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>Fundamentos Críticos y la "Caja Negra"</h1>
          <p style={{ color: "#6b7280", maxWidth: 480, margin: "0 auto", lineHeight: 1.6, fontSize: 15 }}>
            Desmitifica la tecnología: cómo funciona la IA, qué datos proteger y qué sesgos vigilar.
          </p>
        </div>

        {/* Progress */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", padding: "12px 18px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>Progreso</span>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>{completed}/{total} checkpoints · {pct}%</span>
          </div>
          <div style={{ height: 6, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#4f46e5", borderRadius: 99, width: `${pct}%`, transition: "width 0.4s" }} />
          </div>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          {/* Section 1: LLM Anatomy */}
          <Section title="Anatomía de un Modelo de Lenguaje" color="#4F46E5" icon="🧠" checkCount={2} checkDone={[...done].filter(d => ["q1","q2"].includes(d)).length}>
            <SubSection title="¿Qué es (y qué NO es) un LLM?" color="#4F46E5" defaultOpen>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 12px 0" }}>
                Un LLM es un sistema estadístico que <strong>predice la siguiente palabra más probable</strong>. No "sabe", no "comprende", no "piensa". Calcula probabilidades.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div style={{ background: "#fef2f2", border: "1px solid #fecdd3", borderRadius: 10, padding: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", margin: "0 0 6px 0" }}>❌ NO es</p>
                  <p style={{ fontSize: 12, color: "#7f1d1d", lineHeight: 1.6, margin: 0 }}>· Base de datos verificada<br/>· Buscador de internet<br/>· Ser que comprende<br/>· Fuente fiable de datos</p>
                </div>
                <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 10, padding: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#059669", margin: "0 0 6px 0" }}>✅ SÍ es</p>
                  <p style={{ fontSize: 12, color: "#064e3b", lineHeight: 1.6, margin: 0 }}>· Predictor estadístico<br/>· Herramienta de generación<br/>· Asistente que necesita guía<br/>· Amplificador de tu expertise</p>
                </div>
              </div>
              <Checkpoint q="Cuando ChatGPT responde, ¿qué está haciendo realmente?" opts={["Buscando en base de datos verificada","Calculando la secuencia de palabras más probable","Comprendiendo y aplicando lógica formal","Consultando internet en tiempo real"]} correct={1} expl="Los LLMs predicen el siguiente token más probable. No consultan bases de datos, no navegan internet y no aplican lógica." done={done.has("q1")} onDone={() => complete("q1")} />
            </SubSection>

            <SubSection title="Tokens: La unidad básica" color="#4F46E5">
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 12px 0" }}>
                La IA lee <strong>tokens</strong>, no palabras. "Transformación" se divide en varios tokens. Los modelos tienen un <strong>límite de tokens</strong> por conversación (ventana de contexto).
              </p>
              <TokenDemo />
            </SubSection>

            <SubSection title="Temperatura: Creatividad vs. Precisión" color="#4F46E5">
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 12px 0" }}>
                La <strong>temperatura</strong> controla la variabilidad, no la longitud ni la calidad.
              </p>
              <TempDemo />
              <Checkpoint q="Para generar una rúbrica consistente, ¿qué temperatura?" opts={["Alta (0.8-1.0) para criterios creativos","Baja (0.1-0.3) para resultados replicables","No importa, siempre es igual","Media (0.5) por defecto"]} correct={1} expl="Rúbricas necesitan consistencia. Temperatura baja minimiza aleatoriedad." done={done.has("q2")} onDone={() => complete("q2")} />
            </SubSection>

            <SubSection title="Alucinaciones: Cuando la IA inventa" color="#4F46E5">
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 12px 0" }}>
                Una <strong>alucinación</strong> es información que suena plausible pero es inventada: citas falsas, estadísticas inventadas, autores inexistentes.
              </p>
              <div style={{ background: "#fef2f2", border: "2px solid #fecdd3", borderRadius: 10, padding: 14 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", margin: "0 0 8px 0" }}>⚠️ Ejemplos reales</p>
                {['"García-López et al. (2023) en Revista de Educación..." → Inventado','"La LOMLOE art. 47.3 establece..." → No existe o dice otra cosa','"La fotosíntesis produce el 78% del oxígeno" → Dato falso'].map((e, i) => (
                  <p key={i} style={{ fontSize: 12, color: "#7f1d1d", margin: "4px 0", fontFamily: "monospace" }}>{e}</p>
                ))}
              </div>
            </SubSection>
          </Section>

          {/* Section 2: Privacy */}
          <Section title="Marco Legal, Privacidad y Seguridad" color="#7C3AED" icon="🔒" checkCount={1} checkDone={done.has("q3") ? 1 : 0}>
            <SubSection title="El Semáforo de Datos" color="#7C3AED" defaultOpen>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 12px 0" }}>
                El GDPR clasifica los datos de menores como especialmente protegidos. Los datos de salud tienen la categoría más alta.
              </p>
              <TrafficLight />
              <Checkpoint q="Quieres que la IA ayude con un informe para alumno con dislexia. ¿Forma correcta?" opts={["Pegar el informe psicopedagógico completo","Escribir: 'informe para Pedro García, 3ºB, dislexia mixta'","Escribir: 'informe para alumno de 3º ESO con dificultades de lectoescritura' (sin nombre ni diagnóstico)","No usar IA para informes NEAE"]} correct={2} expl="Describe la necesidad sin datos identificables. Luego personaliza fuera de la plataforma." done={done.has("q3")} onDone={() => complete("q3")} />
            </SubSection>

            <SubSection title="Configuración por plataforma" color="#7C3AED">
              {[{ n: "ChatGPT", s: "Configuración → Controles de datos → Desactivar 'Mejorar el modelo'" },
                { n: "Gemini", s: "Actividad de Gemini → Desactivar 'Actividad en Gemini Apps'" },
                { n: "Claude", s: "Los prompts en la API no se usan para entrenamiento por defecto" }
              ].map(p => (
                <div key={p.n} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, marginBottom: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 4px 0" }}>{p.n}</p>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{p.s}</p>
                </div>
              ))}
            </SubSection>
          </Section>

          {/* Section 3: Bias */}
          <Section title="Sesgo Algorítmico" color="#059669" icon="⚖️" checkCount={1} checkDone={done.has("q4") ? 1 : 0}>
            <SubSection title="¿De dónde viene el sesgo?" color="#059669" defaultOpen>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 12px 0" }}>
                Los LLMs se entrenan con texto de internet: <strong>predominantemente en inglés, occidental y del hemisferio norte</strong>. La IA reproduce y amplifica los sesgos de esos datos.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[{ t: "Cultural", d: "Sobrerrepresenta cultura anglosajona" },{ t: "Género", d: "Asocia profesiones con géneros" },{ t: "Racial", d: "Estereotipa representaciones" },{ t: "Lingüístico", d: "Mejor rendimiento en inglés" }].map(b => (
                  <div key={b.t} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#059669", textTransform: "uppercase", margin: "0 0 4px 0" }}>{b.t}</p>
                    <p style={{ fontSize: 12, color: "#374151", margin: 0 }}>{b.d}</p>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Ejercicio: Audita el sesgo" color="#059669">
              <BiasAudit />
              <Checkpoint q="La IA lista '10 contribuciones a la ciencia' solo con europeos/norteamericanos. ¿Mejor respuesta?" opts={["Aceptar — la IA tiene razón","Rechazar la IA y buscar manualmente","Iterar pidiendo diversidad y usar la comparación como material didáctico","Añadir 2-3 nombres no occidentales a mano"]} correct={2} expl="Corrige el sesgo (iterando), aprovecha como material didáctico (comparando versiones) y modela el proceso de auditoría." done={done.has("q4")} onDone={() => complete("q4")} />
            </SubSection>
          </Section>
        </div>

        {pct === 100 && (
          <div style={{ marginTop: 24, background: "#ecfdf5", border: "2px solid #86efac", borderRadius: 16, padding: 24, textAlign: "center" }}>
            <p style={{ fontSize: 28, margin: "0 0 8px 0" }}>✨</p>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#064e3b", margin: "0 0 6px 0" }}>¡Módulo 0 completado!</h3>
            <p style={{ fontSize: 13, color: "#047857", margin: "0 0 8px 0" }}>Ya tienes las bases para entender la IA, proteger datos y detectar sesgos.</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#064e3b" }}>Siguiente → Módulo 1: Framework C.R.E.F.O.</p>
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 32 }}>Módulo 0 · 3 secciones · 4 checkpoints · Curso "Prompt Mastery para Docentes"</p>
      </div>
    </div>
  );
}
