"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSupabase } from "@/lib/supabase"
import type { LiveCourse } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import { Clock, Users } from "lucide-react"

export function CoursesList() {
  const [courses, setCourses] = useState<LiveCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from("live_courses")
        .select("*")
        .eq("is_active", true)
        .order("start_date", { ascending: true })

      if (!error && data) {
        setCourses(data)
      }
      setLoading(false)
    }

    fetchCourses()
  }, [])

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-64 sm:h-72 bg-muted rounded-t-lg" />
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-full" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-card">
          <div className="relative h-64 sm:h-72 bg-muted">
            <Image
              src={course.cover_image || "/placeholder.svg?height=400&width=300&query=course thumbnail"}
              alt={course.title}
              fill
              className="object-cover"
            />
            <Badge className="absolute top-4 right-4 bg-blue-600 text-white">Live Course</Badge>
          </div>
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-xl line-clamp-2">{course.title}</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {course.category}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2 text-base leading-relaxed">{course.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration_hours}h</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.max_students} seats</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">By {course.instructor}</p>
          </CardContent>
          <CardFooter className="flex items-center justify-between pt-4 border-t">
            <div className="text-2xl font-bold text-blue-600">₹{course.price}</div>
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href={`/courses/${course.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
