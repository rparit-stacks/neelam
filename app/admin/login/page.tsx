import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import { AdminLoginForm } from "@/components/admin-login-form"

export const dynamic = "force-dynamic"

export default async function AdminLoginPage() {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      redirect("/admin")
    }
  } catch (error) {
    // During build time, auth check may fail - that's okay
    console.log("[v0] Auth check skipped during build")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <AdminLoginForm />
    </div>
  )
}
