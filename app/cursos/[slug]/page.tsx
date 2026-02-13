import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Star, Sparkles } from "lucide-react"
import EthicsSimulator from "@/components/courses/ethics/EthicsSimulator"
import BrokenPromptsQuiz from "@/components/courses/prompts/BrokenPromptsQuiz"
import ModuleQuiz from "@/components/courses/quizzes/ModuleQuiz"
import CrefoBuilder from "@/components/courses/tools/CrefoBuilder"
import GuideModule0 from "@/components/courses/guides/GuideModule0"
import GuideModule1 from "@/components/courses/guides/GuideModule1"
import GuideModule2 from "@/components/courses/guides/GuideModule2"
import GuideModule3 from "@/components/courses/guides/GuideModule3"
import GuideModule4 from "@/components/courses/guides/GuideModule4"
import GuideModule5 from "@/components/courses/guides/GuideModule5"
import BiasAuditKit from "@/components/courses/tools/BiasAuditKit"
import PrivacyChecklist from "@/components/courses/tools/PrivacyChecklist"
import IterationNotebook from "@/components/courses/tools/IterationNotebook"
import AnchorRubrics from "@/components/courses/community/AnchorRubrics"
import PortfolioTracker from "@/components/courses/community/PortfolioTracker"
import WeeklyCases from "@/components/courses/community/WeeklyCases"
import { courses, getCourseBySlug } from "@/lib/courses"

type RouteParams = {
  slug: string
}

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }))
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { slug } = await params
  const course = getCourseBySlug(slug)
  if (!course) {
    return {
      title: "Curso no encontrado",
      description: "El curso que intentas ver no existe.",
    }
  }

  return {
    title: course.isPublished ? course.title : `${course.title} | Próximamente`,
    description: course.isPublished
      ? course.description
      : `El curso ${course.title} estará disponible próximamente.`,
    alternates: {
      canonical: `/cursos/${course.slug}`,
    },
    openGraph: {
      title: `${course.title} | Profe Cuellar`,
      description: course.description,
      url: `/cursos/${course.slug}`,
      type: "article",
      locale: "es_CO",
    },
  }
}

export default async function CursoDetallePage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params
  const course = getCourseBySlug(slug)
  if (!course) {
    notFound()
  }

  if (!course.isPublished) {
    return (
      <section className="container px-6 py-12 md:py-20">
        <Button asChild variant="ghost" className="mb-6 text-slate-300 hover:text-white">
          <Link href="/cursos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a cursos
          </Link>
        </Button>

        <div className={`rounded-3xl bg-gradient-to-br ${course.gradient} p-8`}>
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white hover:bg-white/30">
            Próximamente
          </Badge>
          <h1 className="mb-4 text-3xl font-extrabold text-white md:text-5xl">{course.title}</h1>
          <p className="max-w-3xl text-white/90">{course.longDescription}</p>
          <p className="mt-4 text-white/90">
            Este curso está en preparación. Muy pronto habilitaremos módulos y herramientas.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/#contacto">Quiero aviso de lanzamiento</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="container px-6 py-12 md:py-20">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-6 text-slate-300 hover:text-white">
          <Link href="/cursos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a cursos
          </Link>
        </Button>

        <div className={`mb-6 rounded-3xl bg-gradient-to-br ${course.gradient} p-8`}>
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white hover:bg-white/30">
            {course.level}
          </Badge>
          <h1 className="mb-4 text-3xl font-extrabold text-white md:text-5xl">{course.title}</h1>
          <p className="max-w-3xl text-white/90">{course.longDescription}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/90">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {course.duration}
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-current" />
              {course.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Resultados de aprendizaje</h2>
          <ul className="space-y-3 text-slate-300">
            {course.outcomes.map((outcome) => (
              <li key={outcome} className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 text-indigo-400" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Módulos</h2>
          <ol className="space-y-3 text-slate-300">
            {course.modules.map((module, index) => (
              <li key={module} className="flex items-start gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                  {index + 1}
                </span>
                <span>{module}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="mb-2 text-xl font-semibold text-white">Inscripción y acceso</h3>
        <p className="mb-4 text-slate-300">
          Este curso está disponible bajo convocatoria. Si quieres recibir acceso o versión gratuita de lanzamiento,
          déjame tu interés y te comparto fechas.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/curso">Entrar al aula del curso</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/#contacto">Quiero información del curso</Link>
          </Button>
        </div>
      </div>

      {course.includesEthicsSimulator && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white">
          <EthicsSimulator />
        </div>
      )}

      {course.includesBrokenPromptsQuiz && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white">
          <BrokenPromptsQuiz />
        </div>
      )}

      {course.includesModuleQuiz && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white">
          <ModuleQuiz />
        </div>
      )}

      {course.includesCrefoBuilder && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white">
          <CrefoBuilder />
        </div>
      )}

      {course.includesGuideModule0 && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white">
          <GuideModule0 />
        </div>
      )}

      {course.includesGuideModule1 && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white">
          <GuideModule1 />
        </div>
      )}

      {course.includesGuideModule2 && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white">
          <GuideModule2 />
        </div>
      )}

      {course.includesGuideModule3 && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white">
          <GuideModule3 />
        </div>
      )}

      {course.includesGuideModule4 && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white">
          <GuideModule4 />
        </div>
      )}

      {course.includesGuideModule5 && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white">
          <GuideModule5 />
        </div>
      )}

      {course.includesBiasAuditKit && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white">
          <BiasAuditKit />
        </div>
      )}

      {course.includesPrivacyChecklist && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white">
          <PrivacyChecklist />
        </div>
      )}

      {course.includesIterationNotebook && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white">
          <IterationNotebook />
        </div>
      )}

      {course.includesAnchorRubrics && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white">
          <AnchorRubrics />
        </div>
      )}

      {course.includesPortfolioTracker && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white">
          <PortfolioTracker />
        </div>
      )}

      {course.includesWeeklyCases && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white">
          <WeeklyCases />
        </div>
      )}
    </section>
  )
}
