export type CourseModule = {
  id: number
  title: string
  href: string
  recommendedToolLabel: string
  recommendedToolHref: string
}

export type CourseNavLink = {
  label: string
  href: string
}

export const COURSE_SLUG = "ingenieria-de-prompts-para-docentes"
export const COURSE_HOME_HREF = "/curso"

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 0,
    title: "Fundamentos Críticos y la Caja Negra",
    href: "/curso/modulos/0",
    recommendedToolLabel: "Simulador de Ética",
    recommendedToolHref: "/curso/herramientas/etica",
  },
  {
    id: 1,
    title: "La Sintaxis de la Maestría",
    href: "/curso/modulos/1",
    recommendedToolLabel: "CREFO Builder",
    recommendedToolHref: "/curso/herramientas/crefo",
  },
  {
    id: 2,
    title: "Arquitectura del Aula con IA",
    href: "/curso/modulos/2",
    recommendedToolLabel: "Concept Quiz",
    recommendedToolHref: "/curso/herramientas/quiz",
  },
  {
    id: 3,
    title: "Evaluación y Retroalimentación Inteligente",
    href: "/curso/modulos/3",
    recommendedToolLabel: "Rúbricas con Anclas",
    recommendedToolHref: "/curso/evaluacion/rubricas",
  },
  {
    id: 4,
    title: "Iteración, Sesgo y Privacidad",
    href: "/curso/modulos/4",
    recommendedToolLabel: "Bias Audit Kit",
    recommendedToolHref: "/curso/herramientas/sesgo",
  },
  {
    id: 5,
    title: "Portafolio y Evidencias de Impacto",
    href: "/curso/modulos/5",
    recommendedToolLabel: "Portafolio Progresivo",
    recommendedToolHref: "/curso/evaluacion/portafolio",
  },
]

export const COURSE_TOOLS: CourseNavLink[] = [
  { href: "/curso/herramientas/etica", label: "Simulador Ética" },
  { href: "/curso/herramientas/prompts-rotos", label: "Prompts Rotos" },
  { href: "/curso/herramientas/quiz", label: "Concept Quiz" },
  { href: "/curso/herramientas/crefo", label: "CREFO Builder" },
  { href: "/curso/herramientas/sesgo", label: "Bias Audit Kit" },
  { href: "/curso/herramientas/privacidad", label: "Privacy Checklist" },
]

export const COURSE_EVALUATION: CourseNavLink[] = [
  { href: "/curso/evaluacion/iteracion", label: "Iteration Notebook" },
  { href: "/curso/evaluacion/rubricas", label: "Rubrics With Anchors" },
  { href: "/curso/evaluacion/portafolio", label: "Progressive Portfolio" },
  { href: "/curso/evaluacion/casos", label: "Weekly Cases" },
]

export const COURSE_MODULE_ROUTES = COURSE_MODULES.map((module) => module.href)

export function getModuleByRoute(route: string) {
  return COURSE_MODULES.find((module) => module.href === route)
}

export function getModuleByPath(pathname: string) {
  return COURSE_MODULES.find((module) => pathname.startsWith(module.href))
}

export function getNextModuleRoute(route: string) {
  const idx = COURSE_MODULE_ROUTES.indexOf(route)
  if (idx < 0 || idx === COURSE_MODULE_ROUTES.length - 1) return null
  return COURSE_MODULE_ROUTES[idx + 1]
}

export function getPreviousModuleRoute(route: string) {
  const idx = COURSE_MODULE_ROUTES.indexOf(route)
  if (idx <= 0) return null
  return COURSE_MODULE_ROUTES[idx - 1]
}
