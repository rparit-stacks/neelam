import { type NextRequest, NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"
// @ts-expect-error - nodemailer types optional in server routes
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  let payload: { to: string; subject: string; body: string; isHtml?: boolean } | null = null
  try {
    payload = await request.json()
    const { to, subject, body, isHtml } = payload as { to: string; subject: string; body: string; isHtml?: boolean }

    // Validate SMTP configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("[Email] SMTP configuration missing. Please check your .env.local file.")
      return NextResponse.json({ 
        error: "Email service not configured. Please contact administrator." 
      }, { status: 500 })
    }

    console.log("[Email] Attempting to send email to:", to)
    console.log("[Email] SMTP Host:", process.env.SMTP_HOST)
    console.log("[Email] SMTP Port:", process.env.SMTP_PORT)
    console.log("[Email] SMTP User:", process.env.SMTP_USER)

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true, // Enable debug output
      logger: true, // Log to console
    })

    // Verify connection configuration
    try {
      await transporter.verify()
      console.log("[Email] SMTP connection verified successfully")
    } catch (verifyError) {
      console.error("[Email] SMTP verification failed:", verifyError)
      return NextResponse.json({ 
        error: "Failed to connect to email server. Please check SMTP configuration." 
      }, { status: 500 })
    }

    // Send email
    const info = await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME || 'Neelam Academy'} <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      [isHtml ? "html" : "text"]: body,
    })

    console.log("[Email] Email sent successfully. Message ID:", info.messageId)

    // Log email
    const supabase = getSupabase()
    await supabase.from("email_logs").insert([
      {
        recipient_email: to,
        subject,
        body,
        status: "sent",
      },
    ])

    return NextResponse.json({ success: true, messageId: info.messageId })
  } catch (error) {
    console.error("[Email] Email send error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    // Log failed email
    try {
      const supabase = getSupabase()
      await supabase.from("email_logs").insert([
        {
          recipient_email: payload?.to || "",
          subject: payload?.subject || "",
          body: payload?.body || "",
          status: "failed",
          error_message: errorMessage,
        },
      ])
    } catch (logError) {
      console.error("[Email] Failed to log error:", logError)
    }
    
    return NextResponse.json({ 
      error: "Failed to send email", 
      details: errorMessage 
    }, { status: 500 })
  }
}
