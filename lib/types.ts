export interface Ebook {
  id: string
  title: string
  description: string | null
  price: number
  cover_image: string | null
  pdf_url: string | null
  file_name: string | null
  file_size: number | null
  file_type: string | null
  author: string | null
  pages: number | null
  published_date: string | null
  category: string | null
  is_active: boolean
  preview_images: string[] | null
  preview_pdf: string | null
  isbn: string | null
  language: string | null
  tags: string[] | null
  rating: number | null
  reviews_count: number | null
  created_at: string
  updated_at: string
}

export interface LiveCourse {
  id: string
  title: string
  description: string | null
  price: number
  cover_image: string | null
  instructor: string | null
  duration_hours: number | null
  start_date: string | null
  end_date: string | null
  max_students: number | null
  enrolled_count: number
  category: string | null
  is_active: boolean
  live_link: string | null
  platform_link: string | null
  instructor_bio: string | null
  syllabus: string | null
  requirements: string | null
  what_you_learn: string | null
  language: string | null
  level: string | null
  tags: string[] | null
  rating: number | null
  reviews_count: number | null
  created_at: string
  updated_at: string
}

export interface Purchase {
  id: string
  user_email: string
  user_name: string | null
  product_type: "ebook" | "course" | "note"
  product_id: string
  amount: number
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  payment_status: string
  created_at: string
}

export interface EmailLog {
  id: string
  recipient_email: string
  subject: string
  body: string
  sent_at: string
  status: string
  error_message: string | null
}

export interface Webinar {
  id: string
  name: string
  webinar_link: string
  banner_image: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  title: string
  description: string | null
  topic: string
  content: string
  file_name: string
  category: string | null
  tags: string[] | null
  download_count: number
  is_active: boolean
  file_url: string | null
  file_size: number | null
  cover_image: string | null
  author: string | null
  reading_time: number | null
  payment_type: "free" | "paid"
  price: number | null
  created_at: string
  updated_at: string
}