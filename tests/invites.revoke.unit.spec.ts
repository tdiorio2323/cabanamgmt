import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

let supabaseAdmin: typeof import('@/lib/supabaseAdmin')['supabaseAdmin'];
let revokeInvite: typeof import('@/lib/invites')['revokeInvite'];
let fromSpy: ReturnType<typeof vi.spyOn> | undefined;

beforeAll(async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://stub.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'service-role-key';

  ({ supabaseAdmin } = await import('@/lib/supabaseAdmin'));
  ({ revokeInvite } = await import('@/lib/invites'));
  fromSpy = vi.spyOn(supabaseAdmin, 'from');
});

describe('revokeInvite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fromSpy?.mockReset();
  });

  afterAll(() => {
    fromSpy?.mockRestore();
  });

  it('revokes pending invite by id', async () => {
    const updateChain = {
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({ data: [{ id: '1' }], error: null }),
    };

    const builder = {
      update: vi.fn().mockReturnValue(updateChain),
    } as unknown as ReturnType<typeof supabaseAdmin.from>;

    fromSpy!.mockImplementationOnce(() => builder);

    const count = await revokeInvite({ id: '00000000-0000-0000-0000-000000000000' });
    expect(count).toBe(1);
    expect(updateChain.select).toHaveBeenCalled();
  });

  it('throws when neither id nor email provided', async () => {
    await expect(revokeInvite({})).rejects.toThrow(/provide invite id or email/i);
  });

  it('propagates errors from supabase', async () => {
    const failingChain = {
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({ data: null, error: new Error('boom') }),
    };

    const builder = {
      update: vi.fn().mockReturnValue(failingChain),
    } as unknown as ReturnType<typeof supabaseAdmin.from>;

    fromSpy!.mockImplementationOnce(() => builder);

    await expect(revokeInvite({ email: 'user@example.com' })).rejects.toThrow(/boom/);
  });
});
