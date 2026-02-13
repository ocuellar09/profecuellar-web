"use client";

import { useState, useCallback } from "react";
import {
  Scale,
  ShieldAlert,
  Brain,
  Heart,
  RotateCcw,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Trophy,
  BookOpen,
  Eye,
  Lock,
  Users,
  Info,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ScoreImpact {
  etica: number;
  pedagogia: number;
  empatia: number;
}

interface Option {
  id: string;
  text: string;
  nextNodeId: string;
  scoreImpact: ScoreImpact;
}

interface ScenarioNode {
  id: string;
  narrative: string;
  context?: string;
  options?: Option[];
  isEnding?: boolean;
  endingType?: "optimal" | "acceptable" | "risky";
  feedback?: string;
  reflection?: string;
  keyTakeaway?: string;
}

interface Scenario {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  accentColor: string;
  bgGradient: string;
  nodes: Record<string, ScenarioNode>;
  startNodeId: string;
}

interface DecisionRecord {
  nodeId: string;
  chosenOptionId: string;
  chosenText: string;
}

// ─── Scenario Data ──────────────────────────────────────────────────────────

const scenarios: Scenario[] = [
  {
    id: "plagiarism",
    title: "El Trabajo Sospechoso",
    icon: <Eye className="w-5 h-5" />,
    description:
      "Una alumna entrega un ensayo brillante, pero algo no encaja. ¿Cómo manejas la situación?",
    accentColor: "#E8590C",
    bgGradient: "from-orange-50 to-amber-50",
    nodes: {
      start: {
        id: "start",
        narrative:
          "Lunes por la mañana. Estás corrigiendo ensayos de 3º de ESO sobre la Revolución Francesa. El ensayo de Lucía, una alumna que suele entregar trabajos correctos pero sin brillo, es sorprendentemente sofisticado: usa vocabulario académico avanzado, cita historiadores que no visteis en clase y tiene una estructura impecable.",
        context:
          "Lucía ha mejorado sus notas este trimestre. No tienes política de aula sobre IA. Otros compañeros han entregado trabajos similares en calidad.",
        options: [
          {
            id: "a1",
            text: 'Pasar el texto por un detector de IA (GPTZero, Turnitin) y, si da positivo, confrontar a Lucía con la "evidencia".',
            nextNodeId: "detector",
            scoreImpact: { etica: -1, pedagogia: -1, empatia: -1 },
          },
          {
            id: "a2",
            text: "Hablar con Lucía en privado, sin acusar, preguntándole sobre su proceso de escritura y las fuentes que usó.",
            nextNodeId: "conversation",
            scoreImpact: { etica: 2, pedagogia: 2, empatia: 2 },
          },
          {
            id: "a3",
            text: "No hacer nada especial. Si el contenido es correcto, la calidad del trabajo merece buena nota independientemente de cómo lo hizo.",
            nextNodeId: "ignore",
            scoreImpact: { etica: -1, pedagogia: -2, empatia: 0 },
          },
        ],
      },
      detector: {
        id: "detector",
        narrative:
          'Pasas el ensayo por GPTZero. El resultado dice: "85% de probabilidad de ser generado por IA". Citas a Lucía al despacho y le muestras el resultado en pantalla. Lucía se pone nerviosa y empieza a llorar. Dice que sí usó ChatGPT, pero "solo para organizar sus ideas" y que luego reescribió todo.',
        context:
          "Los detectores de IA tienen tasas de falsos positivos del 10-30%, especialmente con textos de hablantes no nativos o estudiantes con alto rendimiento. No existe política de centro sobre uso de IA.",
        options: [
          {
            id: "b1",
            text: "Suspender el trabajo. Las reglas son las reglas, aunque no estuvieran escritas. Debería haber sabido que usar IA no está permitido.",
            nextNodeId: "punish",
            scoreImpact: { etica: -2, pedagogia: -2, empatia: -2 },
          },
          {
            id: "b2",
            text: "Reconocer que no tenías política clara, explicarle por qué importa el proceso propio, y pedirle que rehaga el ensayo documentando cada paso.",
            nextNodeId: "redirect_detector",
            scoreImpact: { etica: 1, pedagogia: 2, empatia: 1 },
          },
        ],
      },
      punish: {
        id: "punish",
        isEnding: true,
        endingType: "risky",
        narrative:
          "Lucía recibe un cero. Al día siguiente, su madre llama al centro. Argumenta que nunca se comunicó una política sobre IA y que el detector no es fiable. La jefa de estudios te pide explicaciones. Otros alumnos que también usaron IA pero no fueron detectados mantienen sus notas. Lucía pierde confianza y deja de participar en clase.",
        feedback:
          "Penalizar sin política previa y basándose en detectores poco fiables genera inequidad y daña la relación pedagógica. Los detectores de IA no son evidencia concluyente — son herramientas orientativas con altas tasas de error.",
        reflection:
          "¿Qué habría cambiado si hubieras tenido un protocolo ético de aula (el 'Semáforo de IA') desde el inicio del curso?",
        keyTakeaway:
          "Antes de detectar, establece normas. Sin política clara, no hay infracción.",
      },
      redirect_detector: {
        id: "redirect_detector",
        isEnding: true,
        endingType: "acceptable",
        narrative:
          "Lucía rehace el ensayo con un 'diario de proceso': documenta sus búsquedas, borradores y decisiones. El resultado es menos pulido pero auténticamente suyo. Aprovechas la situación para crear con toda la clase el 'Semáforo de IA': usos verdes (permitidos), amarillos (con supervisión) y rojos (prohibidos).",
        feedback:
          "Buena recuperación. Convertiste un conflicto en oportunidad de aprendizaje. Sin embargo, el uso inicial del detector como 'prueba' pudo haber dañado la confianza. Lo ideal es no llegar a ese punto.",
        reflection:
          "¿Cómo habrías diseñado la tarea originalmente para que el uso de IA fuera transparente en vez de clandestino?",
        keyTakeaway:
          "De la detección a la declaración: diseña tareas donde el proceso sea tan importante como el producto.",
      },
      conversation: {
        id: "conversation",
        narrative:
          "Te sientas con Lucía en un momento tranquilo. Le dices: «Tu ensayo me impresionó. Cuéntame cómo lo trabajaste, qué fuentes consultaste.» Lucía, sin sentirse acusada, te cuenta con naturalidad que usó ChatGPT para buscar información y organizar su esquema, y luego escribió con sus palabras. Te muestra incluso el historial de chat.",
        context:
          "Lucía no siente que hizo trampa porque nadie le dijo que no podía usar IA. Su proceso fue legítimo: usó la IA como herramienta de investigación, no como redactora.",
        options: [
          {
            id: "c1",
            text: "Valorar su honestidad, evaluar el ensayo normalmente, y usar su caso (anónimo) como ejemplo para establecer normas de clase sobre IA.",
            nextNodeId: "best_outcome",
            scoreImpact: { etica: 2, pedagogia: 2, empatia: 2 },
          },
          {
            id: "c2",
            text: "Pedirle que rehaga el ensayo sin IA para comprobar que realmente domina el contenido, pero sin penalización.",
            nextNodeId: "redo_fair",
            scoreImpact: { etica: 1, pedagogia: 1, empatia: 0 },
          },
        ],
      },
      best_outcome: {
        id: "best_outcome",
        isEnding: true,
        endingType: "optimal",
        narrative:
          "Evalúas el ensayo de Lucía con la misma rúbrica que los demás. En la siguiente clase, sin nombrarla, presentas el dilema: «¿Está bien usar IA para investigar? ¿Y para redactar? ¿Dónde está el límite?». La clase construye colectivamente el 'Semáforo de IA'. Lucía participa activamente. Ahora tienes una política de aula co-creada y un precedente de transparencia.",
        feedback:
          "Ruta óptima. Actuaste con presunción de inocencia, fomentaste la transparencia y convertiste un caso individual en aprendizaje colectivo. Modelaste exactamente el comportamiento ético que esperas de tus alumnos.",
        reflection:
          "¿Cómo adaptarías el 'Semáforo de IA' para diferentes asignaturas o niveles educativos?",
        keyTakeaway:
          "La transparencia se construye desde la confianza, no desde la sospecha. El docente modela la ética que exige.",
      },
      redo_fair: {
        id: "redo_fair",
        isEnding: true,
        endingType: "acceptable",
        narrative:
          "Lucía rehace el ensayo. Es más corto y menos sofisticado, pero demuestra comprensión del tema. Tú notas que perdió la motivación extra que tenía cuando podía investigar con más herramientas. Estableces normas para futuros trabajos, pero el mensaje implícito fue: 'usar IA estuvo mal'.",
        feedback:
          "Decisión justa pero con matices. No penalizaste, pero el mensaje implícito de 'rehaz sin IA' sugiere que su proceso original era inválido, cuando en realidad fue bastante razonable. Esto puede desincentivar la transparencia futura.",
        reflection:
          "¿Había otra forma de verificar el aprendizaje de Lucía sin invalidar su proceso original?",
        keyTakeaway:
          "Cuidado con los mensajes implícitos: pedir rehacer puede comunicar 'hiciste trampa' aunque no lo digas.",
      },
      ignore: {
        id: "ignore",
        narrative:
          "Pones buena nota al ensayo y sigues adelante. La semana siguiente, otros tres alumnos entregan ensayos con el mismo nivel sospechosamente alto. Un alumno que sí escribió su propio ensayo (más modesto) se queja: «¿Para qué me esfuerzo si los que usan ChatGPT sacan mejor nota?».",
        context:
          "La inacción no es neutralidad. Sin política clara, estás creando un sistema que premia el uso no declarado de IA y penaliza el esfuerzo propio.",
        options: [
          {
            id: "d1",
            text: "Reaccionar ahora: parar la clase y abrir un debate sobre IA, honestidad y qué significa aprender.",
            nextNodeId: "late_reaction",
            scoreImpact: { etica: 1, pedagogia: 1, empatia: 1 },
          },
          {
            id: "d2",
            text: "Seguir sin intervenir. No quieres abrir la caja de Pandora ni acusar sin pruebas.",
            nextNodeId: "total_ignore",
            scoreImpact: { etica: -2, pedagogia: -2, empatia: -1 },
          },
        ],
      },
      late_reaction: {
        id: "late_reaction",
        isEnding: true,
        endingType: "acceptable",
        narrative:
          "Abres el debate. Algunos alumnos admiten haber usado IA. Otros se sienten validados por haberse esforzado solos. Juntos crean las normas, pero queda la sensación de que llegaste tarde. Los primeros ensayos con IA ya tienen nota y cambiar eso ahora sería injusto.",
        feedback:
          "Mejor tarde que nunca, pero la demora generó inequidad. Las primeras entregas con IA no declarada ya están calificadas. La lección: las normas sobre IA deben existir ANTES de la primera tarea, no después del primer conflicto.",
        reflection:
          "Si pudieras rebobinar al primer día de clase, ¿qué tres normas sobre IA establecerías?",
        keyTakeaway:
          "La política de IA no es reactiva. Se diseña antes de necesitarla, igual que una rúbrica.",
      },
      total_ignore: {
        id: "total_ignore",
        isEnding: true,
        endingType: "risky",
        narrative:
          "Para final de trimestre, la mayoría de trabajos son generados por IA sin declarar. Los alumnos que escriben por sí mismos se sienten en desventaja y dejan de esforzarse. La calidad de los debates en clase cae porque nadie ha procesado realmente los contenidos. Has perdido una herramienta de evaluación y, peor aún, la cultura de esfuerzo del grupo.",
        feedback:
          "La no-intervención es una decisión con consecuencias. Ignorar el uso de IA no lo elimina — lo normaliza sin criterio. Sin guía docente, los alumnos aprenden que la opacidad es aceptable.",
        reflection:
          "¿En qué otros ámbitos de tu aula la 'no-decisión' está funcionando como una política implícita?",
        keyTakeaway:
          "No tener política de IA ya es una política: la del 'todo vale'. Y eso perjudica a quien más se esfuerza.",
      },
    },
    startNodeId: "start",
  },
  {
    id: "privacy",
    title: "Los Datos del Alumnado",
    icon: <Lock className="w-5 h-5" />,
    description:
      "Un compañero quiere usar IA para analizar informes de alumnos con necesidades especiales. ¿Qué haces?",
    accentColor: "#7C3AED",
    bgGradient: "from-violet-50 to-purple-50",
    nodes: {
      start: {
        id: "start",
        narrative:
          "Viernes a mediodía, sala de profesores. Tu compañero Marcos, tutor de 2º ESO, está agobiado. Tiene que preparar 12 informes individualizados para la reunión de evaluación del lunes. Te enseña su portátil: ha pegado en ChatGPT los datos de tres alumnos con NEAE — incluyendo nombres, diagnósticos psicopedagógicos y adaptaciones curriculares — y le ha pedido a la IA que redacte los informes.",
        context:
          "Marcos no tiene mala intención: está desbordado de trabajo. ChatGPT tiene el historial de entrenamiento activado por defecto. Los datos de alumnos con NEAE son especialmente sensibles bajo el GDPR (datos de salud de menores = categoría especial).",
        options: [
          {
            id: "a1",
            text: "No decir nada. Marcos es adulto y profesional, seguro sabe lo que hace. Además, tú también has usado IA para cosas del cole.",
            nextNodeId: "say_nothing",
            scoreImpact: { etica: -2, pedagogia: -1, empatia: 0 },
          },
          {
            id: "a2",
            text: "Alertar a Marcos del problema de privacidad, ayudarle a eliminar el historial, y mostrarle cómo hacer lo mismo de forma segura.",
            nextNodeId: "help_marcos",
            scoreImpact: { etica: 2, pedagogia: 2, empatia: 2 },
          },
          {
            id: "a3",
            text: "Reportar directamente a la dirección del centro. Es una violación grave de protección de datos y debe quedar registro.",
            nextNodeId: "report",
            scoreImpact: { etica: 1, pedagogia: 0, empatia: -2 },
          },
        ],
      },
      say_nothing: {
        id: "say_nothing",
        narrative:
          "No intervienes. El lunes, Marcos presenta los informes y todo sale bien... aparentemente. Tres semanas después, un padre tecnológicamente informado descubre que los datos de su hijo con dislexia aparecen en una filtración de datos de entrenamiento de un modelo de IA. Rastrean el origen: la sesión de ChatGPT de Marcos. El centro enfrenta una denuncia ante la Agencia de Protección de Datos.",
        context:
          "Bajo el GDPR/LOPDGDD, el centro educativo es responsable del tratamiento de datos. Las sanciones pueden alcanzar los 20 millones de euros o el 4% del presupuesto. Tú sabías y no actuaste.",
        options: [
          {
            id: "b1",
            text: "Asumir tu parte de responsabilidad y proponer al centro crear un protocolo de uso de IA que prevenga futuros incidentes.",
            nextNodeId: "late_protocol",
            scoreImpact: { etica: 1, pedagogia: 1, empatia: 1 },
          },
          {
            id: "b2",
            text: "Distanciarte del asunto. Marcos es quien subió los datos, no tú.",
            nextNodeId: "distance",
            scoreImpact: { etica: -2, pedagogia: -1, empatia: -2 },
          },
        ],
      },
      late_protocol: {
        id: "late_protocol",
        isEnding: true,
        endingType: "acceptable",
        narrative:
          "Propones un protocolo y la dirección lo acepta, pero el daño ya está hecho. El centro recibe una sanción económica, Marcos enfrenta un expediente, y la confianza de las familias se resiente. Tu protocolo es bueno, pero llegó tarde. El centro ahora prohíbe TODO uso de IA por miedo, perdiendo las oportunidades pedagógicas.",
        feedback:
          "Actuar después de la crisis es mejor que no actuar, pero la oportunidad real estaba en el momento en que viste a Marcos. Un minuto de conversación habría prevenido semanas de consecuencias. La ética no es solo 'no hacer daño' — es prevenir el daño cuando puedes.",
        reflection:
          "¿Existe en tu centro un protocolo claro sobre qué datos se pueden y no se pueden procesar con IA?",
        keyTakeaway:
          "La responsabilidad ética es proactiva. Si ves el riesgo y callas, eres parte del problema.",
      },
      distance: {
        id: "distance",
        isEnding: true,
        endingType: "risky",
        narrative:
          "Te mantienes al margen. Marcos enfrenta solo las consecuencias. Otros profesores se enteran de que tú estabas presente y no dijiste nada. La confianza del equipo docente se fractura. El centro implementa restricciones draconianamente estrictas sobre tecnología en general. Pierdes credibilidad como referente tecnológico.",
        feedback:
          "La omisión ante un riesgo conocido tiene costes éticos y profesionales. En un entorno educativo, la protección de datos de menores es responsabilidad compartida. La confianza entre colegas se construye con honestidad, incluso cuando es incómoda.",
        reflection:
          "¿Qué te impidió hablar en el momento? ¿Cómo podrías haber planteado la conversación sin sonar acusatorio?",
        keyTakeaway:
          "La colegialidad incluye señalar riesgos. Un buen compañero avisa, no mira para otro lado.",
      },
      help_marcos: {
        id: "help_marcos",
        narrative:
          "Te acercas a Marcos con naturalidad: «Oye, me parece genial que uses IA para los informes, pero hay un tema con los datos de los alumnos que te puede meter en un lío gordo.» Le explicas el riesgo de GDPR con datos de menores y diagnósticos. Marcos se alarma — no había pensado en ello.",
        context:
          "Marcos está receptivo pero necesita solución, no solo el problema. Tiene 12 informes para el lunes y ya son las 14:00 del viernes.",
        options: [
          {
            id: "c1",
            text: "Mostrarle cómo anonimizar los datos (usar 'Alumno A', eliminar diagnósticos específicos) y desactivar el entrenamiento en la configuración de ChatGPT.",
            nextNodeId: "anonymize",
            scoreImpact: { etica: 2, pedagogia: 2, empatia: 2 },
          },
          {
            id: "c2",
            text: "Decirle que no use IA en absoluto para estos informes. Es demasiado arriesgado con datos sensibles.",
            nextNodeId: "ban_ai",
            scoreImpact: { etica: 1, pedagogia: -1, empatia: 0 },
          },
        ],
      },
      anonymize: {
        id: "anonymize",
        isEnding: true,
        endingType: "optimal",
        narrative:
          "Le ayudas a Marcos a: 1) Eliminar la conversación anterior con datos reales, 2) Desactivar el entrenamiento del modelo, 3) Crear una plantilla anonimizada: «Alumno de 13 años con diagnóstico de [tipo general] que presenta [características observables]». Los informes salen bien y a tiempo. El lunes propones en claustro crear un protocolo de 'IA segura' para todo el centro, usando el caso (anónimo) como motivación.",
        feedback:
          "Ruta óptima. Resolviste el problema inmediato (anonimizar), previniste el riesgo futuro (desactivar entrenamiento), no dejaste solo a tu compañero y escalaste constructivamente la solución al nivel institucional. Así se ejerce el liderazgo ético.",
        reflection:
          "¿Podrías diseñar una plantilla de prompt 'segura' para informes de NEAE que cualquier docente de tu centro pudiera usar?",
        keyTakeaway:
          "No prohíbas: enseña a usar de forma segura. Anonimizar + configurar privacidad = IA responsable.",
      },
      ban_ai: {
        id: "ban_ai",
        isEnding: true,
        endingType: "acceptable",
        narrative:
          "Marcos acepta pero se queda sin solución para sus 12 informes. Pasa el fin de semana entero redactándolos a mano, agotado. Los informes son correctos pero genéricos — sin el tiempo necesario para personalizarlos. La próxima vez que necesite ayuda con carga administrativa, probablemente use IA en secreto sin consultarte.",
        feedback:
          "Protegiste los datos, pero no ofreciste alternativa. Cuando la carga de trabajo es real, prohibir sin dar solución solo empuja la práctica a la clandestinidad. La respuesta ética más completa incluye el 'cómo sí' además del 'cómo no'.",
        reflection:
          "¿Qué herramientas o técnicas podrías haber sugerido para que Marcos usara IA de forma segura y eficiente?",
        keyTakeaway:
          "Prohibir sin alternativa genera uso clandestino. Siempre ofrece el 'cómo sí' junto al 'cómo no'.",
      },
      report: {
        id: "report",
        narrative:
          "Vas directamente a la dirección. La directora agradece tu aviso pero te dice que hable primero con Marcos. Marcos se entera de que lo reportaste sin hablar con él primero. Se siente traicionado y lo comenta en la sala de profesores.",
        context:
          "Reportar era legalmente correcto pero socialmente costoso. La mayoría de protocolos éticos recomiendan escalar gradualmente: primero conversación directa, luego mediación, y solo si hay resistencia, reporte formal.",
        options: [
          {
            id: "d1",
            text: "Hablar con Marcos, disculparte por no haberlo consultado primero, y ofrecerle ayuda para resolver la situación juntos.",
            nextNodeId: "repair",
            scoreImpact: { etica: 1, pedagogia: 1, empatia: 2 },
          },
          {
            id: "d2",
            text: "Mantener tu posición. Los datos de menores son sagrados y no podías arriesgarte a que Marcos no actuara.",
            nextNodeId: "stand_ground",
            scoreImpact: { etica: 0, pedagogia: 0, empatia: -1 },
          },
        ],
      },
      repair: {
        id: "repair",
        isEnding: true,
        endingType: "acceptable",
        narrative:
          "Marcos inicialmente está molesto, pero tu disculpa sincera y oferta de ayuda le desarman. Juntos eliminan los datos, configuran la privacidad y preparan los informes de forma segura. La relación se repara parcialmente. La dirección, al ver que los dos profesores lo resolvieron, decide crear un grupo de trabajo sobre IA en el que ambos participan.",
        feedback:
          "Buen resultado final, pero el camino fue innecesariamente costoso. La conversación directa debió ser el primer paso. Reportar sin intentar resolver primero es como poner un parte disciplinario a un alumno sin hablar con él — técnicamente válido, humanamente torpe.",
        reflection:
          "¿Cuándo es apropiado escalar directamente a dirección vs. intentar resolverlo entre colegas primero?",
        keyTakeaway:
          "Escalada gradual: primero conversa, luego media, finalmente reporta. Cada paso solo si el anterior falla.",
      },
      stand_ground: {
        id: "stand_ground",
        isEnding: true,
        endingType: "risky",
        narrative:
          "Mantienes tu posición. Marcos elimina los datos pero la relación queda rota. Otros profesores empiezan a ocultar su uso de IA por miedo a ser reportados. Se crea un clima de desconfianza que impide cualquier innovación tecnológica colaborativa en el centro. Tienes razón legal, pero el efecto neto es negativo.",
        feedback:
          "Tener razón no siempre significa haber actuado bien. La ética profesional incluye la forma, no solo el fondo. Pudiste proteger los datos Y mantener la colegialidad si hubieras empezado por la conversación directa.",
        reflection:
          "¿Hay situaciones en tu contexto profesional donde 'tener razón' está siendo más importante que 'hacer bien'?",
        keyTakeaway:
          "La ética tiene forma: el 'qué' importa, pero el 'cómo' determina si el resultado es constructivo o destructivo.",
      },
    },
    startNodeId: "start",
  },
  {
    id: "bias",
    title: "El Sesgo Invisible",
    icon: <Users className="w-5 h-5" />,
    description:
      "Usas IA para crear material sobre civilizaciones antiguas. El resultado tiene sesgos culturales graves. ¿Cómo reaccionas?",
    accentColor: "#059669",
    bgGradient: "from-emerald-50 to-teal-50",
    nodes: {
      start: {
        id: "start",
        narrative:
          "Estás preparando una unidad sobre civilizaciones antiguas para 1º de Bachillerato. Le pides a la IA: «Crea una tabla comparativa de las civilizaciones más importantes de la antigüedad con sus contribuciones principales.» El resultado incluye Grecia, Roma, Egipto, Mesopotamia y China. No menciona ninguna civilización precolombina, africana subsahariana ni del sudeste asiático. Las 'contribuciones' de las no-occidentales se describen como 'precursoras' de logros occidentales.",
        context:
          "Tu clase tiene alumnos de origen latinoamericano, marroquí y senegalés. El currículo oficial sí incluye civilizaciones no occidentales. La IA ha reproducido un sesgo eurocéntrico muy común en sus datos de entrenamiento.",
        options: [
          {
            id: "a1",
            text: "Usar el material tal cual. La IA sabrá qué civilizaciones son 'las más importantes'. Además, el currículo se centra principalmente en la tradición occidental.",
            nextNodeId: "use_as_is",
            scoreImpact: { etica: -2, pedagogia: -2, empatia: -2 },
          },
          {
            id: "a2",
            text: "Descartar el resultado y escribir la tabla tú, sin IA. No te puedes fiar de una herramienta con estos sesgos.",
            nextNodeId: "reject_ai",
            scoreImpact: { etica: 1, pedagogia: 0, empatia: 1 },
          },
          {
            id: "a3",
            text: "Iterar el prompt: pedir explícitamente diversidad geográfica, cuestionar la jerarquía implícita, y usar el resultado sesgado como material didáctico sobre sesgo algorítmico.",
            nextNodeId: "iterate_teach",
            scoreImpact: { etica: 2, pedagogia: 2, empatia: 2 },
          },
        ],
      },
      use_as_is: {
        id: "use_as_is",
        narrative:
          "Presentas la tabla en clase. Amina, alumna de origen senegalés, levanta la mano: «Profe, ¿y el Imperio de Malí? Mi abuela siempre habla de Mansa Musa, que era el hombre más rico de la historia.» Otros alumnos latinoamericanos preguntan por los Mayas y los Incas. Te quedas sin respuesta convincente.",
        context:
          "Los alumnos están cuestionando legítimamente el material. Tu autoridad pedagógica depende de cómo manejes este momento.",
        options: [
          {
            id: "b1",
            text: "Reconocer el vacío, agradecer a Amina, y convertirlo en actividad: que cada alumno investigue una civilización no incluida.",
            nextNodeId: "recover_classroom",
            scoreImpact: { etica: 1, pedagogia: 2, empatia: 2 },
          },
          {
            id: "b2",
            text: "Explicar que la tabla muestra 'las más influyentes en nuestra cultura occidental' y que las demás se verán más adelante.",
            nextNodeId: "justify",
            scoreImpact: { etica: -1, pedagogia: -1, empatia: -1 },
          },
        ],
      },
      recover_classroom: {
        id: "recover_classroom",
        isEnding: true,
        endingType: "acceptable",
        narrative:
          "Conviertes el error en oportunidad. Los alumnos investigan civilizaciones omitidas y crean una tabla expandida mucho más rica. Amina presenta el Imperio de Malí con orgullo. El resultado pedagógico es bueno, pero dependió de que una alumna detectara el sesgo — no de tu planificación.",
        feedback:
          "Buena reacción, pero reactiva. El sesgo debió detectarse en la fase de revisión del material, no en el aula. Depender de que los alumnos corrijan tu material es arriesgado: ¿qué habría pasado si nadie hubiera dicho nada?",
        reflection:
          "¿Qué checklist de revisión podrías aplicar a TODO material generado por IA antes de presentarlo en clase?",
        keyTakeaway:
          "La auditoría de sesgo es parte del trabajo docente con IA, no un extra opcional.",
      },
      justify: {
        id: "justify",
        isEnding: true,
        endingType: "risky",
        narrative:
          "Amina no insiste pero se cierra. Los alumnos latinoamericanos intercambian miradas. Has reforzado implícitamente una narrativa eurocéntrica y, peor aún, has hecho sentir a parte de tu alumnado que su herencia cultural es secundaria. La confianza del grupo se erosiona sutilmente.",
        feedback:
          "Justificar el sesgo es peor que cometerlo inadvertidamente. Al defender la tabla como 'las más influyentes', estás imponiendo un juicio de valor disfrazado de objetividad. Los datos de entrenamiento de la IA reflejan desequilibrios de poder históricos — tu trabajo como docente es compensarlos, no amplificarlos.",
        reflection:
          "¿En qué otros materiales de tu asignatura podrían estar presentes sesgos que has normalizado por familiaridad?",
        keyTakeaway:
          "Defender el sesgo algorítmico como 'objetividad' lo convierte en sesgo docente. El pensamiento crítico empieza por uno mismo.",
      },
      reject_ai: {
        id: "reject_ai",
        narrative:
          "Escribes la tabla manualmente, incluyendo civilizaciones diversas. El resultado es mejor representado, pero te llevó 2 horas. Un compañero te pregunta: «¿Por qué no usas IA? Yo hago mis materiales en 10 minutos.» Le cuentas el problema del sesgo y te responde: «Bah, exageras, a mí me funciona bien.»",
        context:
          "Has resuelto TU material, pero no has abordado el problema sistémico: tú y tus compañeros seguirán encontrando estos sesgos cada vez que usen IA.",
        options: [
          {
            id: "c1",
            text: "Proponer al departamento crear un protocolo de 'auditoría de sesgo' para material generado por IA, con checklist incluido.",
            nextNodeId: "systemic",
            scoreImpact: { etica: 2, pedagogia: 2, empatia: 1 },
          },
          {
            id: "c2",
            text: "Dejarlo estar. Cada uno es responsable de su propio material. Tú ya hiciste lo correcto con el tuyo.",
            nextNodeId: "individual",
            scoreImpact: { etica: 0, pedagogia: -1, empatia: 0 },
          },
        ],
      },
      systemic: {
        id: "systemic",
        isEnding: true,
        endingType: "optimal",
        narrative:
          "Presentas al departamento un protocolo simple: 1) Revisar representación geográfica y cultural, 2) Buscar lenguaje jerárquico ('precursor de', 'primitivo'), 3) Contrastar con el currículo oficial, 4) Pedir a la IA una autocrítica de su respuesta. Tu colega escéptico lo prueba y se sorprende al encontrar sesgos en su propio material. El protocolo se adopta y compartes la checklist con otros departamentos.",
        feedback:
          "Excelente combinación: resolviste el problema inmediato (tu material), identificaste la causa raíz (el sesgo del modelo) y escalaste la solución al nivel sistémico (protocolo departamental). La única mejora sería haber USADO la IA de forma iterativa en vez de descartarla — así habrías demostrado que el problema tiene solución técnica.",
        reflection:
          "¿Cómo podrías haber iterado el prompt original para obtener un resultado diverso sin escribir todo manualmente?",
        keyTakeaway:
          "Los sesgos de IA son sistémicos y requieren soluciones sistémicas. Un protocolo de auditoría protege a todo el centro.",
      },
      individual: {
        id: "individual",
        isEnding: true,
        endingType: "acceptable",
        narrative:
          "Tu material es bueno, pero tu compañero sigue usando material sesgado sin saberlo. Al final del año, una revisión de materiales detecta inconsistencias: tu unidad es inclusiva, la de tu compañero es eurocéntrica. Los alumnos que tuvieron a tu compañero recibieron una visión más limitada del mismo tema. La calidad educativa dependió de qué profesor les tocó.",
        feedback:
          "Hiciste bien en tu aula, pero la responsabilidad profesional no termina en tu puerta. En un centro educativo, los sesgos de un docente afectan a todo el alumnado. El liderazgo pedagógico incluye compartir aprendizajes con colegas, especialmente los incómodos.",
        reflection:
          "¿Qué barreras reales existen en tu centro para compartir buenas prácticas entre departamentos?",
        keyTakeaway:
          "La ética individual es necesaria pero insuficiente. El cambio real es institucional.",
      },
      iterate_teach: {
        id: "iterate_teach",
        narrative:
          "Reescribes el prompt: «Incluye civilizaciones de todos los continentes. Evita lenguaje jerárquico como 'precursor' o 'primitivo'. Describe cada civilización por sus logros propios, no en relación con Occidente.» El resultado mejora drásticamente. Además, guardas la tabla original sesgada. Ahora tienes dos materiales.",
        context:
          "Tienes la tabla sesgada (versión 1) y la tabla mejorada (versión 2). Esto es una oportunidad pedagógica única: enseñar pensamiento crítico sobre IA usando tu propio proceso.",
        options: [
          {
            id: "d1",
            text: "Usar AMBAS tablas en clase: mostrar la V1 sesgada, analizarla críticamente con los alumnos, y luego revelar la V2. Enseñar sesgo algorítmico con ejemplo real.",
            nextNodeId: "meta_lesson",
            scoreImpact: { etica: 2, pedagogia: 3, empatia: 2 },
          },
          {
            id: "d2",
            text: "Usar solo la V2 mejorada. No quieres exponer material sesgado a los alumnos ni complicar la clase.",
            nextNodeId: "v2_only",
            scoreImpact: { etica: 1, pedagogia: 1, empatia: 1 },
          },
        ],
      },
      meta_lesson: {
        id: "meta_lesson",
        isEnding: true,
        endingType: "optimal",
        narrative:
          "Presentas la V1 sin decir de dónde viene. Preguntas: «¿Qué notáis? ¿Falta algo? ¿Qué imagen del mundo transmite esta tabla?». Los alumnos identifican las ausencias. Revelas que fue generada por IA y muestras cómo la iteraste. Los alumnos entienden visceralmente qué es el sesgo algorítmico. Amina dice: «O sea que si no le dices a la IA que incluya a África, no existe.» Exacto. Has enseñado historia Y pensamiento crítico sobre IA en la misma sesión.",
        feedback:
          "Ruta magistral. Convertiste un fallo de la IA en la mejor clase del trimestre. Modelaste el ciclo completo: detectar sesgo → iterar → mejorar → reflexionar. Tus alumnos no solo aprendieron sobre civilizaciones: aprendieron a cuestionar cualquier fuente, incluida la IA. Eso es alfabetización digital real.",
        reflection:
          "¿Qué otros contenidos de tu asignatura podrían beneficiarse de este enfoque de 'mostrar el sesgo para enseñar a verlo'?",
        keyTakeaway:
          "El sesgo de la IA no es un error a ocultar: es un recurso didáctico de primer orden para enseñar pensamiento crítico.",
      },
      v2_only: {
        id: "v2_only",
        isEnding: true,
        endingType: "acceptable",
        narrative:
          "La clase funciona bien con la tabla mejorada. Los alumnos reciben una visión más equilibrada de las civilizaciones antiguas. Sin embargo, no aprendieron a detectar sesgos por sí mismos — solo recibieron un producto ya corregido. Si encuentran contenido sesgado en el futuro (y lo harán), no tendrán herramientas para identificarlo.",
        feedback:
          "Decisión correcta pero conservadora. Proteger a los alumnos del contenido sesgado es importante, pero enseñarles a detectarlo es más valioso a largo plazo. Perdiste la oportunidad de convertir un problema en aprendizaje metacognitivo.",
        reflection:
          "¿Hay una forma de mostrar el sesgo de forma segura, sin reforzarlo, para que los alumnos desarrollen su propio 'radar' crítico?",
        keyTakeaway:
          "Corregir el sesgo en silencio protege hoy. Enseñar a detectar el sesgo protege para siempre.",
      },
    },
    startNodeId: "start",
  },
];

// ─── Score Utilities ────────────────────────────────────────────────────────

const scoreLabels: Record<keyof ScoreImpact, { label: string; icon: React.ReactNode }> = {
  etica: { label: "Ética", icon: <Scale className="w-4 h-4" /> },
  pedagogia: { label: "Pedagogía", icon: <Brain className="w-4 h-4" /> },
  empatia: { label: "Empatía", icon: <Heart className="w-4 h-4" /> },
};

function calculateTotalScore(decisions: DecisionRecord[], scenario: Scenario): ScoreImpact {
  const total: ScoreImpact = { etica: 0, pedagogia: 0, empatia: 0 };
  for (const d of decisions) {
    const node = scenario.nodes[d.nodeId];
    const option = node.options?.find((o) => o.id === d.chosenOptionId);
    if (option) {
      total.etica += option.scoreImpact.etica;
      total.pedagogia += option.scoreImpact.pedagogia;
      total.empatia += option.scoreImpact.empatia;
    }
  }
  return total;
}

function getScoreColor(val: number): string {
  if (val >= 4) return "text-emerald-600";
  if (val >= 2) return "text-sky-600";
  if (val >= 0) return "text-amber-600";
  return "text-red-600";
}

function getEndingBadge(type: string) {
  switch (type) {
    case "optimal":
      return {
        icon: <CheckCircle2 className="w-5 h-5" />,
        label: "Ruta Óptima",
        bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
      };
    case "acceptable":
      return {
        icon: <AlertTriangle className="w-5 h-5" />,
        label: "Ruta Aceptable",
        bg: "bg-amber-100 text-amber-800 border-amber-300",
      };
    case "risky":
      return {
        icon: <XCircle className="w-5 h-5" />,
        label: "Ruta de Riesgo",
        bg: "bg-red-100 text-red-800 border-red-300",
      };
    default:
      return {
        icon: <Info className="w-5 h-5" />,
        label: "Final",
        bg: "bg-gray-100 text-gray-800 border-gray-300",
      };
  }
}

// ─── Components ─────────────────────────────────────────────────────────────

function ScenarioCard({
  scenario,
  completed,
  onSelect,
}: {
  scenario: Scenario;
  completed: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`group relative text-left w-full rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
        completed
          ? "border-emerald-300 bg-emerald-50/50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {completed && (
        <div className="absolute -top-2.5 -right-2.5 bg-emerald-500 text-white rounded-full p-1">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      )}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: scenario.accentColor + "18", color: scenario.accentColor }}
      >
        {scenario.icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{scenario.title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">{scenario.description}</p>
      <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: scenario.accentColor }}>
        {completed ? "Volver a jugar" : "Comenzar escenario"}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );
}

function ScenarioPlayer({
  scenario,
  onComplete,
  onBack,
}: {
  scenario: Scenario;
  onComplete: () => void;
  onBack: () => void;
}) {
  const [currentNodeId, setCurrentNodeId] = useState(scenario.startNodeId);
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentNode = scenario.nodes[currentNodeId];
  const isEnding = currentNode.isEnding;

  const handleChoose = useCallback(
    (option: Option) => {
      setSelectedOption(option.id);
      setDecisions((prev) => [
        ...prev,
        { nodeId: currentNodeId, chosenOptionId: option.id, chosenText: option.text },
      ]);

      setTimeout(() => {
        setCurrentNodeId(option.nextNodeId);
        setSelectedOption(null);
      }, 400);
    },
    [currentNodeId]
  );

  const handleRestart = useCallback(() => {
    setCurrentNodeId(scenario.startNodeId);
    setDecisions([]);
    setSelectedOption(null);
  }, [scenario.startNodeId]);

  const totalScore = isEnding ? calculateTotalScore(decisions, scenario) : null;
  const badge = isEnding && currentNode.endingType ? getEndingBadge(currentNode.endingType) : null;
  const stepNumber = decisions.length + 1;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1.5"
        >
          ← Volver a escenarios
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-mono">Paso {stepNumber}</span>
          <span>·</span>
          <span>{decisions.length} decisiones</span>
        </div>
      </div>

      {/* Scenario title bar */}
      <div
        className="flex items-center gap-3 mb-6 pb-4 border-b-2"
        style={{ borderColor: scenario.accentColor + "30" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: scenario.accentColor + "18", color: scenario.accentColor }}
        >
          {scenario.icon}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{scenario.title}</h2>
      </div>

      {/* Narrative */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <p className="text-gray-800 leading-relaxed text-[15px] whitespace-pre-line">
          {currentNode.narrative}
        </p>
        {currentNode.context && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                Contexto clave
              </p>
              <p className="text-sm text-amber-900 leading-relaxed">{currentNode.context}</p>
            </div>
          </div>
        )}
      </div>

      {/* Ending */}
      {isEnding && badge && totalScore && (
        <div className="space-y-5 animate-fade-in">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${badge.bg} font-semibold text-sm`}>
            {badge.icon}
            {badge.label}
          </div>

          {/* Feedback */}
          {currentNode.feedback && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-gray-500" />
                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
                  Análisis pedagógico
                </h4>
              </div>
              <p className="text-gray-700 leading-relaxed text-[15px]">{currentNode.feedback}</p>
            </div>
          )}

          {/* Scores */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-4">
              Tu perfil de decisión
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {(Object.keys(scoreLabels) as (keyof ScoreImpact)[]).map((key) => (
                <div key={key} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-gray-500 mb-2">
                    {scoreLabels[key].icon}
                    <span className="text-xs font-medium">{scoreLabels[key].label}</span>
                  </div>
                  <span className={`text-2xl font-bold tabular-nums ${getScoreColor(totalScore[key])}`}>
                    {totalScore[key] > 0 ? "+" : ""}
                    {totalScore[key]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reflection */}
          {currentNode.reflection && (
            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6">
              <h4 className="font-semibold text-violet-900 text-sm uppercase tracking-wider mb-2">
                🪞 Pregunta de reflexión
              </h4>
              <p className="text-violet-800 leading-relaxed italic">{currentNode.reflection}</p>
            </div>
          )}

          {/* Key takeaway */}
          {currentNode.keyTakeaway && (
            <div
              className="rounded-2xl p-6 border-2"
              style={{
                backgroundColor: scenario.accentColor + "08",
                borderColor: scenario.accentColor + "25",
              }}
            >
              <h4
                className="font-bold text-sm uppercase tracking-wider mb-2"
                style={{ color: scenario.accentColor }}
              >
                💡 Aprendizaje clave
              </h4>
              <p className="text-gray-900 font-medium leading-relaxed text-[15px]">
                {currentNode.keyTakeaway}
              </p>
            </div>
          )}

          {/* Decision trail */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-4">
              Tu camino de decisiones
            </h4>
            <div className="space-y-3">
              {decisions.map((d, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: scenario.accentColor }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{d.chosenText}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Explorar otra ruta
            </button>
            <button
              onClick={() => {
                onComplete();
                onBack();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-colors"
              style={{ backgroundColor: scenario.accentColor }}
            >
              Completar escenario
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Options (non-ending) */}
      {!isEnding && currentNode.options && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            ¿Qué haces?
          </p>
          {currentNode.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleChoose(option)}
              disabled={selectedOption !== null}
              className={`w-full text-left rounded-xl border-2 p-5 transition-all duration-300 ${
                selectedOption === option.id
                  ? "border-gray-400 bg-gray-100 scale-[0.98]"
                  : selectedOption !== null
                  ? "opacity-40 cursor-not-allowed border-gray-200"
                  : "border-gray-200 hover:border-gray-400 hover:shadow-md bg-white cursor-pointer"
              }`}
            >
              <p className="text-[15px] text-gray-800 leading-relaxed">{option.text}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function EthicsSimulator() {
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId);
  const progress = completedScenarios.size;

  if (activeScenario) {
    return (
      <div className="min-h-screen bg-gray-50/80 py-10 px-4">
        <ScenarioPlayer
          key={activeScenario.id}
          scenario={activeScenario}
          onComplete={() =>
            setCompletedScenarios((prev) => new Set([...prev, activeScenario.id]))
          }
          onBack={() => setActiveScenarioId(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            Módulo 0 · Recurso Interactivo
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Simulador de Decisión Ética
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Enfréntate a dilemas reales que ocurren en el aula con IA. Cada decisión
            tiene consecuencias. No hay respuestas perfectas — hay respuestas más
            informadas.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Trophy className="w-4 h-4" />
            <span>
              <span className="font-bold text-gray-900">{progress}</span> de{" "}
              {scenarios.length} completados
            </span>
          </div>
          <div className="flex gap-1.5">
            {scenarios.map((s) => (
              <div
                key={s.id}
                className={`w-8 h-1.5 rounded-full transition-colors ${
                  completedScenarios.has(s.id) ? "bg-emerald-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scenario grid */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              completed={completedScenarios.has(scenario.id)}
              onSelect={() => setActiveScenarioId(scenario.id)}
            />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 text-center">
          <p className="text-xs text-gray-400">
            Basado en casos reales adaptados. Parte del curso &quot;Prompt Mastery para
            Docentes&quot;.
          </p>
        </div>
      </div>
    </div>
  );
}
