"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { getSupabase } from "@/lib/supabase"
import type { Note } from "@/lib/types"
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Download, 
  Eye, 
  EyeOff, 
  Save, 
  X,
  Tag,
  Calendar,
  Upload,
  File,
  Copy,
  CreditCard,
  Users,
  TrendingUp
} from "lucide-react"
import { toast } from "sonner"

export function NotesAdmin() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [purchasedNotes, setPurchasedNotes] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"notes" | "purchases">("notes")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topic: "",
    content: "",
    file_name: "",
    file_url: "",
    file_size: 0,
    category: "",
    tags: "",
    is_active: true,
    cover_image: "",
    author: "",
    payment_type: "free" as "free" | "paid",
    price: 0,
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [inputMode, setInputMode] = useState<"file">("file")

  useEffect(() => {
    fetchNotes()
    fetchPurchasedNotes()
  }, [])

  const fetchNotes = async () => {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setNotes(data)
    }
    setLoading(false)
  }

  const fetchPurchasedNotes = async () => {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("purchases")
      .select(`
        *,
        notes:product_id (
          title,
          topic,
          category
        )
      `)
      .eq("product_type", "note")
      .eq("payment_status", "completed")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setPurchasedNotes(data)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      topic: "",
      content: "",
      file_name: "",
      file_url: "",
      file_size: 0,
      category: "",
      tags: "",
      is_active: true,
      cover_image: "",
      author: "",
      payment_type: "free",
      price: 0,
    })
    setUploadedFile(null)
    setEditingNote(null)
    setShowForm(false)
  }

  const handleEdit = (note: Note) => {
    setFormData({
      title: note.title,
      description: note.description || "",
      topic: note.topic,
      content: note.content,
      file_name: note.file_name,
      file_url: note.file_url || "",
      file_size: note.file_size || 0,
      category: note.category || "",
      tags: note.tags?.join(", ") || "",
      is_active: note.is_active,
      cover_image: note.cover_image || "",
      author: note.author || "",
      payment_type: note.payment_type || "free",
      price: note.price || 0,
    })
    setUploadedFile(null)
    setEditingNote(note)
    setShowForm(true)
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const supabase = getSupabase()
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('notes')
        .upload(fileName, file)

      if (error) {
        throw error
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('notes')
        .getPublicUrl(fileName)

      // Update form data with file info
      setFormData(prev => ({
        ...prev,
        file_name: file.name,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ""), // Use filename as title if empty
        file_url: publicUrl,
        file_size: file.size,
      }))
      
      setUploadedFile(file)
      toast.success("File uploaded successfully!")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload file")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title?.trim()) {
      toast.error("Title is required")
      return
    }
    
    if (!formData.topic?.trim()) {
      toast.error("Topic is required")
      return
    }
    
    if (!uploadedFile && !editingNote) {
      toast.error("Please upload a file")
      return
    }
    
    if (!formData.file_name?.trim()) {
      toast.error("File name is required")
      return
    }

    // File name validation
    const fileName = formData.file_name.trim()
    if (fileName.length < 3) {
      toast.error("File name must be at least 3 characters")
      return
    }
    
    if (!/^[a-zA-Z0-9._-]+$/.test(fileName)) {
      toast.error("File name can only contain letters, numbers, dots, underscores, and hyphens")
      return
    }

    if (formData.payment_type === "paid" && (!formData.price || formData.price <= 0)) {
      toast.error("Please enter a valid price for paid notes")
      return
    }

    // File size validation
    if (uploadedFile && uploadedFile.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("File size must be less than 10MB")
      return
    }

    const supabase = getSupabase()
    
    // Clean and validate data
    const cleanTitle = formData.title.trim()
    const cleanTopic = formData.topic.trim()
    const cleanFileName = formData.file_name.trim()
    
    const noteData = {
      title: cleanTitle,
      description: formData.description?.trim() || null,
      topic: cleanTopic,
      content: "File-based content", // Placeholder since we're using file_url
      file_name: cleanFileName,
      file_url: formData.file_url || null,
      file_size: formData.file_size || null,
      category: formData.category?.trim() || null,
      tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(Boolean) : null,
      is_active: formData.is_active,
      payment_type: formData.payment_type,
      price: formData.payment_type === "paid" ? formData.price : null,
      cover_image: formData.cover_image?.trim() || null,
      author: formData.author?.trim() || null,
    }

    console.log("Note data to be saved:", noteData)

    try {
      if (editingNote) {
        // Update existing note
        const { error } = await supabase
          .from("notes")
          .update(noteData)
          .eq("id", editingNote.id)

        if (error) {
          console.error("Supabase update error:", error)
          throw new Error(error.message || "Failed to update note")
        }

        toast.success("Note updated successfully!")
      } else {
        // Create new note
        const { error } = await supabase
          .from("notes")
          .insert(noteData)

        if (error) {
          console.error("Supabase insert error:", error)
          throw new Error(error.message || "Failed to create note")
        }

        toast.success("Note created successfully!")
      }

      resetForm()
      fetchNotes()
      fetchPurchasedNotes()
    } catch (error) {
      console.error("Error saving note:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast.error(`Failed to save note: ${errorMessage}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return

    const supabase = getSupabase()
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting note:", error)
      toast.error("Failed to delete note")
    } else {
      toast.success("Note deleted successfully!")
      fetchNotes()
      fetchPurchasedNotes()
    }
  }

  const toggleActive = async (note: Note) => {
    const supabase = getSupabase()
    const { error } = await supabase
      .from("notes")
      .update({ is_active: !note.is_active })
      .eq("id", note.id)

    if (error) {
      console.error("Error updating note:", error)
      toast.error("Failed to update note")
    } else {
      toast.success(`Note ${!note.is_active ? "activated" : "deactivated"} successfully!`)
      fetchNotes()
      fetchPurchasedNotes()
    }
  }

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

      toast.success("Note downloaded successfully!")
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Failed to download note")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse w-1/4" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notes Management</h2>
          <p className="text-muted-foreground">Manage your study notes and track purchases</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Note
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("notes")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "notes"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-4 w-4 mr-2 inline" />
          All Notes
        </button>
        <button
          onClick={() => setActiveTab("purchases")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "purchases"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingUp className="h-4 w-4 mr-2 inline" />
          Purchased Notes ({purchasedNotes.length})
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingNote ? "Edit Note" : "Add New Note"}
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter note title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic *</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g., React Hooks, JavaScript Basics"
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
                  placeholder="Brief description of the note"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="file_name">File Name *</Label>
                  <Input
                    id="file_name"
                    value={formData.file_name}
                    onChange={(e) => setFormData({ ...formData, file_name: e.target.value })}
                    placeholder="e.g., react-hooks-guide"
                    required
                    pattern="[a-zA-Z0-9._-]+"
                    title="Only letters, numbers, dots, underscores, and hyphens allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Only letters, numbers, dots, underscores, and hyphens. No spaces or special characters.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Programming, Web Development"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="e.g., Neelam Academy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cover_image">Cover Image URL</Label>
                  <Input
                    id="cover_image"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., react, hooks, javascript, tutorial"
                />
              </div>

              {/* Payment Type Selection */}
              <div className="space-y-4">
                <Label>Payment Type</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="free"
                      name="payment_type"
                      value="free"
                      checked={formData.payment_type === "free"}
                      onChange={(e) => setFormData({ ...formData, payment_type: e.target.value as "free" | "paid", price: 0 })}
                      className="rounded"
                    />
                    <Label htmlFor="free">Free Note</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="paid"
                      name="payment_type"
                      value="paid"
                      checked={formData.payment_type === "paid"}
                      onChange={(e) => setFormData({ ...formData, payment_type: e.target.value as "free" | "paid" })}
                      className="rounded"
                    />
                    <Label htmlFor="paid">Paid Note</Label>
                  </div>
                </div>
              </div>

              {/* Price Field - Only show for paid notes */}
              {formData.payment_type === "paid" && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    placeholder="Enter price in rupees"
                    required={formData.payment_type === "paid"}
                  />
                </div>
              )}

              {/* File Upload Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload File *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      accept=".txt,.md,.doc,.docx,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          // Validate file size (max 10MB)
                          if (file.size > 10 * 1024 * 1024) {
                            toast.error("File size must be less than 10MB")
                            return
                          }
                          // Validate file type
                          const allowedTypes = ['.txt', '.md', '.doc', '.docx', '.pdf']
                          const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
                          if (!allowedTypes.includes(fileExt)) {
                            toast.error("Only .txt, .md, .doc, .docx, .pdf files are allowed")
                            return
                          }
                          handleFileUpload(file)
                        }
                      }}
                      className="hidden"
                      required
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {uploading ? (
                        <div className="space-y-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                      ) : uploadedFile ? (
                        <div className="space-y-2">
                          <File className="h-8 w-8 text-green-600 mx-auto" />
                          <p className="text-sm font-medium">{uploadedFile.name}</p>
                          <p className="text-xs text-muted-foreground">Click to change file</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                          <p className="text-sm font-medium">Click to upload file</p>
                          <p className="text-xs text-muted-foreground">Supports .txt, .md, .doc, .docx, .pdf files (max 10MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                  {uploadedFile && (
                    <div className="text-sm text-muted-foreground bg-green-50 p-2 rounded">
                      <strong>File:</strong> {uploadedFile.name} | <strong>Size:</strong> {(uploadedFile.size / 1024).toFixed(1)} KB
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_active">Active (visible to users)</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  {editingNote ? "Update Note" : "Create Note"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Content based on active tab */}
      {activeTab === "notes" ? (
        /* Notes List */
        <div className="space-y-4">
          {notes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notes found. Create your first note!</p>
              </CardContent>
            </Card>
          ) : (
            notes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      {note.title}
                    </CardTitle>
                    <CardDescription>{note.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={note.is_active ? "default" : "secondary"}>
                      {note.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {note.category && (
                      <Badge variant="outline">{note.category}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      <span>{note.topic}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{note.download_count} downloads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground space-y-1">
                    <div><strong>File:</strong> {note.file_name} | <strong>Size:</strong> {note.file_size ? `${(note.file_size / 1024).toFixed(1)} KB` : 'Unknown'}</div>
                    <div className="flex items-center gap-2">
                      <strong>URL:</strong>
                      <code className="bg-muted px-2 py-1 rounded text-xs">
                        {typeof window !== 'undefined' ? `${window.location.origin}/notes/${note.id}` : `/notes/${note.id}`}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const url = `${window.location.origin}/notes/${note.id}`
                          navigator.clipboard.writeText(url)
                          toast.success("URL copied to clipboard!")
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(note)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(note)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(note)}
                    className="gap-2"
                  >
                    {note.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {note.is_active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(note.id)}
                    className="gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      ) : (
        /* Purchased Notes List */
        <div className="space-y-4">
          {purchasedNotes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No purchased notes found yet.</p>
              </CardContent>
            </Card>
          ) : (
            purchasedNotes.map((purchase) => (
              <Card key={purchase.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-green-600" />
                        {purchase.notes?.title || "Unknown Note"}
                      </CardTitle>
                      <CardDescription>
                        Purchased by {purchase.user_name || purchase.user_email}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-100 text-green-700">
                        Paid
                      </Badge>
                      <Badge variant="outline">₹{purchase.amount}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        <span>{purchase.notes?.topic || "Unknown Topic"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(purchase.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{purchase.user_email}</span>
                      </div>
                    </div>
                    
                    {purchase.notes?.category && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{purchase.notes.category}</Badge>
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground space-y-1">
                      <div><strong>Order ID:</strong> {purchase.id}</div>
                      {purchase.razorpay_payment_id && (
                        <div><strong>Payment ID:</strong> {purchase.razorpay_payment_id}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
