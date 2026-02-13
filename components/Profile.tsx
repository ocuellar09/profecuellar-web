import { Badge } from "@/components/ui/badge"

export default function Profile() {
    return (
        <section className="container py-12 md:py-24 lg:py-32">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                <div className="flex justify-center order-first lg:order-last">
                    <div className="relative aspect-square w-[300px] h-[300px] overflow-hidden rounded-full border-4 border-primary shadow-2xl">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src="/img/profile_pic-1.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Profe Cuellar</h2>
                    <ul className="grid gap-2 text-muted-foreground md:text-lg">
                        <li className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            Licenciado en Matemáticas y Física (U. de Antioquia)
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            Magister en Enseñanza de las Ciencias (U. Nacional)
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            Estudiante de Doctorado (U. Politécnica de Valencia)
                        </li>
                    </ul>

                    <div className="flex flex-wrap gap-2 pt-4">
                        <Badge variant="secondary" className="text-md py-1">Director de Educación en Academy by PolygonUs</Badge>
                        <Badge variant="secondary" className="text-md py-1">Experto en evaluación con IA</Badge>
                    </div>
                </div>
            </div>
        </section>
    )
}
