"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSupabase } from "@/lib/supabase"
import type { Ebook, LiveCourse } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Star, Clock, Users } from "lucide-react"

interface RelatedProductsProps {
  productType: "ebook" | "course"
  currentProductId: string
  category: string | null
  tags?: string[] | null
}

export function RelatedProducts({ productType, currentProductId, category, tags }: RelatedProductsProps) {
  const [products, setProducts] = useState<(Ebook | LiveCourse)[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRelatedProducts() {
      const supabase = getSupabase()
      const tableName = productType === "ebook" ? "ebooks" : "live_courses"

      // Fetch products from the same category, excluding the current product
      let query = supabase.from(tableName).select("*").eq("is_active", true).neq("id", currentProductId).limit(3)

      // Filter by category if available
      if (category) {
        query = query.eq("category", category)
      }

      const { data, error } = await query

      if (!error && data) {
        setProducts(data)
      }
      setLoading(false)
    }

    fetchRelatedProducts()
  }, [productType, currentProductId, category, tags])

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Related {productType === "ebook" ? "Ebooks" : "Courses"}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold">Related {productType === "ebook" ? "Ebooks" : "Courses"}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const isEbook = productType === "ebook"
          const ebook = isEbook ? (product as Ebook) : null
          const course = !isEbook ? (product as LiveCourse) : null

          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-muted">
                <Image
                  src={
                    product.cover_image ||
                    `/placeholder.svg?height=300&width=400&query=${isEbook ? "ebook cover" : "course thumbnail"}`
                  }
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                {!isEbook && <Badge className="absolute top-3 right-3 bg-blue-600 text-white">Live Course</Badge>}
              </div>
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                  {product.category && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 shrink-0 text-xs">
                      {product.category}
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2 text-sm">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {isEbook && ebook?.pages && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{ebook.pages} pages</span>
                    </div>
                  )}
                  {!isEbook && course?.duration_hours && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{course.duration_hours}h</span>
                    </div>
                  )}
                  {!isEbook && course?.max_students && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>{course.max_students} seats</span>
                    </div>
                  )}
                  {product.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
                      <span>{product.rating}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-3 border-t">
                <div className="text-xl font-bold text-blue-600">₹{product.price}</div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href={`/${isEbook ? "ebooks" : "courses"}/${product.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
