import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

let supabaseAdmin: typeof import('@/lib/supabaseAdmin')['supabaseAdmin'];
let createInvite: typeof import('@/lib/invites')['createInvite'];
let fromSpy: ReturnType<typeof vi.spyOn> | undefined;

beforeAll(async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://stub.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'service-role-key';

  ({ supabaseAdmin } = await import('@/lib/supabaseAdmin'));
  ({ createInvite } = await import('@/lib/invites'));
  fromSpy = vi.spyOn(supabaseAdmin, 'from');
});

describe('createInvite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fromSpy?.mockReset();
  });

  afterAll(() => {
    fromSpy?.mockRestore();
  });

  it('creates a pending invite with token', async () => {
    const limitMock = vi.fn().mockResolvedValue({ data: [], error: null });
    const statusEqMock = vi.fn().mockReturnValue({ limit: limitMock });
    const emailEqMock = vi.fn().mockReturnValue({ eq: statusEqMock });
    const selectMock = vi.fn().mockReturnValue({ eq: emailEqMock });

    const insertSingleMock = vi.fn().mockResolvedValue({ data: { id: 'new-invite' }, error: null });
    const insertSelectMock = vi.fn().mockReturnValue({ single: insertSingleMock });
    const insertMock = vi.fn().mockReturnValue({ select: insertSelectMock });

    fromSpy!.mockImplementation(() => ({
      select: selectMock,
      insert: insertMock,
    }) as unknown as ReturnType<typeof supabaseAdmin.from>);

    const result = await createInvite({
      email: 'user@example.com',
      role: 'member',
      expiresInDays: 7,
      actorId: 'actor-1',
    });

    expect(result.id).toBe('new-invite');
    expect(result.token).toMatch(/[a-f0-9]{48}/i);
  });

  it('rejects when pending invite exists', async () => {
    const limitMock = vi.fn().mockResolvedValue({ data: [{ id: 'pending' }], error: null });
    const statusEqMock = vi.fn().mockReturnValue({ limit: limitMock });
    const emailEqMock = vi.fn().mockReturnValue({ eq: statusEqMock });
    const selectMock = vi.fn().mockReturnValue({ eq: emailEqMock });

    fromSpy!.mockImplementation(() => ({
      select: selectMock,
    }) as unknown as ReturnType<typeof supabaseAdmin.from>);

    await expect(
      createInvite({ email: 'user@example.com', role: 'staff', expiresInDays: 7, actorId: 'actor-1' }),
    ).rejects.toThrow(/already exists/i);
  });
});
