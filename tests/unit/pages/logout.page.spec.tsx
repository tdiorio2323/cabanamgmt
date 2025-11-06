import { render, screen } from "@testing-library/react";
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

describe("Logout page", () => {
  test("renders logout confirmation", async () => {
    const Page = (await import("@/app/logout/page")).default;
    render(<Page />);
    expect(screen.getByText(/logged out/i)).toBeTruthy();
  });
});
