import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 sm:h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image src="/logo.png" alt="Neelu Mam" width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10" />
          <span className="font-bold text-lg sm:text-xl">Neelu Mam</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link href="/ebooks" className="text-sm font-medium hover:text-primary transition-colors">
            Ebooks
          </Link>
          <Link href="/courses" className="text-sm font-medium hover:text-primary transition-colors">
            Live Courses
          </Link>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/ebooks">Browse Ebooks</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/ebooks" className="text-lg font-medium hover:text-primary transition-colors">
                  Ebooks
                </Link>
                <Link href="/courses" className="text-lg font-medium hover:text-primary transition-colors">
                  Live Courses
                </Link>
                <Link href="/admin" className="text-lg font-medium hover:text-primary transition-colors">
                  Admin
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
