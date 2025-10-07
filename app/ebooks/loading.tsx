import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Header Skeleton */}
          <div className="mb-8 sm:mb-12">
            <div className="h-12 w-48 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
            <div className="h-6 w-96 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Filters Skeleton */}
          <div className="mb-8 flex gap-4">
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
                {/* Image skeleton */}
                <div className="h-64 sm:h-72 bg-gray-200"></div>
                
                {/* Content skeleton */}
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  
                  <div className="flex gap-4 pt-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
