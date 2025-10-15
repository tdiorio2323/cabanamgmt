import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

vi.mock("@/lib/supabaseBrowser", () => ({
  supabaseBrowser: () => ({
    auth: {
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Topbar", () => {
  test("renders without crash", async () => {
    const Topbar = (await import("@/components/layout/Topbar")).default;
    const { container } = render(<Topbar />);
    expect(container.firstChild).toBeTruthy();
  });
});
