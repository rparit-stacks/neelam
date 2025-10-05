"use client"

import { BookOpen, GraduationCap, Lightbulb, Award, Brain, Pencil } from "lucide-react"
import { useEffect, useState } from "react"

export function FloatingIcons() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const icons = [
    { Icon: BookOpen, delay: 0, duration: 20 },
    { Icon: GraduationCap, delay: 2, duration: 25 },
    { Icon: Lightbulb, delay: 4, duration: 22 },
    { Icon: Award, delay: 1, duration: 23 },
    { Icon: Brain, delay: 3, duration: 21 },
    { Icon: Pencil, delay: 5, duration: 24 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
      {icons.map(({ Icon, delay, duration }, index) => (
        <div
          key={index}
          className="absolute animate-float"
          style={{
            left: `${(index * 15) % 90}%`,
            top: `${(index * 20) % 80}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        >
          <Icon className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 text-primary" />
        </div>
      ))}
    </div>
  )
}
