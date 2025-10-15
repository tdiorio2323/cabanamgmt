# Manual QA Checklist

Use this list for release candidates. Capture pass/fail, tester initials, and date for each item.

## Authentication
- [ ] Sign in with valid admin credentials
- [ ] Invalid credentials show error toast
- [ ] Password reset email triggers from `/reset-password`

## Invites
- [ ] Create invite from dashboard and verify email appears in list
- [ ] Resend invite updates timestamp without duplicating entry
- [ ] Revoke invite removes access token and updates status

## Onboarding
- [ ] New user completes intake flow (`/intake`) and reaches dashboard
- [ ] Screening form submits and records profile data
- [ ] Contract signing flow renders and uploads signature assets

## Logout & Session
- [ ] Logout button clears session and redirects to `/login`
- [ ] Expired session redirects to `/login` after refresh

## Navigation
- [ ] Sidebar links route to every dashboard section without errors
- [ ] Topbar user menu opens and triggers logout
- [ ] Mobile nav collapses/expands correctly

## Error States
- [ ] Missing route returns branded 404 page
- [ ] API failure banners surface retry actions
