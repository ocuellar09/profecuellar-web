import { useState, useCallback } from "react";

const quizModules = {
  module0: {
    id: "module0", title: "Módulo 0", subtitle: "Fundamentos Críticos y la Caja Negra",
    description: "Verifica tu comprensión: cómo funcionan los LLMs, privacidad, sesgo y marco legal.",
    accentColor: "#4F46E5", passingScore: 70,
    questions: [
      {
        id: "m0q1", type: "single",
        question: "¿Qué hace realmente un LLM cuando genera texto?",
        options: [
          { id: "a", text: "Busca la respuesta correcta en una base de datos verificada" },
          { id: "b", text: "Predice la probabilidad del siguiente token (palabra) en una secuencia" },
          { id: "c", text: "Comprende el significado profundo y razona lógicamente" },
          { id: "d", text: "Copia fragmentos de textos memorizados" },
        ],
        correctId: "b",
        explanation: "Los LLMs son modelos estadísticos de predicción de tokens. No 'saben' ni 'comprenden' — calculan probabilidades. Cuando la IA dice algo incorrecto con confianza, es porque la secuencia más probable no coincide con la realidad.",
        tip: "Cuando un alumno diga 'la IA dice que...', corrige a 'la IA predice que...'.",
      },
      {
        id: "m0q2", type: "truefalse",
        question: "El parámetro de 'temperatura' controla qué tan largas son las respuestas.",
        correctAnswer: false,
        explanation: "La temperatura controla la aleatoriedad/creatividad, NO la longitud. Baja (0-0.3) = determinista. Alta (0.7-1.0) = creativa. La longitud se controla con 'tokens máximos'.",
        tip: "Para evaluación: temperatura baja. Para lluvia de ideas: temperatura alta.",
      },
      {
        id: "m0q3", type: "multiple",
        question: "¿Cuáles de estos datos NUNCA deben incluirse en un prompt?",
        options: [
          { id: "a", text: "Nombre completo de alumno + diagnóstico psicopedagógico" },
          { id: "b", text: "El nivel educativo y asignatura que impartes" },
          { id: "c", text: "Calificaciones individuales de un alumno identificable" },
          { id: "d", text: "Ejemplo anónimo de trabajo de alumno" },
          { id: "e", text: "Situación socioeconómica familiar con nombre del alumno" },
        ],
        correctIds: ["a", "c", "e"],
        hint: "Selecciona todos los que apliquen (3 correctas)",
        explanation: "Bajo el GDPR, datos que identifican a un menor — combinados con salud o situación socioeconómica — son categoría especial. El nivel educativo y ejemplos anonimizados son seguros.",
      },
      {
        id: "m0q4", type: "single",
        question: "La IA genera la imagen de un 'científico importante' como hombre blanco con bata. ¿Qué concepto explica esto?",
        options: [
          { id: "a", text: "Alucinación" },
          { id: "b", text: "Sesgo algorítmico" },
          { id: "c", text: "Error de temperatura" },
          { id: "d", text: "Ventana de contexto insuficiente" },
        ],
        correctId: "b",
        explanation: "El sesgo algorítmico ocurre cuando los datos de entrenamiento sobrerrepresentan ciertos perfiles. La IA refleja patrones estadísticos de sus datos, no toma decisiones conscientes.",
        tip: "Audita siempre la representación: ¿quién aparece? ¿quién falta?",
      },
      {
        id: "m0q5", type: "ordering",
        question: "Ordena los pasos para introducir una herramienta de IA en tu aula:",
        items: [
          { id: "a", text: "Verificar cumplimiento GDPR/COPPA" },
          { id: "b", text: "Comunicar a las familias" },
          { id: "c", text: "Consultar política institucional del centro" },
          { id: "d", text: "Probar la herramienta personalmente" },
          { id: "e", text: "Implementar con normas claras" },
        ],
        correctOrder: ["c", "a", "d", "b", "e"],
        explanation: "Primero: política del centro (C), luego privacidad (A), prueba personal (D), comunicación a familias (B), implementación (E). Muchos docentes saltan directamente a implementar.",
        tip: "Antes de entusiasmarte con una herramienta, haz el 'checklist de vetting': ¿cumple GDPR? ¿el centro la aprobó?",
      },
    ],
  },
  module1: {
    id: "module1", title: "Módulo 1", subtitle: "Ingeniería Básica — Framework C.R.E.F.O.",
    description: "Comprueba tu dominio del framework C.R.E.F.O. y las técnicas Zero-shot vs Few-shot.",
    accentColor: "#D97706", passingScore: 70,
    questions: [
      {
        id: "m1q1", type: "single",
        question: "En el framework C.R.E.F.O., ¿qué representa la 'R'?",
        options: [
          { id: "a", text: "Resultado — el output esperado" },
          { id: "b", text: "Rol — la 'máscara' o expertise que asignas a la IA" },
          { id: "c", text: "Restricciones — lo que la IA no debe hacer" },
          { id: "d", text: "Recursos — las herramientas disponibles" },
        ],
        correctId: "b",
        explanation: "La R es Rol: asignar una identidad o expertise. Ejemplo: 'Actúa como experto en didáctica de matemáticas con 20 años de experiencia'. Mejora la relevancia y profundidad.",
        tip: "Un buen rol incluye: disciplina + nivel de experiencia + contexto.",
      },
      {
        id: "m1q2", type: "ordering",
        question: "Ordena los elementos del framework C.R.E.F.O.:",
        items: [
          { id: "c", text: "Contexto" },
          { id: "r", text: "Rol" },
          { id: "e", text: "Especificidad (Task)" },
          { id: "f", text: "Formato" },
          { id: "o", text: "Objetivos y Restricciones" },
        ],
        correctOrder: ["c", "r", "e", "f", "o"],
        explanation: "C.R.E.F.O.: Contexto → Rol → Especificidad → Formato → Objetivos. No es obligatorio este orden en el prompt, pero sí que todos los elementos estén presentes.",
        tip: "Usa C.R.E.F.O. como checklist, no como plantilla rígida.",
      },
      {
        id: "m1q3", type: "single",
        question: "¿Cuál es la diferencia entre Zero-shot y Few-shot prompting?",
        options: [
          { id: "a", text: "Zero-shot es gratis y Few-shot es de pago" },
          { id: "b", text: "Zero-shot no da ejemplos; Few-shot incluye ejemplos de calidad" },
          { id: "c", text: "Zero-shot usa un modelo y Few-shot combina varios" },
          { id: "d", text: "Zero-shot es para textos cortos y Few-shot para largos" },
        ],
        correctId: "b",
        explanation: "En Zero-shot pides sin ejemplos. En Few-shot incluyes 2-3 ejemplos del resultado esperado. Few-shot mejora drásticamente la precisión en tareas complejas.",
      },
      {
        id: "m1q4", type: "multiple",
        question: "¿Cuáles son verbos EFECTIVOS para la 'E' (Especificidad)?",
        options: [
          { id: "a", text: "Diseña" },
          { id: "b", text: "Hazme algo sobre" },
          { id: "c", text: "Analiza y contrasta" },
          { id: "d", text: "Genera una tabla comparativa de" },
        ],
        correctIds: ["a", "c", "d"],
        hint: "3 correctas",
        explanation: "'Diseña', 'Analiza y contrasta' y 'Genera tabla comparativa' son precisos. 'Hazme algo sobre' es vago — no especifica acción ni alcance.",
        tip: "Usa la taxonomía de Bloom: Crear, Evaluar, Analizar, Aplicar, Comprender, Recordar.",
      },
      {
        id: "m1q5", type: "truefalse",
        question: "Un prompt bien diseñado siempre produce el mismo resultado en diferentes intentos.",
        correctAnswer: false,
        explanation: "Los LLMs tienen aleatoriedad (temperatura). Un buen prompt REDUCE la variabilidad pero no la elimina. La 'robustez' se mide por cuán consistentes son los resultados.",
        tip: "Prueba tu prompt al menos 3 veces antes de considerarlo terminado.",
      },
    ],
  },
};

// ─── Components ─────────────────────────────────────────────────────

function OptionBtn({ children, selected, correct, revealed, onClick, radio }) {
  let bg = "#fff", border = "#e5e7eb", ring = "none";
  if (revealed) {
    if (correct && selected) { bg = "#ecfdf5"; border = "#6ee7b7"; ring = "2px solid #34d399"; }
    else if (correct && !selected) { bg = "#fffbeb"; border = "#fcd34d"; ring = "2px solid #fbbf24"; }
    else if (!correct && selected) { bg = "#fef2f2"; border = "#fca5a5"; ring = "2px solid #f87171"; }
    else { bg = "#f9fafb"; border = "#e5e7eb"; }
  } else if (selected) { bg = "#f9fafb"; border = "#374151"; ring = "2px solid #9ca3af"; }

  const dotBg = revealed ? (correct ? "#10b981" : selected ? "#ef4444" : "#d1d5db") : (selected ? "#111827" : "#d1d5db");

  return (
    <button onClick={onClick} disabled={revealed} style={{
      width: "100%", textAlign: "left", display: "flex", alignItems: "flex-start", gap: 12,
      borderRadius: 12, border: `2px solid ${border}`, padding: 14, background: bg,
      cursor: revealed ? "default" : "pointer", transition: "all 0.2s", outline: ring, outlineOffset: -2,
      opacity: revealed && !correct && !selected ? 0.45 : 1,
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: radio ? 99 : 4, border: `2px solid ${dotBg}`,
        background: (selected || (revealed && correct)) ? dotBg : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2,
      }}>
        {(selected || (revealed && correct)) && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>}
      </div>
      <span style={{ fontSize: 14, color: "#1f2937", lineHeight: 1.6 }}>{children}</span>
    </button>
  );
}

function OrderItem({ text, idx, total, correct, wrongPos, revealed, onUp, onDown }) {
  let bg = "#fff", border = "#e5e7eb", numBg = "#e5e7eb", numColor = "#4b5563";
  if (revealed && correct) { bg = "#ecfdf5"; border = "#6ee7b7"; numBg = "#10b981"; numColor = "#fff"; }
  else if (revealed && !correct) { bg = "#fef2f2"; border = "#fca5a5"; numBg = "#f87171"; numColor = "#fff"; }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 12, border: `2px solid ${border}`, padding: 12, background: bg, transition: "all 0.2s" }}>
      <span style={{ width: 24, height: 24, borderRadius: 99, background: numBg, color: numColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{idx + 1}</span>
      <span style={{ flex: 1, fontSize: 13, color: "#1f2937" }}>{text}</span>
      {!revealed && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <button onClick={onUp} disabled={idx === 0} style={{ padding: 2, border: "none", background: "none", cursor: idx === 0 ? "default" : "pointer", opacity: idx === 0 ? 0.2 : 1, fontSize: 12 }}>▲</button>
          <button onClick={onDown} disabled={idx === total - 1} style={{ padding: 2, border: "none", background: "none", cursor: idx === total - 1 ? "default" : "pointer", opacity: idx === total - 1 ? 0.2 : 1, fontSize: 12 }}>▼</button>
        </div>
      )}
      {revealed && !correct && <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 500 }}>→ Pos. {wrongPos}</span>}
    </div>
  );
}

function QCard({ q, idx, total, accent, onAnswer }) {
  const [sel, setSel] = useState(q.type === "single" || q.type === "truefalse" ? null : q.type === "multiple" ? new Set() : null);
  const [order, setOrder] = useState(q.type === "ordering" ? q.items.map(i => i.id) : []);
  const [revealed, setRevealed] = useState(false);

  const typeLabel = { single: "Opción única", multiple: "Selección múltiple", truefalse: "V / F", ordering: "Ordenar" }[q.type];
  const typeIcon = { single: "◉", multiple: "☑", truefalse: "⟷", ordering: "≡" }[q.type];

  const hasAns = q.type === "single" ? sel !== null : q.type === "multiple" ? sel.size > 0 : q.type === "truefalse" ? sel !== null : true;

  const check = () => {
    setRevealed(true);
    let ok = false;
    if (q.type === "single") ok = sel === q.correctId;
    else if (q.type === "multiple") { const c = new Set(q.correctIds); ok = sel.size === c.size && [...sel].every(i => c.has(i)); }
    else if (q.type === "truefalse") ok = sel === q.correctAnswer;
    else if (q.type === "ordering") ok = order.every((id, i) => q.correctOrder[i] === id);
    onAnswer(ok);
  };

  const toggleMulti = (id) => setSel((p) => {
    const n = new Set(p);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    return n;
  });
  const moveOrder = (i, d) => { const n = [...order]; [n[i], n[i+d]] = [n[i+d], n[i]]; setOrder(n); };

  const isCorrect = revealed && (
    q.type === "single" ? sel === q.correctId :
    q.type === "multiple" ? (() => { const c = new Set(q.correctIds); return sel.size === c.size && [...sel].every(i => c.has(i)); })() :
    q.type === "truefalse" ? sel === q.correctAnswer :
    order.every((id, i) => q.correctOrder[i] === id)
  );

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af" }}>{idx+1}/{total}</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: "#6b7280", background: "#f3f4f6", padding: "3px 8px", borderRadius: 6 }}>{typeIcon} {typeLabel}</span>
        </div>
        {revealed && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8,
            background: isCorrect ? "#ecfdf5" : "#fef2f2", color: isCorrect ? "#047857" : "#be123c"
          }}>{isCorrect ? "✓ Correcto" : "✗ Incorrecto"}</span>
        )}
      </div>

      <div style={{ padding: 20 }}>
        <p style={{ fontWeight: 600, color: "#111827", fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>{q.question}</p>

        {q.type === "single" && (
          <div style={{ display: "grid", gap: 8 }}>
            {q.options.map(o => (
              <OptionBtn key={o.id} selected={sel === o.id} correct={o.id === q.correctId} revealed={revealed} onClick={() => !revealed && setSel(o.id)} radio>
                {o.text}
              </OptionBtn>
            ))}
          </div>
        )}

        {q.type === "multiple" && (
          <div style={{ display: "grid", gap: 8 }}>
            {q.hint && !revealed && <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>{q.hint}</p>}
            {q.options.map(o => (
              <OptionBtn key={o.id} selected={sel.has(o.id)} correct={q.correctIds.includes(o.id)} revealed={revealed} onClick={() => !revealed && toggleMulti(o.id)}>
                {o.text}
              </OptionBtn>
            ))}
          </div>
        )}

        {q.type === "truefalse" && (
          <div style={{ display: "flex", gap: 10 }}>
            {[{ v: true, l: "Verdadero" }, { v: false, l: "Falso" }].map(({ v, l }) => {
              const isSel = sel === v, isCor = v === q.correctAnswer;
              let bg = "#fff", border = "#e5e7eb", ring = "none";
              if (revealed) {
                if (isCor) { bg = "#ecfdf5"; border = "#6ee7b7"; ring = "2px solid #34d399"; }
                else if (isSel) { bg = "#fef2f2"; border = "#fca5a5"; ring = "2px solid #f87171"; }
                else { bg = "#f9fafb"; }
              } else if (isSel) { bg = "#f9fafb"; border = "#374151"; ring = "2px solid #9ca3af"; }
              return (
                <button key={l} onClick={() => !revealed && setSel(v)} disabled={revealed} style={{
                  flex: 1, textAlign: "center", borderRadius: 12, border: `2px solid ${border}`, padding: 14,
                  fontWeight: 600, fontSize: 14, background: bg, cursor: revealed ? "default" : "pointer",
                  outline: ring, outlineOffset: -2, transition: "all 0.2s",
                }}>
                  {revealed && isCor && <span style={{ display: "block", color: "#10b981", fontSize: 14, marginBottom: 2 }}>✓</span>}
                  {revealed && isSel && !isCor && <span style={{ display: "block", color: "#ef4444", fontSize: 14, marginBottom: 2 }}>✗</span>}
                  {l}
                </button>
              );
            })}
          </div>
        )}

        {q.type === "ordering" && (
          <div style={{ display: "grid", gap: 6 }}>
            {order.map((id, i) => {
              const item = q.items.find(x => x.id === id);
              const correctPos = q.correctOrder.indexOf(id);
              return (
                <OrderItem key={id} text={item.text} idx={i} total={order.length}
                  correct={revealed && correctPos === i}
                  wrongPos={revealed && correctPos !== i ? correctPos + 1 : null}
                  revealed={revealed}
                  onUp={() => moveOrder(i, -1)} onDown={() => moveOrder(i, 1)} />
              );
            })}
          </div>
        )}

        {!revealed && (
          <button onClick={check} disabled={!hasAns} style={{
            width: "100%", marginTop: 16, padding: "12px 0", borderRadius: 12, border: "none",
            fontWeight: 600, fontSize: 14, cursor: hasAns ? "pointer" : "default",
            background: hasAns ? accent : "#f3f4f6", color: hasAns ? "#fff" : "#9ca3af", transition: "all 0.2s",
          }}>Verificar respuesta</button>
        )}

        {revealed && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f3f4f6" }}>
            <div style={{ background: isCorrect ? "#ecfdf5" : "#eff6ff", border: `1px solid ${isCorrect ? "#a7f3d0" : "#bfdbfe"}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: isCorrect ? "#047857" : "#1d4ed8", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px 0" }}>📖 Explicación</p>
              <p style={{ fontSize: 13, color: isCorrect ? "#064e3b" : "#1e3a5f", lineHeight: 1.7, margin: 0 }}>{q.explanation}</p>
            </div>
            {q.tip && (
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 14, display: "flex", gap: 8 }}>
                <span>💡</span>
                <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.5, margin: 0 }}>{q.tip}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Results({ quiz, correct, total, onRestart, onBack }) {
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= quiz.passingScore;
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
      <div style={{ borderRadius: 16, border: `2px solid ${passed ? "#86efac" : "#fcd34d"}`, background: passed ? "#ecfdf5" : "#fffbeb", padding: 32, marginBottom: 20 }}>
        <div style={{ width: 56, height: 56, borderRadius: 99, background: passed ? "#10b981" : "#f59e0b", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
          {passed ? "🏆" : "🎯"}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 6px 0" }}>{passed ? "¡Módulo superado!" : "Casi lo tienes"}</h2>
        <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 20px 0" }}>
          {passed ? "Dominio sólido de los conceptos." : `Necesitas ${quiz.passingScore}% para superar. Revisa las explicaciones.`}
        </p>
        <div style={{ fontSize: 44, fontWeight: 800, color: passed ? "#047857" : "#b45309" }}>{pct}%</div>
        <p style={{ fontSize: 13, color: "#9ca3af" }}>{correct} de {total} correctas</p>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={onRestart} style={{ padding: "10px 20px", borderRadius: 12, border: "2px solid #d1d5db", background: "#fff", cursor: "pointer", fontWeight: 500, fontSize: 13 }}>🔄 Repetir</button>
        <button onClick={onBack} style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: quiz.accentColor, color: "#fff", cursor: "pointer", fontWeight: 500, fontSize: 13 }}>Volver a módulos →</button>
      </div>
    </div>
  );
}

export default function ModuleQuiz() {
  const [activeId, setActiveId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showRes, setShowRes] = useState(false);
  const [best, setBest] = useState({});

  const quiz = activeId ? quizModules[activeId] : null;

  const handleAnswer = useCallback((qid, ok) => {
    setAnswers(p => {
      const n = { ...p, [qid]: ok };
      if (quiz && Object.keys(n).length === quiz.questions.length) setTimeout(() => setShowRes(true), 500);
      return n;
    });
  }, [quiz]);

  const restart = () => { setAnswers({}); setShowRes(false); };
  const back = () => {
    if (quiz) {
      const c = Object.values(answers).filter(Boolean).length;
      const pct = Math.round((c / quiz.questions.length) * 100);
      setBest(p => ({ ...p, [quiz.id]: Math.max(p[quiz.id] ?? 0, pct) }));
    }
    setActiveId(null); setAnswers({}); setShowRes(false);
  };

  if (quiz) {
    const correct = Object.values(answers).filter(Boolean).length;
    if (showRes) return (
      <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "40px 16px" }}>
        <Results quiz={quiz} correct={correct} total={quiz.questions.length} onRestart={restart} onBack={back} />
      </div>
    );

    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "40px 16px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <button onClick={back} style={{ fontSize: 13, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>← Volver</button>
            <span style={{ fontSize: 13, color: "#9ca3af" }}>{Object.keys(answers).length}/{quiz.questions.length} · <span style={{ color: "#059669" }}>{correct} ✓</span></span>
          </div>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, color: "#fff", background: quiz.accentColor }}>{quiz.title}</span>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "8px 0 4px 0" }}>{quiz.subtitle}</h2>
            <p style={{ fontSize: 13, color: "#9ca3af" }}>{quiz.description}</p>
          </div>
          <div style={{ height: 5, background: "#e5e7eb", borderRadius: 99, marginBottom: 24, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, background: quiz.accentColor, transition: "width 0.4s", width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }} />
          </div>
          <div style={{ display: "grid", gap: 18 }}>
            {quiz.questions.map((q, i) => <QCard key={q.id} q={q} idx={i} total={quiz.questions.length} accent={quiz.accentColor} onAnswer={(ok) => handleAnswer(q.id, ok)} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "40px 16px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#111827", color: "#fff", fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 99, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14 }}>🎯 Verificación de Aprendizaje</span>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>Quizzes por Módulo</h1>
          <p style={{ color: "#6b7280", maxWidth: 480, margin: "0 auto", lineHeight: 1.6, fontSize: 15 }}>
            Verifica tu comprensión al final de cada módulo. Cada pregunta incluye explicación detallada.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {Object.values(quizModules).map(qz => {
            const b = best[qz.id];
            const passed = b !== undefined && b >= qz.passingScore;
            return (
              <button key={qz.id} onClick={() => { setActiveId(qz.id); setAnswers({}); setShowRes(false); }} style={{
                position: "relative", textAlign: "left", borderRadius: 16,
                border: `2px solid ${passed ? "#86efac" : "#e5e7eb"}`,
                padding: 24, background: passed ? "#f0fdf4" : "#fff", cursor: "pointer", transition: "all 0.2s",
              }}>
                {passed && <span style={{ position: "absolute", top: -8, right: -8, background: "#10b981", color: "#fff", borderRadius: 99, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✓</span>}
                <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 8, color: "#fff", background: qz.accentColor, marginBottom: 10 }}>{qz.title}</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 6px 0" }}>{qz.subtitle}</h3>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, margin: "0 0 10px 0" }}>{qz.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>{qz.questions.length} preguntas</span>
                  {b !== undefined && <span style={{ fontSize: 11, fontWeight: 700, color: passed ? "#059669" : "#d97706" }}>Mejor: {b}%</span>}
                </div>
                <span style={{ display: "block", marginTop: 8, fontSize: 13, fontWeight: 600, color: qz.accentColor }}>
                  {b !== undefined ? "Repetir →" : "Comenzar →"}
                </span>
              </button>
            );
          })}
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 32 }}>
          Mín. 70% para superar · Curso &quot;Prompt Mastery para Docentes&quot;
        </p>
      </div>
    </div>
  );
}
