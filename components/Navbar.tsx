import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Youtube, Instagram, Mail } from "lucide-react"
import Link from "next/link"

export default function Navbar() {
  const NAV_ITEMS = [
    { label: "Blog", href: "/blog" },
    { label: "Cursos", href: "/cursos" },
    { label: "Recursos", href: "/recursos" },
  ]

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
      <header className="flex h-14 w-[95%] max-w-5xl items-center justify-between rounded-full border border-white/10 bg-black/60 px-6 backdrop-blur-md shadow-2xl transition-all hover:bg-black/70 hover:border-white/20">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-500 transition-all duration-300">
            Profe Cuellar
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions & Mobile */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 pr-4 border-r border-white/10">
            <Link href="https://www.youtube.com/user/ocuellar" target="_blank" className="text-slate-400 hover:text-[#FF0000] transition-colors"><Youtube className="w-5 h-5" /></Link>
            <Link href="https://www.instagram.com/profecuellar/" target="_blank" className="text-slate-400 hover:text-[#E4405F] transition-colors"><Instagram className="w-5 h-5" /></Link>
          </div>

          <Button asChild variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 font-medium shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-shadow hover:shadow-[0_0_25px_rgba(79,70,229,0.7)]">
            <Link href="/#contacto">
              <Mail className="mr-2 h-4 w-4" />
              Contacto
            </Link>
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-black/95 border-l-white/10 text-white">
                <SheetHeader>
                  <SheetTitle className="text-white text-left">Menú</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-6 mt-8">
                  {NAV_ITEMS.map((item) => (
                    <Link key={item.href} href={item.href} className="text-xl font-medium text-slate-300 hover:text-indigo-400">
                      {item.label}
                    </Link>
                  ))}
                  <Link href="/#contacto" className="text-xl font-medium text-slate-300 hover:text-indigo-400">Contacto</Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </div>
  )
}
