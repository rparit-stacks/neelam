import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RelatedProducts } from "@/components/related-products"
import { Star, Clock, Users, Calendar, CheckCircle2, ArrowLeft, Award } from "lucide-react"
import { createServerClient } from "@/lib/supabase"

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const { data: course } = await supabase
    .from("live_courses")
    .select("*")
    .eq("id", params.id)
    .eq("is_active", true)
    .single()

  if (!course) {
    notFound()
  }

  const startDate = new Date(course.start_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Image */}
            <div className="space-y-6">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={course.cover_image || "/placeholder.svg?height=600&width=800&query=online course"}
                  alt={course.title}
                  fill
                  className="object-cover"
                  priority
                />
                <Badge className="absolute top-4 right-4 bg-blue-600 text-white">Live Course</Badge>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge className="w-fit bg-blue-100 text-blue-700">{course.category}</Badge>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance leading-tight">
                  {course.title}
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">{course.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration_hours} hours</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{course.max_students} seats</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Starts {startDate}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4 fill-blue-600 text-blue-600" />
                  <span>4.9 (85 reviews)</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">What you'll learn:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Live interactive sessions with expert instructor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Build multiple real-world projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Get personalized feedback and code reviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Access to course materials and recordings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl font-bold text-blue-600">₹{course.price}</CardTitle>
                      <CardDescription className="mt-1">Limited seats available</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button size="lg" className="w-full text-base bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href={`/checkout?type=course&id=${course.id}`}>Enroll Now</Link>
                  </Button>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <span>Live interactive sessions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <span>Lifetime access to recordings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <span>Certificate upon completion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>About the Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{course.instructor}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Expert instructor with years of industry experience, helping thousands of students master their
                        skills through live interactive sessions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-12" />
          <RelatedProducts
            productType="course"
            currentProductId={course.id}
            category={course.category}
            tags={course.tags}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
