import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BookOpen, Video, Users, Award, Clock, Star } from "lucide-react"

export default function WhyUsPage() {
  const items = [
    { icon: BookOpen, title: "Comprehensive Ebooks", desc: "In-depth guides from basics to advanced with practical examples" },
    { icon: Video, title: "Live Interactive Sessions", desc: "Hands-on learning with expert instructors" },
    { icon: Users, title: "Community Support", desc: "Join a thriving community and get help when you need it" },
    { icon: Clock, title: "Learn at Your Pace", desc: "Access materials anytime and progress at your speed" },
    { icon: Award, title: "Expert Instructors", desc: "Industry professionals with real-world experience" },
    { icon: Star, title: "Quality Content", desc: "Carefully crafted, job-ready content" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Why Choose Us</h1>
            <p className="text-muted-foreground text-lg">We focus on clear, practical learning that gets results</p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {items.map(({ icon: Icon, title, desc }, i) => (
              <Card key={i} className="border-2 hover:border-blue-300 transition-colors">
                <CardHeader className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-center">{title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-center">{desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}


