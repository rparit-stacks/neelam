# Fix for Notes Payment Error

## Problem
Error: Database error: new row for relation "purchases" violates check constraint "purchases_product_type_check"

## Root Cause
The `purchases` table has a check constraint that only allows `product_type` values of 'ebook' and 'course', but not 'note'.

## Solution

### Step 1: Update Database Constraint
Run this SQL in your Supabase SQL Editor:

```sql
-- Drop the existing constraint
ALTER TABLE public.purchases DROP CONSTRAINT IF EXISTS purchases_product_type_check;

-- Add the new constraint that includes "note"
ALTER TABLE public.purchases ADD CONSTRAINT purchases_product_type_check 
CHECK (product_type IN ('ebook', 'course', 'note'));

-- Verify the constraint
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'purchases_product_type_check';
```

### Step 2: Code Changes Made
1. **API Route Fixed**: Removed the conditional logic for product_type
2. **Error Logging Improved**: Added better error logging for debugging
3. **Types Updated**: Purchase interface already supports "note" type

### Step 3: Test the Fix
1. Try to purchase a paid note
2. Check if the order is created successfully
3. Verify payment flow works

## Files Modified
- `app/api/orders/create/route.ts` - Fixed product_type handling
- `app/checkout/page.tsx` - Improved error logging
- `database-constraint-fix.sql` - SQL script to fix constraint

## Verification
After running the SQL, you should be able to:
1. Create paid notes in admin panel
2. Purchase notes through checkout
3. See purchase records in admin dashboard

## Notes
- The constraint now allows: 'ebook', 'course', 'note'
- All existing functionality remains intact
- No data migration required




