"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, Download, Mail } from "lucide-react"
import { getSupabase } from "@/lib/supabase"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<any>(null)
  const [note, setNote] = useState<any>(null)
  const [ebook, setEbook] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return

      const supabase = getSupabase()
      const { data, error } = await supabase.from("purchases").select("*").eq("id", orderId).single()

      if (!error && data) {
        setOrder(data)
        
        // If it's a note purchase, fetch the note details
        if (data.product_type === "note") {
          const { data: noteData } = await supabase
            .from("notes")
            .select("title, file_name, file_url, file_size")
            .eq("id", data.product_id)
            .single()
          
          if (noteData) {
            setNote(noteData)
          }
        }
        
        // If it's an eBook purchase, fetch the eBook details
        if (data.product_type === "ebook") {
          const { data: ebookData } = await supabase
            .from("ebooks")
            .select("title, author, pdf_url, file_name, file_size")
            .eq("id", data.product_id)
            .single()
          
          if (ebookData) {
            setEbook(ebookData)
          }
        }
      }
      setLoading(false)
    }

    fetchOrder()
  }, [orderId])

  const handleDownload = () => {
    if (note?.file_url) {
      const link = document.createElement('a')
      link.href = note.file_url
      link.download = note.file_name
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (ebook?.pdf_url) {
      const link = document.createElement('a')
      link.href = ebook.pdf_url
      link.download = ebook.file_name || 'ebook.pdf'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-blue-50/30">
          <div className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Loading Your Purchase</h3>
              <p className="text-sm text-gray-600 mt-2">
                Please wait while we fetch your order details...
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-blue-200">
              <CardHeader className="text-center space-y-4 pb-8">
                <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-3xl sm:text-4xl">Payment Successful!</CardTitle>
                <CardDescription className="text-base sm:text-lg">
                  Thank you for your purchase. Your order has been confirmed.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {order && (
                  <div className="bg-blue-50 rounded-lg p-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Order ID</span>
                      <span className="font-mono font-semibold">{order.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount Paid</span>
                      <span className="font-semibold text-blue-600">₹{order.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment ID</span>
                      <span className="font-mono text-xs">{order.razorpay_payment_id}</span>
                    </div>
                  </div>
                )}

                {/* Note Download Section */}
                {note && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Download className="h-6 w-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-800">Your Note is Ready!</h3>
                        <p className="text-sm text-green-600">{note.title}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">File:</span>
                        <span className="font-medium">{note.file_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size:</span>
                        <span className="font-medium">{note.file_size ? `${(note.file_size / 1024).toFixed(1)} KB` : 'Unknown'}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={handleDownload}
                      className="w-full bg-green-600 hover:bg-green-700 gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Note Now
                    </Button>
                  </div>
                )}

                {/* eBook Download Section */}
                {ebook && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Download className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-blue-800">Your eBook is Ready!</h3>
                        <p className="text-sm text-blue-600">{ebook.title}</p>
                        {ebook.author && (
                          <p className="text-xs text-blue-500">by {ebook.author}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">File:</span>
                        <span className="font-medium">{ebook.file_name || 'eBook.pdf'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size:</span>
                        <span className="font-medium">{ebook.file_size ? `${(ebook.file_size / 1024 / 1024).toFixed(1)} MB` : 'Unknown'}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={handleDownload}
                      className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
                    >
                      <Download className="h-4 w-4" />
                      📖 Download eBook Now
                    </Button>
                  </div>
                )}

                <div className="space-y-3 pt-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Check your email</p>
                      <p className="text-sm text-muted-foreground">
                        We've sent you a confirmation email with access details
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Download className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Instant access</p>
                      <p className="text-sm text-muted-foreground">You can now access your purchased content anytime</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/">Back to Home</Link>
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent" asChild>
                    <Link href="/ebooks">Browse More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </main>
          <Footer />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
