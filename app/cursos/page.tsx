import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, Clock, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { courses } from "@/lib/courses"

export const metadata: Metadata = {
    title: "Cursos",
    description: "Catálogo de cursos especializados para docentes que quieren implementar IA en su práctica.",
    alternates: {
        canonical: "/cursos",
    },
    openGraph: {
        title: "Cursos | Profe Cuellar",
        description: "Rutas formativas para aplicar IA y automatización en educación.",
        url: "/cursos",
        type: "website",
        locale: "es_CO",
    },
}

export default function CursosPage() {
    return (
        <div className="container px-6 py-12 md:py-20">

            {/* Header */}
            <div className="mb-12 flex flex-col items-start gap-4">
                <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                    Catálogo Académico
                </Badge>
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    Cursos Especializados
                </h1>
                <p className="max-w-2xl text-lg text-slate-400">
                    Rutas de aprendizaje diseñadas para transformar tu práctica docente con tecnología de vanguardia.
                </p>
            </div>

            {/* Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <div key={course.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10">

                        {/* Gradient Cover (Placeholder for Image) */}
                        <div className={`h-48 w-full bg-gradient-to-br ${course.gradient} opacity-80 transition-opacity group-hover:opacity-100`}>
                            <div className="flex h-full w-full items-center justify-center">
                                <PlayCircle className="h-12 w-12 text-white/80 opacity-0 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100" />
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                                    {course.level}
                                </Badge>
                                {course.isPublished ? (
                                    <div className="flex items-center text-amber-400 text-sm font-medium gap-1">
                                        <Star className="h-4 w-4 fill-current" />
                                        {course.rating.toFixed(1)}
                                    </div>
                                ) : (
                                    <Badge variant="outline" className="border-amber-400/40 bg-amber-500/10 text-amber-300">
                                        Próximamente
                                    </Badge>
                                )}
                            </div>

                            <h3 className="mb-2 text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                {course.title}
                            </h3>

                            <p className="mb-6 flex-1 text-sm text-slate-400 leading-relaxed">
                                {course.description}
                            </p>

                            <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                                <div className="flex items-center text-slate-500 text-xs font-semibold gap-1">
                                    <Clock className="h-3 w-3" />
                                    {course.duration}
                                </div>
                                {course.isPublished ? (
                                    <Button asChild size="sm" variant="ghost" className="text-indigo-300 hover:text-white hover:bg-indigo-500/20">
                                        <Link href="/curso">
                                            Entrar al Curso <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button size="sm" variant="ghost" disabled className="text-slate-500 hover:bg-transparent">
                                        Próximamente
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
