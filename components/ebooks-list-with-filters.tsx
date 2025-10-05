"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { getSupabase } from "@/lib/supabase"
import type { Ebook } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Star, Search } from "lucide-react"

export function EbooksListWithFilters() {
  const [ebooks, setEbooks] = useState<Ebook[]>([])
  const [filteredEbooks, setFilteredEbooks] = useState<Ebook[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>([])

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
        setFilteredEbooks(data)

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map((e) => e.category).filter(Boolean))) as string[]
        setCategories(uniqueCategories)
      }
      setLoading(false)
    }

    fetchEbooks()
  }, [])

  useEffect(() => {
    let filtered = ebooks

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((ebook) => ebook.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (ebook) =>
          ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ebook.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ebook.author?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredEbooks(filtered)
  }, [searchQuery, selectedCategory, ebooks])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-12 bg-muted rounded animate-pulse" />
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
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search ebooks by title, author, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className={selectedCategory === "all" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredEbooks.length} {filteredEbooks.length === 1 ? "ebook" : "ebooks"}
        </p>
      </div>

      {/* Ebooks Grid */}
      {filteredEbooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No ebooks found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredEbooks.map((ebook) => (
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
                  {ebook.category && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 shrink-0">
                      {ebook.category}
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2 text-base leading-relaxed">
                  {ebook.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {ebook.pages && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{ebook.pages} pages</span>
                    </div>
                  )}
                  {ebook.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-blue-600 text-blue-600" />
                      <span>{ebook.rating}</span>
                    </div>
                  )}
                </div>
                {ebook.author && <p className="text-sm text-muted-foreground">By {ebook.author}</p>}
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
      )}
    </div>
  )
}
