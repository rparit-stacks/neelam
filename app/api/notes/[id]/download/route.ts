import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

// POST - Increment download count and return note content
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    
    // First, get the note
    const { data: note, error: fetchError } = await supabase
      .from("notes")
      .select("*")
      .eq("id", params.id)
      .eq("is_active", true)
      .single()

    if (fetchError || !note) {
      console.error("Error fetching note:", fetchError)
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    // Increment download count
    const { error: updateError } = await supabase
      .from("notes")
      .update({ download_count: note.download_count + 1 })
      .eq("id", params.id)

    if (updateError) {
      console.error("Error updating download count:", updateError)
      // Don't fail the request if download count update fails
    }

    return NextResponse.json({ 
      note: {
        ...note,
        download_count: note.download_count + 1
      }
    })
  } catch (error) {
    console.error("Note download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
