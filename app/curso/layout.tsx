import CourseLayoutNav from "@/components/courses/navigation/CourseLayoutNav"
import { CourseProgressProvider } from "@/components/courses/navigation/CourseProgressProvider"
import { ToolSyncProvider } from "@/components/courses/navigation/ToolSyncProvider"

export default function CursoLayout({ children }: { children: React.ReactNode }) {
  return (
    <CourseProgressProvider>
      <ToolSyncProvider>
        <section className="container px-6 py-8 md:py-12">
          <CourseLayoutNav />
          {children}
        </section>
      </ToolSyncProvider>
    </CourseProgressProvider>
  )
}
