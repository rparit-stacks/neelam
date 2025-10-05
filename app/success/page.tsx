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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return

      const supabase = getSupabase()
      const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

      if (!error && data) {
        setOrder(data)
      }
      setLoading(false)
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
