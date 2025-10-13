"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { getSupabase } from "@/lib/supabase"
import type { Note } from "@/lib/types"
import { FileText, Search, Download, Tag, Calendar, Eye, CreditCard, Lock } from "lucide-react"
import { toast } from "sonner"

export function NotesListWithFilters() {
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTopic, setSelectedTopic] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>([])
  const [topics, setTopics] = useState<string[]>([])

  useEffect(() => {
    async function fetchNotes() {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setNotes(data)
        setFilteredNotes(data)

        // Extract unique categories and topics
        const uniqueCategories = Array.from(new Set(data.map((n) => n.category).filter(Boolean))) as string[]
        const uniqueTopics = Array.from(new Set(data.map((n) => n.topic).filter(Boolean))) as string[]
        setCategories(uniqueCategories)
        setTopics(uniqueTopics)
      }
      setLoading(false)
    }

    fetchNotes()
  }, [])

  useEffect(() => {
    let filtered = notes

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((note) => note.category === selectedCategory)
    }

    // Filter by topic
    if (selectedTopic !== "all") {
      filtered = filtered.filter((note) => note.topic === selectedTopic)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    setFilteredNotes(filtered)
  }, [searchQuery, selectedCategory, selectedTopic, notes])

  const handleDownload = async (note: Note) => {
    try {
      if (note.file_url) {
        // Download from file URL
        const link = document.createElement('a')
        link.href = note.file_url
        link.download = note.file_name
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // Fallback to content if file_url is not available
        const blob = new Blob([note.content], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = note.file_name.endsWith('.txt') ? note.file_name : `${note.file_name}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }

      // Update download count
      const supabase = getSupabase()
      await supabase
        .from("notes")
        .update({ download_count: note.download_count + 1 })
        .eq("id", note.id)

      // Update local state
      setNotes(prev => prev.map(n => 
        n.id === note.id ? { ...n, download_count: n.download_count + 1 } : n
      ))

      toast.success("Note downloaded successfully!")
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Failed to download note")
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-12 bg-muted rounded animate-pulse" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-full" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
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
            placeholder="Search notes by title, topic, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Filter Buttons */}
        <div className="space-y-3">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">Categories:</span>
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "bg-blue-600 hover:bg-blue-700" : ""}
              size="sm"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Topic Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">Topics:</span>
            <Button
              variant={selectedTopic === "all" ? "default" : "outline"}
              onClick={() => setSelectedTopic("all")}
              className={selectedTopic === "all" ? "bg-green-600 hover:bg-green-700" : ""}
              size="sm"
            >
              All Topics
            </Button>
            {topics.map((topic) => (
              <Button
                key={topic}
                variant={selectedTopic === topic ? "default" : "outline"}
                onClick={() => setSelectedTopic(topic)}
                className={selectedTopic === topic ? "bg-green-600 hover:bg-green-700" : ""}
                size="sm"
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
        </p>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">No notes found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl line-clamp-2 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    {note.title}
                  </CardTitle>
                  {note.category && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 shrink-0">
                      {note.category}
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2 text-base leading-relaxed">
                  {note.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      <span>{note.topic}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{note.download_count}</span>
                    </div>
                    {note.payment_type === "paid" && note.price && (
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        <span>₹{note.price}</span>
                      </div>
                    )}
                  </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(note.created_at).toLocaleDateString()}</span>
                </div>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{note.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {note.file_size ? `${(note.file_size / 1024).toFixed(1)} KB` : 'Unknown size'}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/notes/${note.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                  {note.payment_type === "free" ? (
                    <Button 
                      onClick={() => handleDownload(note)}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      size="sm"
                      asChild
                      className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    >
                      <Link href={`/checkout?type=note&id=${note.id}`}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Buy ₹{note.price || 0}
                      </Link>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
