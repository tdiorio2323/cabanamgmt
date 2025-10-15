'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

const FormSchema = z.object({
  email: z.string().email(),
});

type FormStatus = 'idle' | 'loading' | 'ok' | 'err';

export default function ResendInviteForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState<string>('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = FormSchema.safeParse({ email });
    if (!parsed.success) {
      setStatus('err');
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      setStatus('loading');
      setMessage('');

      const response = await fetch('/api/invites/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: parsed.data.email }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const error = typeof payload?.error === 'string' ? payload.error : 'Unable to resend invite.';
        setStatus('err');
        setMessage(error);
        toast.error(error);
        return;
      }

      setStatus('ok');
      setMessage('Invite resent successfully.');
      setEmail('');
      toast.success('Invite email queued for delivery.');
      router.refresh();
    } catch (error) {
      console.error('Resend invite failed:', error);
      setStatus('err');
      setMessage('Unexpected error resending invite. Please try again.');
      toast.error('Unexpected error resending invite.');
    } finally {
      setStatus((current) => (current === 'loading' ? 'idle' : current));
    }
  }

  const isSubmitting = status === 'loading';

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-3" data-testid="resend-form" noValidate>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-white/80">Recipient email</span>
        <input
          className="mt-1 w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-white shadow-inner focus:border-white/60 focus:outline-none focus:ring-0"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="user@example.com"
          required
          aria-describedby="resend-help"
        />
      </label>
      <p id="resend-help" className="text-xs text-white/60">
        The recipient receives a fresh invitation link. Recent sends (within 15 minutes) are blocked.
      </p>
      <button
        className="rounded-md bg-white px-4 py-2 font-medium text-black transition disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
        data-testid="resend-submit"
      >
        {isSubmitting ? 'Sending…' : 'Resend invite'}
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
