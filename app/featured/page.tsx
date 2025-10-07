import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function FeaturedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Featured</h1>
            <p className="text-muted-foreground text-lg">Handpicked ebooks and live courses</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Top Ebooks</h3>
              <p className="text-sm text-muted-foreground mb-4">Bestselling and trending ebooks</p>
              <Button asChild><Link href="/ebooks">Browse Ebooks</Link></Button>
            </div>
            <div className="border rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Top Courses</h3>
              <p className="text-sm text-muted-foreground mb-4">Popular live sessions</p>
              <Button variant="outline" asChild><Link href="/courses">Browse Courses</Link></Button>
            </div>
            <div className="border rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">New Arrivals</h3>
              <p className="text-sm text-muted-foreground mb-4">Fresh content this month</p>
              <Button asChild><Link href="/ebooks">See What's New</Link></Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}


