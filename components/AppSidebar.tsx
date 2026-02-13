"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    BookOpen,
    Library,
    Mail,
    Youtube,
    Linkedin,
    Instagram,
    Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const MENU_ITEMS = [
    { icon: LayoutDashboard, label: "Inicio", href: "/" },
    { icon: BookOpen, label: "Cursos", href: "/cursos" },
    { icon: Library, label: "Blog", href: "/blog" },
    { icon: Mail, label: "Contacto", href: "/#contacto" },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <>
            {/* Mobile Trigger */}
            <div className="fixed top-4 left-4 z-50 md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-md">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        <nav className="flex flex-col gap-4 mt-8">
                            {MENU_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary",
                                        pathname === item.href ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar (Navigation Rail) */}
            <aside className="hidden md:flex h-screen w-[280px] flex-col border-r border-white/5 bg-background sticky top-0 overflow-hidden">
                {/* Logo Header */}
                <div className="p-6 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <span className="font-bold text-white text-xl">P</span>
                        </div>
                        <span className="font-outfit font-bold text-xl tracking-tight text-white">
                            Profe Cuellar
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4">
                    <div className="space-y-1">
                        {MENU_ITEMS.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary/10 text-primary shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)]"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-slate-500")} />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Section Divider */}
                    <div className="my-6 border-t border-white/5 mx-2" />

                    <div className="px-4">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Social</p>
                        <div className="space-y-1">
                            <Link href="https://www.youtube.com/@ProfeCu%C3%A9llarIA" target="_blank" className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                <Youtube className="h-4 w-4 text-red-600" />
                                YouTube
                            </Link>
                            <Link href="https://www.linkedin.com/in/oscar-andres-cuellar-rojas/" target="_blank" className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                <Linkedin className="h-4 w-4 text-blue-500" />
                                LinkedIn
                            </Link>
                            <Link href="https://www.instagram.com/profecuellar/" target="_blank" className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                <Instagram className="h-4 w-4 text-pink-500" />
                                Instagram
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* User / Footer Area */}
                <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-3 border border-indigo-500/20">
                        <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-xs ring-1 ring-indigo-500/50">
                            PC
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-white">Estudiante IA</span>
                            <span className="text-[10px] text-indigo-300">Plan Gratuito</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
