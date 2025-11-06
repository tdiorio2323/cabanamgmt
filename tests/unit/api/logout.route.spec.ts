import { describe, expect, test, vi } from "vitest";

vi.mock("@/lib/supabaseBrowser", () => ({
  supabaseBrowser: () => ({
    auth: {
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  }),
}));

describe("POST /api/auth/logout", () => {
  test("POST clears session", async () => {
    const mod = await import("@/app/api/auth/logout/route");
    const res = await mod.POST();
    expect(res.status).toBeLessThan(400);
  });
});
