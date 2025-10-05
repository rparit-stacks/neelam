import { type NextRequest, NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body, isHtml } = await request.json()

    // Create SMTP transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Send email
    await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      [isHtml ? "html" : "text"]: body,
    })

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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Email send error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
