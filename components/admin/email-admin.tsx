"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSupabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Mail, Send, BookOpen, Video } from "lucide-react"

export function EmailAdmin() {
  const [emailType, setEmailType] = useState<"individual" | "segment">("segment")
  const [formData, setFormData] = useState({
    recipient: "",
    subject: "",
    body: "",
    htmlBody: "",
  })
  const [contentType, setContentType] = useState<"text" | "html">("text")
  const [segment, setSegment] = useState<string>("all_ebooks")
  const [ebooks, setEbooks] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function loadProducts() {
      const supabase = getSupabase()
      const { data: ebooksData } = await supabase.from("ebooks").select("id, title").eq("is_active", true)
      const { data: coursesData } = await supabase.from("live_courses").select("id, title").eq("is_active", true)

      if (ebooksData) setEbooks(ebooksData)
      if (coursesData) setCourses(coursesData)
    }
    loadProducts()
  }, [])

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)

    try {
      if (emailType === "individual") {
        await fetch("/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: formData.recipient,
            subject: formData.subject,
            body: contentType === "html" ? formData.htmlBody : formData.body,
            isHtml: contentType === "html",
          }),
        })

        toast({
          title: "Email sent successfully",
          description: `Email sent to ${formData.recipient}`,
        })
      } else {
        const supabase = getSupabase()
        let query = supabase
          .from("purchases")
          .select("user_email, product_id, product_type")
          .eq("payment_status", "completed")

        // Apply segment filters
        if (segment === "all_ebooks") {
          query = query.eq("product_type", "ebook")
        } else if (segment === "all_courses") {
          query = query.eq("product_type", "course")
        } else if (segment.startsWith("ebook_")) {
          const ebookId = segment.replace("ebook_", "")
          query = query.eq("product_type", "ebook").eq("product_id", ebookId)
        } else if (segment.startsWith("course_")) {
          const courseId = segment.replace("course_", "")
          query = query.eq("product_type", "course").eq("product_id", courseId)
        }

        const { data, error } = await query

        if (!error && data) {
          const uniqueEmails = [...new Set(data.map((p) => p.user_email))]

          // Send emails via API
          await fetch("/api/email/send-bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              emails: uniqueEmails,
              subject: formData.subject,
              body: contentType === "html" ? formData.htmlBody : formData.body,
              isHtml: contentType === "html",
            }),
          })

          toast({
            title: `Email sent to ${uniqueEmails.length} recipients`,
            description: "Emails have been queued for delivery",
          })
        }
      }

      setFormData({ recipient: "", subject: "", body: "", htmlBody: "" })
    } catch (error) {
      toast({
        title: "Error sending email",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Email Campaign
          </CardTitle>
          <CardDescription>Send emails to individual users or customer segments</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendEmail} className="space-y-6">
            <div className="space-y-2">
              <Label>Email Type</Label>
              <Tabs value={emailType} onValueChange={(v) => setEmailType(v as "individual" | "segment")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="individual">Individual User</TabsTrigger>
                  <TabsTrigger value="segment">Customer Segment</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {emailType === "individual" ? (
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Email *</Label>
                <Input
                  id="recipient"
                  type="email"
                  placeholder="user@example.com"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Customer Segment *</Label>
                <Select value={segment} onValueChange={setSegment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_ebooks">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        All Ebook Buyers
                      </div>
                    </SelectItem>
                    <SelectItem value="all_courses">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        All Course Students
                      </div>
                    </SelectItem>
                    {ebooks.length > 0 && (
                      <>
                        <SelectItem value="divider1" disabled>
                          ─── Specific Ebooks ───
                        </SelectItem>
                        {ebooks.map((ebook) => (
                          <SelectItem key={ebook.id} value={`ebook_${ebook.id}`}>
                            📚 {ebook.title}
                          </SelectItem>
                        ))}
                      </>
                    )}
                    {courses.length > 0 && (
                      <>
                        <SelectItem value="divider2" disabled>
                          ─── Specific Courses ───
                        </SelectItem>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={`course_${course.id}`}>
                            🎓 {course.title}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="Enter email subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Content Type</Label>
              <Tabs value={contentType} onValueChange={(v) => setContentType(v as "text" | "html")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Plain Text</TabsTrigger>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {contentType === "text" ? (
              <div className="space-y-2">
                <Label htmlFor="body">Message *</Label>
                <Textarea
                  id="body"
                  placeholder="Enter your message here..."
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={8}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="htmlBody">HTML Content *</Label>
                <Textarea
                  id="htmlBody"
                  placeholder="<h1>Hello!</h1><p>Your HTML content here...</p>"
                  value={formData.htmlBody}
                  onChange={(e) => setFormData({ ...formData, htmlBody: e.target.value })}
                  rows={12}
                  className="font-mono text-sm"
                  required
                />
                <p className="text-xs text-gray-500">You can use HTML tags for formatting</p>
              </div>
            )}

            <Button type="submit" disabled={sending} className="gap-2">
              <Send className="h-4 w-4" />
              {sending ? "Sending..." : "Send Email"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMTP Configuration</CardTitle>
          <CardDescription>Current email settings from database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">SMTP Host:</span>
              <span className="font-mono">smtp.hostinger.com</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">SMTP Port:</span>
              <span className="font-mono">465</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">From Email:</span>
              <span className="font-mono">support@helloneelammaam.com</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">From Name:</span>
              <span className="font-mono">Neelu Mam</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
