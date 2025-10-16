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
      console.log("[verify] Email check:", {
        hasSMTPHost: !!process.env.SMTP_HOST,
        hasSMTPUser: !!process.env.SMTP_USER,
        hasSMTPPass: !!process.env.SMTP_PASS,
        hasUserEmail: !!order?.user_email,
        userEmail: order?.user_email
      })
      
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && order?.user_email) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 465,
          secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        })

        const fromName = process.env.SMTP_FROM_NAME || "Neelam Academy"
        const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER

        let subject = "Payment Confirmation"
        let text = `Hi ${order.user_name || "there"},\n\nWe have received your payment successfully.\n\nOrder ID: ${orderId}\nAmount: ₹${order.amount}\nProduct: ${order.product_type}\n\nThank you for your purchase!\n${fromName}`
        let html = `<p>Hi ${order.user_name || "there"},</p><p>We have received your payment successfully.</p><ul><li><strong>Order ID:</strong> ${orderId}</li><li><strong>Amount:</strong> ₹${order.amount}</li><li><strong>Product:</strong> ${order.product_type}</li></ul><p>Thank you for your purchase!</p><p>${fromName}</p>`

        // Handle note delivery
        if (order.product_type === "note") {
          const { data: note } = await supabase
            .from("notes")
            .select("title, content, file_name, file_url, file_size")
            .eq("id", order.product_id)
            .single()

          if (note) {
            subject = `Your Note: ${note.title} - Neelam Academy`
            
            if (note.file_url) {
              // File-based note
              text = `Hi ${order.user_name || "there"},\n\nThank you for your purchase! Here's your note:\n\nTitle: ${note.title}\nFile: ${note.file_name}\nFile Size: ${note.file_size ? `${(note.file_size / 1024).toFixed(1)} KB` : 'Unknown'}\n\nDownload Link: ${note.file_url}\n\nOrder ID: ${orderId}\nAmount: ₹${order.amount}\n\nThank you for choosing Neelam Academy!\n${fromName}`
              html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #2563eb;">Your Note: ${note.title}</h2>
                  <p>Hi ${order.user_name || "there"},</p>
                  <p>Thank you for your purchase! Here's your note:</p>
                  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">${note.title}</h3>
                    <p><strong>File:</strong> ${note.file_name}</p>
                    <p><strong>Size:</strong> ${note.file_size ? `${(note.file_size / 1024).toFixed(1)} KB` : 'Unknown'}</p>
                    <div style="text-align: center; margin: 20px 0;">
                      <a href="${note.file_url}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Download Note</a>
                    </div>
                  </div>
                  <p><strong>Order ID:</strong> ${orderId}</p>
                  <p><strong>Amount:</strong> ₹${order.amount}</p>
                  <p>Thank you for choosing Neelam Academy!</p>
                  <p>${fromName}</p>
                </div>
              `
            } else {
              // Content-based note (fallback)
              text = `Hi ${order.user_name || "there"},\n\nThank you for your purchase! Here's your note:\n\nTitle: ${note.title}\nFile: ${note.file_name}\n\nNote Content:\n${note.content}\n\nOrder ID: ${orderId}\nAmount: ₹${order.amount}\n\nThank you for choosing Neelam Academy!\n${fromName}`
              html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #2563eb;">Your Note: ${note.title}</h2>
                  <p>Hi ${order.user_name || "there"},</p>
                  <p>Thank you for your purchase! Here's your note:</p>
                  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">${note.title}</h3>
                    <p><strong>File:</strong> ${note.file_name}</p>
                    <div style="background: white; padding: 15px; border-radius: 4px; white-space: pre-wrap; font-family: monospace; font-size: 14px;">${note.content}</div>
                  </div>
                  <p><strong>Order ID:</strong> ${orderId}</p>
                  <p><strong>Amount:</strong> ₹${order.amount}</p>
                  <p>Thank you for choosing Neelam Academy!</p>
                  <p>${fromName}</p>
                </div>
              `
            }
          }
        }

        // Handle eBook delivery
        if (order.product_type === "ebook") {
          const { data: ebook } = await supabase
            .from("ebooks")
            .select("title, author, pdf_url, file_name, file_size")
            .eq("id", order.product_id)
            .single()

          if (ebook && ebook.pdf_url) {
            subject = `Your eBook: ${ebook.title} - Neelam Academy`
            
            text = `Hi ${order.user_name || "there"},\n\nThank you for your purchase! Here's your eBook:\n\nTitle: ${ebook.title}\nAuthor: ${ebook.author || 'Unknown'}\nFile: ${ebook.file_name || 'eBook.pdf'}\n\nDownload Link: ${ebook.pdf_url}\n\nOrder ID: ${orderId}\nAmount: ₹${order.amount}\n\nThank you for choosing Neelam Academy!\n${fromName}`
            
            html = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Your eBook: ${ebook.title}</h2>
                <p>Hi ${order.user_name || "there"},</p>
                <p>Thank you for your purchase! Here's your eBook:</p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #1f2937;">${ebook.title}</h3>
                  <p><strong>Author:</strong> ${ebook.author || 'Unknown'}</p>
                  <p><strong>File:</strong> ${ebook.file_name || 'eBook.pdf'}</p>
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="${ebook.pdf_url}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">📖 Download eBook</a>
                  </div>
                </div>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Amount:</strong> ₹${order.amount}</p>
                <p>Thank you for choosing Neelam Academy!</p>
                <p>${fromName}</p>
              </div>
            `
          } else if (ebook) {
            // eBook exists but no PDF file
            subject = `eBook Purchase Confirmation: ${ebook.title} - Neelam Academy`
            text = `Hi ${order.user_name || "there"},\n\nThank you for your purchase! Unfortunately, the eBook file is not available at the moment. Please contact our support team.\n\nTitle: ${ebook.title}\nAuthor: ${ebook.author || 'Unknown'}\n\nOrder ID: ${orderId}\nAmount: ₹${order.amount}\n\nThank you for choosing Neelam Academy!\n${fromName}`
            html = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">eBook Purchase Confirmation</h2>
                <p>Hi ${order.user_name || "there"},</p>
                <p>Thank you for your purchase! Unfortunately, the eBook file is not available at the moment. Please contact our support team.</p>
                <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                  <h3 style="margin-top: 0; color: #dc2626;">${ebook.title}</h3>
                  <p><strong>Author:</strong> ${ebook.author || 'Unknown'}</p>
                  <p style="color: #dc2626; font-weight: bold;">⚠️ File not available - Please contact support</p>
                </div>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Amount:</strong> ₹${order.amount}</p>
                <p>Thank you for choosing Neelam Academy!</p>
                <p>${fromName}</p>
              </div>
            `
          }
        }

        const mailResult = await transporter.sendMail({
          from: `${fromName} <${fromEmail}>`,
          to: order.user_email,
          subject,
          text,
          html,
        })
        
        console.log("[verify] Email sent successfully:", {
          messageId: mailResult.messageId,
          to: order.user_email,
          subject: subject
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
