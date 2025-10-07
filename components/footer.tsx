import Link from "next/link"
import Image from "next/image"
import { Mail, BookOpen, GraduationCap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-gradient-to-b from-muted/30 to-muted/50">
      <div className="container py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Brand Section */}
          <div className="space-y-4 text-center md:text-left mx-auto md:mx-0">
            <Link href="/" className="inline-flex items-center gap-3 group transition-transform hover:scale-105 duration-300">
              <Image 
                src="/logo.png" 
                alt="Neelam Academy Logo" 
                width={60} 
                height={60} 
                className="w-14 h-14 rounded-lg transition-transform group-hover:rotate-6 duration-300" 
              />
              <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Neelam Academy
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto md:mx-0">
              Quality educational content for aspiring developers and professionals. Learn from the best.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center md:justify-start">
              <Mail className="w-4 h-4 animate-pulse" />
              <a 
                href="mailto:support@helloneelammaam.com" 
                className="hover:text-primary transition-all duration-300 hover:translate-x-1"
              >
                support@helloneelammaam.com
              </a>
            </div>
          </div>

          {/* Products Section */}
          <div className="text-center md:text-left mx-auto md:mx-0">
            <h4 className="font-semibold text-base mb-4 text-foreground">Products</h4>
            <ul className="space-y-3 text-sm">
              <li className="transform transition-all duration-300 hover:translate-x-2">
                <Link
                  href="/ebooks"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  Ebooks
                </Link>
              </li>
              <li className="transform transition-all duration-300 hover:translate-x-2">
                <Link
                  href="/courses"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <GraduationCap className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  Live Courses
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="text-center md:text-left mx-auto md:mx-0">
            <h4 className="font-semibold text-base mb-4 text-foreground">Support</h4>
            <ul className="space-y-3 text-sm">
              <li className="transform transition-all duration-300 hover:translate-x-2">
                <Link 
                  href="/contact" 
                  className="text-muted-foreground hover:text-primary transition-colors inline-block"
                >
                  Contact Us
                </Link>
              </li>
              <li className="transform transition-all duration-300 hover:translate-x-2">
                <Link 
                  href="/admin" 
                  className="text-muted-foreground hover:text-primary transition-colors inline-block"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div className="text-center md:text-left mx-auto md:mx-0">
            <h4 className="font-semibold text-base mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li className="transform transition-all duration-300 hover:translate-x-2">
                <Link 
                  href="/" 
                  className="text-muted-foreground hover:text-primary transition-colors inline-block"
                >
                  Home
                </Link>
              </li>
              <li className="transform transition-all duration-300 hover:translate-x-2">
                <Link 
                  href="/ebooks" 
                  className="text-muted-foreground hover:text-primary transition-colors inline-block"
                >
                  Browse Ebooks
                </Link>
              </li>
              <li className="transform transition-all duration-300 hover:translate-x-2">
                <Link 
                  href="/courses" 
                  className="text-muted-foreground hover:text-primary transition-colors inline-block"
                >
                  Browse Courses
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Neelam Academy. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link 
                href="/contact" 
                className="hover:text-primary transition-all duration-300 hover:scale-110 inline-block"
              >
                Contact
              </Link>
              <a 
                href="mailto:support@helloneelammaam.com" 
                className="hover:text-primary transition-all duration-300 hover:scale-110 inline-block"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}