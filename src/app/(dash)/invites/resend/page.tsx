'use client';

import ResendInviteForm from '@/components/Invites/ResendInviteForm';

export default function ResendInvitePage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Resend Invite</h1>
      <p className="text-sm text-white/70">
        Send a fresh invitation link to an existing contact. Recent sends (under 15 minutes) are blocked to
        prevent accidental spam.
      </p>
      <ResendInviteForm />
    </main>
  );
}
