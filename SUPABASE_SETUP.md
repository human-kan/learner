# Supabase + Google OAuth Setup

## What I Need from You

### 1. Supabase Project URL
Your Supabase project URL looks like:
`https://YOUR-PROJECT-ID.supabase.co`

Example: `https://nbyyvhhyhfzciqafadmn.supabase.co`

### 2. Google OAuth Credentials

To enable Google login, you need to:

1. Go to Google Cloud Console: https://console.cloud.google.com
2. Create a new project (or select existing)
3. Enable Google+ API
4. Go to "Credentials"
5. Create OAuth 2.0 Client ID
6. Set authorized redirect URIs:
   - `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
7. Copy:
   - **Client ID** (looks like: `xxx.apps.googleusercontent.com`)
   - **Client Secret**

### 3. Configure in Supabase

1. Go to your Supabase project: https://supabase.com/dashboard/project/YOUR-PROJECT-ID
2. Navigate to: **Authentication → Providers**
3. Enable **Google**
4. Paste Client ID and Client Secret
5. Save

---

## What I Have

✅ **Supabase Secret Key:** (configured in .env)  
✅ **Supabase Public Key (Anon):** (configured in .env)

---

## What I Need to Continue

Please provide:
1. **Supabase Project URL** (the full URL)
2. **Google OAuth Client ID** (after setting it up above)
3. **Google OAuth Client Secret** (after setting it up above)

OR

If you want me to set up Google OAuth for you, give me access to your Google Cloud Console.

---

**Let me know when you have these details!**
