# User Invitation Guide

Complete guide for inviting new users to Cabana and ensuring they can sign up successfully.

## ✅ Quick Steps

1. **Create invitation** in admin dashboard
2. **Copy invite link**
3. **Send link** to the user
4. **User clicks link** → automatically redirected to signup
5. **User creates account** → invitation automatically redeemed
6. **User redirected** to dashboard

---

## Step-by-Step Process

### 1. Create the Invitation (Admin)

**Navigate to Invite Codes Page**:
```
http://localhost:3002/dashboard/invite
```
(Or your production URL: `https://your-domain.com/dashboard/invite`)

**Fill out the form**:

| Field | What to Enter | Notes |
|-------|---------------|-------|
| **Target email** | `jane@example.com` | Optional but recommended - links invite to specific email |
| **Custom code** | Leave blank or `JANE2025` | Auto-generated if blank (e.g., `CABANA-A3F2-B8D1`) |
| **Role** | `creator` | Options: `creator` (talent), `client` (booking), `admin` |
| **Uses allowed** | `1` or `5` | How many times this code can be used |
| **Valid for (days)** | `30` | Expiration period |
| **Note** | `Jane Doe - Oct 2025` | Internal note for tracking |

**Click "Create Invite"**

✅ Invitation will appear in the list below

### 2. Copy the Invite Link

**Find the invitation** in the list

**Click the Copy button** (📋 icon) next to the invitation

This copies a link like:
```
http://localhost:3002/invite/CABANA-A3F2-B8D1
```

### 3. Send the Invitation

**Email Template**:
```
Subject: Your Invitation to Join Cabana

Hi [Name],

You've been invited to join Cabana! Click the link below to create your account:

[INVITE LINK]

The invitation expires in 30 days.

Best,
Cabana Team
```

**Text Message Template**:
```
You've been invited to Cabana! Create your account here: [INVITE LINK] (expires in 30 days)
```

### 4. User Experience (What Happens Next)

**When the user clicks the invite link:**

1. **If NOT logged in** (new user):
   - ✅ Automatically redirected to `/signup?code=CABANA-A3F2-B8D1`
   - Sees "Valid invitation code!" message
   - Fills out signup form (name, email, password)
   - Clicks "Create Account"
   - ✅ Account created + invitation automatically redeemed
   - ✅ Redirected to `/dashboard`

2. **If already logged in** (existing user):
   - ✅ Invitation immediately redeemed
   - ✅ Redirected to `/dashboard`
   - Sees success message

---

## Invitation Status Tracking

### In the Dashboard

The invitation card shows:
- **Code**: `CABANA-A3F2-B8D1`
- **Role badge**: Creator/Client/Admin
- **Email**: If specified
- **Uses**: `3/5` (remaining/total)
- **Expires**: `Nov 8, 2025`
- **Note**: Your internal note

### Stats Overview

Top of the page shows:
- **Total Invites**: All created
- **Active**: Not expired, has uses remaining
- **Expired**: Past expiration date
- **Used Up**: No uses remaining

---

## Troubleshooting

### Problem: User says "Invalid invitation code"

**Causes**:
- ✅ Code expired (past expiration date)
- ✅ Code depleted (all uses consumed)
- ✅ User already redeemed this code

**Solutions**:
1. Check invitation status in dashboard
2. If expired/depleted: Create a new invitation
3. If already redeemed: User should login instead

### Problem: User can't find signup button

**Solution**: The invite link automatically redirects to signup for new users. They should just click the link you sent.

### Problem: Invitation not working after signup

**Likely cause**: User manually went to `/signup` instead of using the invite link

**Solution**:
1. Send them the invite link again
2. Tell them to **click the link** (don't manually type the signup URL)

### Problem: User gets "already_redeemed" error

**Cause**: User already used this invitation code

**Solution**: They should login to their existing account at `/login`

---

## API Endpoints (Technical Reference)

### Create Invitation
```
POST /api/invites/create
Body: { email?, role, uses, days, note?, code? }
Auth: Admin only
```

### Validate Invitation
```
GET /api/invites/validate?code=CABANA-XXX
Returns: { valid: true/false, invite: {...} }
Public endpoint (no auth required)
```

### Accept Invitation
```
POST /api/invites/accept
Body: { code }
Auth: Required (user must be logged in)
```

### List Invitations
```
POST /api/invites/list
Returns: { invites: [...] }
Auth: Admin only
```

### Revoke Invitation
```
POST /api/invites/revoke
Body: { id }
Auth: Admin only
```

---

## Database Schema

### `invites` table
```sql
- id (uuid)
- code (text, unique) - e.g., "CABANA-A3F2-B8D1"
- email (text, nullable) - Optional target email
- role (text) - "creator", "client", or "admin"
- uses_allowed (int) - Total uses permitted
- uses_remaining (int) - Remaining uses
- expires_at (timestamptz) - Expiration date
- note (text, nullable) - Internal note
- created_by (uuid) - Admin who created it
- created_at (timestamptz)
```

### `invite_redemptions` table
```sql
- id (uuid)
- invite_id (uuid) - FK to invites
- user_id (uuid) - FK to auth.users
- ip (text, nullable)
- user_agent (text, nullable)
- redeemed_at (timestamptz)
```

---

## Security Features

✅ **Role-based access**: Only admins can create invitations
✅ **Expiration**: Invitations auto-expire after configured days
✅ **Usage limits**: Prevent unlimited use of single code
✅ **One redemption per user**: Users can't redeem same code twice
✅ **IP & User Agent tracking**: Audit trail for redemptions
✅ **Email validation**: Optionally lock invitation to specific email

---

## Best Practices

1. **Use specific emails** when inviting individual users
2. **Set uses=1** for single-user invitations
3. **Use meaningful notes** for tracking (e.g., "Jane Doe - Oct 2025 Creator")
4. **Set appropriate expiration** (7 days for urgent, 30 days standard)
5. **Monitor usage** via the dashboard stats
6. **Revoke immediately** if invitation is compromised
7. **Don't share codes publicly** - send to specific recipients only

---

## Example Workflow

**Scenario**: Inviting a new creator "Jane Doe"

1. ✅ Admin goes to `/dashboard/invite`
2. ✅ Fills form:
   - Email: `jane.doe@gmail.com`
   - Role: `creator`
   - Uses: `1`
   - Days: `7`
   - Note: `Jane Doe - Creator - Oct 2025`
3. ✅ Clicks "Create Invite"
4. ✅ Copies link: `http://cabana.com/invite/CABANA-J4N3-D03`
5. ✅ Sends email to Jane
6. ✅ Jane clicks link
7. ✅ Auto-redirected to signup with code pre-applied
8. ✅ Jane creates account
9. ✅ Invitation automatically redeemed
10. ✅ Jane lands in dashboard as "creator" role
11. ✅ Admin sees invitation status updated: `0/1 uses remaining`

---

## Related Files

- **Admin UI**: `src/app/(dash)/dashboard/invite/page.tsx`
- **Signup Page**: `src/app/signup/page.tsx`
- **Invite Redirect**: `src/app/invite/[code]/page.tsx`
- **Create API**: `src/app/api/invites/create/route.ts`
- **Accept API**: `src/app/api/invites/accept/route.ts`
- **Validate API**: `src/app/api/invites/validate/route.ts`
