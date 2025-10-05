import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EbooksListWithFilters } from "@/components/ebooks-list-with-filters"

export default function EbooksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Ebooks</h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Comprehensive guides to master development skills
            </p>
          </div>

          <EbooksListWithFilters />
        </section>
      </main>

      <Footer />
    </div>
  )
}
