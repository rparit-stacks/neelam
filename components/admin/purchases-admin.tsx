"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MoreVertical, Mail, Eye, X, FileText, BookOpen, Video } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import type { Purchase } from "@/lib/types"

export function PurchasesAdmin() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null)
  const [detailsFor, setDetailsFor] = useState<Purchase | null>(null)
  const [composeFor, setComposeFor] = useState<Purchase | null>(null)
  const [compose, setCompose] = useState({ to: "", subject: "", body: "", link: "" })

  useEffect(() => {
    fetchPurchases()
  }, [])

  async function fetchPurchases() {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("purchases").select("*").order("created_at", { ascending: false })

    if (!error && data) {
      setPurchases(data)
    }
    setLoading(false)
  }

  async function sendAccessEmail(purchase: Purchase) {
    try {
      setSendingId(purchase.id)
      const supabase = getSupabase()
      let subject = "Your purchase access"
      let body = ""
      if (purchase.product_type === "ebook") {
        const { data: ebook } = await supabase.from("ebooks").select("title,pdf_url").eq("id", purchase.product_id).single()
        subject = `Access to your ebook: ${ebook?.title || "Ebook"}`
        body = ebook?.pdf_url
          ? `Hi,\n\nThank you for your purchase. Your ebook link: ${ebook.pdf_url}\n\nHappy learning!`
          : `Hi,\n\nThank you for your purchase. Your ebook will be shared shortly.\n\nHappy learning!`
      } else {
        const { data: course } = await supabase
          .from("live_courses")
          .select("title,live_link,platform_link")
          .eq("id", purchase.product_id)
          .single()
        subject = `Access to your course: ${course?.title || "Course"}`
        const link = course?.live_link || course?.platform_link
        body = link
          ? `Hi,\n\nThank you for your purchase. Your live class link: ${link}\n\nSee you in class!`
          : `Hi,\n\nThank you for your purchase. Your class access details will be shared shortly.\n\nSee you in class!`
      }

      const finalSubject = composeFor?.id === purchase.id && compose.subject ? compose.subject : subject
      const finalBody = composeFor?.id === purchase.id && (compose.body || compose.link)
        ? `${compose.body}${compose.link ? `\n\nLink: ${compose.link}` : ""}`
        : body

      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: purchase.user_email, subject: finalSubject, body: finalBody, isHtml: false }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to send email")
      await fetchPurchases()
      alert("Access email sent")
      setComposeFor(null)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to send")
    } finally {
      setSendingId(null)
    }
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>All Purchases</CardTitle>
        <CardDescription>View all customer purchases and payment status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{purchase.user_name || purchase.user_email}</h3>
                  <Badge variant={purchase.payment_status === "completed" ? "default" : "secondary"}>
                    {purchase.payment_status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {purchase.product_type === "note" && <FileText className="h-4 w-4" />}
                    {purchase.product_type === "ebook" && <BookOpen className="h-4 w-4" />}
                    {purchase.product_type === "course" && <Video className="h-4 w-4" />}
                    <span className="capitalize">{purchase.product_type}</span>
                  </div>
                  <span>•</span>
                  <span>₹{purchase.amount}</span>
                  <span>•</span>
                  <span>{new Date(purchase.created_at).toLocaleDateString()}</span>
                </div>
                {purchase.razorpay_payment_id && (
                  <p className="text-xs text-muted-foreground mt-1">Payment ID: {purchase.razorpay_payment_id}</p>
                )}
              </div>
              <div className="ml-4 relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-transparent"
                  onClick={() => setMenuOpenFor((prev) => (prev === purchase.id ? null : purchase.id))}
                >
                  {menuOpenFor === purchase.id ? <X className="h-4 w-4" /> : <MoreVertical className="h-4 w-4" />}
                </Button>
                {menuOpenFor === purchase.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center"
                      onClick={() => {
                        setDetailsFor(purchase)
                        setMenuOpenFor(null)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" /> View details
                    </button>
                    {purchase.payment_status === "completed" && (
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center disabled:opacity-50"
                        onClick={() => {
                          setComposeFor(purchase)
                          setCompose({ to: purchase.user_email, subject: "", body: "", link: "" })
                        }}
                        disabled={sendingId === purchase.id}
                      >
                        <Mail className="h-4 w-4 mr-2" /> Compose & send access
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {purchases.length === 0 && !loading && (
            <p className="text-center text-muted-foreground py-8">No purchases yet</p>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Details Modal */}
    {detailsFor && (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDetailsFor(null)}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Purchase details</h3>
            <Button variant="ghost" size="icon" onClick={() => setDetailsFor(null)} className="bg-transparent">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span>{detailsFor?.user_name || "-"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-mono">{detailsFor?.user_email}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{detailsFor?.product_type}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Product ID</span><span className="font-mono">{detailsFor?.product_id}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span>₹{detailsFor?.amount}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Payment ID</span><span className="font-mono">{detailsFor?.razorpay_payment_id || "-"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span>{detailsFor?.payment_status}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Created at</span><span>{detailsFor ? new Date(detailsFor.created_at).toLocaleString() : "-"}</span></div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(detailsFor, null, 2))
              alert("Copied details")
            }}>Copy JSON</Button>
          </div>
        </div>
      </div>
    )}

    {/* Compose Modal */}
    {composeFor && (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setComposeFor(null)}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Send access email</h3>
            <Button variant="ghost" size="icon" onClick={() => setComposeFor(null)} className="bg-transparent">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">To</label>
              <Input value={compose.to} onChange={(e) => setCompose({ ...compose, to: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Subject</label>
              <Input value={compose.subject} onChange={(e) => setCompose({ ...compose, subject: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Message</label>
              <Textarea rows={6} value={compose.body} onChange={(e) => setCompose({ ...compose, body: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Access link (optional)</label>
              <Input placeholder="https://..." value={compose.link} onChange={(e) => setCompose({ ...compose, link: e.target.value })} />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setComposeFor(null)} className="bg-transparent">Cancel</Button>
            <Button onClick={() => composeFor && sendAccessEmail(composeFor)} disabled={sendingId === composeFor?.id}>
              {sendingId === composeFor?.id ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
