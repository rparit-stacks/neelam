-- Create ebooks table
CREATE TABLE IF NOT EXISTS ebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  cover_image TEXT,
  pdf_url TEXT,
  author TEXT,
  pages INTEGER,
  published_date TIMESTAMP,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  preview_images TEXT[], -- Array of preview image URLs
  preview_pdf TEXT, -- Preview PDF URL
  isbn TEXT, -- ISBN number
  language TEXT DEFAULT 'English',
  tags TEXT[], -- Array of tags
  rating DECIMAL(3, 2) DEFAULT 0.0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create live_courses table
CREATE TABLE IF NOT EXISTS live_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  cover_image TEXT,
  instructor TEXT,
  duration_hours INTEGER,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  max_students INTEGER,
  enrolled_count INTEGER DEFAULT 0,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  live_link TEXT, -- Live class link (Zoom/Google Meet)
  platform_link TEXT, -- Platform where course is hosted
  instructor_bio TEXT, -- Instructor biography
  syllabus TEXT, -- Course syllabus
  requirements TEXT, -- Course requirements
  what_you_learn TEXT, -- What students will learn
  language TEXT DEFAULT 'English',
  level TEXT DEFAULT 'Beginner', -- Beginner, Intermediate, Advanced
  tags TEXT[], -- Array of tags
  rating DECIMAL(3, 2) DEFAULT 0.0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  user_name TEXT,
  product_type TEXT NOT NULL CHECK (product_type IN ('ebook', 'course')),
  product_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'sent',
  error_message TEXT
);

-- Create settings table for SMTP and Razorpay configuration
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ebooks_active ON ebooks(is_active);
CREATE INDEX IF NOT EXISTS idx_courses_active ON live_courses(is_active);
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(user_email);
CREATE INDEX IF NOT EXISTS idx_purchases_product ON purchases(product_type, product_id);
