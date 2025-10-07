"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getSupabase } from "@/lib/supabase"
import type { LiveCourse } from "@/lib/types"
import { Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function CoursesAdmin() {
  const [courses, setCourses] = useState<LiveCourse[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    instructor: "",
    duration_hours: "",
    start_date: "",
    max_students: "",
    category: "",
    cover_image: "",
  })
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCourses()
  }, [])

  async function fetchCourses() {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("live_courses").select("*").order("created_at", { ascending: false })

    if (!error && data) {
      setCourses(data)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = getSupabase()

    const courseData = {
      title: formData.title,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      instructor: formData.instructor,
      duration_hours: formData.duration_hours ? Number.parseInt(formData.duration_hours) : null,
      start_date: formData.start_date || null,
      max_students: formData.max_students ? Number.parseInt(formData.max_students) : null,
      category: formData.category,
      cover_image: formData.cover_image || null,
      updated_at: new Date().toISOString(),
    }

    if (editing) {
      const { error } = await supabase.from("live_courses").update(courseData).eq("id", editing)

      if (!error) {
        toast({ title: "Course updated successfully" })
        setEditing(null)
        resetForm()
        fetchCourses()
      }
    } else {
      const { error } = await supabase.from("live_courses").insert([courseData])

      if (!error) {
        toast({ title: "Course created successfully" })
        resetForm()
        fetchCourses()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this course?")) return

    const supabase = getSupabase()
    const { error } = await supabase.from("live_courses").delete().eq("id", id)

    if (!error) {
      toast({ title: "Course deleted successfully" })
      fetchCourses()
    }
  }

  function handleEdit(course: LiveCourse) {
    setEditing(course.id)
    setFormData({
      title: course.title,
      description: course.description || "",
      price: course.price.toString(),
      instructor: course.instructor || "",
      duration_hours: course.duration_hours?.toString() || "",
      start_date: course.start_date ? new Date(course.start_date).toISOString().slice(0, 16) : "",
      max_students: course.max_students?.toString() || "",
      category: course.category || "",
      cover_image: course.cover_image || "",
    })
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      price: "",
      instructor: "",
      duration_hours: "",
      start_date: "",
      max_students: "",
      category: "",
      cover_image: "",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Edit Course" : "Add New Course"}</CardTitle>
          <CardDescription>{editing ? "Update course details" : "Create a new live course"}</CardDescription>
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

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
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

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration_hours">Duration (hours)</Label>
                <Input
                  id="duration_hours"
                  type="number"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_students">Max Students</Label>
                <Input
                  id="max_students"
                  type="number"
                  value={formData.max_students}
                  onChange={(e) => setFormData({ ...formData, max_students: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
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

            <div className="flex gap-2">
              <Button type="submit">{editing ? "Update Course" : "Create Course"}</Button>
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
          <CardTitle>All Courses</CardTitle>
          <CardDescription>Manage your live course listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.instructor} • ₹{course.price} • {course.enrolled_count}/{course.max_students} enrolled
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(course)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(course.id)}>
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
