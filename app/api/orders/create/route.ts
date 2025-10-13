import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productType, productId, amount, customerName, customerEmail, customerPhone } = body

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error("[v0] Razorpay credentials missing")
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 })
    }

    console.log("[v0] Creating Razorpay order for amount:", amount)

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      }),
    })

    if (!razorpayResponse.ok) {
      const err = await razorpayResponse.text()
      console.error("[v0] Razorpay order create failed:", err)
      return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 })
    }

    const razorpayOrder = await razorpayResponse.json()
    console.log("[v0] Razorpay order created:", razorpayOrder.id)

    const supabase = await createServerClient()
    const { data: order, error } = await supabase
      .from("purchases")
      .insert({
        product_type: productType,
        product_id: productId,
        amount,
        user_name: customerName,
        user_email: customerEmail,
        razorpay_order_id: razorpayOrder.id,
        payment_status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      console.error("[v0] Product type being inserted:", productType)
      console.error("[v0] Full error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    console.log("[v0] Order saved to database:", order.id)

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId,
    })
  } catch (error) {
    console.error("[v0] Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
