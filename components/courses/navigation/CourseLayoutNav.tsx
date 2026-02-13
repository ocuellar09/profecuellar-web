"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CheckCircle2, Circle, PlayCircle } from "lucide-react"
import { useCourseProgress } from "@/components/courses/navigation/CourseProgressProvider"
import {
  COURSE_EVALUATION,
  COURSE_MODULES,
  COURSE_TOOLS,
} from "@/lib/courseNavigation"

function StatusIcon({
  isCurrent,
  isCompleted,
}: {
  isCurrent: boolean
  isCompleted: boolean
}) {
  if (isCompleted) return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
  if (isCurrent) return <PlayCircle className="h-4 w-4 text-indigo-300" />
  return <Circle className="h-4 w-4 text-slate-500" />
}

export default function CourseLayoutNav() {
  const pathname = usePathname()
  const { completedCount, totalCount, progressPercent, isComplete } = useCourseProgress()

  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Ingeniería de Prompts para Docentes
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {completedCount}/{totalCount} módulos completados
          </p>
        </div>
        <div className="w-full md:w-64">
          <div className="mb-1 flex justify-between text-[11px] text-slate-400">
            <span>Progreso</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <details className="mb-4 block rounded-xl border border-white/10 bg-black/10 p-3 md:hidden">
        <summary className="cursor-pointer text-sm font-semibold text-white">
          Navegación del curso
        </summary>
        <div className="mt-3 space-y-2">
          {COURSE_MODULES.map((module) => {
            const isCurrent = pathname.startsWith(module.href)
            const done = isComplete(module.href)
            return (
              <Link
                key={module.href}
                href={module.href}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-200 hover:bg-white/10"
              >
                <StatusIcon isCurrent={isCurrent} isCompleted={done} />
                <span>Modulo {module.id}</span>
              </Link>
            )
          })}
        </div>
      </details>

      <div className="hidden gap-6 md:grid md:grid-cols-3">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Módulos
          </p>
          <div className="space-y-1.5">
            {COURSE_MODULES.map((module) => {
              const isCurrent = pathname.startsWith(module.href)
              const done = isComplete(module.href)
              return (
                <Link
                  key={module.href}
                  href={module.href}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors ${
                    isCurrent
                      ? "bg-indigo-500/20 text-indigo-200"
                      : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <StatusIcon isCurrent={isCurrent} isCompleted={done} />
                  <span>
                    Modulo {module.id}: {module.title}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Herramientas
          </p>
          <div className="space-y-1.5">
            {COURSE_TOOLS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-2 py-1.5 text-xs transition-colors ${
                  pathname.startsWith(link.href)
                    ? "bg-indigo-500/20 text-indigo-200"
                    : "text-slate-300 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Evaluación
          </p>
          <div className="space-y-1.5">
            {COURSE_EVALUATION.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-2 py-1.5 text-xs transition-colors ${
                  pathname.startsWith(link.href)
                    ? "bg-indigo-500/20 text-indigo-200"
                    : "text-slate-300 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
