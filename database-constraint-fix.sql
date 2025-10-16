-- Fix for purchases table constraint to allow "note" product type
-- Run this SQL in your Supabase SQL Editor

-- Step 1: Drop the existing constraint
ALTER TABLE public.purchases DROP CONSTRAINT IF EXISTS purchases_product_type_check;

-- Step 2: Add the new constraint that includes "note"
ALTER TABLE public.purchases ADD CONSTRAINT purchases_product_type_check 
CHECK (product_type IN ('ebook', 'course', 'note'));

-- Step 3: Verify the constraint
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'purchases_product_type_check';




