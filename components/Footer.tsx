import Link from "next/link"
import { Youtube, Linkedin, Instagram, Facebook, Globe } from "lucide-react"

// Using a simple X icon since lucide-react doesn't have the X/Twitter logo
function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
    )
}

// TikTok icon
function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
    )
}

export default function Footer() {
    return (
        <footer className="w-full border-t bg-background py-6">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © {new Date().getFullYear()} <Link href="#" className="font-medium underline underline-offset-4">Profe Cuellar</Link>. Todos los derechos reservados.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link href="https://www.youtube.com/user/ocuellar" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#FF0000] transition-colors">
                        <Youtube className="h-5 w-5" />
                        <span className="sr-only">YouTube</span>
                    </Link>
                    <Link href="https://www.tiktok.com/@profecuellar" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#000000] dark:hover:text-[#ffffff] transition-colors">
                        <TikTokIcon className="h-5 w-5" />
                        <span className="sr-only">TikTok</span>
                    </Link>
                    <Link href="https://www.instagram.com/profecuellar/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#E4405F] transition-colors">
                        <Instagram className="h-5 w-5" />
                        <span className="sr-only">Instagram</span>
                    </Link>
                    <Link href="https://x.com/cuellarprofe" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#000000] dark:hover:text-[#ffffff] transition-colors">
                        <XIcon className="h-5 w-5" />
                        <span className="sr-only">X (Twitter)</span>
                    </Link>
                    <Link href="https://www.facebook.com/Profecuellar/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#1877F2] transition-colors">
                        <Facebook className="h-5 w-5" />
                        <span className="sr-only">Facebook</span>
                    </Link>
                    <Link href="https://www.linkedin.com/in/oscar-andres-cuellar-rojas/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#0A66C2] transition-colors">
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                    </Link>
                    <Link href="https://www.flow.page/profecuellar" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Globe className="h-5 w-5" />
                        <span className="sr-only">Flow.page</span>
                    </Link>
                </div>
            </div>
        </footer>
    )
}
