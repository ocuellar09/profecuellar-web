import Link from "next/link"
import CourseDashboard from "@/components/courses/navigation/CourseDashboard"

const quickLinks = [
  { href: "/curso/herramientas/crefo", label: "Abrir CREFO Builder" },
  { href: "/curso/herramientas/prompts-rotos", label: "Practicar Prompts Rotos" },
  { href: "/curso/evaluacion/portafolio", label: "Abrir Portafolio Progresivo" },
]

export default function CursoHomePage() {
  return (
    <div className="space-y-6">
      <CourseDashboard />

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-2 text-lg font-semibold text-white">Accesos rápidos</h2>
        <p className="mb-4 text-slate-300">
          Recursos transversales para practicar mientras avanzas por los módulos.
        </p>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
