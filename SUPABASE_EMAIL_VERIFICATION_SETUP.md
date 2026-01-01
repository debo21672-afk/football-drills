# Supabase Email Verification Setup

## ⚠️ IMPORTANT: Configure Email Verification in Supabase Dashboard

To enforce email verification, you need to configure this in your Supabase dashboard:

### Steps:

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `aoovdibpkpoqjkxjzbqg`
3. **Navigate to**: Authentication → Settings
4. **Find "Enable email confirmations"** and toggle it **ON**
5. **Save changes**

### What This Does:

- ✅ Prevents users from logging in until they verify their email
- ✅ Sends automatic verification emails on signup
- ✅ Sets `email_confirmed_at` field when user clicks verification link

### Code Changes Already Made:

✅ **useAuth.tsx** - Added email verification check in `signIn()` function
- Checks if `email_confirmed_at` exists
- Signs out user immediately if email not verified
- Returns clear error message

✅ **Auth.tsx** - Added email verification screen
- Shows after successful signup
- Clear instructions for users
- Warning about verification requirement

### Testing:

1. **Sign up** with a new email
2. You should see the "Verify Your Email" screen
3. **Try to login** before verifying → should show error
4. **Click verification link** in email
5. **Login** → should work now

### Email Template Customization (Optional):

To customize the verification email template:
1. Go to: Authentication → Email Templates
2. Edit the "Confirm signup" template
3. Customize the subject, content, and styling

---

**Note**: Google OAuth users are automatically verified, so they can login immediately without email verification.
