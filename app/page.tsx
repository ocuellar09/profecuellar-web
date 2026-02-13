import Hero from "@/components/Hero";
import Profile from "@/components/Profile";
import Videos from "@/components/Videos";
import Platform from "@/components/Platform";
import DownloadSection from "@/components/DownloadSection";
import ContactSection from "@/components/ContactSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio | Profe Cuellar",
  description:
    "Aprende IA aplicada a la educación con tutoriales, cursos y recursos prácticos para docentes.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Profe Cuellar - Educación del Futuro",
    description:
      "Cierra la brecha digital y transforma tu práctica docente con IA, automatización y prompts efectivos.",
    url: "/",
    type: "website",
    locale: "es_CO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profe Cuellar - Educación del Futuro",
    description:
      "IA aplicada a la educación: cursos, tutoriales y recursos para docentes.",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Profile />
      <div id="cursos">
        {/* Using Videos as a proxy for courses/content for now, or could link to Moodle */}
        <Videos />
      </div>
      <Platform />
      <DownloadSection />
      <ContactSection />
    </>
  );
}
