"use client";

import { useState, useCallback, useMemo } from "react";
import { usePersistedToolState } from "@/hooks/usePersistedToolState";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Trophy,
  BookOpen,
  Lightbulb,
  ArrowRight,
  CircleDot,
  SquareCheck,
  ListOrdered,
  ToggleLeft,
  Target,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface BaseQuestion {
  id: string;
  question: string;
  explanation: string;
  tip?: string;
}

interface SingleChoiceQuestion extends BaseQuestion {
  type: "single";
  options: { id: string; text: string }[];
  correctId: string;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple";
  options: { id: string; text: string }[];
  correctIds: string[];
  hint?: string;
}

interface TrueFalseQuestion extends BaseQuestion {
  type: "truefalse";
  correctAnswer: boolean;
}

interface OrderingQuestion extends BaseQuestion {
  type: "ordering";
  items: { id: string; text: string }[];
  correctOrder: string[];
}

type Question = SingleChoiceQuestion | MultipleChoiceQuestion | TrueFalseQuestion | OrderingQuestion;

interface QuizModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  passingScore: number;
  questions: Question[];
}

// ─── Quiz Data ──────────────────────────────────────────────────────────────

const quizModules: Record<string, QuizModule> = {
  module0: {
    id: "module0",
    title: "Módulo 0",
    subtitle: "Fundamentos Críticos y la Caja Negra",
    description: "Verifica tu comprensión de los conceptos fundamentales: cómo funcionan los LLMs, privacidad de datos, sesgo algorítmico y el marco legal.",
    accentColor: "#4F46E5",
    passingScore: 70,
    questions: [
      {
        id: "m0q1",
        type: "single",
        question: "¿Qué hace realmente un Modelo de Lenguaje Grande (LLM) cuando genera texto?",
        options: [
          { id: "a", text: "Busca la respuesta correcta en una base de datos de conocimiento verificado" },
          { id: "b", text: "Predice la probabilidad del siguiente token (palabra) en una secuencia" },
          { id: "c", text: "Comprende el significado profundo de la pregunta y razona lógicamente" },
          { id: "d", text: "Copia y pega fragmentos de textos que ha memorizado durante el entrenamiento" },
        ],
        correctId: "b",
        explanation: "Los LLMs son modelos estadísticos de predicción de tokens. No 'saben' ni 'comprenden' — calculan probabilidades. Entender esto es el antídoto contra la antropomorfización: cuando la IA dice algo incorrecto con total confianza, es porque la secuencia de tokens más probable no coincide con la realidad.",
        tip: "Cuando un alumno diga 'la IA dice que...', corrige a 'la IA predice que...'. El verbo importa.",
      },
      {
        id: "m0q2",
        type: "truefalse",
        question: "El parámetro de 'temperatura' en un LLM controla qué tan largas son las respuestas que genera.",
        correctAnswer: false,
        explanation: "La temperatura controla la aleatoriedad/creatividad de la respuesta, NO su longitud. Temperatura baja (0-0.3) = respuestas más deterministas y predecibles. Temperatura alta (0.7-1.0) = respuestas más creativas y variadas. La longitud se controla con el parámetro de 'tokens máximos'.",
        tip: "Para tareas de evaluación usa temperatura baja (consistencia). Para lluvia de ideas, temperatura alta (variedad).",
      },
      {
        id: "m0q3",
        type: "multiple",
        question: "¿Cuáles de los siguientes datos NUNCA deben incluirse en un prompt enviado a un LLM comercial como ChatGPT?",
        options: [
          { id: "a", text: "El nombre completo de un alumno junto con su diagnóstico psicopedagógico" },
          { id: "b", text: "El nivel educativo y la asignatura que impartes" },
          { id: "c", text: "Las calificaciones individuales de un alumno identificable" },
          { id: "d", text: "Un ejemplo anónimo de trabajo de alumno sin datos identificables" },
          { id: "e", text: "La situación socioeconómica familiar de un alumno con nombre" },
        ],
        correctIds: ["a", "c", "e"],
        hint: "Selecciona todos los que apliquen (3 correctas)",
        explanation: "Bajo el GDPR/LOPDGDD, los datos que permiten identificar a un menor — especialmente combinados con información de salud (diagnósticos) o situación socioeconómica — son datos de categoría especial con protección reforzada. El nivel educativo y los ejemplos anonimizados son seguros porque no identifican a ningún individuo.",
      },
      {
        id: "m0q4",
        type: "single",
        question: "Un docente pide a ChatGPT: «Describe a un científico importante.» La IA genera la imagen de un hombre blanco con bata de laboratorio. ¿Qué concepto explica este resultado?",
        options: [
          { id: "a", text: "Alucinación — la IA inventó información falsa" },
          { id: "b", text: "Sesgo algorítmico — los datos de entrenamiento sobrerrepresentan ciertos perfiles" },
          { id: "c", text: "Error de temperatura — el parámetro estaba mal configurado" },
          { id: "d", text: "Ventana de contexto — la IA no tenía suficiente memoria" },
        ],
        correctId: "b",
        explanation: "El sesgo algorítmico ocurre cuando los datos de entrenamiento (mayoritariamente occidentales y en inglés) sobrerrepresentan ciertos perfiles. La IA no 'decide' que los científicos son hombres blancos — refleja los patrones estadísticos de sus datos. Por eso el prompt debe incluir instrucciones explícitas de diversidad.",
        tip: "Audita siempre la representación en los materiales generados: ¿quién aparece? ¿quién falta? ¿qué narrativa implícita se transmite?",
      },
      {
        id: "m0q5",
        type: "truefalse",
        question: "Si desactivas el historial de chat en ChatGPT, tus datos ya no se utilizan para entrenar el modelo.",
        correctAnswer: false,
        explanation: "Desactivar el historial de chat NO garantiza que los datos no se procesen. Según la política de OpenAI, los datos pueden retenerse hasta 30 días para revisión de seguridad. Para mayor protección, debe desactivarse específicamente la opción de 'mejorar el modelo' en Configuración > Controles de datos. Además, cada plataforma tiene sus propios controles que deben verificarse individualmente.",
        tip: "Configura la privacidad de CADA herramienta antes de usarla. Y recuerda: la configuración puede cambiar con las actualizaciones.",
      },
      {
        id: "m0q6",
        type: "single",
        question: "¿Qué es una 'alucinación' en el contexto de los LLMs?",
        options: [
          { id: "a", text: "Un error de programación que hace que el modelo se bloquee" },
          { id: "b", text: "Cuando el modelo genera información que suena plausible pero es factualmente incorrecta" },
          { id: "c", text: "La tendencia del modelo a copiar textos de internet sin citar" },
          { id: "d", text: "Un efecto visual en las imágenes generadas por IA" },
        ],
        correctId: "b",
        explanation: "Las alucinaciones son uno de los riesgos más críticos de los LLMs. Como el modelo predice tokens probables (no verdaderos), puede generar información completamente inventada con total confianza: citas bibliográficas que no existen, datos estadísticos falsos, o atribuciones incorrectas. Por eso el docente debe VERIFICAR siempre antes de usar cualquier dato factual generado por IA.",
        tip: "Regla de oro: nunca presentes datos, citas o estadísticas generadas por IA sin verificarlas en una fuente primaria.",
      },
      {
        id: "m0q7",
        type: "ordering",
        question: "Ordena los pasos correctos para introducir una herramienta de IA nueva en tu aula:",
        items: [
          { id: "a", text: "Verificar cumplimiento GDPR/COPPA y política de datos de la herramienta" },
          { id: "b", text: "Comunicar a las familias el uso que se hará de la herramienta" },
          { id: "c", text: "Consultar si el centro tiene política institucional sobre IA" },
          { id: "d", text: "Probar la herramienta personalmente y evaluar su utilidad pedagógica" },
          { id: "e", text: "Implementar en el aula con normas claras de uso" },
        ],
        correctOrder: ["c", "a", "d", "b", "e"],
        explanation: "El orden correcto prioriza la seguridad legal e institucional antes que la exploración. Primero verificas que no estás violando ninguna norma del centro (C), luego la privacidad de la herramienta (A), después pruebas su valor pedagógico (D), informas a las familias (B) y finalmente implementas con normas (E). Muchos docentes saltan directamente al paso D o E, exponiendo al centro a riesgos legales.",
        tip: "Antes de entusiasmarte con una herramienta nueva, haz el 'checklist de vetting': ¿cumple GDPR? ¿tiene política de datos clara? ¿el centro la ha aprobado?",
      },
    ],
  },
  module1: {
    id: "module1",
    title: "Módulo 1",
    subtitle: "La Sintaxis de la Maestría — Ingeniería Básica",
    description: "Comprueba tu dominio del framework C.R.E.F.O., las diferencias entre Zero-shot y Few-shot, y los principios de un prompt bien estructurado.",
    accentColor: "#D97706",
    passingScore: 70,
    questions: [
      {
        id: "m1q1",
        type: "single",
        question: "En el framework C.R.E.F.O., ¿qué representa la 'R'?",
        options: [
          { id: "a", text: "Resultado — el output esperado de la IA" },
          { id: "b", text: "Rol — la 'máscara' o expertise que asignas a la IA" },
          { id: "c", text: "Restricciones — lo que la IA no debe hacer" },
          { id: "d", text: "Recursos — las herramientas disponibles" },
        ],
        correctId: "b",
        explanation: "La R de C.R.E.F.O. es Rol: la asignación de una identidad o expertise a la IA. Ejemplo: 'Actúa como un experto en didáctica de las matemáticas con 20 años de experiencia'. Asignar un rol específico mejora la relevancia y profundidad de las respuestas porque orienta al modelo hacia un registro de conocimiento concreto.",
        tip: "Un buen rol incluye: disciplina + nivel de experiencia + contexto. 'Profesor' es genérico; 'profesor de Física de Bachillerato con experiencia en laboratorio escolar' es preciso.",
      },
      {
        id: "m1q2",
        type: "ordering",
        question: "Ordena los elementos del framework C.R.E.F.O. correctamente:",
        items: [
          { id: "c", text: "Contexto" },
          { id: "r", text: "Rol" },
          { id: "e", text: "Especificidad (Task)" },
          { id: "f", text: "Formato" },
          { id: "o", text: "Objetivos y Restricciones" },
        ],
        correctOrder: ["c", "r", "e", "f", "o"],
        explanation: "C.R.E.F.O. sigue un orden lógico: primero defines el escenario (Contexto), luego quién habla (Rol), qué debe hacer exactamente (Especificidad), cómo debe presentarlo (Formato) y finalmente los límites (Objetivos y Restricciones). No es obligatorio seguir este orden en el prompt, pero sí asegurarte de que todos los elementos estén presentes.",
        tip: "Usa C.R.E.F.O. como checklist, no como plantilla rígida. Lo importante es que ningún elemento falte, no el orden exacto en que aparecen.",
      },
      {
        id: "m1q3",
        type: "single",
        question: "¿Cuál es la diferencia principal entre prompting Zero-shot y Few-shot?",
        options: [
          { id: "a", text: "Zero-shot es gratis y Few-shot es de pago" },
          { id: "b", text: "Zero-shot no da ejemplos; Few-shot incluye ejemplos de calidad en el prompt" },
          { id: "c", text: "Zero-shot usa un solo modelo y Few-shot combina varios modelos" },
          { id: "d", text: "Zero-shot es para textos cortos y Few-shot para textos largos" },
        ],
        correctId: "b",
        explanation: "En Zero-shot, le pides a la IA que haga algo sin ningún ejemplo previo. En Few-shot, incluyes 2-3 ejemplos del resultado que esperas antes de hacer tu petición. Few-shot mejora drásticamente la precisión en tareas complejas (evaluación, estilo específico, formato particular) porque le muestra al modelo exactamente qué patrón debe seguir.",
      },
      {
        id: "m1q4",
        type: "multiple",
        question: "¿Cuáles de los siguientes son verbos de acción EFECTIVOS para la 'E' (Especificidad) de C.R.E.F.O.?",
        options: [
          { id: "a", text: "Diseña" },
          { id: "b", text: "Hazme algo sobre" },
          { id: "c", text: "Analiza y contrasta" },
          { id: "d", text: "Genera una tabla comparativa de" },
        ],
        correctIds: ["a", "c", "d"],
        hint: "Selecciona todos los que apliquen (3 correctas)",
        explanation: "'Diseña', 'Analiza y contrasta' y 'Genera una tabla comparativa' son verbos de acción precisos y delimitados que le dicen a la IA exactamente qué operación cognitiva realizar. 'Hazme algo sobre' es vago — no especifica la acción ni el alcance. La especificidad en los verbos determina la calidad del resultado.",
        tip: "Usa la taxonomía de Bloom como fuente de verbos: Crear, Evaluar, Analizar, Aplicar, Comprender, Recordar. Cada nivel implica una tarea diferente.",
      },
      {
        id: "m1q5",
        type: "truefalse",
        question: "Un prompt bien diseñado siempre produce el mismo resultado en diferentes intentos y modelos de IA.",
        correctAnswer: false,
        explanation: "Los LLMs tienen un componente de aleatoriedad (controlado por la temperatura) que hace que las respuestas varíen entre ejecuciones. Además, diferentes modelos (ChatGPT, Claude, Gemini) interpretan los prompts de forma distinta. Un buen prompt REDUCE la variabilidad pero no la elimina. La 'robustez' de un prompt se mide por cuán consistentes son los resultados, no por si son idénticos.",
        tip: "Prueba tu prompt al menos 3 veces antes de considerarlo 'terminado'. Si los resultados varían mucho, necesita más restricciones.",
      },
      {
        id: "m1q6",
        type: "single",
        question: "Tienes un prompt que produce resultados mediocres. ¿Cuál es la estrategia de mejora más efectiva según la metodología 'Prompt-Test-Iterate'?",
        options: [
          { id: "a", text: "Reescribir el prompt completamente desde cero" },
          { id: "b", text: "Cambiar a un modelo de IA diferente" },
          { id: "c", text: "Analizar la salida, identificar qué falta, y ajustar un elemento a la vez" },
          { id: "d", text: "Añadir 'por favor hazlo mejor' al final del prompt" },
        ],
        correctId: "c",
        explanation: "La metodología Prompt-Test-Iterate se basa en iteración controlada: analiza qué específicamente falla en la salida, modifica UN elemento del prompt (añadir contexto, cambiar el rol, especificar formato) y vuelve a ejecutar. Cambiar todo de golpe no te permite identificar qué mejora causó qué efecto. Es el método científico aplicado al prompting.",
        tip: "Documenta tus iteraciones: Prompt v1 → Resultado → Análisis → Cambio → Prompt v2. Este 'diario de prompts' es tu mejor herramienta de aprendizaje.",
      },
      {
        id: "m1q7",
        type: "single",
        question: "¿Cuándo es especialmente recomendable usar la técnica Few-shot en lugar de Zero-shot?",
        options: [
          { id: "a", text: "Cuando quieres que la IA sea más creativa y original" },
          { id: "b", text: "Cuando necesitas que el resultado siga un formato, estilo o criterio muy específico" },
          { id: "c", text: "Cuando tienes poco tiempo y necesitas resultados rápidos" },
          { id: "d", text: "Cuando trabajas con temas simples y directos" },
        ],
        correctId: "b",
        explanation: "Few-shot brilla cuando necesitas consistencia en formato, estilo o criterios de calidad. Por ejemplo: si quieres preguntas de examen con un estilo específico, incluir 2-3 ejemplos 'modelo' en el prompt es mucho más efectivo que describir el estilo con palabras. La IA replica el patrón de los ejemplos con alta fidelidad.",
        tip: "Invierte tiempo en crear 2-3 ejemplos 'gold standard' de lo que quieres. Esos ejemplos son reutilizables y mejoran radicalmente cualquier prompt donde los incluyas.",
      },
    ],
  },
};

// ─── Utilities ──────────────────────────────────────────────────────────────

function getTypeIcon(type: Question["type"]) {
  switch (type) {
    case "single": return <CircleDot className="w-3.5 h-3.5" />;
    case "multiple": return <SquareCheck className="w-3.5 h-3.5" />;
    case "truefalse": return <ToggleLeft className="w-3.5 h-3.5" />;
    case "ordering": return <ListOrdered className="w-3.5 h-3.5" />;
  }
}

function getTypeLabel(type: Question["type"]) {
  switch (type) {
    case "single": return "Opción única";
    case "multiple": return "Selección múltiple";
    case "truefalse": return "Verdadero / Falso";
    case "ordering": return "Ordenar";
  }
}

// ─── Question Components ────────────────────────────────────────────────────

function SingleChoiceInput({
  question,
  selected,
  onSelect,
  revealed,
}: {
  question: SingleChoiceQuestion;
  selected: string | null;
  onSelect: (id: string) => void;
  revealed: boolean;
}) {
  return (
    <div className="space-y-2.5">
      {question.options.map((opt) => {
        const isSelected = selected === opt.id;
        const isCorrect = opt.id === question.correctId;

        let classes = "border-gray-200 bg-white hover:border-gray-400";
        if (revealed) {
          if (isCorrect) classes = "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200";
          else if (isSelected && !isCorrect) classes = "border-red-400 bg-red-50 ring-2 ring-red-200";
          else classes = "border-gray-200 bg-gray-50 opacity-50";
        } else if (isSelected) {
          classes = "border-gray-900 bg-gray-50 ring-2 ring-gray-300";
        }

        return (
          <button
            key={opt.id}
            onClick={() => !revealed && onSelect(opt.id)}
            disabled={revealed}
            className={`w-full text-left flex items-start gap-3 rounded-xl border-2 p-4 transition-all duration-200 ${classes}`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
              revealed && isCorrect ? "border-emerald-500 bg-emerald-500" :
              revealed && isSelected ? "border-red-500 bg-red-500" :
              isSelected ? "border-gray-900 bg-gray-900" : "border-gray-300"
            }`}>
              {(isSelected || (revealed && isCorrect)) && (
                revealed
                  ? isCorrect
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    : <XCircle className="w-3.5 h-3.5 text-white" />
                  : <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <span className="text-sm text-gray-800 leading-relaxed">{opt.text}</span>
          </button>
        );
      })}
    </div>
  );
}

function MultipleChoiceInput({
  question,
  selected,
  onToggle,
  revealed,
}: {
  question: MultipleChoiceQuestion;
  selected: Set<string>;
  onToggle: (id: string) => void;
  revealed: boolean;
}) {
  return (
    <div className="space-y-2.5">
      {question.hint && !revealed && (
        <p className="text-xs text-gray-500 italic mb-1">{question.hint}</p>
      )}
      {question.options.map((opt) => {
        const isSelected = selected.has(opt.id);
        const isCorrect = question.correctIds.includes(opt.id);

        let classes = "border-gray-200 bg-white hover:border-gray-400";
        if (revealed) {
          if (isCorrect && isSelected) classes = "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200";
          else if (isCorrect && !isSelected) classes = "border-amber-400 bg-amber-50 ring-2 ring-amber-200";
          else if (!isCorrect && isSelected) classes = "border-red-400 bg-red-50 ring-2 ring-red-200";
          else classes = "border-gray-200 bg-gray-50 opacity-50";
        } else if (isSelected) {
          classes = "border-gray-900 bg-gray-50 ring-2 ring-gray-300";
        }

        return (
          <button
            key={opt.id}
            onClick={() => !revealed && onToggle(opt.id)}
            disabled={revealed}
            className={`w-full text-left flex items-start gap-3 rounded-xl border-2 p-4 transition-all duration-200 ${classes}`}
          >
            <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
              revealed && isCorrect && isSelected ? "border-emerald-500 bg-emerald-500" :
              revealed && isCorrect && !isSelected ? "border-amber-500 bg-amber-500" :
              revealed && isSelected ? "border-red-500 bg-red-500" :
              isSelected ? "border-gray-900 bg-gray-900" : "border-gray-300"
            }`}>
              {(isSelected || (revealed && isCorrect)) && (
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              )}
            </div>
            <span className="text-sm text-gray-800 leading-relaxed">{opt.text}</span>
          </button>
        );
      })}
    </div>
  );
}

function TrueFalseInput({
  question,
  selected,
  onSelect,
  revealed,
}: {
  question: TrueFalseQuestion;
  selected: boolean | null;
  onSelect: (val: boolean) => void;
  revealed: boolean;
}) {
  const options = [
    { value: true, label: "Verdadero" },
    { value: false, label: "Falso" },
  ];

  return (
    <div className="flex gap-3">
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        const isCorrect = opt.value === question.correctAnswer;

        let classes = "border-gray-200 bg-white hover:border-gray-400";
        if (revealed) {
          if (isCorrect) classes = "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200";
          else if (isSelected) classes = "border-red-400 bg-red-50 ring-2 ring-red-200";
          else classes = "border-gray-200 bg-gray-50 opacity-50";
        } else if (isSelected) {
          classes = "border-gray-900 bg-gray-50 ring-2 ring-gray-300";
        }

        return (
          <button
            key={String(opt.value)}
            onClick={() => !revealed && onSelect(opt.value)}
            disabled={revealed}
            className={`flex-1 text-center rounded-xl border-2 p-4 font-semibold text-sm transition-all duration-200 ${classes}`}
          >
            {revealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />}
            {revealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 mx-auto mb-1" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function OrderingInput({
  question,
  order,
  onReorder,
  revealed,
}: {
  question: OrderingQuestion;
  order: string[];
  onReorder: (newOrder: string[]) => void;
  revealed: boolean;
}) {
  const moveItem = (idx: number, dir: -1 | 1) => {
    if (revealed) return;
    const target = idx + dir;
    if (target < 0 || target >= order.length) return;
    const newOrder = [...order];
    [newOrder[idx], newOrder[target]] = [newOrder[target], newOrder[idx]];
    onReorder(newOrder);
  };

  const itemMap = Object.fromEntries(question.items.map((item) => [item.id, item]));

  return (
    <div className="space-y-2">
      {order.map((id, idx) => {
        const item = itemMap[id];
        const correctPos = question.correctOrder.indexOf(id);
        const isCorrectPosition = revealed && correctPos === idx;
        const isWrongPosition = revealed && correctPos !== idx;

        let classes = "border-gray-200 bg-white";
        if (isCorrectPosition) classes = "border-emerald-400 bg-emerald-50";
        else if (isWrongPosition) classes = "border-red-300 bg-red-50";

        return (
          <div
            key={id}
            className={`flex items-center gap-3 rounded-xl border-2 p-3.5 transition-all ${classes}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              isCorrectPosition ? "bg-emerald-500 text-white" :
              isWrongPosition ? "bg-red-400 text-white" :
              "bg-gray-200 text-gray-600"
            }`}>
              {idx + 1}
            </span>
            <span className="text-sm text-gray-800 flex-1">{item.text}</span>
            {!revealed && (
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveItem(idx, -1)}
                  disabled={idx === 0}
                  className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-20 transition-colors"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-gray-500" />
                </button>
                <button
                  onClick={() => moveItem(idx, 1)}
                  disabled={idx === order.length - 1}
                  className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-20 transition-colors"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            )}
            {revealed && isWrongPosition && (
              <span className="text-xs text-red-500 font-medium">→ Posición {correctPos + 1}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Question Card ──────────────────────────────────────────────────────────

function QuestionCard({
  question,
  index,
  total,
  accentColor,
  onAnswer,
}: {
  question: Question;
  index: number;
  total: number;
  accentColor: string;
  onAnswer: (correct: boolean) => void;
}) {
  const [singleSelected, setSingleSelected] = useState<string | null>(null);
  const [multiSelected, setMultiSelected] = useState<Set<string>>(new Set());
  const [tfSelected, setTfSelected] = useState<boolean | null>(null);
  const [ordering, setOrdering] = useState<string[]>(
    question.type === "ordering" ? question.items.map((i) => i.id) : []
  );
  const [revealed, setRevealed] = useState(false);

  const hasAnswer = useMemo(() => {
    switch (question.type) {
      case "single": return singleSelected !== null;
      case "multiple": return multiSelected.size > 0;
      case "truefalse": return tfSelected !== null;
      case "ordering": return true;
    }
  }, [question.type, singleSelected, multiSelected, tfSelected]);

  const isCorrect = useMemo(() => {
    if (!revealed) return false;
    switch (question.type) {
      case "single": return singleSelected === question.correctId;
      case "multiple": {
        const correct = new Set(question.correctIds);
        return multiSelected.size === correct.size && [...multiSelected].every((id) => correct.has(id));
      }
      case "truefalse": return tfSelected === question.correctAnswer;
      case "ordering": return ordering.every((id, i) => question.correctOrder[i] === id);
    }
  }, [revealed, question, singleSelected, multiSelected, tfSelected, ordering]);

  const handleReveal = useCallback(() => {
    setRevealed(true);
    let correct = false;
    switch (question.type) {
      case "single": correct = singleSelected === question.correctId; break;
      case "multiple": {
        const c = new Set(question.correctIds);
        correct = multiSelected.size === c.size && [...multiSelected].every((id) => c.has(id));
        break;
      }
      case "truefalse": correct = tfSelected === question.correctAnswer; break;
      case "ordering": correct = ordering.every((id, i) => question.correctOrder[i] === id); break;
    }
    onAnswer(correct);
  }, [question, singleSelected, multiSelected, tfSelected, ordering, onAnswer]);

  const toggleMulti = useCallback((id: string) => {
    setMultiSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-400 tabular-nums">{index + 1}/{total}</span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
            {getTypeIcon(question.type)}
            {getTypeLabel(question.type)}
          </span>
        </div>
        {revealed && (
          isCorrect
            ? <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg"><CheckCircle2 className="w-3.5 h-3.5" /> Correcto</span>
            : <span className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-lg"><XCircle className="w-3.5 h-3.5" /> Incorrecto</span>
        )}
      </div>

      <div className="p-6">
        {/* Question text */}
        <p className="text-gray-900 font-semibold text-[15px] leading-relaxed mb-5">
          {question.question}
        </p>

        {/* Input based on type */}
        {question.type === "single" && (
          <SingleChoiceInput question={question} selected={singleSelected} onSelect={setSingleSelected} revealed={revealed} />
        )}
        {question.type === "multiple" && (
          <MultipleChoiceInput question={question} selected={multiSelected} onToggle={toggleMulti} revealed={revealed} />
        )}
        {question.type === "truefalse" && (
          <TrueFalseInput question={question} selected={tfSelected} onSelect={setTfSelected} revealed={revealed} />
        )}
        {question.type === "ordering" && (
          <OrderingInput question={question} order={ordering} onReorder={setOrdering} revealed={revealed} />
        )}

        {/* Verify button */}
        {!revealed && (
          <button
            onClick={handleReveal}
            disabled={!hasAnswer}
            className={`w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
              hasAnswer ? "text-white cursor-pointer hover:opacity-90" : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            style={hasAnswer ? { backgroundColor: accentColor } : undefined}
          >
            Verificar respuesta
          </button>
        )}

        {/* Feedback */}
        {revealed && (
          <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">
            <div className={`rounded-xl p-4 ${isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-blue-50 border border-blue-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4" style={{ color: isCorrect ? "#047857" : "#1d4ed8" }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: isCorrect ? "#047857" : "#1d4ed8" }}>
                  Explicación
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: isCorrect ? "#064e3b" : "#1e3a5f" }}>
                {question.explanation}
              </p>
            </div>
            {question.tip && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 leading-relaxed">{question.tip}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Results Screen ─────────────────────────────────────────────────────────

function ResultsScreen({
  quiz,
  correctCount,
  totalCount,
  onRestart,
  onBack,
}: {
  quiz: QuizModule;
  correctCount: number;
  totalCount: number;
  onRestart: () => void;
  onBack: () => void;
}) {
  const pct = Math.round((correctCount / totalCount) * 100);
  const passed = pct >= quiz.passingScore;

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className={`rounded-2xl border-2 p-8 mb-6 ${passed ? "border-emerald-300 bg-emerald-50" : "border-amber-300 bg-amber-50"}`}>
        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? "bg-emerald-500" : "bg-amber-500"}`}>
          {passed ? <Trophy className="w-8 h-8 text-white" /> : <Target className="w-8 h-8 text-white" />}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {passed ? "¡Módulo superado!" : "Casi lo tienes"}
        </h2>
        <p className="text-gray-600 mb-6">
          {passed
            ? "Has demostrado un dominio sólido de los conceptos de este módulo."
            : `Necesitas un ${quiz.passingScore}% para superar el módulo. Revisa las explicaciones y vuelve a intentarlo.`}
        </p>
        <div className="text-5xl font-bold tabular-nums mb-1" style={{ color: passed ? "#047857" : "#b45309" }}>
          {pct}%
        </div>
        <p className="text-sm text-gray-500">{correctCount} de {totalCount} correctas</p>
      </div>

      <div className="flex gap-3 justify-center">
        <button onClick={onRestart} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors">
          <RotateCcw className="w-4 h-4" /> Repetir quiz
        </button>
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-colors" style={{ backgroundColor: quiz.accentColor }}>
          Volver a módulos <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

interface ModuleQuizProps {
  moduleId?: string;
}

export default function ModuleQuiz({ moduleId }: ModuleQuizProps) {
  const [activeQuizId, setActiveQuizId] = useState<string | null>(moduleId ?? null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [completedQuizzes, setCompletedQuizzes] = usePersistedToolState<Record<string, number>>(
    "module-quiz",
    {},
  );

  const activeQuiz = activeQuizId ? quizModules[activeQuizId] : null;

  const handleAnswer = useCallback((questionId: string, correct: boolean) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: correct };
      const quiz = activeQuizId ? quizModules[activeQuizId] : null;
      if (quiz && Object.keys(next).length === quiz.questions.length) {
        setTimeout(() => setShowResults(true), 600);
      }
      return next;
    });
  }, [activeQuizId]);

  const handleRestart = useCallback(() => {
    setAnswers({});
    setShowResults(false);
  }, []);

  const handleBack = useCallback(() => {
    if (activeQuiz) {
      const correctCount = Object.values(answers).filter(Boolean).length;
      const pct = Math.round((correctCount / activeQuiz.questions.length) * 100);
      setCompletedQuizzes((prev) => ({
        ...prev,
        [activeQuiz.id]: Math.max(prev[activeQuiz.id] ?? 0, pct),
      }));
    }
    setActiveQuizId(null);
    setAnswers({});
    setShowResults(false);
  }, [activeQuiz, answers]);

  // ── Active quiz view ──
  if (activeQuiz) {
    const correctCount = Object.values(answers).filter(Boolean).length;

    if (showResults) {
      return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
          <ResultsScreen
            quiz={activeQuiz}
            correctCount={correctCount}
            totalCount={activeQuiz.questions.length}
            onRestart={handleRestart}
            onBack={handleBack}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={handleBack} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              ← Volver a módulos
            </button>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{Object.keys(answers).length}/{activeQuiz.questions.length} respondidas</span>
              <span className="text-emerald-600 font-medium">{correctCount} correctas</span>
            </div>
          </div>

          {/* Quiz title */}
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white" style={{ backgroundColor: activeQuiz.accentColor }}>
              {activeQuiz.title}
            </span>
            <h2 className="text-xl font-bold text-gray-900 mt-3">{activeQuiz.subtitle}</h2>
            <p className="text-sm text-gray-500 mt-1">{activeQuiz.description}</p>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(Object.keys(answers).length / activeQuiz.questions.length) * 100}%`,
                backgroundColor: activeQuiz.accentColor,
              }}
            />
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {activeQuiz.questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                total={activeQuiz.questions.length}
                accentColor={activeQuiz.accentColor}
                onAnswer={(correct) => handleAnswer(q.id, correct)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Module selection view ──
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            Verificación de Aprendizaje
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Quizzes por Módulo
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Verifica tu comprensión al final de cada módulo. Cada pregunta incluye
            explicación detallada — el objetivo es aprender, no solo acertar.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {Object.values(quizModules).map((quiz) => {
            const bestScore = completedQuizzes[quiz.id];
            const passed = bestScore !== undefined && bestScore >= quiz.passingScore;

            return (
              <button
                key={quiz.id}
                onClick={() => { setActiveQuizId(quiz.id); setAnswers({}); setShowResults(false); }}
                className={`group relative text-left rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                  passed ? "border-emerald-300 bg-emerald-50/50" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {passed && (
                  <div className="absolute -top-2.5 -right-2.5 bg-emerald-500 text-white rounded-full p-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                <span
                  className="inline-block text-xs font-bold px-2.5 py-1 rounded-lg text-white mb-3"
                  style={{ backgroundColor: quiz.accentColor }}
                >
                  {quiz.title}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.subtitle}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{quiz.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{quiz.questions.length} preguntas</span>
                  {bestScore !== undefined && (
                    <span className={`text-xs font-bold ${passed ? "text-emerald-600" : "text-amber-600"}`}>
                      Mejor: {bestScore}%
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium mt-3" style={{ color: quiz.accentColor }}>
                  {bestScore !== undefined ? "Repetir quiz" : "Comenzar quiz"}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          Mínimo {Object.values(quizModules)[0]?.passingScore}% para superar cada módulo · Curso &quot;Prompt Mastery para Docentes&quot;
        </p>
      </div>
    </div>
  );
}
