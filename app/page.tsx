import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FloatingIcons } from "@/components/floating-icons"
import { BookOpen, Video, Star, Users, Clock, Award, ArrowRight, CheckCircle2 } from "lucide-react"
import { createServerClient } from "@/lib/supabase"

export default async function HomePage() {
  const supabase = createServerClient()

  const { data: ebooks } = await supabase.from("ebooks").select("*").eq("is_active", true).limit(3)

  const { data: courses } = await supabase.from("live_courses").select("*").eq("is_active", true).limit(3)

  return (
    <div className="min-h-screen flex flex-col relative">
      <FloatingIcons />

      <Header />

      <main className="flex-1 relative z-10">
        <section className="relative bg-gradient-to-b from-blue-50 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="space-y-6 lg:space-y-8">
                <Badge className="w-fit" variant="secondary">
                  <Star className="h-3 w-3 mr-1 fill-blue-600 text-blue-600" />
                  Trusted by 5,000+ Students
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-tight">
                  Master Your Skills with <span className="text-blue-600">Expert-Led Courses</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground text-pretty leading-relaxed max-w-xl">
                  Learn from industry professionals through comprehensive ebooks and interactive live courses. Build
                  real-world projects and advance your career.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-base bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="#ebooks">
                      Browse Ebooks <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base bg-transparent" asChild>
                    <Link href="#courses">View Live Courses</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-muted-foreground">Lifetime Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-muted-foreground">Expert Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-muted-foreground">Certificate</span>
                  </div>
                </div>
              </div>
              <div className="relative lg:h-[500px] h-[300px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/students-learning-online-with-laptop-and-books-mod.jpg"
                  alt="Students learning online"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y bg-blue-50/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center space-y-2">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600">50+</div>
                <div className="text-sm sm:text-base text-muted-foreground">Quality Ebooks</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600">30+</div>
                <div className="text-sm sm:text-base text-muted-foreground">Live Courses</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600">5K+</div>
                <div className="text-sm sm:text-base text-muted-foreground">Happy Students</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600">4.9</div>
                <div className="text-sm sm:text-base text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        <section id="ebooks" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 sm:mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3">Featured Ebooks</h2>
              <p className="text-muted-foreground text-base sm:text-lg">Comprehensive guides to master your skills</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/ebooks">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {ebooks?.map((ebook) => (
              <Card key={ebook.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64 sm:h-72 bg-muted">
                  <Image
                    src={ebook.cover_image || "/placeholder.svg?height=400&width=300"}
                    alt={ebook.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl line-clamp-2">{ebook.title}</CardTitle>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {ebook.category}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 text-base leading-relaxed">
                    {ebook.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{ebook.pages} pages</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-blue-600 text-blue-600" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">By {ebook.author}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-4 border-t">
                  <div className="text-2xl font-bold text-blue-600">₹{ebook.price}</div>
                  <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href={`/ebooks/${ebook.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section id="courses" className="bg-blue-50/50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 sm:mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3">Live Courses</h2>
                <p className="text-muted-foreground text-base sm:text-lg">
                  Interactive sessions with expert instructors
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/courses">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {courses?.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-card">
                  <div className="relative h-64 sm:h-72 bg-muted">
                    <Image
                      src={course.cover_image || "/placeholder.svg?height=400&width=300"}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-blue-600 text-white">Live Course</Badge>
                  </div>
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl line-clamp-2">{course.title}</CardTitle>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {course.category}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 text-base leading-relaxed">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration_hours}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.max_students} seats</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">By {course.instructor}</p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between pt-4 border-t">
                    <div className="text-2xl font-bold text-blue-600">₹{course.price}</div>
                    <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href={`/courses/${course.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              We provide comprehensive learning resources designed for modern learners
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Comprehensive Ebooks</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  In-depth guides covering everything from basics to advanced topics with practical examples
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Video className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Live Interactive Sessions</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Real-time learning with expert instructors and hands-on projects you can build
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Community Support</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Join a thriving community of learners and get help when you need it most
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Learn at Your Pace</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Access materials anytime and progress through content at your own speed
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Expert Instructors</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Learn from industry professionals with years of real-world experience
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Quality Content</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Carefully crafted materials that focus on practical, job-ready skills
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="bg-blue-600 text-white py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">Ready to Start Learning?</h2>
              <p className="text-lg sm:text-xl text-blue-50 leading-relaxed">
                Browse our collection of ebooks and live courses to find the perfect fit for your learning journey
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-base bg-white text-blue-600 hover:bg-blue-50"
                  asChild
                >
                  <Link href="/ebooks">Explore Ebooks</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
                  asChild
                >
                  <Link href="/courses">View Courses</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
