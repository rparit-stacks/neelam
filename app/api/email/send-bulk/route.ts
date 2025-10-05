import { type NextRequest, NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { emails, subject, body, isHtml } = await request.json()

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

    const supabase = getSupabase()

    // Send emails
    for (const email of emails) {
      try {
        await transporter.sendMail({
          from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
          to: email,
          subject,
          [isHtml ? "html" : "text"]: body,
        })

        // Log successful email
        await supabase.from("email_logs").insert([
          {
            recipient_email: email,
            subject,
            body,
            status: "sent",
          },
        ])
      } catch (error) {
        // Log failed email
        await supabase.from("email_logs").insert([
          {
            recipient_email: email,
            subject,
            body,
            status: "failed",
            error_message: error instanceof Error ? error.message : "Unknown error",
          },
        ])
      }
    }

    return NextResponse.json({ success: true, count: emails.length })
  } catch (error) {
    console.error("[v0] Bulk email send error:", error)
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 })
  }
}
