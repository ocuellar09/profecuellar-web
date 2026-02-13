import { useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────

const scenarios = [
  {
    id: "plagiarism",
    title: "El Trabajo Sospechoso",
    icon: "👁",
    description: "Una alumna entrega un ensayo brillante, pero algo no encaja. ¿Cómo manejas la situación?",
    accentColor: "#E8590C",
    nodes: {
      start: {
        id: "start",
        narrative: "Lunes por la mañana. Estás corrigiendo ensayos de 3º de ESO sobre la Revolución Francesa. El ensayo de Lucía, una alumna que suele entregar trabajos correctos pero sin brillo, es sorprendentemente sofisticado: usa vocabulario académico avanzado, cita historiadores que no visteis en clase y tiene una estructura impecable.",
        context: "Lucía ha mejorado sus notas este trimestre. No tienes política de aula sobre IA. Otros compañeros han entregado trabajos similares en calidad.",
        options: [
          { id: "a1", text: 'Pasar el texto por un detector de IA (GPTZero, Turnitin) y, si da positivo, confrontar a Lucía con la "evidencia".', nextNodeId: "detector", scoreImpact: { etica: -1, pedagogia: -1, empatia: -1 } },
          { id: "a2", text: "Hablar con Lucía en privado, sin acusar, preguntándole sobre su proceso de escritura y las fuentes que usó.", nextNodeId: "conversation", scoreImpact: { etica: 2, pedagogia: 2, empatia: 2 } },
          { id: "a3", text: "No hacer nada especial. Si el contenido es correcto, la calidad del trabajo merece buena nota independientemente de cómo lo hizo.", nextNodeId: "ignore", scoreImpact: { etica: -1, pedagogia: -2, empatia: 0 } },
        ],
      },
      detector: {
        id: "detector",
        narrative: 'Pasas el ensayo por GPTZero. El resultado dice: "85% de probabilidad de ser generado por IA". Citas a Lucía al despacho y le muestras el resultado en pantalla. Lucía se pone nerviosa y empieza a llorar. Dice que sí usó ChatGPT, pero "solo para organizar sus ideas" y que luego reescribió todo.',
        context: "Los detectores de IA tienen tasas de falsos positivos del 10-30%, especialmente con textos de hablantes no nativos o estudiantes con alto rendimiento. No existe política de centro sobre uso de IA.",
        options: [
          { id: "b1", text: "Suspender el trabajo. Las reglas son las reglas, aunque no estuvieran escritas.", nextNodeId: "punish", scoreImpact: { etica: -2, pedagogia: -2, empatia: -2 } },
          { id: "b2", text: "Reconocer que no tenías política clara, explicarle por qué importa el proceso propio, y pedirle que rehaga el ensayo documentando cada paso.", nextNodeId: "redirect_detector", scoreImpact: { etica: 1, pedagogia: 2, empatia: 1 } },
        ],
      },
      punish: {
        id: "punish", isEnding: true, endingType: "risky",
        narrative: "Lucía recibe un cero. Al día siguiente, su madre llama al centro. Argumenta que nunca se comunicó una política sobre IA y que el detector no es fiable. La jefa de estudios te pide explicaciones. Otros alumnos que también usaron IA pero no fueron detectados mantienen sus notas. Lucía pierde confianza y deja de participar en clase.",
        feedback: "Penalizar sin política previa y basándose en detectores poco fiables genera inequidad y daña la relación pedagógica.",
        reflection: "¿Qué habría cambiado si hubieras tenido un protocolo ético de aula (el 'Semáforo de IA') desde el inicio del curso?",
        keyTakeaway: "Antes de detectar, establece normas. Sin política clara, no hay infracción.",
      },
      redirect_detector: {
        id: "redirect_detector", isEnding: true, endingType: "acceptable",
        narrative: "Lucía rehace el ensayo con un 'diario de proceso': documenta sus búsquedas, borradores y decisiones. El resultado es menos pulido pero auténticamente suyo. Aprovechas la situación para crear con toda la clase el 'Semáforo de IA'.",
        feedback: "Buena recuperación. Convertiste un conflicto en oportunidad de aprendizaje. Sin embargo, el uso inicial del detector como 'prueba' pudo haber dañado la confianza.",
        reflection: "¿Cómo habrías diseñado la tarea originalmente para que el uso de IA fuera transparente en vez de clandestino?",
        keyTakeaway: "De la detección a la declaración: diseña tareas donde el proceso sea tan importante como el producto.",
      },
      conversation: {
        id: "conversation",
        narrative: "Te sientas con Lucía en un momento tranquilo. Le dices: «Tu ensayo me impresionó. Cuéntame cómo lo trabajaste.» Lucía, sin sentirse acusada, te cuenta con naturalidad que usó ChatGPT para buscar información y organizar su esquema, y luego escribió con sus palabras. Te muestra incluso el historial de chat.",
        context: "Lucía no siente que hizo trampa porque nadie le dijo que no podía usar IA. Su proceso fue legítimo: usó la IA como herramienta de investigación, no como redactora.",
        options: [
          { id: "c1", text: "Valorar su honestidad, evaluar el ensayo normalmente, y usar su caso (anónimo) como ejemplo para establecer normas de clase sobre IA.", nextNodeId: "best_outcome", scoreImpact: { etica: 2, pedagogia: 2, empatia: 2 } },
          { id: "c2", text: "Pedirle que rehaga el ensayo sin IA para comprobar que realmente domina el contenido, pero sin penalización.", nextNodeId: "redo_fair", scoreImpact: { etica: 1, pedagogia: 1, empatia: 0 } },
        ],
      },
      best_outcome: {
        id: "best_outcome", isEnding: true, endingType: "optimal",
        narrative: "Evalúas el ensayo de Lucía con la misma rúbrica que los demás. En la siguiente clase, sin nombrarla, presentas el dilema: «¿Está bien usar IA para investigar? ¿Y para redactar?» La clase construye colectivamente el 'Semáforo de IA'. Lucía participa activamente. Ahora tienes una política de aula co-creada y un precedente de transparencia.",
        feedback: "Ruta óptima. Actuaste con presunción de inocencia, fomentaste la transparencia y convertiste un caso individual en aprendizaje colectivo.",
        reflection: "¿Cómo adaptarías el 'Semáforo de IA' para diferentes asignaturas o niveles educativos?",
        keyTakeaway: "La transparencia se construye desde la confianza, no desde la sospecha. El docente modela la ética que exige.",
      },
      redo_fair: {
        id: "redo_fair", isEnding: true, endingType: "acceptable",
        narrative: "Lucía rehace el ensayo. Es más corto y menos sofisticado, pero demuestra comprensión del tema. Tú notas que perdió la motivación extra que tenía cuando podía investigar con más herramientas.",
        feedback: "Decisión justa pero con matices. El mensaje implícito de 'rehaz sin IA' sugiere que su proceso original era inválido.",
        reflection: "¿Había otra forma de verificar el aprendizaje de Lucía sin invalidar su proceso original?",
        keyTakeaway: "Cuidado con los mensajes implícitos: pedir rehacer puede comunicar 'hiciste trampa' aunque no lo digas.",
      },
      ignore: {
        id: "ignore",
        narrative: "Pones buena nota al ensayo y sigues adelante. La semana siguiente, otros tres alumnos entregan ensayos con el mismo nivel sospechosamente alto. Un alumno que sí escribió su propio ensayo se queja: «¿Para qué me esfuerzo si los que usan ChatGPT sacan mejor nota?».",
        context: "La inacción no es neutralidad. Sin política clara, estás creando un sistema que premia el uso no declarado de IA.",
        options: [
          { id: "d1", text: "Reaccionar ahora: parar la clase y abrir un debate sobre IA, honestidad y qué significa aprender.", nextNodeId: "late_reaction", scoreImpact: { etica: 1, pedagogia: 1, empatia: 1 } },
          { id: "d2", text: "Seguir sin intervenir. No quieres abrir la caja de Pandora ni acusar sin pruebas.", nextNodeId: "total_ignore", scoreImpact: { etica: -2, pedagogia: -2, empatia: -1 } },
        ],
      },
      late_reaction: {
        id: "late_reaction", isEnding: true, endingType: "acceptable",
        narrative: "Abres el debate. Algunos alumnos admiten haber usado IA. Juntos crean las normas, pero queda la sensación de que llegaste tarde. Los primeros ensayos con IA ya tienen nota y cambiar eso ahora sería injusto.",
        feedback: "Mejor tarde que nunca, pero la demora generó inequidad. Las normas sobre IA deben existir ANTES de la primera tarea.",
        reflection: "Si pudieras rebobinar al primer día de clase, ¿qué tres normas sobre IA establecerías?",
        keyTakeaway: "La política de IA no es reactiva. Se diseña antes de necesitarla, igual que una rúbrica.",
      },
      total_ignore: {
        id: "total_ignore", isEnding: true, endingType: "risky",
        narrative: "Para final de trimestre, la mayoría de trabajos son generados por IA sin declarar. Los alumnos que escriben por sí mismos se sienten en desventaja. La calidad de los debates en clase cae porque nadie ha procesado realmente los contenidos.",
        feedback: "La no-intervención es una decisión con consecuencias. Sin guía docente, los alumnos aprenden que la opacidad es aceptable.",
        reflection: "¿En qué otros ámbitos de tu aula la 'no-decisión' está funcionando como una política implícita?",
        keyTakeaway: "No tener política de IA ya es una política: la del 'todo vale'. Y eso perjudica a quien más se esfuerza.",
      },
    },
    startNodeId: "start",
  },
  {
    id: "privacy",
    title: "Los Datos del Alumnado",
    icon: "🔒",
    description: "Un compañero quiere usar IA para analizar informes de alumnos con necesidades especiales.",
    accentColor: "#7C3AED",
    nodes: {
      start: {
        id: "start",
        narrative: "Viernes a mediodía, sala de profesores. Tu compañero Marcos, tutor de 2º ESO, está agobiado. Tiene que preparar 12 informes individualizados para la reunión del lunes. Te enseña su portátil: ha pegado en ChatGPT los datos de tres alumnos con NEAE — incluyendo nombres, diagnósticos psicopedagógicos y adaptaciones curriculares — y le ha pedido que redacte los informes.",
        context: "Marcos no tiene mala intención: está desbordado. ChatGPT tiene el historial de entrenamiento activado por defecto. Los datos de alumnos con NEAE son especialmente sensibles bajo el GDPR (datos de salud de menores = categoría especial).",
        options: [
          { id: "a1", text: "No decir nada. Marcos es adulto y profesional, seguro sabe lo que hace.", nextNodeId: "say_nothing", scoreImpact: { etica: -2, pedagogia: -1, empatia: 0 } },
          { id: "a2", text: "Alertar a Marcos del problema de privacidad, ayudarle a eliminar el historial, y mostrarle cómo hacerlo de forma segura.", nextNodeId: "help_marcos", scoreImpact: { etica: 2, pedagogia: 2, empatia: 2 } },
          { id: "a3", text: "Reportar directamente a la dirección del centro. Es una violación grave de protección de datos.", nextNodeId: "report", scoreImpact: { etica: 1, pedagogia: 0, empatia: -2 } },
        ],
      },
      say_nothing: {
        id: "say_nothing",
        narrative: "No intervienes. Tres semanas después, un padre descubre que los datos de su hijo con dislexia aparecen en una filtración de datos de entrenamiento. Rastrean el origen: la sesión de ChatGPT de Marcos. El centro enfrenta una denuncia ante la Agencia de Protección de Datos.",
        context: "Bajo el GDPR/LOPDGDD, las sanciones pueden alcanzar los 20 millones de euros o el 4% del presupuesto. Tú sabías y no actuaste.",
        options: [
          { id: "b1", text: "Asumir tu parte de responsabilidad y proponer crear un protocolo de uso de IA.", nextNodeId: "late_protocol", scoreImpact: { etica: 1, pedagogia: 1, empatia: 1 } },
          { id: "b2", text: "Distanciarte del asunto. Marcos es quien subió los datos, no tú.", nextNodeId: "distance", scoreImpact: { etica: -2, pedagogia: -1, empatia: -2 } },
        ],
      },
      late_protocol: {
        id: "late_protocol", isEnding: true, endingType: "acceptable",
        narrative: "Propones un protocolo y la dirección lo acepta, pero el daño ya está hecho. El centro recibe sanción, Marcos enfrenta un expediente, y la confianza de las familias se resiente. El centro ahora prohíbe TODO uso de IA por miedo.",
        feedback: "Actuar después de la crisis es mejor que no actuar, pero la oportunidad real estaba cuando viste a Marcos. Un minuto de conversación habría prevenido semanas de consecuencias.",
        reflection: "¿Existe en tu centro un protocolo claro sobre qué datos se pueden y no se pueden procesar con IA?",
        keyTakeaway: "La responsabilidad ética es proactiva. Si ves el riesgo y callas, eres parte del problema.",
      },
      distance: {
        id: "distance", isEnding: true, endingType: "risky",
        narrative: "Te mantienes al margen. Marcos enfrenta solo las consecuencias. Otros profesores se enteran de que tú estabas presente y no dijiste nada. La confianza del equipo docente se fractura. El centro implementa restricciones drásticas sobre toda la tecnología.",
        feedback: "La omisión ante un riesgo conocido tiene costes éticos y profesionales. En un entorno educativo, la protección de datos de menores es responsabilidad compartida.",
        reflection: "¿Qué te impidió hablar en el momento? ¿Cómo podrías haber planteado la conversación sin sonar acusatorio?",
        keyTakeaway: "La colegialidad incluye señalar riesgos. Un buen compañero avisa, no mira para otro lado.",
      },
      help_marcos: {
        id: "help_marcos",
        narrative: "Te acercas a Marcos con naturalidad: «Oye, me parece genial que uses IA para los informes, pero hay un tema con los datos de los alumnos que te puede meter en un lío gordo.» Le explicas el riesgo. Marcos se alarma — no había pensado en ello.",
        context: "Marcos está receptivo pero necesita solución, no solo el problema. Tiene 12 informes para el lunes y ya son las 14:00 del viernes.",
        options: [
          { id: "c1", text: "Mostrarle cómo anonimizar los datos (usar 'Alumno A', eliminar diagnósticos) y desactivar el entrenamiento en la configuración.", nextNodeId: "anonymize", scoreImpact: { etica: 2, pedagogia: 2, empatia: 2 } },
          { id: "c2", text: "Decirle que no use IA en absoluto para estos informes. Es demasiado arriesgado con datos sensibles.", nextNodeId: "ban_ai", scoreImpact: { etica: 1, pedagogia: -1, empatia: 0 } },
        ],
      },
      anonymize: {
        id: "anonymize", isEnding: true, endingType: "optimal",
        narrative: "Le ayudas a: 1) Eliminar la conversación anterior con datos reales, 2) Desactivar el entrenamiento del modelo, 3) Crear una plantilla anonimizada. Los informes salen bien y a tiempo. El lunes propones en claustro crear un protocolo de 'IA segura' para todo el centro.",
        feedback: "Ruta óptima. Resolviste el problema inmediato, previniste el riesgo futuro, no dejaste solo a tu compañero y escalaste constructivamente la solución al nivel institucional.",
        reflection: "¿Podrías diseñar una plantilla de prompt 'segura' para informes de NEAE que cualquier docente de tu centro pudiera usar?",
        keyTakeaway: "No prohíbas: enseña a usar de forma segura. Anonimizar + configurar privacidad = IA responsable.",
      },
      ban_ai: {
        id: "ban_ai", isEnding: true, endingType: "acceptable",
        narrative: "Marcos acepta pero se queda sin solución para sus 12 informes. Pasa el fin de semana redactándolos a mano, agotado. Los informes son correctos pero genéricos. La próxima vez probablemente use IA en secreto sin consultarte.",
        feedback: "Protegiste los datos, pero no ofreciste alternativa. Prohibir sin dar solución empuja la práctica a la clandestinidad.",
        reflection: "¿Qué herramientas o técnicas podrías haber sugerido para que Marcos usara IA de forma segura?",
        keyTakeaway: "Prohibir sin alternativa genera uso clandestino. Siempre ofrece el 'cómo sí' junto al 'cómo no'.",
      },
      report: {
        id: "report",
        narrative: "Vas directamente a la dirección. La directora agradece tu aviso pero te dice que hables primero con Marcos. Marcos se entera de que lo reportaste sin hablar con él. Se siente traicionado.",
        context: "Reportar era legalmente correcto pero socialmente costoso. Los protocolos éticos recomiendan escalar gradualmente.",
        options: [
          { id: "d1", text: "Hablar con Marcos, disculparte por no haberlo consultado primero, y ofrecerle ayuda para resolver juntos.", nextNodeId: "repair", scoreImpact: { etica: 1, pedagogia: 1, empatia: 2 } },
          { id: "d2", text: "Mantener tu posición. Los datos de menores son sagrados y no podías arriesgarte.", nextNodeId: "stand_ground", scoreImpact: { etica: 0, pedagogia: 0, empatia: -1 } },
        ],
      },
      repair: {
        id: "repair", isEnding: true, endingType: "acceptable",
        narrative: "Marcos inicialmente está molesto, pero tu disculpa y oferta de ayuda le desarman. Juntos eliminan los datos y configuran la privacidad. La dirección, al ver que lo resolvieron, crea un grupo de trabajo sobre IA en el que ambos participan.",
        feedback: "Buen resultado final, pero el camino fue innecesariamente costoso. La conversación directa debió ser el primer paso.",
        reflection: "¿Cuándo es apropiado escalar directamente a dirección vs. intentar resolverlo entre colegas primero?",
        keyTakeaway: "Escalada gradual: primero conversa, luego media, finalmente reporta. Cada paso solo si el anterior falla.",
      },
      stand_ground: {
        id: "stand_ground", isEnding: true, endingType: "risky",
        narrative: "Mantienes tu posición. Marcos elimina los datos pero la relación queda rota. Otros profesores empiezan a ocultar su uso de IA por miedo a ser reportados. Se crea un clima de desconfianza que impide cualquier innovación tecnológica colaborativa.",
        feedback: "Tener razón no siempre significa haber actuado bien. La ética profesional incluye la forma, no solo el fondo.",
        reflection: "¿Hay situaciones en tu contexto profesional donde 'tener razón' está siendo más importante que 'hacer bien'?",
        keyTakeaway: "La ética tiene forma: el 'qué' importa, pero el 'cómo' determina si el resultado es constructivo o destructivo.",
      },
    },
    startNodeId: "start",
  },
  {
    id: "bias",
    title: "El Sesgo Invisible",
    icon: "👥",
    description: "Usas IA para crear material sobre civilizaciones antiguas. El resultado tiene sesgos culturales graves.",
    accentColor: "#059669",
    nodes: {
      start: {
        id: "start",
        narrative: "Estás preparando una unidad sobre civilizaciones antiguas para 1º de Bachillerato. Le pides a la IA: «Crea una tabla comparativa de las civilizaciones más importantes de la antigüedad.» El resultado incluye Grecia, Roma, Egipto, Mesopotamia y China. No menciona ninguna civilización precolombina, africana subsahariana ni del sudeste asiático.",
        context: "Tu clase tiene alumnos de origen latinoamericano, marroquí y senegalés. El currículo oficial sí incluye civilizaciones no occidentales. La IA ha reproducido un sesgo eurocéntrico muy común.",
        options: [
          { id: "a1", text: "Usar el material tal cual. La IA sabrá qué civilizaciones son 'las más importantes'.", nextNodeId: "use_as_is", scoreImpact: { etica: -2, pedagogia: -2, empatia: -2 } },
          { id: "a2", text: "Descartar el resultado y escribir la tabla tú, sin IA. No te puedes fiar.", nextNodeId: "reject_ai", scoreImpact: { etica: 1, pedagogia: 0, empatia: 1 } },
          { id: "a3", text: "Iterar el prompt pidiendo diversidad geográfica, y usar el resultado sesgado como material didáctico sobre sesgo algorítmico.", nextNodeId: "iterate_teach", scoreImpact: { etica: 2, pedagogia: 2, empatia: 2 } },
        ],
      },
      use_as_is: {
        id: "use_as_is",
        narrative: "Presentas la tabla en clase. Amina, alumna de origen senegalés, levanta la mano: «Profe, ¿y el Imperio de Malí? Mi abuela siempre habla de Mansa Musa, que era el hombre más rico de la historia.» Te quedas sin respuesta convincente.",
        context: "Los alumnos están cuestionando legítimamente el material. Tu autoridad pedagógica depende de cómo manejes este momento.",
        options: [
          { id: "b1", text: "Reconocer el vacío, agradecer a Amina, y convertirlo en actividad: que cada alumno investigue una civilización no incluida.", nextNodeId: "recover_classroom", scoreImpact: { etica: 1, pedagogia: 2, empatia: 2 } },
          { id: "b2", text: "Explicar que la tabla muestra 'las más influyentes en nuestra cultura occidental'.", nextNodeId: "justify", scoreImpact: { etica: -1, pedagogia: -1, empatia: -1 } },
        ],
      },
      recover_classroom: {
        id: "recover_classroom", isEnding: true, endingType: "acceptable",
        narrative: "Conviertes el error en oportunidad. Los alumnos investigan civilizaciones omitidas y crean una tabla expandida mucho más rica. Amina presenta el Imperio de Malí con orgullo. Pero el sesgo debió detectarse antes de llegar al aula.",
        feedback: "Buena reacción, pero reactiva. ¿Qué habría pasado si nadie hubiera dicho nada?",
        reflection: "¿Qué checklist de revisión podrías aplicar a TODO material generado por IA antes de presentarlo?",
        keyTakeaway: "La auditoría de sesgo es parte del trabajo docente con IA, no un extra opcional.",
      },
      justify: {
        id: "justify", isEnding: true, endingType: "risky",
        narrative: "Amina no insiste pero se cierra. Los alumnos latinoamericanos intercambian miradas. Has reforzado implícitamente una narrativa eurocéntrica y hecho sentir a parte de tu alumnado que su herencia cultural es secundaria.",
        feedback: "Justificar el sesgo es peor que cometerlo inadvertidamente. Los datos de la IA reflejan desequilibrios de poder históricos — tu trabajo como docente es compensarlos.",
        reflection: "¿En qué otros materiales de tu asignatura podrían estar presentes sesgos que has normalizado?",
        keyTakeaway: "Defender el sesgo algorítmico como 'objetividad' lo convierte en sesgo docente.",
      },
      reject_ai: {
        id: "reject_ai",
        narrative: "Escribes la tabla manualmente. El resultado es diverso pero te llevó 2 horas. Un compañero te pregunta por qué no usas IA y te dice: «Bah, exageras, a mí me funciona bien.»",
        context: "Has resuelto TU material, pero no has abordado el problema sistémico.",
        options: [
          { id: "c1", text: "Proponer al departamento crear un protocolo de 'auditoría de sesgo' para material generado por IA.", nextNodeId: "systemic", scoreImpact: { etica: 2, pedagogia: 2, empatia: 1 } },
          { id: "c2", text: "Dejarlo estar. Cada uno es responsable de su propio material.", nextNodeId: "individual", scoreImpact: { etica: 0, pedagogia: -1, empatia: 0 } },
        ],
      },
      systemic: {
        id: "systemic", isEnding: true, endingType: "optimal",
        narrative: "Presentas un protocolo simple: 1) Revisar representación, 2) Buscar lenguaje jerárquico, 3) Contrastar con el currículo, 4) Pedir a la IA una autocrítica. Tu colega escéptico lo prueba y se sorprende. El protocolo se adopta.",
        feedback: "Excelente: resolviste el problema inmediato y escalaste la solución al nivel sistémico. La mejora sería haber iterado la IA en vez de descartarla.",
        reflection: "¿Cómo podrías haber iterado el prompt original para obtener un resultado diverso sin escribir todo manualmente?",
        keyTakeaway: "Los sesgos de IA son sistémicos y requieren soluciones sistémicas. Un protocolo protege a todo el centro.",
      },
      individual: {
        id: "individual", isEnding: true, endingType: "acceptable",
        narrative: "Tu material es bueno, pero tu compañero sigue usando material sesgado. Al final del año, una revisión detecta inconsistencias: tu unidad es inclusiva, la de tu compañero es eurocéntrica. La calidad dependió de qué profesor les tocó.",
        feedback: "Hiciste bien en tu aula, pero la responsabilidad no termina en tu puerta.",
        reflection: "¿Qué barreras existen en tu centro para compartir buenas prácticas entre departamentos?",
        keyTakeaway: "La ética individual es necesaria pero insuficiente. El cambio real es institucional.",
      },
      iterate_teach: {
        id: "iterate_teach",
        narrative: "Reescribes el prompt pidiendo civilizaciones de todos los continentes, sin lenguaje jerárquico. El resultado mejora drásticamente. Además, guardas la tabla original sesgada. Ahora tienes dos materiales.",
        context: "Tienes la tabla sesgada (V1) y la mejorada (V2). Esto es una oportunidad pedagógica única.",
        options: [
          { id: "d1", text: "Usar AMBAS tablas en clase: mostrar la V1 sesgada, analizarla críticamente, y luego revelar la V2. Enseñar sesgo algorítmico con ejemplo real.", nextNodeId: "meta_lesson", scoreImpact: { etica: 2, pedagogia: 3, empatia: 2 } },
          { id: "d2", text: "Usar solo la V2 mejorada. No quieres exponer material sesgado a los alumnos.", nextNodeId: "v2_only", scoreImpact: { etica: 1, pedagogia: 1, empatia: 1 } },
        ],
      },
      meta_lesson: {
        id: "meta_lesson", isEnding: true, endingType: "optimal",
        narrative: "Presentas la V1 sin decir de dónde viene. Los alumnos identifican las ausencias. Revelas que fue generada por IA y muestras cómo la iteraste. Amina dice: «O sea que si no le dices a la IA que incluya a África, no existe.» Exacto. Has enseñado historia Y pensamiento crítico sobre IA en la misma sesión.",
        feedback: "Ruta magistral. Convertiste un fallo de la IA en la mejor clase del trimestre. Tus alumnos aprendieron a cuestionar cualquier fuente, incluida la IA.",
        reflection: "¿Qué otros contenidos podrían beneficiarse del enfoque 'mostrar el sesgo para enseñar a verlo'?",
        keyTakeaway: "El sesgo de la IA no es un error a ocultar: es un recurso didáctico de primer orden para enseñar pensamiento crítico.",
      },
      v2_only: {
        id: "v2_only", isEnding: true, endingType: "acceptable",
        narrative: "La clase funciona bien con la tabla mejorada. Los alumnos reciben una visión equilibrada. Pero no aprendieron a detectar sesgos por sí mismos — solo recibieron un producto ya corregido.",
        feedback: "Decisión correcta pero conservadora. Enseñar a detectar el sesgo es más valioso que corregirlo en silencio.",
        reflection: "¿Hay forma de mostrar el sesgo de forma segura para que los alumnos desarrollen su propio 'radar' crítico?",
        keyTakeaway: "Corregir el sesgo en silencio protege hoy. Enseñar a detectar el sesgo protege para siempre.",
      },
    },
    startNodeId: "start",
  },
];

// ─── Utilities ──────────────────────────────────────────────────────

function calcScore(decisions, scenario) {
  const total = { etica: 0, pedagogia: 0, empatia: 0 };
  for (const d of decisions) {
    const node = scenario.nodes[d.nodeId];
    const opt = node.options?.find((o) => o.id === d.chosenOptionId);
    if (opt) {
      total.etica += opt.scoreImpact.etica;
      total.pedagogia += opt.scoreImpact.pedagogia;
      total.empatia += opt.scoreImpact.empatia;
    }
  }
  return total;
}

function scoreColor(v) {
  if (v >= 4) return "#059669";
  if (v >= 2) return "#0284c7";
  if (v >= 0) return "#d97706";
  return "#dc2626";
}

function badgeStyle(type) {
  if (type === "optimal") return { bg: "#dcfce7", border: "#86efac", color: "#166534", label: "✅ Ruta Óptima" };
  if (type === "acceptable") return { bg: "#fef9c3", border: "#fde047", color: "#854d0e", label: "⚠️ Ruta Aceptable" };
  return { bg: "#fee2e2", border: "#fca5a5", color: "#991b1b", label: "❌ Ruta de Riesgo" };
}

// ─── Player ─────────────────────────────────────────────────────────

function Player({ scenario, onComplete, onBack }) {
  const [nodeId, setNodeId] = useState(scenario.startNodeId);
  const [decisions, setDecisions] = useState([]);
  const [selected, setSelected] = useState(null);

  const node = scenario.nodes[nodeId];
  const isEnd = node.isEnding;

  const choose = (opt) => {
    setSelected(opt.id);
    setDecisions((p) => [...p, { nodeId, chosenOptionId: opt.id, chosenText: opt.text }]);
    setTimeout(() => { setNodeId(opt.nextNodeId); setSelected(null); }, 350);
  };

  const restart = () => { setNodeId(scenario.startNodeId); setDecisions([]); setSelected(null); };

  const score = isEnd ? calcScore(decisions, scenario) : null;
  const badge = isEnd ? badgeStyle(node.endingType) : null;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <button onClick={onBack} style={{ fontSize: 14, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>← Volver a escenarios</button>
        <span style={{ fontSize: 13, color: "#9ca3af", fontFamily: "monospace" }}>Paso {decisions.length + 1} · {decisions.length} decisiones</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: `3px solid ${scenario.accentColor}22` }}>
        <span style={{ fontSize: 22 }}>{scenario.icon}</span>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>{scenario.title}</h2>
      </div>

      {/* Narrative */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <p style={{ color: "#1f2937", lineHeight: 1.7, fontSize: 15, margin: 0 }}>{node.narrative}</p>
        {node.context && (
          <div style={{ marginTop: 16, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 16, display: "flex", gap: 10 }}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px 0" }}>Contexto clave</p>
              <p style={{ fontSize: 13, color: "#78350f", lineHeight: 1.6, margin: 0 }}>{node.context}</p>
            </div>
          </div>
        )}
      </div>

      {/* Ending */}
      {isEnd && badge && score && (
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", padding: "8px 16px", borderRadius: 99, background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>
            {badge.label}
          </div>

          {node.feedback && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px 0" }}>📖 Análisis pedagógico</p>
              <p style={{ color: "#374151", lineHeight: 1.7, fontSize: 15, margin: 0 }}>{node.feedback}</p>
            </div>
          )}

          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 16px 0" }}>Tu perfil de decisión</p>
            <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
              {[["⚖️", "Ética", score.etica], ["🧠", "Pedagogía", score.pedagogia], ["💜", "Empatía", score.empatia]].map(([icon, label, val]) => (
                <div key={label} style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>{icon} {label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: scoreColor(val), fontVariantNumeric: "tabular-nums" }}>
                    {val > 0 ? "+" : ""}{val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {node.reflection && (
            <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#5b21b6", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px 0" }}>🪞 Pregunta de reflexión</p>
              <p style={{ color: "#4c1d95", lineHeight: 1.7, fontStyle: "italic", margin: 0 }}>{node.reflection}</p>
            </div>
          )}

          {node.keyTakeaway && (
            <div style={{ background: `${scenario.accentColor}08`, border: `2px solid ${scenario.accentColor}30`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: scenario.accentColor, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px 0" }}>💡 Aprendizaje clave</p>
              <p style={{ color: "#111827", fontWeight: 500, lineHeight: 1.7, fontSize: 15, margin: 0 }}>{node.keyTakeaway}</p>
            </div>
          )}

          <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px 0" }}>Tu camino</p>
            {decisions.map((d, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                <span style={{ width: 24, height: 24, borderRadius: 99, background: scenario.accentColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>{d.chosenText}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={restart} style={{ padding: "10px 20px", borderRadius: 12, border: "2px solid #d1d5db", background: "#fff", cursor: "pointer", fontWeight: 500, fontSize: 14, color: "#374151" }}>🔄 Explorar otra ruta</button>
            <button onClick={() => { onComplete(); onBack(); }} style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: scenario.accentColor, color: "#fff", cursor: "pointer", fontWeight: 500, fontSize: 14 }}>Completar escenario →</button>
          </div>
        </div>
      )}

      {/* Options */}
      {!isEnd && node.options && (
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>¿Qué haces?</p>
          {node.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => choose(opt)}
              disabled={selected !== null}
              style={{
                display: "block", width: "100%", textAlign: "left", borderRadius: 12, border: "2px solid #e5e7eb",
                padding: 20, marginBottom: 10, cursor: selected ? "default" : "pointer",
                background: selected === opt.id ? "#f3f4f6" : "#fff",
                opacity: selected && selected !== opt.id ? 0.4 : 1,
                transition: "all 0.2s", fontSize: 15, color: "#1f2937", lineHeight: 1.6,
              }}
            >
              {opt.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────

export default function EthicsSimulator() {
  const [activeId, setActiveId] = useState(null);
  const [completed, setCompleted] = useState(new Set());

  const active = scenarios.find((s) => s.id === activeId);

  if (active) {
    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "40px 16px" }}>
        <Player
          key={active.id}
          scenario={active}
          onComplete={() => setCompleted((p) => new Set([...p, active.id]))}
          onBack={() => setActiveId(null)}
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "40px 16px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#111827", color: "#fff", fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 99, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14 }}>
            🛡️ Módulo 0 · Recurso Interactivo
          </span>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111827", margin: "0 0 10px 0" }}>
            Simulador de Decisión Ética
          </h1>
          <p style={{ color: "#6b7280", maxWidth: 500, margin: "0 auto", lineHeight: 1.6, fontSize: 15 }}>
            Enfréntate a dilemas reales que ocurren en el aula con IA. Cada decisión tiene consecuencias. No hay respuestas perfectas — hay respuestas más informadas.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 32 }}>
          <span style={{ fontSize: 14, color: "#6b7280" }}>
            🏆 <strong style={{ color: "#111827" }}>{completed.size}</strong> de {scenarios.length} completados
          </span>
          <div style={{ display: "flex", gap: 5 }}>
            {scenarios.map((s) => (
              <div key={s.id} style={{ width: 32, height: 6, borderRadius: 99, background: completed.has(s.id) ? "#10b981" : "#d1d5db", transition: "background 0.3s" }} />
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              style={{
                position: "relative", textAlign: "left", borderRadius: 16, border: completed.has(s.id) ? "2px solid #86efac" : "2px solid #e5e7eb",
                padding: 24, background: completed.has(s.id) ? "#f0fdf4" : "#fff", cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {completed.has(s.id) && (
                <span style={{ position: "absolute", top: -8, right: -8, background: "#10b981", color: "#fff", borderRadius: 99, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✓</span>
              )}
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 12, background: `${s.accentColor}15`, fontSize: 20, marginBottom: 14 }}>{s.icon}</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 8px 0" }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, margin: "0 0 14px 0" }}>{s.description}</p>
              <span style={{ fontSize: 13, fontWeight: 600, color: s.accentColor }}>
                {completed.has(s.id) ? "Volver a jugar →" : "Comenzar escenario →"}
              </span>
            </button>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 36 }}>
          Basado en casos reales adaptados · Curso &quot;Prompt Mastery para Docentes&quot;
        </p>
      </div>
    </div>
  );
}
