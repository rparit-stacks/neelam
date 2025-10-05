import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body

    const text = `${razorpayOrderId}|${razorpayPaymentId}`
    const encoder = new TextEncoder()
    const keyData = encoder.encode(process.env.RAZORPAY_KEY_SECRET!)
    const messageData = encoder.encode(text)

    const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData)
    const generated_signature = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    if (generated_signature !== razorpaySignature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 })
    }

    // Update order status
    const supabase = createServerClient()
    const { error } = await supabase
      .from("purchases")
      .update({
        status: "completed",
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
      })
      .eq("id", orderId)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 })
  }
}
