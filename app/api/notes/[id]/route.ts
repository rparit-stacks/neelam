import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

// GET - Fetch single note
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Error fetching note:", error)
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({ note: data })
  } catch (error) {
    console.error("Note fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update note
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, topic, content, file_name, category, tags, is_active } = body

    if (!title || !topic || !content || !file_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from("notes")
      .update({
        title,
        description: description || null,
        topic,
        content,
        file_name,
        category: category || null,
        tags: tags || null,
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating note:", error)
      return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
    }

    return NextResponse.json({ note: data })
  } catch (error) {
    console.error("Note update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", params.id)

    if (error) {
      console.error("Error deleting note:", error)
      return NextResponse.json({ error: "Failed to delete note" }, { status: 500 })
    }

    return NextResponse.json({ message: "Note deleted successfully" })
  } catch (error) {
    console.error("Note deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
