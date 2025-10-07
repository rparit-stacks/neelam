import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
// @ts-expect-error - nodemailer types optional in server routes
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("[verify] Missing RAZORPAY_KEY_SECRET env")
      return NextResponse.json({ success: false, error: "Payment gateway not configured" }, { status: 500 })
    }

    const text = `${razorpayOrderId}|${razorpayPaymentId}`
    const encoder = new TextEncoder()
    const keyData = encoder.encode(process.env.RAZORPAY_KEY_SECRET!)
    const messageData = encoder.encode(text)

    const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData)
    const generated_signature = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    if (generated_signature.toLowerCase() !== String(razorpaySignature).toLowerCase()) {
      console.error("[verify] Signature mismatch", {
        expected: generated_signature,
        received: razorpaySignature,
        orderId,
      })
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 })
    }

    // Update order status
    const supabase = await createServerClient()
    const { error } = await supabase
      .from("purchases")
      .update({
        payment_status: "completed",
        razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      })
      .eq("id", orderId)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
    }

    // Fetch order to get email and product details
    const { data: order } = await supabase
      .from("purchases")
      .select("id, user_email, user_name, product_type, product_id, amount")
      .eq("id", orderId)
      .single()

    let mailSent = false
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && order?.user_email) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 465,
          secure: true,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        })

        const fromName = process.env.SMTP_FROM_NAME || "Neelam Academy"
        const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER

        const subject = "Payment Confirmation"
        const text = `Hi ${order.user_name || "there"},\n\nWe have received your payment successfully.\n\nOrder ID: ${orderId}\nAmount: ₹${order.amount}\nProduct: ${order.product_type}\n\nThank you for your purchase!\n${fromName}`
        const html = `<p>Hi ${order.user_name || "there"},</p><p>We have received your payment successfully.</p><ul><li><strong>Order ID:</strong> ${orderId}</li><li><strong>Amount:</strong> ₹${order.amount}</li><li><strong>Product:</strong> ${order.product_type}</li></ul><p>Thank you for your purchase!</p><p>${fromName}</p>`

        await transporter.sendMail({
          from: `${fromName} <${fromEmail}>`,
          to: order.user_email,
          subject,
          text,
          html,
        })
        mailSent = true
      } else {
        console.warn("[verify] SMTP not configured or user_email missing; skipping confirmation email")
      }
    } catch (mailErr) {
      console.error("[verify] Failed to send confirmation email:", mailErr)
    }

    return NextResponse.json({ success: true, orderId, mailSent })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 })
  }
}
