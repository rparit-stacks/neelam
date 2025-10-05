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
import { BookOpen, Star, Award, CheckCircle2, ArrowLeft } from "lucide-react"
import { createServerClient } from "@/lib/supabase"

export default async function EbookDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const { data: ebook } = await supabase.from("ebooks").select("*").eq("id", params.id).eq("is_active", true).single()

  if (!ebook) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/ebooks">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Ebooks
            </Link>
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Image */}
            <div className="space-y-6">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={ebook.cover_image || "/placeholder.svg?height=800&width=600&query=ebook cover"}
                  alt={ebook.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge className="w-fit bg-blue-100 text-blue-700">{ebook.category}</Badge>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance leading-tight">{ebook.title}</h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">{ebook.description}</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{ebook.pages} pages</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-blue-600 text-blue-600" />
                  <span>4.8 (120 reviews)</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">What you'll learn:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Master the fundamentals and advanced concepts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Build real-world projects from scratch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Learn industry best practices and patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Get lifetime access to all content and updates</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl font-bold text-blue-600">₹{ebook.price}</CardTitle>
                      <CardDescription className="mt-1">One-time payment</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button size="lg" className="w-full text-base bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href={`/checkout?type=ebook&id=${ebook.id}`}>Buy Now</Link>
                  </Button>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <span>Instant access after purchase</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <span>Lifetime updates included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>About the Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{ebook.author}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Expert instructor with years of industry experience, helping thousands of students master their
                        skills.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-12" />
          <RelatedProducts
            productType="ebook"
            currentProductId={ebook.id}
            category={ebook.category}
            tags={ebook.tags}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
