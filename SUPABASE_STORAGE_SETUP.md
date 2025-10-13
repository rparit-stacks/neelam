# Supabase Storage Setup for Notes Feature

## 📁 Storage Bucket Configuration

### 1. Create Storage Bucket

Go to your Supabase dashboard → Storage → Create a new bucket:

**Bucket Name:** `notes`
**Public:** ✅ Yes (so users can download files)
**File size limit:** 10MB (adjust as needed)
**Allowed MIME types:** 
- `text/plain`
- `text/markdown`
- `application/msword`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### 2. Update Database Schema

Add these columns to your `notes` table:

```sql
-- Add file storage and additional columns to notes table
ALTER TABLE notes 
ADD COLUMN file_url TEXT,
ADD COLUMN file_size INTEGER,
ADD COLUMN cover_image TEXT,
ADD COLUMN author TEXT,
ADD COLUMN reading_time INTEGER;
```

### 3. Storage Policies

Create these RLS policies for the `notes` bucket:

```sql
-- Allow public read access to notes files
CREATE POLICY "Public can view notes files" ON storage.objects
FOR SELECT USING (bucket_id = 'notes');

-- Allow authenticated users to upload notes files
CREATE POLICY "Authenticated users can upload notes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'notes' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update notes files
CREATE POLICY "Authenticated users can update notes" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'notes' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete notes files
CREATE POLICY "Authenticated users can delete notes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'notes' 
  AND auth.role() = 'authenticated'
);
```

### 4. Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Features

### File Upload Support
- **Text files** (.txt)
- **Markdown files** (.md)
- **Word documents** (.doc, .docx)
- **File size limit:** 10MB
- **Automatic content extraction** from uploaded files

### Admin Interface
- **Toggle between** typing content and uploading files
- **Drag & drop** file upload
- **File preview** with name and size
- **Automatic filename** generation for storage
- **Content extraction** from uploaded files

### User Experience
- **Instant download** of notes
- **File format preservation** (.txt, .md, etc.)
- **Download count tracking**
- **Search and filter** by file content

## 📝 Usage

### For Admins:
1. Go to Admin Panel → Free Notes
2. Click "Add New Note"
3. Choose between "Type Content" or "Upload File"
4. If uploading: drag & drop or click to select file
5. File content will be automatically extracted and displayed
6. Fill in other details (title, topic, category, tags)
7. Save the note

### For Users:
1. Visit `/notes` page
2. Browse, search, or filter notes
3. Click "Download" to get the file
4. File downloads with original name and format

## 🔧 Technical Details

- **Storage:** Supabase Storage bucket `notes`
- **File Processing:** Client-side text extraction
- **Security:** RLS policies for public read, authenticated write
- **Performance:** Automatic file size limits and validation
- **Backup:** Files stored in Supabase with automatic backups

## 🛠️ Troubleshooting

### Common Issues:

1. **Upload fails:** Check file size (max 10MB) and format
2. **Permission denied:** Verify RLS policies are set correctly
3. **File not found:** Check if bucket exists and is public
4. **Content not extracted:** Ensure file is text-based format

### File Format Support:
- ✅ `.txt` - Plain text files
- ✅ `.md` - Markdown files  
- ✅ `.doc` - Microsoft Word (legacy)
- ✅ `.docx` - Microsoft Word (modern)
- ❌ `.pdf` - Not supported (binary format)
- ❌ Images - Not supported (use text files only)
