import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExternalLink, Video } from "lucide-react"
import { createServerClient } from "@/lib/supabase"

export async function WebinarBanner() {
  const supabase = await createServerClient()

  const { data: webinar } = await supabase
    .from("webinars")
    .select("*")
    .eq("is_active", true)
    .single()

  if (!webinar) return null

  return (
    <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-blue-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-4 sm:space-y-6 text-white order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <Video className="h-4 w-4" />
              <span>Live Webinar</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {webinar.name}
            </h2>
            
            <p className="text-lg sm:text-xl text-blue-50 max-w-xl">
              Join our exclusive live webinar and learn from industry experts. Don't miss this opportunity!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Link href={webinar.webinar_link} target="_blank" rel="noopener noreferrer">
                  Join Webinar Now
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-blue-50">Live Session</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-white rounded-full"></div>
                <span className="text-blue-50">Interactive Q&A</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-white rounded-full"></div>
                <span className="text-blue-50">Free to Join</span>
              </div>
            </div>
          </div>

          {/* Banner Image */}
          {webinar.banner_image && (
            <div className="relative order-1 lg:order-2">
              <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <Image
                  src={webinar.banner_image}
                  alt={webinar.name}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400/30 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-400/30 rounded-full blur-2xl"></div>
            </div>
          )}

          {/* Fallback design when no banner image */}
          {!webinar.banner_image && (
            <div className="relative order-1 lg:order-2">
              <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-2xl flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <Video className="h-20 w-20 mx-auto mb-4 opacity-80" />
                  <p className="text-2xl font-bold">Live Webinar</p>
                  <p className="text-blue-100 mt-2">Interactive Learning Session</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 48h1440V0c-240 48-480 48-720 0S240 0 0 48z" fill="currentColor" className="text-white dark:text-gray-950"/>
        </svg>
      </div>
    </section>
  )
}


