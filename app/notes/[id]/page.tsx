import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NoteDetail } from "@/components/note-detail"
import { createServerClient } from "@/lib/supabase"

interface NotePageProps {
  params: {
    id: string
  }
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params
  const supabase = await createServerClient()
  
  const { data: note, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (error || !note) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <NoteDetail note={note} />
      </main>
      <Footer />
    </div>
  )
}

export async function generateMetadata({ params }: NotePageProps) {
  const { id } = await params
  const supabase = await createServerClient()
  
  const { data: note } = await supabase
    .from("notes")
    .select("title, description, topic, category, tags")
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (!note) {
    return {
      title: "Note Not Found",
    }
  }

  return {
    title: `${note.title} | Free Notes - Neelam Academy`,
    description: note.description || `Free study notes on ${note.topic} by Neelam Academy. Download and learn at your own pace.`,
    keywords: [
      "free notes",
      note.topic,
      note.category,
      ...(note.tags || []),
      "neelam academy",
      "study material",
      "download notes"
    ].filter(Boolean),
    openGraph: {
      title: note.title,
      description: note.description || `Free study notes on ${note.topic}`,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/notes/${id}`,
      images: note.cover_image ? [
        {
          url: note.cover_image,
          width: 1200,
          height: 630,
          alt: note.title,
        }
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.description || `Free study notes on ${note.topic}`,
      images: note.cover_image ? [note.cover_image] : [],
    },
  }
}
