import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

// GET - Fetch all notes
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    let query = supabase.from("notes").select("*")
    
    if (activeOnly) {
      query = query.eq("is_active", true)
    }
    
    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching notes:", error)
      return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
    }

    return NextResponse.json({ notes: data })
  } catch (error) {
    console.error("Notes fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, topic, content, file_name, category, tags, is_active } = body

    if (!title || !topic || !content || !file_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from("notes")
      .insert({
        title,
        description: description || null,
        topic,
        content,
        file_name,
        category: category || null,
        tags: tags || null,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating note:", error)
      return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
    }

    return NextResponse.json({ note: data }, { status: 201 })
  } catch (error) {
    console.error("Note creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
