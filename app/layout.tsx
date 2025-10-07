import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { StructuredData } from "@/components/structured-data"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Neelam Academy - Quality E-Learning Platform for Aspiring Developers",
    template: "%s | Neelam Academy",
  },
  description:
    "Neelam Academy offers premium ebooks and live courses for aspiring developers. Learn programming, web development, and more with expert guidance and comprehensive study materials.",
  keywords: [
    "neelam academy",
    "online courses",
    "ebooks",
    "programming courses",
    "web development",
    "live courses",
    "e-learning",
    "developer courses",
    "coding tutorials",
    "tech education",
  ],
  authors: [{ name: "Neelam Academy" }],
  creator: "Neelam Academy",
  publisher: "Neelam Academy",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://helloneelammaam.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://helloneelammaam.com",
    siteName: "Neelam Academy",
    title: "Neelam Academy - Quality E-Learning Platform for Aspiring Developers",
    description:
      "Neelam Academy offers premium ebooks and live courses for aspiring developers. Learn programming, web development, and more with expert guidance.",
    images: [
      {
        url: "https://helloneelammaam.com/logo.png",
        width: 1200,
        height: 1200,
        alt: "Neelam Academy Logo",
        type: "image/png",
      },
      {
        url: "https://helloneelammaam.com/uploads/IMG_3781-removebg-preview (1).png",
        width: 800,
        height: 800,
        alt: "Neelam Academy - Expert Teacher",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neelam Academy - Quality E-Learning Platform for Aspiring Developers",
    description:
      "Neelam Academy offers premium ebooks and live courses for aspiring developers. Learn programming, web development, and more with expert guidance.",
    images: ["https://helloneelammaam.com/logo.png"],
    creator: "@neelamacademy",
    site: "@neelamacademy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.png" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/logo.png" }],
  },
  manifest: "/manifest.json",
  verification: {
    google: "google-site-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body suppressHydrationWarning={true} className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster position="top-center" />
        <Analytics />
      </body>
    </html>
  )
}
