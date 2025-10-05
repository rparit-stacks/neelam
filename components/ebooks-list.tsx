"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSupabase } from "@/lib/supabase"
import type { Ebook } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Star } from "lucide-react"

export function EbooksList() {
  const [ebooks, setEbooks] = useState<Ebook[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEbooks() {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from("ebooks")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setEbooks(data)
      }
      setLoading(false)
    }

    fetchEbooks()
  }, [])

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-64 sm:h-72 bg-muted rounded-t-lg" />
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-full" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {ebooks.map((ebook) => (
        <Card key={ebook.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-64 sm:h-72 bg-muted">
            <Image
              src={ebook.cover_image || "/placeholder.svg?height=400&width=300&query=ebook cover"}
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
            <CardDescription className="line-clamp-2 text-base leading-relaxed">{ebook.description}</CardDescription>
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
  )
}
