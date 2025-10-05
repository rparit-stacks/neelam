import Link from "next/link"
import Image from "next/image"
import { Mail, BookOpen, GraduationCap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-gradient-to-b from-muted/30 to-muted/50">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt="Neelu Mam"
                width={48}
                height={48}
                className="w-12 h-12 transition-transform group-hover:scale-110"
              />
              <span className="font-bold text-xl">Neelu Mam</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Quality educational content for aspiring developers and professionals. Learn from the best.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <a href="mailto:support@helloneelammaam.com" className="hover:text-primary transition-colors">
                support@helloneelammaam.com
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-4">Products</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/ebooks"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Ebooks
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <GraduationCap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Live Courses
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/ebooks" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Ebooks
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Courses
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Neelu Mam. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
            <a href="mailto:support@helloneelammaam.com" className="hover:text-primary transition-colors">
              Email Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
