'use client';

import RevokeInviteForm from '@/components/Invites/RevokeInviteForm';

export default function RevokeInvitePage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Revoke Invite</h1>
      <p className="text-sm text-white/70">
        Remove a pending invitation by its ID or recipient email. Accepted or revoked invites remain unchanged.
      </p>
      <RevokeInviteForm />
    </main>
  );
}
