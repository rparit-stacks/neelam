import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import { AdminLoginForm } from "@/components/admin-login-form"

export default async function AdminLoginPage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <AdminLoginForm />
    </div>
  )
}
