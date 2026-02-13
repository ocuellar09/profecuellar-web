"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useCourseProgress } from "@/components/courses/navigation/CourseProgressProvider"
import {
  COURSE_MODULES,
  getModuleByRoute,
  getNextModuleRoute,
  getPreviousModuleRoute,
} from "@/lib/courseNavigation"

export default function CourseModuleFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const {
    completedCount,
    totalCount,
    progressPercent,
    isComplete,
    markComplete,
    markIncomplete,
  } = useCourseProgress()

  const currentModule = useMemo(() => getModuleByRoute(pathname), [pathname])
  const previousRoute = currentModule ? getPreviousModuleRoute(currentModule.href) : null
  const nextRoute = currentModule ? getNextModuleRoute(currentModule.href) : null
  const completed = currentModule ? isComplete(currentModule.href) : false

  return (
    <div>
      {currentModule && (
        <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-white">
              Módulo {currentModule.id + 1} de {COURSE_MODULES.length}
            </p>
            <p className="text-xs text-slate-300">
              Progreso global: {completedCount}/{totalCount} ({progressPercent}%)
            </p>
          </div>
          <h2 className="text-sm text-slate-300">{currentModule.title}</h2>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
        {children}
      </div>

      {currentModule && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {previousRoute ? (
              <Button asChild variant="ghost" className="text-slate-200 hover:text-white">
                <Link href={previousRoute}>Anterior</Link>
              </Button>
            ) : (
              <Button asChild variant="ghost" className="text-slate-200 hover:text-white">
                <Link href="/curso">Volver al curso</Link>
              </Button>
            )}

            {completed ? (
              <Button variant="outline" onClick={() => markIncomplete(currentModule.href)}>
                Marcar pendiente
              </Button>
            ) : (
              <Button onClick={() => markComplete(currentModule.href)}>
                Marcar como completado
              </Button>
            )}

            {nextRoute ? (
              <Button asChild>
                <Link href={nextRoute}>Siguiente</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href={currentModule.recommendedToolHref}>
                  Ir a {currentModule.recommendedToolLabel}
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
