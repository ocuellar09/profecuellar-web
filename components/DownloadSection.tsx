import { Button } from "@/components/ui/button"
import { Download, Youtube } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function DownloadSection() {
    return (
        <section id="descarga" className="container py-12 md:py-24">
            <Card className="max-w-2xl mx-auto border-2 border-primary/20 shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl md:text-3xl font-bold">¡Descarga Gratis la Guía de LaTeX con IA!</CardTitle>
                    <CardDescription className="text-lg">
                        Domina LaTeX con herramientas de inteligencia artificial.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6 text-center">
                    <p className="text-muted-foreground">
                        Es completamente gratis, pero si te resulta útil,
                        <strong> suscríbete a mi canal para agradecerme</strong>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Button asChild size="lg" className="gap-2">
                            <Link href="https://drive.google.com/uc?export=download&id=1j6d-bJaHm5_KWPEKqtWORJ3m15m6sGjI" target="_blank">
                                <Download className="h-4 w-4" /> Descargar Guía
                            </Link>
                        </Button>
                        <Button asChild variant="secondary" size="lg" className="gap-2">
                            <Link href="https://www.youtube.com/@ProfeCuellarIA?sub_confirmation=1" target="_blank">
                                <Youtube className="h-4 w-4 text-red-600" /> Suscribirme al Canal
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}

import Link from "next/link"
