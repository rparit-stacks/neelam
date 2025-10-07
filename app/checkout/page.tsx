"use client"

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Loader2, ShieldCheck, CreditCard } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { toast } from "sonner"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const type = searchParams.get("type")
  const id = searchParams.get("id")

  useEffect(() => {
    async function fetchProduct() {
      if (!type || !id) {
        router.push("/")
        return
      }

      const supabase = getSupabase()
      const table = type === "ebook" ? "ebooks" : "live_courses"

      const { data } = await supabase.from(table).select("*").eq("id", id).single()

      if (data) {
        setProduct({ ...data, type })
      }
      setLoading(false)
    }

    fetchProduct()
  }, [type, id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      console.log("[v0] Creating order...")
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productType: type,
          productId: product.id,
          amount: product.price,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] Order creation failed:", errorData)
        throw new Error(errorData.error || "Failed to create order")
      }

      const { orderId, razorpayOrderId, razorpayKeyId } = await response.json()

      if (!razorpayKeyId) {
        console.error("[v0] No Razorpay key received from server")
        throw new Error("Payment gateway not configured")
      }

      console.log("[v0] Order created, opening Razorpay checkout...")

      const options = {
        key: razorpayKeyId,
        amount: product.price * 100,
        currency: "INR",
        name: "Neelam Academy",
        description: product.title,
        order_id: razorpayOrderId,
        handler: async (paymentResponse: any) => {
          console.log("[v0] Payment successful, verifying...")
          // Verify payment
          const verifyResponse = await fetch("/api/orders/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            }),
          })

          const verifyJson = await verifyResponse.json()
          const { success } = verifyJson

          if (success) {
            console.log("[v0] Payment verified successfully")
            toast.success("Payment successful!")
            router.push(`/success?orderId=${orderId}`)
          } else {
            console.error("[v0] Payment verification failed", verifyJson)
            toast.error(verifyJson?.error || "Payment verification failed")
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#2563eb",
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.on("payment.failed", (response: any) => {
        console.error("[v0] Payment failed:", response.error)
        toast.error("Payment failed. Please try again.")
      })
      razorpay.open()
    } catch (error) {
      console.error("[v0] Payment error:", error)
      toast.error(error instanceof Error ? error.message : "Payment failed. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Enter your details to complete the purchase</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ShieldCheck className="h-5 w-5 text-blue-600" />
                          <span>Secure payment powered by Razorpay</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                          <span>All major cards, UPI, and net banking accepted</span>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={processing}
                      >
                        {processing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Pay ₹${product.price}`
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8 border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <div className="relative h-24 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <Image
                          src={product.cover_image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold line-clamp-2 mb-1">{product.title}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{product.type}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{product.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span>₹0</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">₹{product.price}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <CheckoutContent />
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </Suspense>
  )
}
