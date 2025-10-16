import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const subfolder = (formData.get("folder") as string | null) || ""
    const customFilename = formData.get("filename") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 100MB." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Use custom filename if provided, otherwise generate one
    let finalFilename
    if (customFilename) {
      finalFilename = customFilename
    } else {
      const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_")
      finalFilename = `${Date.now()}-${safeName}`
    }
    
    const objectPath = [subfolder, finalFilename].filter(Boolean).join("/")

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

    return NextResponse.json({ 
      url: publicUrl.publicUrl,
      filename: finalFilename,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error("[upload] Failed:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}


