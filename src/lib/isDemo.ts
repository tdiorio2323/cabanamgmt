/**
 * Demo Mode Detection Helper
 *
 * Returns true when ANY of the following is true:
 * - NEXT_PUBLIC_DEMO_MODE env var is 'true'
 * - Current pathname starts with /partner-demo
 * - Current pathname starts with /demo
 * - URL has ?demo=1 query param
 *
 * Use this helper everywhere to ensure consistent demo behavior
 * between local dev and production.
 */

/**
 * Check if demo mode based on request details (pathname and query params)
 * Use in middleware, server components, and API routes
 */
export function isDemoRequest(pathname: string, searchParams?: URLSearchParams): boolean {
  // Check environment variable
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return true;
  }

  // Check pathname
  if (pathname.startsWith('/partner-demo') || pathname.startsWith('/demo')) {
    return true;
  }

  // Check query param
  if (searchParams?.get('demo') === '1') {
    return true;
  }

  return false;
}

/**
 * Check if demo mode at runtime (only checks env var)
 * Use in module initialization or when pathname isn't available
 */
export function isDemoRuntime(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}

/**
 * General demo detection - alias for isDemoRequest
 * Backwards compatibility with existing code
 */
export function isDemo(pathname?: string, searchParams?: URLSearchParams): boolean {
  if (!pathname) {
    return isDemoRuntime();
  }
  return isDemoRequest(pathname, searchParams);
}

/**
 * Client-side demo detection
 * Use this in client components
 */
export function isDemoClient(): boolean {
  if (typeof window === 'undefined') {
    return isDemoRuntime();
  }

  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  return isDemoRequest(pathname, searchParams);
}
