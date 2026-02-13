import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
// import Navbar from "@/components/Navbar"; // Removed in favor of Sidebar
import Footer from "@/components/Footer";
import { AppSidebar } from "@/components/AppSidebar";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://profecuellar.com"),
  title: {
    default: "Profe Cuellar - Educación del Futuro",
    template: "%s | Profe Cuellar",
  },
  description:
    "Espacio para la educación del futuro. Cierra la brecha digital y potencia habilidades del siglo XXI.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Profe Cuellar - Educación del Futuro",
    description:
      "Cursos, tutoriales y soluciones para integrar IA en procesos educativos.",
    url: "/",
    siteName: "Profe Cuellar",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profe Cuellar - Educación del Futuro",
    description:
      "Aprende IA educativa con recursos prácticos para transformar tu docencia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth dark" suppressHydrationWarning>
      <body className={`${outfit.className} bg-background text-foreground antialiased selection:bg-indigo-500/30 flex min-h-screen`}>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
          {/* Mobile header spacer could go here if needed, but sidebar handles trigger */}
          <main className="flex-1 w-full max-w-[1600px] mx-auto">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
