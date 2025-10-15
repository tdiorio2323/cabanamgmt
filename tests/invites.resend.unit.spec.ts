import { describe, expect, it, vi, beforeEach, afterAll, beforeAll } from 'vitest';

let supabaseAdmin: typeof import('@/lib/supabaseAdmin')['supabaseAdmin'];
let resendInvite: typeof import('@/lib/invites')['resendInvite'];
let fromSpy: ReturnType<typeof vi.spyOn> | undefined;

beforeAll(async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://stub.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'service-role-key';

  ({ supabaseAdmin } = await import('@/lib/supabaseAdmin'));
  ({ resendInvite } = await import('@/lib/invites'));
  fromSpy = vi.spyOn(supabaseAdmin, 'from');
});

const buildSelectBuilder = (override?: Partial<ReturnType<typeof createSelectBuilder>>) =>
  Object.assign(createSelectBuilder(), override);

function createSelectBuilder() {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  };
}

const buildInsertBuilder = () => ({
  select: vi.fn().mockReturnValue({
    single: vi.fn().mockResolvedValue({
      data: { id: 'invite-id', code: 'CABANA-AAAA-BBBB' },
      error: null,
    }),
  }),
});

describe('resendInvite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fromSpy?.mockReset();
  });

  afterAll(() => {
    fromSpy?.mockRestore();
  });

  it('creates a new invite when allowed', async () => {
    const selectBuilder = buildSelectBuilder();
    const insertBuilder = buildInsertBuilder();

    fromSpy!.mockImplementationOnce(() => ({
      ...selectBuilder,
      insert: vi.fn(() => insertBuilder),
    })).mockImplementationOnce(() => ({
      ...selectBuilder,
      insert: vi.fn(() => insertBuilder),
    }));

    const result = await resendInvite({ email: 'user@example.com', actorId: 'actor-1' });

    expect(result.id).toBe('invite-id');
    expect(result.code).toMatch(/CABANA-/);
    expect(insertBuilder.select).toHaveBeenCalled();
  });

  it('throws when invite was recently sent', async () => {
    const recentBuilder = buildSelectBuilder({
      maybeSingle: vi.fn().mockResolvedValue({
        data: { created_at: new Date().toISOString(), role: 'client', uses_allowed: 1, note: null },
        error: null,
      }),
    });

    fromSpy!.mockImplementationOnce(() => ({
      ...recentBuilder,
      insert: vi.fn(() => buildInsertBuilder()),
    }));

    await expect(resendInvite({ email: 'user@example.com', actorId: 'actor-1' })).rejects.toThrow(
      /recently sent/i,
    );
  });
});
