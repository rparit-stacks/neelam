-- Database Migration for Paid Notes Feature
-- Run this SQL in your Supabase SQL Editor

-- Step 1: Add payment_type column
ALTER TABLE public.notes 
ADD COLUMN IF NOT EXISTS payment_type VARCHAR(10) DEFAULT 'free';

-- Step 2: Add price column
ALTER TABLE public.notes 
ADD COLUMN IF NOT EXISTS price INTEGER NULL;

-- Step 3: Add cover_image column
ALTER TABLE public.notes 
ADD COLUMN IF NOT EXISTS cover_image TEXT NULL;

-- Step 4: Add author column
ALTER TABLE public.notes 
ADD COLUMN IF NOT EXISTS author VARCHAR(255) NULL;

-- Step 5: Add reading_time column
ALTER TABLE public.notes 
ADD COLUMN IF NOT EXISTS reading_time INTEGER NULL;

-- Step 6: Update existing notes to have payment_type = 'free'
UPDATE public.notes 
SET payment_type = 'free' 
WHERE payment_type IS NULL;

-- Step 7: Create index for better performance
CREATE INDEX IF NOT EXISTS idx_notes_payment_type ON public.notes USING btree (payment_type);

-- Step 8: Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'notes' 
AND table_schema = 'public'
ORDER BY ordinal_position;
