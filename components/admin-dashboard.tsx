"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EbooksAdmin } from "@/components/admin/ebooks-admin"
import { CoursesAdmin } from "@/components/admin/courses-admin"
import { PurchasesAdmin } from "@/components/admin/purchases-admin"
import { EmailAdmin } from "@/components/admin/email-admin"
import { LayoutDashboard, BookOpen, Video, ShoppingCart, Mail, Menu, X, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import Image from "next/image"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  async function handleLogout() {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "ebooks", label: "Ebooks", icon: BookOpen },
    { id: "courses", label: "Live Courses", icon: Video },
    { id: "purchases", label: "Purchases", icon: ShoppingCart },
    { id: "email", label: "Email System", icon: Mail },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded" />
            <div>
              <h2 className="font-bold text-lg">Neelu Mam</h2>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button onClick={handleLogout} variant="outline" className="w-full gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {menuItems.find((item) => item.id === activeTab)?.label || "Dashboard"}
            </h1>
          </div>
          <Button onClick={handleLogout} variant="ghost" size="sm" className="gap-2 hidden lg:flex">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Ebooks</p>
                    <p className="text-3xl font-bold text-gray-900">12</p>
                  </div>
                  <BookOpen className="h-10 w-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Live Courses</p>
                    <p className="text-3xl font-bold text-gray-900">8</p>
                  </div>
                  <Video className="h-10 w-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Sales</p>
                    <p className="text-3xl font-bold text-gray-900">₹45,230</p>
                  </div>
                  <ShoppingCart className="h-10 w-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Emails Sent</p>
                    <p className="text-3xl font-bold text-gray-900">156</p>
                  </div>
                  <Mail className="h-10 w-10 text-orange-500" />
                </div>
              </div>
            </div>
          )}
          {activeTab === "ebooks" && <EbooksAdmin />}
          {activeTab === "courses" && <CoursesAdmin />}
          {activeTab === "purchases" && <PurchasesAdmin />}
          {activeTab === "email" && <EmailAdmin />}
        </main>
      </div>
    </div>
  )
}
