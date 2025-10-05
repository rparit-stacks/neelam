-- Insert sample ebooks
INSERT INTO ebooks (
  title, description, price, cover_image, author, pages, category, 
  preview_images, preview_pdf, isbn, language, tags, is_active
) VALUES
(
  'Complete React & Next.js Guide', 
  'Master modern React development with hooks, context, server components, and Next.js 14 App Router. Build production-ready applications with best practices and industry standards. Learn state management, routing, API integration, authentication, and deployment.',
  1299.00, 
  '/placeholder.svg?height=600&width=400', 
  'Neelu Mam', 
  450, 
  'Programming',
  ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600'],
  '/placeholder.pdf?query=React preview chapter',
  '978-1234567890',
  'English',
  ARRAY['React', 'Next.js', 'JavaScript', 'Web Development', 'Frontend'],
  true
),
(
  'JavaScript Mastery 2025', 
  'Deep dive into JavaScript ES6+, async programming, design patterns, and advanced concepts. From fundamentals to expert-level techniques. Master closures, promises, async/await, modules, and modern JavaScript features.',
  999.00, 
  '/placeholder.svg?height=600&width=400', 
  'Neelu Mam', 
  380, 
  'Programming',
  ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600'],
  '/placeholder.pdf?query=JavaScript sample chapter',
  '978-1234567891',
  'English',
  ARRAY['JavaScript', 'ES6', 'Programming', 'Web Development'],
  true
),
(
  'Full Stack Development Bible', 
  'Complete guide to building full-stack applications with React, Node.js, databases, authentication, deployment, and scaling strategies. Learn MongoDB, PostgreSQL, Redis, Docker, AWS, and production best practices.',
  1599.00, 
  '/placeholder.svg?height=600&width=400', 
  'Neelu Mam', 
  620, 
  'Web Development',
  ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600'],
  '/placeholder.pdf?query=Full stack preview',
  '978-1234567892',
  'English',
  ARRAY['Full Stack', 'React', 'Node.js', 'MongoDB', 'PostgreSQL', 'DevOps'],
  true
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample live courses
INSERT INTO live_courses (
  title, description, price, cover_image, instructor, duration_hours, 
  start_date, max_students, category, live_link, platform_link, 
  instructor_bio, syllabus, requirements, what_you_learn, language, level, tags, is_active
) VALUES
(
  'React Masterclass 2025', 
  'Live interactive sessions covering React 18+, hooks, performance optimization, testing, and building real-world projects. Includes code reviews and Q&A sessions with industry experts.',
  4999.00, 
  '/placeholder.svg?height=400&width=600', 
  'Neelu Mam', 
  40, 
  NOW() + INTERVAL '7 days', 
  50, 
  'Programming',
  'https://zoom.us/j/react-masterclass-2025',
  'https://learn.helloneelammaam.com/react-masterclass',
  'Neelu Mam is a senior software engineer with 10+ years of experience in React and modern web development. She has trained over 5000 students and worked with top tech companies.',
  'Week 1: React Fundamentals | Week 2: Hooks & State Management | Week 3: Performance & Testing | Week 4: Real-world Projects',
  'Basic JavaScript knowledge, Computer with internet connection, Code editor installed',
  'Build production-ready React applications, Master hooks and state management, Optimize performance, Write tests, Deploy to production',
  'English',
  'Intermediate',
  ARRAY['React', 'JavaScript', 'Frontend', 'Web Development', 'Live Course'],
  true
),
(
  'Node.js Backend Bootcamp', 
  'Build scalable backend applications with Node.js, Express, databases, authentication, APIs, and deployment. Live coding sessions with real-world projects and industry best practices.',
  5499.00, 
  '/placeholder.svg?height=400&width=600', 
  'Neelu Mam', 
  35, 
  NOW() + INTERVAL '14 days', 
  40, 
  'Backend',
  'https://meet.google.com/nodejs-bootcamp-2025',
  'https://learn.helloneelammaam.com/nodejs-bootcamp',
  'Neelu Mam specializes in backend development and has built scalable systems serving millions of users. Expert in Node.js, databases, and cloud architecture.',
  'Week 1: Node.js Basics & Express | Week 2: Databases & ORMs | Week 3: Authentication & Security | Week 4: APIs & Deployment',
  'JavaScript fundamentals, Understanding of HTTP, Basic command line knowledge',
  'Build RESTful APIs, Implement authentication, Work with databases, Deploy to cloud, Handle security best practices',
  'English',
  'Intermediate',
  ARRAY['Node.js', 'Backend', 'Express', 'API', 'Database', 'Live Course'],
  true
),
(
  'MERN Stack Complete Course', 
  'Comprehensive MERN stack bootcamp covering MongoDB, Express, React, Node.js with authentication, payments, and cloud deployment. Build 3 full-stack projects from scratch.',
  7999.00, 
  '/placeholder.svg?height=400&width=600', 
  'Neelu Mam', 
  60, 
  NOW() + INTERVAL '21 days', 
  30, 
  'Full Stack',
  'https://zoom.us/j/mern-stack-complete-2025',
  'https://learn.helloneelammaam.com/mern-complete',
  'Neelu Mam is a full-stack architect with expertise in MERN stack. She has built and deployed numerous production applications and mentored hundreds of developers.',
  'Module 1: MongoDB & Data Modeling | Module 2: Express & REST APIs | Module 3: React & State Management | Module 4: Integration & Deployment',
  'Basic programming knowledge, HTML/CSS basics, Willingness to learn',
  'Build complete MERN applications, Implement authentication & authorization, Integrate payment gateways, Deploy to production, Follow industry best practices',
  'English',
  'Beginner',
  ARRAY['MERN', 'MongoDB', 'Express', 'React', 'Node.js', 'Full Stack', 'Live Course'],
  true
)
ON CONFLICT (id) DO NOTHING;

-- Insert SMTP settings
INSERT INTO settings (key, value) VALUES
('smtp_host', 'smtp.hostinger.com'),
('smtp_port', '465'),
('smtp_user', 'support@helloneelammaam.com'),
('smtp_pass', 'Support23@8'),
('smtp_from_email', 'support@helloneelammaam.com'),
('smtp_from_name', 'Neelu Mam')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Insert Razorpay settings
INSERT INTO settings (key, value) VALUES
('razorpay_key_id', 'rzp_live_RHUNTjqsw8n4Mg'),
('razorpay_key_secret', 'S7IDlUhtkoaBuBZtanhnUkQN')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Note: Admin user must be created through Supabase Auth
-- Go to Supabase Dashboard > Authentication > Users > Add User
-- Email: admin@helloneelammaam.com
-- Password: Admin@2025
