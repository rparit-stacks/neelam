import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const subfolder = (formData.get("folder") as string | null) || ""

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_")
    const uniqueName = `${Date.now()}-${safeName}`
    const objectPath = [subfolder, uniqueName].filter(Boolean).join("/")

    const supabase = await createServerClient()

    // Ensure bucket exists (idempotent on server-side config; here we assume bucket 'uploads' already created)
    const uploadRes = await supabase.storage.from("uploads").upload(objectPath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    })

    if (uploadRes.error) {
      console.error("[upload] Supabase upload error:", uploadRes.error)
      return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }

    const { data: publicUrl } = supabase.storage.from("uploads").getPublicUrl(objectPath)
    if (!publicUrl?.publicUrl) {
      return NextResponse.json({ error: "Failed to get public URL" }, { status: 500 })
    }

    return NextResponse.json({ url: publicUrl.publicUrl })
  } catch (error) {
    console.error("[upload] Failed:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}


