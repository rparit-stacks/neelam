'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, RefreshCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-background px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl sm:text-7xl font-bold text-red-600">Error</h1>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Something went wrong!
              </h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Please try refreshing the page or go to the home page.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 min-w-[200px]"
                onClick={() => reset()}
              >
                <RefreshCcw className="mr-2 h-5 w-5" />
                Try Again
              </Button>
              <Button size="lg" variant="outline" className="min-w-[200px]" asChild>
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Go to Home Page
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

