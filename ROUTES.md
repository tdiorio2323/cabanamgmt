# Route Inventory

Generated 2025-10-14T01:06:35Z via `pnpm dlx tsx`.

| Route file | Tests present | Helper / notes |
| --- | --- | --- |
| src/app/page.tsx | None | Add smoke test for landing layout |
| src/app/confirmation/page.tsx | None | Document confirmation scenarios |
| src/app/contracts/page.tsx | None | Link with Supabase contract helper |
| src/app/debug/page.tsx | None | Low priority admin tool |
| src/app/deposit/page.tsx | None | Cover deposit form states |
| src/app/deposits/page.tsx | None | Consider table render test |
| src/app/health/page.tsx | None | Integration heartbeat check |
| src/app/intake/page.tsx | None | Complex flow, prioritise e2e coverage |
| src/app/interview/page.tsx | None | Mock scheduling API |
| src/app/learn/page.tsx | None | Static copy review only |
| src/app/login/page.tsx | None | Add auth success/error tests |
| src/app/logout/page.tsx | Yes `__tests__/pages/logout.page.spec.tsx` | Mocks Supabase sign-out + router |
| src/app/screening/page.tsx | None | Requires screening API stubs |
| src/app/reset-password/page.tsx | None | Form validation tests needed |
| src/app/signup/page.tsx | None | Happy/validation path tests |
| src/app/verify/page.tsx | None | Needs Supabase verification helper |
| src/app/vetting/page.tsx | None | Pending automation |
| src/app/admin/codes/page.tsx | None | Ensure code management coverage |
| src/app/(dash)/dashboard/page.tsx | None | Snapshot layout shell |
| src/app/debug/session/page.tsx | None | Low priority dev tool |
| src/app/invite/[code]/page.tsx | None | Add invite validation helper |
| src/app/vip/[code]/page.tsx | None | Mock VIP redemption |
| src/app/(dash)/invites/resend/page.tsx | None | UI test should reuse resend logic |
| src/app/(dash)/invites/revoke/page.tsx | None | UI test should cover revoke flow |
| src/app/(dash)/dashboard/activity/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/analytics/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/api/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/audit/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/bookings/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/calendar/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/codes/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/contracts/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/deposits/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/documents/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/environment/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/invoices/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/media/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/moderation/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/payments/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/payouts/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/portfolio/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/invite/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/rooms/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/settings/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/signatures/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/support/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/system/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/users/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/vetting/page.tsx | None | Add component/unit coverage |
| src/app/(dash)/dashboard/users/[id]/page.tsx | None | Add component/unit coverage |

Shared helper backlog:
- `src/lib/testing/dashboard.ts` for seeded dashboard data
- `src/lib/testing/supabase.ts` for Supabase client mocks
