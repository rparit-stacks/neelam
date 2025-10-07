'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search } from "lucide-react"
import Image from "next/image"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-background px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image 
            src="/logo.png" 
            alt="Neelam Academy Logo" 
            width={100} 
            height={100} 
            className="rounded-lg"
          />
        </div>

        {/* 404 Error */}
        <div className="space-y-4">
          <h1 className="text-8xl sm:text-9xl font-bold text-blue-600">404</h1>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            This webpage is not available. Please go to the home page.
          </p>
        </div>

        {/* Decorative Element */}
        <div className="relative py-8">
          <Search className="w-24 h-24 mx-auto text-blue-200" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 min-w-[200px]" asChild>
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go to Home Page
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="min-w-[200px]" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t border-border/40 mt-12">
          <p className="text-sm text-muted-foreground mb-4">Or explore these pages:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="link" asChild>
              <Link href="/ebooks">Ebooks</Link>
            </Button>
            <span className="text-muted-foreground">•</span>
            <Button variant="link" asChild>
              <Link href="/courses">Live Courses</Link>
            </Button>
            <span className="text-muted-foreground">•</span>
            <Button variant="link" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <span className="text-muted-foreground">•</span>
            <Button variant="link" asChild>
              <Link href="/why-us">Why Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

