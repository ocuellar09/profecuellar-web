"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles, Youtube } from "lucide-react"

export default function Hero() {
    return (
        <section className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-background pt-20">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-1/2 -ml-[50%] h-[500px] w-full max-w-[1000px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-grid-white/10 bg-[size:50px_50px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="container relative z-10 px-6 md:px-12 py-12 md:py-20 lg:py-32">
                <div className="grid gap-12 lg:grid-cols-2 items-center">

                    {/* Left Content */}
                    <div className="flex flex-col items-start text-left space-y-8 animate-in fade-in slide-in-from-left-6 duration-1000">
                        {/* Badge */}
                        <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 backdrop-blur-xl">
                            <Sparkles className="mr-2 h-4 w-4 text-indigo-400" />
                            <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                                Nueva Era Educativa
                            </span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
                            Educación <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Future-Ready
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="max-w-xl text-lg text-slate-400 md:text-xl leading-relaxed">
                            Cierra la brecha digital. Domina la ingeniería de prompts, automatiza procesos y transforma tu carrera docente con tecnología real.
                        </p>

                        {/* CTA Group */}
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button asChild size="lg" className="h-14 rounded-2xl bg-white px-8 text-base font-bold text-black hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform hover:scale-105">
                                <Link href="#cursos">
                                    Explorar Cursos
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-14 rounded-2xl border-white/20 bg-white/5 px-8 text-base text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/40">
                                <Link href="https://www.youtube.com/user/ocuellar" target="_blank">
                                    <Youtube className="mr-2 h-5 w-5 text-red-500" />
                                    YouTube
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Visual (Video) */}
                    <div className="relative w-full max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-right-6 duration-1000 delay-200">
                        {/* Decorative Blob */}
                        <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 blur-2xl transform rotate-3" />

                        <div className="relative aspect-video overflow-hidden rounded-[32px] border border-white/10 bg-black/50 shadow-2xl backdrop-blur-sm ring-1 ring-white/10">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="h-full w-full object-cover opacity-90"
                            >
                                <source src="/img/teacher-1.mp4" type="video/mp4" />
                            </video>

                            {/* Inner Highlight */}
                            <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/20 pointer-events-none" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
