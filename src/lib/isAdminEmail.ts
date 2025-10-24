/**
 * Check if an email is in the ADMIN_EMAILS environment variable list
 *
 * Note: This is a lightweight env-var check. For database-backed admin verification,
 * query the admin_emails table directly (see /api/invites/create for example).
 *
 * @param email - Email address to check
 * @returns true if email is in ADMIN_EMAILS list
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email?.trim()) return false;

  const envList = process.env.ADMIN_EMAILS;

  if (!envList) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('ADMIN_EMAILS environment variable not set - no admin access granted');
    }
    return false;
  }

  return envList
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .includes(email.trim().toLowerCase());
}
