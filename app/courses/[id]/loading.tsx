import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Back button skeleton */}
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse mb-6"></div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Skeleton */}
            <div className="space-y-6">
              <div className="relative aspect-video rounded-xl bg-gray-200 animate-pulse"></div>
            </div>

            {/* Details Skeleton */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="h-px bg-gray-200"></div>

              {/* Features skeleton */}
              <div className="space-y-3">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-5 flex-1 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-200"></div>

              {/* Price card skeleton */}
              <div className="border-2 rounded-lg p-6 space-y-4 bg-blue-50 animate-pulse">
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
                <div className="h-12 w-full bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
