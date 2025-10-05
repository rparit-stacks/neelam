import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CoursesListWithFilters } from "@/components/courses-list-with-filters"

export default function CoursesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Live Courses</h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Interactive learning experiences with expert instructors
            </p>
          </div>

          <CoursesListWithFilters />
        </section>
      </main>

      <Footer />
    </div>
  )
}
