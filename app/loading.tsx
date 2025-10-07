import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />

      <main className="flex-1 relative z-10">
        {/* Hero Section Skeleton */}
        <section className="relative bg-gradient-to-b from-blue-50 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="space-y-6 lg:space-y-8">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-4">
                  <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded animate-pulse w-5/6"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-4/5"></div>
                </div>
                <div className="flex gap-4">
                  <div className="h-12 w-40 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-12 w-40 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="relative lg:h-[500px] h-[300px] rounded-2xl bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Stats Section Skeleton */}
        <section className="border-y bg-blue-50/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="h-12 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ebooks Section Skeleton */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="flex justify-between items-center mb-10 sm:mb-12">
            <div className="space-y-2">
              <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
                <div className="h-64 sm:h-72 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Courses Section Skeleton */}
        <section className="bg-blue-50/50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-10 sm:mb-12">
              <div className="space-y-2">
                <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden animate-pulse bg-card">
                  <div className="h-64 sm:h-72 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                      <div className="h-10 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
