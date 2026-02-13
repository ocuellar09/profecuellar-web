export type Course = {
  id: number
  slug: string
  title: string
  description: string
  longDescription: string
  isPublished?: boolean
  level: "Principiante" | "Intermedio" | "Avanzado" | "Experto"
  duration: string
  rating: number
  gradient: string
  outcomes: string[]
  modules: string[]
  includesEthicsSimulator?: boolean
  includesBrokenPromptsQuiz?: boolean
  includesModuleQuiz?: boolean
  includesCrefoBuilder?: boolean
  includesGuideModule0?: boolean
  includesGuideModule1?: boolean
  includesGuideModule2?: boolean
  includesGuideModule3?: boolean
  includesGuideModule4?: boolean
  includesGuideModule5?: boolean
  includesBiasAuditKit?: boolean
  includesPrivacyChecklist?: boolean
  includesIterationNotebook?: boolean
  includesAnchorRubrics?: boolean
  includesPortfolioTracker?: boolean
  includesWeeklyCases?: boolean
}

export const courses: Course[] = [
  {
    id: 1,
    slug: "ingenieria-de-prompts-para-docentes",
    title: "Ingeniería de Prompts para Docentes",
    description:
      "Domina el arte de comunicarte con la IA. Aprende a estructurar prompts efectivos para crear material didáctico, evaluar y personalizar el aprendizaje.",
    longDescription:
      "Programa práctico para docentes que quieren integrar IA con criterio pedagógico. Aprenderás marcos de prompting, técnicas de verificación y flujos para diseñar clases, rúbricas y recursos en menos tiempo.",
    isPublished: true,
    level: "Principiante",
    duration: "4 Semanas",
    rating: 4.9,
    gradient: "from-blue-500 to-cyan-500",
    outcomes: [
      "Diseñar prompts claros para planeación y evaluación",
      "Reducir tiempo de preparación de clase con plantillas reutilizables",
      "Validar calidad y sesgos en salidas de IA",
    ],
    modules: [
      "Fundamentos de prompt engineering educativo",
      "Prompts para planeación de clase y actividades",
      "Prompts para evaluación y retroalimentación",
      "Ética, sesgo y uso responsable de IA en aula",
    ],
    includesEthicsSimulator: true,
    includesBrokenPromptsQuiz: true,
    includesModuleQuiz: true,
    includesCrefoBuilder: true,
    includesGuideModule0: true,
    includesGuideModule1: true,
    includesGuideModule2: true,
    includesGuideModule3: true,
    includesGuideModule4: true,
    includesGuideModule5: true,
    includesBiasAuditKit: true,
    includesPrivacyChecklist: true,
    includesIterationNotebook: true,
    includesAnchorRubrics: true,
    includesPortfolioTracker: true,
    includesWeeklyCases: true,
  },
  {
    id: 2,
    slug: "creacion-de-contenidos-educativos-con-ia",
    title: "Creación de Contenidos Educativos con IA",
    description:
      "Automatiza la producción de videos, guías y presentaciones. Herramientas clave: Runway, HeyGen, y automatizaciones con Make.",
    longDescription:
      "Curso orientado a producción de contenido educativo multimodal con IA. Desde idea a publicación, con flujos repetibles para video, presentación y material descargable.",
    isPublished: false,
    level: "Intermedio",
    duration: "6 Semanas",
    rating: 4.8,
    gradient: "from-purple-500 to-pink-500",
    outcomes: [
      "Crear guiones educativos con apoyo de IA",
      "Convertir contenido en formatos video, slides y PDF",
      "Diseñar pipeline de publicación y reutilización",
    ],
    modules: [
      "Storytelling pedagógico para IA",
      "Generación asistida de slides y guías",
      "Video educativo con avatares y edición rápida",
      "Automatización del flujo de contenidos",
    ],
  },
  {
    id: 3,
    slug: "evaluacion-automatizada-y-rubricas-inteligentes",
    title: "Evaluación Automatizada y Rúbricas Inteligentes",
    description:
      "Implementa sistemas de evaluación con feedback inmediato usando LLMs. Reduce tu carga de trabajo administrativa.",
    longDescription:
      "Entrenamiento para diseñar evaluación asistida por IA sin perder validez pedagógica. Incluye rúbricas, criterios de calidad y revisión humana estratégica.",
    isPublished: false,
    level: "Avanzado",
    duration: "3 Semanas",
    rating: 5.0,
    gradient: "from-indigo-500 to-purple-600",
    outcomes: [
      "Construir rúbricas robustas con IA",
      "Automatizar feedback inicial manteniendo criterio docente",
      "Definir protocolos de revisión y control de calidad",
    ],
    modules: [
      "Diseño de criterios e indicadores",
      "Rúbricas en lenguaje natural + estructura",
      "Feedback automatizado y calibración",
      "Gobernanza y trazabilidad de evaluación",
    ],
  },
  {
    id: 4,
    slug: "tutoria-inteligente-creando-tu-gemelo-digital",
    title: "Tutoría Inteligente: Creando tu Gemelo Digital",
    description:
      "Configura asistentes virtuales que respondan dudas de tus estudiantes 24/7 basados en tu propio material de clase.",
    longDescription:
      "Construye un asistente docente alineado con tu metodología. Entrena comportamiento, define límites y mejora respuestas con ciclos de retroalimentación.",
    isPublished: false,
    level: "Experto",
    duration: "5 Semanas",
    rating: 4.9,
    gradient: "from-emerald-400 to-cyan-500",
    outcomes: [
      "Definir identidad y límites del tutor virtual",
      "Conectar base de conocimiento del curso",
      "Monitorear calidad de respuestas y mejorar iterativamente",
    ],
    modules: [
      "Arquitectura de un tutor virtual educativo",
      "Diseño de personalidad, tono y guardrails",
      "Conocimiento contextual y recuperación de información",
      "Evaluación de desempeño del asistente",
    ],
  },
]

export function getCourseBySlug(slug: string) {
  return courses.find((course) => course.slug === slug)
}
