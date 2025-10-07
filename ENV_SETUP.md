# Environment Variables Setup Guide

## Required Configuration

Create a `.env.local` file in the `neelam` directory with the following variables:

### 1. Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE=your_service_role_key_if_needed
```

**Where to get these:**
1. Go to your Supabase project dashboard
2. Click on Settings → API
3. Copy the "Project URL" and "anon/public" key

---

### 2. Razorpay Configuration
```env
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

**Where to get these:**
1. Login to Razorpay Dashboard
2. Go to Settings → API Keys
3. Generate or copy your Key ID and Secret

---

### 3. SMTP Email Configuration

#### Option A: Gmail (Recommended for testing)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
SMTP_FROM_NAME=Neelam Academy
SMTP_FROM_EMAIL=your_email@gmail.com
```

**Gmail Setup Steps:**
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to https://myaccount.google.com/apppasswords
4. Generate a new App Password
5. Use that 16-character password as `SMTP_PASS`

#### Option B: SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=465
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
SMTP_FROM_NAME=Neelam Academy
SMTP_FROM_EMAIL=verified_sender@yourdomain.com
```

#### Option C: Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=465
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your_mailgun_password
SMTP_FROM_NAME=Neelam Academy
SMTP_FROM_EMAIL=noreply@yourdomain.com
```

#### Option D: Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
SMTP_FROM_NAME=Neelam Academy
SMTP_FROM_EMAIL=your_email@outlook.com
```

---

## Complete .env.local Example

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# SMTP (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=yourname@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM_NAME=Neelam Academy
SMTP_FROM_EMAIL=yourname@gmail.com
```

---

## Troubleshooting Email Issues

If emails are not sending, check:

1. **Configuration Missing**: Check terminal logs for `[Email] SMTP configuration missing`
2. **Connection Failed**: Verify your SMTP credentials are correct
3. **Gmail Issues**: 
   - Make sure 2-Step Verification is enabled
   - Use App Password, not your regular password
   - Allow "Less secure app access" if needed
4. **Port Issues**: Try port 587 with `secure: false` if 465 doesn't work
5. **Firewall**: Ensure your firewall allows SMTP connections

**Check logs in terminal** - The email system now provides detailed logging to help diagnose issues.

---

## Testing Email

After configuration:
1. Restart your dev server: `npm run dev`
2. Go to Admin Panel → Email System
3. Try sending a test email
4. Check terminal for detailed logs
5. Check console for any error messages

---

## Security Notes
---

## Supabase Storage (for uploads on Vercel)

Create a bucket named `uploads` (public):
1. Supabase Dashboard → Storage → Create Bucket → Name: uploads → Public
2. Optionally add folders like `covers`, `files` in the dashboard (or they will be created on first upload)

Environment variables already used:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

No extra vars needed for public uploads. If you want to write server-side with service role, set:
```env
SUPABASE_SERVICE_ROLE=your_service_role
```
and update server client creation to use it. Currently, we use the anon key with SSR and public bucket writes allowed via Storage policies.

Storage Policy (SQL): Allow authenticated inserts to `uploads` bucket
```sql
-- In Supabase SQL editor
begin;
create policy "Allow uploads to uploads bucket" on storage.objects
for insert to authenticated
with check ( bucket_id = 'uploads' );
commit;
```

If you want anonymous uploads from SSR, you can permit via Edge Function/JWT or keep using authenticated SSR context.

- ⚠️ Never commit `.env.local` to git
- ✅ Keep your API keys secret
- ✅ Use App Passwords for Gmail (never use your actual password)
- ✅ Use test keys during development
- ✅ Switch to live keys only in production
