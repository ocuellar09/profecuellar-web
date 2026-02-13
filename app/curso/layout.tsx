import CourseLayoutNav from "@/components/courses/navigation/CourseLayoutNav"
import { CourseProgressProvider } from "@/components/courses/navigation/CourseProgressProvider"

export default function CursoLayout({ children }: { children: React.ReactNode }) {
  return (
    <CourseProgressProvider>
      <section className="container px-6 py-8 md:py-12">
        <CourseLayoutNav />
        {children}
      </section>
    </CourseProgressProvider>
  )
}
