import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
// @ts-expect-error - nodemailer types optional in server routes
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, type, noteId, orderId } = body

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("[email] SMTP not configured")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const supabase = await createServerClient()

    if (type === 'note_delivery' && noteId) {
      // Fetch note details
      const { data: note } = await supabase
        .from("notes")
        .select("title, content, file_name, file_url, file_size")
        .eq("id", noteId)
        .single()

      if (!note) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 })
      }

      // Fetch order details
      const { data: order } = await supabase
        .from("purchases")
        .select("user_name, amount")
        .eq("id", orderId)
        .single()

      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })

      const fromName = process.env.SMTP_FROM_NAME || "Neelam Academy"
      const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER

      let emailSubject = `Your Note: ${note.title} - Neelam Academy`
      let emailText = ""
      let emailHtml = ""

      if (note.file_url) {
        // File-based note
        emailText = `Hi ${order?.user_name || "there"},\n\nThank you for your purchase! Here's your note:\n\nTitle: ${note.title}\nFile: ${note.file_name}\nFile Size: ${note.file_size ? `${(note.file_size / 1024).toFixed(1)} KB` : 'Unknown'}\n\nDownload Link: ${note.file_url}\n\nOrder ID: ${orderId}\nAmount: ₹${order?.amount || 0}\n\nThank you for choosing Neelam Academy!\n${fromName}`
        
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Your Note: ${note.title}</h2>
            <p>Hi ${order?.user_name || "there"},</p>
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
            <p><strong>Amount:</strong> ₹${order?.amount || 0}</p>
            <p>Thank you for choosing Neelam Academy!</p>
            <p>${fromName}</p>
          </div>
        `
      } else {
        // Content-based note (fallback)
        emailText = `Hi ${order?.user_name || "there"},\n\nThank you for your purchase! Here's your note:\n\nTitle: ${note.title}\nFile: ${note.file_name}\n\nNote Content:\n${note.content}\n\nOrder ID: ${orderId}\nAmount: ₹${order?.amount || 0}\n\nThank you for choosing Neelam Academy!\n${fromName}`
        
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Your Note: ${note.title}</h2>
            <p>Hi ${order?.user_name || "there"},</p>
            <p>Thank you for your purchase! Here's your note:</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">${note.title}</h3>
              <p><strong>File:</strong> ${note.file_name}</p>
              <div style="background: white; padding: 15px; border-radius: 4px; white-space: pre-wrap; font-family: monospace; font-size: 14px;">${note.content}</div>
            </div>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Amount:</strong> ₹${order?.amount || 0}</p>
            <p>Thank you for choosing Neelam Academy!</p>
            <p>${fromName}</p>
          </div>
        `
      }

      await transporter.sendMail({
        from: `${fromName} <${fromEmail}>`,
        to: to,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      })

      console.log("[email] Note delivery email sent successfully to:", to)
      return NextResponse.json({ success: true, message: "Email sent successfully" })
    }

    return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
  } catch (error) {
    console.error("[email] Failed to send email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}