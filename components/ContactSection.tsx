import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Instagram, Linkedin, Youtube } from "lucide-react"
import Link from "next/link"

export default function ContactSection() {
  return (
    <section id="contacto" className="container py-12 md:py-24">
      <Card className="mx-auto max-w-3xl border border-primary/20 bg-card/60 shadow-xl backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold md:text-3xl">Contacto</CardTitle>
          <CardDescription className="text-base md:text-lg">
            Hablemos de tu proyecto educativo, capacitaciones o implementaciones con IA.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="https://www.instagram.com/profecuellar/" target="_blank" rel="noopener noreferrer">
              <Instagram className="mr-2 h-4 w-4" />
              Instagram
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
            <Link href="https://www.linkedin.com/in/oscar-andres-cuellar-rojas/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="https://www.youtube.com/@ProfeCuellarIA" target="_blank" rel="noopener noreferrer">
              <Youtube className="mr-2 h-4 w-4 text-red-500" />
              Canal de YouTube
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
