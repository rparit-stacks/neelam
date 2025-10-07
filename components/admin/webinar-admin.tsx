"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabase } from "@/lib/supabase"
import { Webinar } from "@/lib/types"
import { Loader2, Trash2, Edit, Plus, ToggleLeft, ToggleRight, ExternalLink, Upload, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

export function WebinarAdmin() {
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [loading, setLoading] = useState(true)
  const [editingWebinar, setEditingWebinar] = useState<Webinar | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    webinar_link: "",
    banner_image: "",
  })

  useEffect(() => {
    fetchWebinars()
  }, [])

  async function fetchWebinars() {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from("webinars")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setWebinars(data || [])
    } catch (error) {
      console.error("Error fetching webinars:", error)
      toast({
        title: "Error",
        description: "Failed to fetch webinars",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setUploadingImage(true)

    try {
      const supabase = getSupabase()
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `webinars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("uploads").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("uploads").getPublicUrl(filePath)

      setFormData((prev) => ({ ...prev, banner_image: publicUrl }))
      toast({
        title: "Success",
        description: "Banner image uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload banner image",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.name.trim() || !formData.webinar_link.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabase()

      if (editingWebinar) {
        const { error } = await supabase
          .from("webinars")
          .update({
            name: formData.name,
            webinar_link: formData.webinar_link,
            banner_image: formData.banner_image,
          })
          .eq("id", editingWebinar.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Webinar updated successfully",
        })
      } else {
        const { error } = await supabase.from("webinars").insert({
          name: formData.name,
          webinar_link: formData.webinar_link,
          banner_image: formData.banner_image,
          is_active: false,
        })

        if (error) throw error

        toast({
          title: "Success",
          description: "Webinar created successfully",
        })
      }

      setFormData({ name: "", webinar_link: "", banner_image: "" })
      setEditingWebinar(null)
      setIsCreating(false)
      fetchWebinars()
    } catch (error) {
      console.error("Error saving webinar:", error)
      toast({
        title: "Error",
        description: "Failed to save webinar",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleActive(webinar: Webinar) {
    try {
      const supabase = getSupabase()

      // If activating this webinar, deactivate all others first
      if (!webinar.is_active) {
        await supabase.from("webinars").update({ is_active: false }).neq("id", webinar.id)
      }

      const { error } = await supabase
        .from("webinars")
        .update({ is_active: !webinar.is_active })
        .eq("id", webinar.id)

      if (error) throw error

      toast({
        title: "Success",
        description: `Webinar ${!webinar.is_active ? "activated" : "deactivated"}`,
      })

      fetchWebinars()
    } catch (error) {
      console.error("Error toggling webinar:", error)
      toast({
        title: "Error",
        description: "Failed to toggle webinar status",
        variant: "destructive",
      })
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this webinar?")) return

    try {
      const supabase = getSupabase()
      const { error } = await supabase.from("webinars").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Webinar deleted successfully",
      })

      fetchWebinars()
    } catch (error) {
      console.error("Error deleting webinar:", error)
      toast({
        title: "Error",
        description: "Failed to delete webinar",
        variant: "destructive",
      })
    }
  }

  function handleEdit(webinar: Webinar) {
    setEditingWebinar(webinar)
    setFormData({
      name: webinar.name,
      webinar_link: webinar.webinar_link,
      banner_image: webinar.banner_image || "",
    })
    setIsCreating(true)
  }

  function handleCancel() {
    setEditingWebinar(null)
    setIsCreating(false)
    setFormData({ name: "", webinar_link: "", banner_image: "" })
  }

  if (loading && webinars.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Webinar Management</h2>
          <p className="text-gray-500 mt-1">Manage webinars on your homepage (only one can be active at a time)</p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Add Webinar
          </Button>
        )}
      </div>

      {/* Info Alert */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Important Notes:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Only ONE webinar can be active (visible) at a time</li>
                <li>When you activate a webinar, all others will be automatically deactivated</li>
                <li>Active webinar appears below the hero section on the homepage</li>
                <li>Recommended banner size: 1200x400px for best results</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>{editingWebinar ? "Edit Webinar" : "Create New Webinar"}</CardTitle>
            <CardDescription>
              {editingWebinar ? "Update webinar details" : "Add a new webinar to your platform"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Webinar Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Learn React in 2 Hours"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webinar_link">
                    Webinar Link <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="webinar_link"
                    type="url"
                    value={formData.webinar_link}
                    onChange={(e) => setFormData({ ...formData, webinar_link: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner_image">Banner Image (Optional)</Label>
                <div className="space-y-3">
                  <Input
                    id="banner_image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                  {uploadingImage && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading image...
                    </div>
                  )}
                  {formData.banner_image && (
                    <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                      <Image src={formData.banner_image} alt="Banner preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading || uploadingImage} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{editingWebinar ? "Update Webinar" : "Create Webinar"}</>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Webinars List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Webinars ({webinars.length})</h3>
        {webinars.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No webinars yet. Create your first webinar!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {webinars.map((webinar) => (
              <Card key={webinar.id} className={webinar.is_active ? "border-2 border-green-400 shadow-lg" : ""}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Banner Image */}
                    {webinar.banner_image && (
                      <div className="relative w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={webinar.banner_image} alt={webinar.name} fill className="object-cover" />
                      </div>
                    )}

                    {/* Webinar Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-lg flex items-center gap-2">
                            {webinar.name}
                            {webinar.is_active && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            )}
                          </h4>
                          <a
                            href={webinar.webinar_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                          >
                            {webinar.webinar_link}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Created: {new Date(webinar.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={webinar.is_active ? "default" : "outline"}
                          onClick={() => handleToggleActive(webinar)}
                          className={webinar.is_active ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          {webinar.is_active ? (
                            <>
                              <ToggleRight className="h-4 w-4 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-4 w-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(webinar)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(webinar.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

