'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

const InviteFormSchema = z.object({
  email: z.string().email(),
  role: z.enum(['member', 'staff', 'admin']).default('member'),
  expiresInDays: z.number().int().min(1).max(60).default(7),
  message: z.string().max(500).optional(),
});

type FormState = z.infer<typeof InviteFormSchema>;

const defaultForm: FormState = {
  email: '',
  role: 'member',
  expiresInDays: 7,
  message: undefined,
};

export default function CreateInviteForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => ({ ...defaultForm }));
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const [message, setMessage] = useState('');

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = InviteFormSchema.safeParse({
      email: form.email,
      role: form.role,
      expiresInDays: Number(form.expiresInDays),
      message: form.message?.trim() ? form.message : undefined,
    });

    if (!parsed.success) {
      const error = parsed.error.issues[0]?.message ?? 'Invalid form input.';
      setStatus('err');
      setMessage(error);
      toast.error(error);
      return;
    }

    try {
      setStatus('loading');
      setMessage('');

      const response = await fetch('/api/invites/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = typeof payload?.error === 'string' ? payload.error : 'Unable to create invite.';
        setStatus('err');
        setMessage(error);
        toast.error(error);
        return;
      }

      setStatus('ok');
      setMessage('Invite created');
      setForm({ ...defaultForm });
      toast.success('Invite created successfully.');
      router.refresh();
    } catch (error) {
      console.error('Create invite failed:', error);
      setStatus('err');
      setMessage('Unexpected error creating invite.');
      toast.error('Unexpected error creating invite.');
    } finally {
      setStatus((current) => (current === 'loading' ? 'idle' : current));
    }
  }

  const isSubmitting = status === 'loading';

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4" data-testid="create-form" noValidate>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-white/80">Recipient email</span>
        <input
          className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-white shadow-inner focus:border-white/60 focus:outline-none focus:ring-0"
          type="email"
          placeholder="user@example.com"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          required
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-white/80">Role</span>
        <select
          className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-white focus:border-white/60 focus:outline-none focus:ring-0"
          value={form.role}
          onChange={(event) => updateField('role', event.target.value as FormState['role'])}
        >
          <option value="member">Member</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-white/80">Expires in (days)</span>
        <input
          className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-white shadow-inner focus:border-white/60 focus:outline-none focus:ring-0"
          type="number"
          min={1}
          max={60}
          value={form.expiresInDays}
          onChange={(event) => updateField('expiresInDays', Number(event.target.value))}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-white/80">Message (optional)</span>
        <textarea
          className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-white shadow-inner focus:border-white/60 focus:outline-none focus:ring-0"
          rows={3}
          value={form.message ?? ''}
          onChange={(event) => updateField('message', event.target.value)}
          maxLength={500}
        />
      </label>

      <button
        className="rounded-md bg-white px-4 py-2 font-medium text-black transition disabled:opacity-60"
        type="submit"
        disabled={isSubmitting}
        data-testid="create-submit"
      >
        {isSubmitting ? 'Creating…' : 'Create invite'}
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
