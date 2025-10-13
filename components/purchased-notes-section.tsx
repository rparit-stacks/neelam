"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabase } from "@/lib/supabase"
import { FileText, Download, Calendar, CreditCard, Mail } from "lucide-react"
import { toast } from "sonner"

interface PurchasedNote {
  id: string
  title: string
  file_name: string
  file_url: string | null
  file_size: number | null
  topic: string
  category: string | null
  purchase_date: string
  amount: number
  order_id: string
}

export function PurchasedNotesSection() {
  const [purchasedNotes, setPurchasedNotes] = useState<PurchasedNote[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const [emailInput, setEmailInput] = useState("")

  useEffect(() => {
    // Only load if user explicitly wants to view purchased notes
    setLoading(false)
  }, [])

  const fetchPurchasedNotes = async (email: string) => {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          id,
          user_email,
          amount,
          created_at,
          product_id,
          notes:product_id (
            title,
            file_name,
            file_url,
            file_size,
            topic,
            category
          )
        `)
        .eq("user_email", email)
        .eq("product_type", "note")
        .eq("payment_status", "completed")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching purchased notes:", error)
        toast.error("Failed to fetch purchased notes")
        return
      }

      if (data) {
        const notes = data
          .filter(purchase => purchase.notes)
          .map(purchase => ({
            id: purchase.notes.id,
            title: purchase.notes.title,
            file_name: purchase.notes.file_name,
            file_url: purchase.notes.file_url,
            file_size: purchase.notes.file_size,
            topic: purchase.notes.topic,
            category: purchase.notes.category,
            purchase_date: purchase.created_at,
            amount: purchase.amount,
            order_id: purchase.id
          }))
        
        setPurchasedNotes(notes)
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to fetch purchased notes")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (note: PurchasedNote) => {
    try {
      if (note.file_url) {
        const link = document.createElement('a')
        link.href = note.file_url
        link.download = note.file_name
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success("Note downloaded successfully!")
      } else {
        toast.error("Download link not available")
      }
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Failed to download note")
    }
  }

  const handleResendEmail = async (note: PurchasedNote) => {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: userEmail,
          subject: `Your Note: ${note.title} - Neelam Academy`,
          type: 'note_delivery',
          noteId: note.id,
          orderId: note.order_id
        })
      })

      if (response.ok) {
        toast.success("Email sent successfully!")
      } else {
        toast.error("Failed to send email")
      }
    } catch (error) {
      console.error("Email error:", error)
      toast.error("Failed to send email")
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
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

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (emailInput.trim()) {
      setUserEmail(emailInput.trim())
      localStorage.setItem('userEmail', emailInput.trim())
      setLoading(true)
      fetchPurchasedNotes(emailInput.trim())
    }
  }

  if (!userEmail) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center mb-6">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">View Your Purchased Notes</h3>
            <p className="text-muted-foreground">Enter your email to access your purchased notes</p>
          </div>
          
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              View My Purchases
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  if (purchasedNotes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No purchased notes found for {userEmail}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Purchase some notes to see them here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Your Purchased Notes</h3>
          <p className="text-muted-foreground">Access your purchased notes anytime</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {purchasedNotes.length} note{purchasedNotes.length !== 1 ? 's' : ''} purchased
        </div>
      </div>

      <div className="grid gap-4">
        {purchasedNotes.map((note) => (
          <Card key={note.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {note.title}
                  </CardTitle>
                  <CardDescription>{note.topic}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-700">
                    Purchased
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
                    <Calendar className="h-4 w-4" />
                    <span>Purchased: {new Date(note.purchase_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    <span>₹{note.amount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{note.file_size ? `${(note.file_size / 1024).toFixed(1)} KB` : 'Unknown size'}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleDownload(note)}
                    className="bg-green-600 hover:bg-green-700 gap-2"
                    size="sm"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button 
                    onClick={() => handleResendEmail(note)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Resend Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
