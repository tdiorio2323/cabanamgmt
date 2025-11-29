# Enable Demo Mode on Vercel

## Steps:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add new variable:
   - Name: NEXT_PUBLIC_DEMO_MODE
   - Value: true
   - Environment: Production (or create a separate Preview deployment)
3. Click "Save"
4. Go to Deployments → Click "..." → "Redeploy"

## Result:
- https://cabanagrp.com will redirect to /demo automatically
- No login screen will appear
- Full navigation access granted
- All external services disabled
- Demo data displayed

## WARNING:
This will make your production site publicly accessible without authentication.
Only do this if you want to show the demo to your partner using the live URL.

## Better Option:
Create a separate Vercel deployment just for demo:
- Deploy from the demo branch
- Use a custom domain like demo.cabanagrp.com
- Keep main production secure
