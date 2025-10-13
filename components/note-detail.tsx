"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Note } from "@/lib/types"
import { 
  Download, 
  Share2, 
  Calendar, 
  Tag, 
  FileText, 
  Clock, 
  User, 
  Eye,
  Copy,
  ExternalLink,
  ArrowLeft,
  BookOpen
} from "lucide-react"
import { toast } from "sonner"

interface NoteDetailProps {
  note: Note
}

export function NoteDetail({ note }: NoteDetailProps) {
  const [copied, setCopied] = useState(false)

  const handleDownload = async () => {
    try {
      const blob = new Blob([note.content], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = note.file_name.endsWith('.txt') ? note.file_name : `${note.file_name}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Note downloaded successfully!")
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Failed to download note")
    }
  }

  const handleShare = async () => {
    const shareUrl = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: note.description || `Check out this free note on ${note.topic}`,
          url: shareUrl,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        toast.success("Link copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        toast.error("Failed to copy link")
      }
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(note.content)
      toast.success("Content copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy content")
    }
  }

  const readingTime = Math.ceil(note.content.length / 500) // Approximate reading time

  return (
    <div className="bg-gradient-to-b from-green-50 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/notes">
              <ArrowLeft className="h-4 w-4" />
              Back to All Notes
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {note.category && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {note.category}
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-green-300 text-green-700">
                    <Tag className="h-3 w-3 mr-1" />
                    {note.topic}
                  </Badge>
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  {note.title}
                </h1>
                
                {note.description && (
                  <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                    {note.description}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(note.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{note.download_count} downloads</span>
                  </div>
                  {note.author && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>By {note.author}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Image */}
              {note.cover_image && (
                <div className="relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden">
                  <Image
                    src={note.cover_image}
                    alt={note.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Content Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Note Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-muted p-4 rounded-lg overflow-x-auto">
                      {note.content.length > 500 
                        ? `${note.content.substring(0, 500)}...` 
                        : note.content
                      }
                    </pre>
                    {note.content.length > 500 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        This is a preview. Download the full note to see complete content.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Download Card */}
              <Card className="sticky top-8 border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-green-600" />
                    Download Note
                  </CardTitle>
                  <CardDescription>
                    Get the complete note in text format
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">File:</span>
                      <span className="font-medium">{note.file_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">{note.content.length} characters</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-medium">Text File</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <Button 
                    onClick={handleDownload}
                    className="w-full bg-green-600 hover:bg-green-700 gap-2"
                    size="lg"
                  >
                    <Download className="h-4 w-4" />
                    Download Now
                  </Button>
                  
                  <Button 
                    onClick={copyToClipboard}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Content
                  </Button>
                </CardContent>
              </Card>

              {/* Share Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Share This Note
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={handleShare}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    {copied ? (
                      <>
                        <Copy className="h-4 w-4" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4" />
                        Share Link
                      </>
                    )}
                  </Button>
                  
                  <div className="text-xs text-muted-foreground">
                    Share this note with others who might find it helpful
                  </div>
                </CardContent>
              </Card>

              {/* Related Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    More Free Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link href="/notes">
                        <FileText className="h-4 w-4 mr-2" />
                        Browse All Notes
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link href="/ebooks">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Premium Ebooks
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link href="/courses">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Live Courses
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
