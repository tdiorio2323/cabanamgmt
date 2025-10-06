# API Key Security Setup Guide

## ✅ What I've Done

1. **Secured your exposed keys**: Moved real API keys from `.env.local` to a backup file
2. **Updated .gitignore**: Added `.api-keys-backup.txt` to prevent accidental commits
3. **Created templates**: Updated `.env.example` with all required environment variables
4. **Replaced with placeholders**: Your `.env.local` now has safe placeholder values

## 🚨 IMMEDIATE ACTION REQUIRED

### Step 1: Secure Your Keys

- Your actual API keys are temporarily stored in `.api-keys-backup.txt`
- **Copy these keys to a secure password manager IMMEDIATELY**
- **Delete `.api-keys-backup.txt` after securing the keys**

### Step 2: Rotate Your API Keys (CRITICAL)

Since these keys may have been exposed, rotate them immediately:

#### OpenAI API Key

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Delete the old key: `sk-svcacct-B7lIZw1y-jwf8usO...`
3. Create a new key
4. Update your `.env.local` with the new key

#### Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Delete the old key: `AIzaSyDSqhuu4VKRT3lfn-OuF4N1VmrOXy7IltA`
3. Create a new key
4. Update your `.env.local` with the new key

### Step 3: Update Your Environment

Replace the placeholder values in `.env.local` with your new, secure keys:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your_new_openai_key_here

# Gemini API Configuration
GEMINI_API_KEY=your_new_gemini_key_here
```

## 🔒 Best Practices Going Forward

1. **Never commit real API keys** - They're already in `.gitignore`
2. **Use environment-specific keys**:
   - Development: Test/sandbox keys
   - Production: Live keys with restricted permissions
3. **Regular key rotation**: Rotate keys every 90 days
4. **Use key restrictions**: Limit API keys by IP, domain, or usage quotas when possible
5. **Monitor usage**: Set up alerts for unusual API usage

## 🧪 For Development

Your Supabase keys are already configured. For other services, you can:

- Keep using mock keys for initial development
- Replace with real test keys when testing integrations
- Use the `.env.example` template for new team members

## 📝 Team Setup

When other developers join:

1. They copy `.env.example` to `.env.local`
2. You provide them with development API keys (never share production keys)
3. They never commit their `.env.local` file
