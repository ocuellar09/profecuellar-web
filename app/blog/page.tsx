import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Blog",
    description: "Artículos y reflexiones sobre IA educativa, automatización y docencia.",
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        title: "Blog | Profe Cuellar",
        description: "Contenido sobre IA educativa y estrategias para docentes.",
        url: "/blog",
        type: "website",
        locale: "es_CO",
    },
}

export default function BlogPage() {
    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
            <div className="relative mb-8 h-32 w-32">
                <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20"></div>
                <div className="relative flex h-full w-full items-center justify-center rounded-full border border-indigo-500/30 bg-black/50 backdrop-blur-sm">
                    <span className="text-4xl">✍️</span>
                </div>
            </div>

            <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Blog en Construcción
            </h1>
            <p className="mb-8 max-w-md text-slate-400">
                Estamos preparando artículos increíbles sobre IA educativa. Muy pronto podrás leerlos aquí.
            </p>

            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Inicio
                </Link>
            </Button>
        </div>
    )
}
