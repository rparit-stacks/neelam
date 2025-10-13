"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { EbooksAdmin } from "@/components/admin/ebooks-admin"
import { CoursesAdmin } from "@/components/admin/courses-admin"
import { PurchasesAdmin } from "@/components/admin/purchases-admin"
import { EmailAdmin } from "@/components/admin/email-admin"
import { WebinarAdmin } from "@/components/admin/webinar-admin"
import { NotesAdmin } from "@/components/admin/notes-admin"
import { LayoutDashboard, BookOpen, Video, ShoppingCart, Mail, Menu, X, LogOut, Keyboard, Plus, TrendingUp, Presentation, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import Image from "next/image"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, shortcut: "1" },
    { id: "ebooks", label: "Ebooks", icon: BookOpen, shortcut: "2" },
    { id: "courses", label: "Live Courses", icon: Video, shortcut: "3" },
    { id: "notes", label: "Free Notes", icon: FileText, shortcut: "4" },
    { id: "webinars", label: "Webinars", icon: Presentation, shortcut: "5" },
    { id: "purchases", label: "Purchases", icon: ShoppingCart, shortcut: "6" },
    { id: "email", label: "Email System", icon: Mail, shortcut: "7" },
  ]

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      // Alt + Number keys for navigation
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const num = e.key
        const item = menuItems.find(item => item.shortcut === num)
        if (item) {
          e.preventDefault()
          setActiveTab(item.id)
        }
      }
      
      // Alt + S to toggle sidebar
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault()
        setSidebarOpen(prev => !prev)
      }

      // Alt + K to show shortcuts
      if (e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setShowShortcuts(prev => !prev)
      }

      // Escape to close shortcuts modal
      if (e.key === 'Escape' && showShortcuts) {
        setShowShortcuts(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showShortcuts])

  return (
    <>
      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowShortcuts(false)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Keyboard Shortcuts
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowShortcuts(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-600">Navigation</h4>
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
                      Alt + {item.shortcut}
                    </kbd>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2">
                <h4 className="font-semibold text-sm text-gray-600">Actions</h4>
                <div className="flex items-center justify-between text-sm">
                  <span>Toggle Sidebar</span>
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
                    Alt + S
                  </kbd>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Show Shortcuts</span>
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
                    Alt + K
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-screen bg-gray-50">
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Neelam Academy Logo" width={40} height={40} className="rounded-lg" />
              <div>
                <h2 className="font-bold text-lg">Neelam Academy</h2>
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
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                  <kbd className="hidden lg:block px-1.5 py-0.5 text-xs font-mono bg-gray-100 rounded border border-gray-300">
                    {item.shortcut}
                  </kbd>
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
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setShowShortcuts(true)} 
                variant="ghost" 
                size="sm" 
                className="gap-2 hidden lg:flex"
                title="Keyboard Shortcuts (Alt + K)"
              >
                <Keyboard className="h-4 w-4" />
                <span className="hidden xl:inline">Shortcuts</span>
              </Button>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="gap-2 hidden lg:flex">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            {activeTab === "notes" && <NotesAdmin />}
            {activeTab === "webinars" && <WebinarAdmin />}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">Welcome Back! 👋</h2>
                  <p className="text-blue-100 mb-6">Quick actions to manage your platform</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                    <button
                      onClick={() => setActiveTab("ebooks")}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg p-4 text-left transition-all hover:scale-105"
                    >
                      <Plus className="h-6 w-6 mb-2" />
                      <div className="font-semibold">Add Ebook</div>
                      <div className="text-sm text-blue-100">Create new ebook</div>
                    </button>
                    <button
                      onClick={() => setActiveTab("courses")}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg p-4 text-left transition-all hover:scale-105"
                    >
                      <Plus className="h-6 w-6 mb-2" />
                      <div className="font-semibold">Add Course</div>
                      <div className="text-sm text-blue-100">Create live course</div>
                    </button>
                    <button
                      onClick={() => setActiveTab("notes")}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg p-4 text-left transition-all hover:scale-105"
                    >
                      <FileText className="h-6 w-6 mb-2" />
                      <div className="font-semibold">Add Note</div>
                      <div className="text-sm text-blue-100">Create free note</div>
                    </button>
                    <button
                      onClick={() => setActiveTab("webinars")}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg p-4 text-left transition-all hover:scale-105"
                    >
                      <Presentation className="h-6 w-6 mb-2" />
                      <div className="font-semibold">Add Webinar</div>
                      <div className="text-sm text-blue-100">Create webinar</div>
                    </button>
                    <button
                      onClick={() => setActiveTab("purchases")}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg p-4 text-left transition-all hover:scale-105"
                    >
                      <TrendingUp className="h-6 w-6 mb-2" />
                      <div className="font-semibold">View Sales</div>
                      <div className="text-sm text-blue-100">Check purchases</div>
                    </button>
                    <button
                      onClick={() => setActiveTab("email")}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg p-4 text-left transition-all hover:scale-105"
                    >
                      <Mail className="h-6 w-6 mb-2" />
                      <div className="font-semibold">Send Email</div>
                      <div className="text-sm text-blue-100">Email customers</div>
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
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

                {/* Recent Activity Placeholder */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <p className="text-gray-500 text-center py-8">Recent orders and activities will appear here</p>
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
    </>
  )
}