'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

const RevokeSchema = z
  .object({
    id: z.string().uuid().optional(),
    email: z.string().email().optional(),
  })
  .refine((value) => Boolean(value.id || value.email), {
    message: 'Provide an invite ID or email address.',
  });

export default function RevokeInviteForm() {
  const router = useRouter();
  const [inviteId, setInviteId] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = RevokeSchema.safeParse({
      id: inviteId.trim() || undefined,
      email: email.trim() || undefined,
    });

    if (!parsed.success) {
      const error = parsed.error.issues[0]?.message ?? 'Invalid request';
      setStatus('err');
      setMessage(error);
      toast.error(error);
      return;
    }

    try {
      setStatus('loading');
      setMessage('');

      const response = await fetch('/api/invites/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = typeof payload?.error === 'string' ? payload.error : 'Failed to revoke invite.';
        setStatus('err');
        setMessage(error);
        toast.error(error);
        return;
      }

      setStatus('ok');
      setMessage('Invite revoked');
      setInviteId('');
      setEmail('');
      toast.success('Invite revoked successfully.');
      router.refresh();
    } catch (error) {
      console.error('Revoke invite failed:', error);
      setStatus('err');
      setMessage('Unexpected error revoking invite.');
      toast.error('Unexpected error revoking invite.');
    } finally {
      setStatus((current) => (current === 'loading' ? 'idle' : current));
    }
  }

  const isSubmitting = status === 'loading';

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-3" data-testid="revoke-form" noValidate>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-white/80">Invite ID (optional)</span>
        <input
          className="mt-1 w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-white shadow-inner focus:border-white/60 focus:outline-none focus:ring-0"
          value={inviteId}
          onChange={(event) => setInviteId(event.target.value)}
          placeholder="00000000-0000-0000-0000-000000000000"
          data-testid="revoke-id"
        />
      </label>
      <p className="text-xs text-white/60">or</p>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-white/80">Email (optional)</span>
        <input
          className="mt-1 w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-white shadow-inner focus:border-white/60 focus:outline-none focus:ring-0"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="user@example.com"
          data-testid="revoke-email"
        />
      </label>
      <button
        type="submit"
        className="rounded-md bg-white px-4 py-2 font-medium text-black transition disabled:opacity-60"
        disabled={isSubmitting}
        data-testid="revoke-submit"
      >
        {isSubmitting ? 'Revoking…' : 'Revoke invite'}
      </button>
      <p
        role="status"
        aria-live="polite"
        className={`min-h-[1.25rem] text-sm ${status === 'err' ? 'text-red-400' : 'text-emerald-300'}`}
      >
        {message}
      </p>
    </form>
  );
}
