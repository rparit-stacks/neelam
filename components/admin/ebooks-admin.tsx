"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getSupabase } from "@/lib/supabase"
import type { Ebook } from "@/lib/types"
import { Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function EbooksAdmin() {
  const [ebooks, setEbooks] = useState<Ebook[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    author: "",
    pages: "",
    category: "",
    cover_image: "",
    pdf_url: "",
    file_name: "",
    file_size: 0,
  })
  const [uploading, setUploading] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchEbooks()
  }, [])

  async function fetchEbooks() {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("ebooks").select("*").order("created_at", { ascending: false })

    if (!error && data) {
      setEbooks(data)
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = getSupabase()

    const ebookData = {
      title: formData.title,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      author: formData.author,
      pages: formData.pages ? Number.parseInt(formData.pages) : null,
      category: formData.category,
      cover_image: formData.cover_image || null,
      pdf_url: formData.pdf_url || null,
      file_name: formData.file_name || null,
      file_size: formData.file_size || null,
      updated_at: new Date().toISOString(),
    }

    if (editing) {
      const { error } = await supabase.from("ebooks").update(ebookData).eq("id", editing)

      if (!error) {
        toast({ title: "Ebook updated successfully" })
        setEditing(null)
        resetForm()
        fetchEbooks()
      }
    } else {
      const { error } = await supabase.from("ebooks").insert([ebookData])

      if (!error) {
        toast({ title: "Ebook created successfully" })
        resetForm()
        fetchEbooks()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this ebook?")) return

    const supabase = getSupabase()
    const { error } = await supabase.from("ebooks").delete().eq("id", id)

    if (!error) {
      toast({ title: "Ebook deleted successfully" })
      fetchEbooks()
    }
  }

  function handleEdit(ebook: Ebook) {
    setEditing(ebook.id)
    setFormData({
      title: ebook.title,
      description: ebook.description || "",
      price: ebook.price.toString(),
      author: ebook.author || "",
      pages: ebook.pages?.toString() || "",
      category: ebook.category || "",
      cover_image: ebook.cover_image || "",
      pdf_url: ebook.pdf_url || "",
      file_name: ebook.file_name || "",
      file_size: ebook.file_size || 0,
    })
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      price: "",
      author: "",
      pages: "",
      category: "",
      cover_image: "",
      pdf_url: "",
      file_name: "",
      file_size: 0,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Edit Ebook" : "Add New Ebook"}</CardTitle>
          <CardDescription>{editing ? "Update ebook details" : "Create a new ebook listing"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  type="number"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image">Cover Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="cover_image"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="Paste URL or upload file"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = "image/*"
                    input.onchange = async () => {
                      if (!input.files || input.files.length === 0) return
                      setUploading(true)
                      const file = input.files[0]
                      const data = new FormData()
                      data.append("file", file)
                      data.append("folder", "covers")
                      const res = await fetch("/api/upload", { method: "POST", body: data })
                      const json = await res.json()
                      setUploading(false)
                      if (!res.ok) return alert(json.error || "Upload failed")
                      setFormData({ ...formData, cover_image: json.url })
                    }
                    input.click()
                  }}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
              {formData.cover_image && (
                <p className="text-xs text-muted-foreground">Saved: {formData.cover_image}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pdf_file">eBook File * (PDF, DOCX, DOC)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="pdf_file"
                  accept=".pdf,.docx,.doc"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      // Validate file size (max 100MB)
                      if (file.size > 100 * 1024 * 1024) {
                        toast({
                          title: "File Too Large",
                          description: "File must be less than 100MB",
                          variant: "destructive",
                        })
                        return
                      }
                      
                      // Validate file type
                      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
                      const allowedExtensions = ['.pdf', '.docx', '.doc']
                      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
                      
                      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
                        toast({
                          title: "Invalid File Type",
                          description: "Please upload PDF, DOCX, or DOC file",
                          variant: "destructive",
                        })
                        return
                      }
                      
                      setUploadingPdf(true)
                      try {
                        // Create proper filename with timestamp
                        const timestamp = Date.now()
                        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'pdf'
                        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\s+/g, '_')
                        const newFileName = `${timestamp}_${cleanFileName}`
                        
                        const data = new FormData()
                        data.append("file", file)
                        data.append("folder", "ebooks")
                        data.append("filename", newFileName) // Custom filename
                        
                        const res = await fetch("/api/upload", { method: "POST", body: data })
                        const json = await res.json()
                        
                        if (!res.ok) {
                          throw new Error(json.error || "Upload failed")
                        }
                        
                        setFormData({ 
                          ...formData, 
                          pdf_url: json.url,
                          file_name: json.filename || newFileName,
                          file_size: json.size || file.size
                        })
                        
                        toast({
                          title: "Success",
                          description: `${fileExtension.toUpperCase()} file uploaded successfully (${(file.size / 1024 / 1024).toFixed(1)} MB)`,
                        })
                      } catch (error) {
                        console.error("Upload error:", error)
                        toast({
                          title: "Upload Failed",
                          description: "Failed to upload file. Please try again.",
                          variant: "destructive",
                        })
                      } finally {
                        setUploadingPdf(false)
                      }
                    }
                  }}
                  className="hidden"
                  required
                />
                <label htmlFor="pdf_file" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {uploadingPdf ? (
                      <p className="text-blue-600">Uploading file...</p>
                    ) : formData.pdf_url ? (
                      <div className="text-green-600">
                        <p className="font-medium">✓ File Uploaded</p>
                        <p className="text-sm">{formData.file_name}</p>
                        <p className="text-xs">{formData.file_size ? `${(formData.file_size / 1024 / 1024).toFixed(1)} MB` : 'Unknown size'}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600 mb-2">Click to upload file</p>
                        <p className="text-sm text-gray-500">Supports: PDF, DOCX, DOC</p>
                        <p className="text-sm text-gray-500">Maximum file size: 100MB</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">{editing ? "Update Ebook" : "Create Ebook"}</Button>
              {editing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditing(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Ebooks</CardTitle>
          <CardDescription>Manage your ebook listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ebooks.map((ebook) => (
              <div key={ebook.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{ebook.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {ebook.author} • ₹{ebook.price}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    {ebook.pdf_url ? (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        ✓ PDF Available
                      </span>
                    ) : (
                      <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                        ⚠ No PDF
                      </span>
                    )}
                    {ebook.file_name && (
                      <span className="text-xs text-gray-500">
                        {ebook.file_name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(ebook)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(ebook.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
