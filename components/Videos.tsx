import VideoCard from "@/components/VideoCard"

const VIDEOS = [
    {
        id: "ykzaQjF5yV8",
        title: "Ep. 0 – Configurá ChatGPT a tu estilo | Serie Prompt Mastery",
        description: "Aprende a personalizar ChatGPT para que te responda con tu tono y estilo. Deja de sonar como robot."
    },
    {
        id: "YkcLAReaCKU",
        title: "Ep. 1 – ¿Por qué la IA no te entiende?",
        description: "Aprende a dirigir la atención de la IA como un experto para obtener mejores respuestas."
    },
    {
        id: "iFMNq_sQXwg",
        title: "Canal contenidos IA: Implementa soluciones técnicas reales",
        description: "Optimiza tus procesos con este Canal contenidos IA especializado en automatización y prompts efectivos. Aprende ingeniería de prompts y automatización."
    },
    {
        id: "3zTENRl4g8U",
        title: "Privacidad y Datos en ChatGPT: Cómo Protegerte",
        description: "Descubre qué pasa con tus datos y cómo usar ChatGPT de forma segura."
    },
    {
        id: "_ZK4X5B5mo4",
        title: "Crea mapas mentales e infografías con Claude.ai",
        description: "Tutorial para generar material visual educativo usando IA."
    },
    {
        id: "8qIHJP9R9Os",
        title: "Transforma tus Ideas en Proyectos con IA",
        description: "Tutorial completo usando Gemini, LaTeX y más herramientas."
    },
]

const SHORTS = [
    {
        id: "CayMTdZS1sw",
        title: "La Jugada 37 🧠 Decisiones que solo tienen sentido después",
        description: "Reflexión sobre inteligencia y estrategia."
    }
]

export default function Videos() {
    return (
        <section className="relative w-full bg-slate-950 py-16 text-slate-100 md:py-24">
            {/* Background Gradients */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />

            <div className="container relative z-10 px-4 md:px-6">
                <div className="mb-12 flex flex-col items-center text-center">
                    <span className="mb-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 backdrop-blur-md">
                        Contenido Exclusivo
                    </span>
                    <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">
                        Domina la IA Educativa
                    </h2>
                    <p className="mt-4 max-w-[700px] text-lg text-slate-400">
                        Tu <strong>Canal contenidos IA online</strong> favorito. Tutoriales técnicos, guías de automatización y estrategias para optimizar tu flujo de trabajo digital.
                    </p>
                </div>

                {/* Main Series Grid */}
                <div className="mb-16">
                    <h3 className="mb-6 text-xl font-semibold text-white/90">Últimos Episodios</h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {VIDEOS.map((video) => (
                            <VideoCard key={video.id} {...video} />
                        ))}
                    </div>
                </div>

                {/* Shorts & Highlights */}
                <div className="rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="mb-2 text-2xl font-bold text-white">Shorts & Reflexiones</h3>
                            <p className="text-slate-400">
                                Píldoras de conocimiento rápido para consumir en cualquier momento.
                                La &quot;Jugada 37&quot; cambió la historia de la IA... ¿ya la conoces?
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {SHORTS.map((video) => (
                                <VideoCard key={video.id} {...video} isShort />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
