import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, BookOpen, Youtube } from "lucide-react"

export const metadata: Metadata = {
  title: "Recursos",
  description: "Materiales y recursos recomendados para potenciar tu docencia con IA.",
  alternates: {
    canonical: "/recursos",
  },
  openGraph: {
    title: "Recursos | Profe Cuellar",
    description: "Guías, contenido y herramientas para implementar IA en educación.",
    url: "/recursos",
    type: "website",
    locale: "es_CO",
  },
}

export default function RecursosPage() {
  return (
    <section className="container px-6 py-12 md:py-20">
      <div className="mb-10 max-w-2xl">
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Recursos</h1>
        <p className="text-lg text-slate-400">
          Una selección de materiales para acelerar tu adopción de IA en contextos educativos.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Download className="h-5 w-5 text-indigo-400" />
              Guía de LaTeX con IA
            </CardTitle>
            <CardDescription>Descarga gratuita para crear material académico asistido por IA.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="https://drive.google.com/uc?export=download&id=1j6d-bJaHm5_KWPEKqtWORJ3m15m6sGjI" target="_blank" rel="noopener noreferrer">
                Descargar guía
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Youtube className="h-5 w-5 text-red-500" />
              Canal Profe Cuellar IA
            </CardTitle>
            <CardDescription>Tutoriales prácticos de prompts, automatización y herramientas educativas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary">
              <Link href="https://www.youtube.com/@ProfeCuellarIA" target="_blank" rel="noopener noreferrer">
                Ver canal
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              Rutas recomendadas
            </CardTitle>
            <CardDescription>Explora las rutas formativas para implementar IA paso a paso.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/cursos">Ir a cursos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
