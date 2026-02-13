"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCourseProgress } from "@/components/courses/navigation/CourseProgressProvider"
import { COURSE_MODULES } from "@/lib/courseNavigation"

export default function CourseDashboard() {
  const {
    completedCount,
    totalCount,
    progressPercent,
    continueRoute,
    nextSuggestedRoute,
    isComplete,
    isAuthenticated,
    openSaveProgress,
  } = useCourseProgress()

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="mb-2 text-2xl font-bold text-white">Aula del curso</h1>
        <p className="mb-4 text-slate-300">
          Sigue una ruta clara por módulos, marca tu avance y retoma donde te quedaste.
        </p>
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mb-4 text-sm text-slate-300">
          Progreso global: {completedCount}/{totalCount} módulos ({progressPercent}%)
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={continueRoute}>Continuar donde quedaste</Link>
          </Button>
          {nextSuggestedRoute && (
            <Button asChild variant="outline">
              <Link href={nextSuggestedRoute}>Ir al siguiente módulo sugerido</Link>
            </Button>
          )}
          {!isAuthenticated && (
            <Button variant="outline" onClick={openSaveProgress}>
              Guardar progreso
            </Button>
          )}
        </div>
      </div>

      {progressPercent >= 100 && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
          <h2 className="mb-2 text-lg font-semibold text-white">Terminaste el curso gratuito</h2>
          <p className="mb-4 text-slate-200">
            Si quieres el siguiente nivel (más plantillas, casos y acompañamiento), te dejo el acceso al catálogo.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/cursos">Desbloquear el siguiente curso</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/#contacto">Quiero asesoría / cupo</Link>
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Mapa de módulos</h2>
        <div className="space-y-2">
          {COURSE_MODULES.map((module) => {
            const completed = isComplete(module.href)
            return (
              <div
                key={module.href}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    Módulo {module.id}: {module.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    Recurso recomendado: {module.recommendedToolLabel}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                      completed
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-slate-500/20 text-slate-300"
                    }`}
                  >
                    {completed ? "Completado" : "Pendiente"}
                  </span>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={module.href}>Abrir</Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-2 text-lg font-semibold text-white">Sígueme para más contenido</h2>
        <p className="mb-4 text-slate-300">
          Publico recursos, plantillas y ejemplos prácticos para docentes.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="https://www.youtube.com/@ProfeCu%C3%A9llarIA" target="_blank">
              YouTube
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="https://www.linkedin.com/in/oscar-andres-cuellar-rojas/" target="_blank">
              LinkedIn
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="https://www.instagram.com/profecuellar/" target="_blank">
              Instagram
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
