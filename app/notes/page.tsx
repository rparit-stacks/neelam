import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NotesListWithFilters } from "@/components/notes-list-with-filters"
import { PurchasedNotesSection } from "@/components/purchased-notes-section"
import { FileText, Download, BookOpen, Users, Star } from "lucide-react"

export default function NotesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-green-50 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Free <span className="text-green-600">Study Notes</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
                Access our comprehensive collection of free study notes, guides, and resources. 
                Download, edit, and use them for your learning journey.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">50+</div>
                  <div className="text-sm text-muted-foreground">Free Notes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">10+</div>
                  <div className="text-sm text-muted-foreground">Topics</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">1K+</div>
                  <div className="text-sm text-muted-foreground">Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-muted-foreground">Free</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-y bg-green-50/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="text-center space-y-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Instant Download</h3>
                <p className="text-muted-foreground">
                  Download notes instantly in text format. No registration required.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Editable Content</h3>
                <p className="text-muted-foreground">
                  All notes are in plain text format, making them easy to edit and customize.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Community Driven</h3>
                <p className="text-muted-foreground">
                  Notes created by experts and continuously updated with new content.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Purchased Notes Section */}
        {/* <section className="bg-blue-50/50 py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Your Purchased Notes</h2>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Access your purchased notes and download them anytime
              </p>
            </div>

            <PurchasedNotesSection />
          </div>
        </section> */}

        {/* Free Notes List Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Browse Free Notes</h2>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Find the perfect study material for your learning needs
            </p>
          </div>

          <NotesListWithFilters />
        </section>

        {/* CTA Section */}
        <section className="bg-green-600 text-white py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
                Need More Advanced Content?
              </h2>
              <p className="text-lg sm:text-xl text-green-50 leading-relaxed">
                Explore our premium ebooks and live courses for in-depth learning experiences
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <a
                  href="/ebooks"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium bg-white text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  Browse Ebooks
                </a>
                <a
                  href="/courses"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 rounded-lg transition-colors"
                >
                  View Live Courses
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
