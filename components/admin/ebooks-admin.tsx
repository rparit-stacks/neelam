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
  })
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
              <Label htmlFor="cover_image">Cover Image URL</Label>
              <Input
                id="cover_image"
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                placeholder="/abstract-book-cover.png"
              />
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
