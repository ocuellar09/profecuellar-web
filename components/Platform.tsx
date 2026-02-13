import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Platform() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/10">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                    <div className="flex justify-center">
                        <div className="relative rounded-xl overflow-hidden shadow-2xl border bg-background">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full max-w-md mx-auto"
                            >
                                <source src="/img/oscar-ilustration-1.mp4" type="video/mp4" />
                            </video>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Soluciones Educativas a Medida</h2>
                        <p className="text-xl text-muted-foreground">
                            Si requieres una plataforma educativa personalizada, puedo implementarla conforme tus objetivos de aprendizaje.
                        </p>
                        <div className="pt-4">
                            <Button asChild size="lg">
                                <Link href="/#contacto">Contáctame</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
