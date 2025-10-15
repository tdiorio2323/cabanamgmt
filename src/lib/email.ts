import { Resend } from 'resend';
import { logger } from '@/lib/logger';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export type SendInviteEmailArgs = {
  to: string;
  code: string;
  inviteUrl: string;
  role: string;
};

export async function sendInviteEmail({ to, code, inviteUrl, role }: SendInviteEmailArgs): Promise<void> {
  const from = process.env.MAIL_FROM || 'no-reply@cabana.com';

  const subject = 'Your Cabana Management Invitation';
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;background-color:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;">
    <tr>
      <td style="padding:40px 30px;text-align:center;background-color:#111827;">
        <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:600;">Cabana Management</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:40px 30px;">
        <h2 style="margin:0 0 20px;color:#111827;font-size:20px;font-weight:600;">You've Been Invited!</h2>
        <p style="margin:0 0 20px;color:#4b5563;font-size:16px;line-height:24px;">
          You've been invited to join Cabana Management as a <strong>${role}</strong>.
        </p>
        <div style="margin:30px 0;padding:20px;background-color:#f3f4f6;border-radius:8px;text-align:center;">
          <p style="margin:0 0 10px;color:#6b7280;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;">Your Invitation Code</p>
          <p style="margin:0;color:#111827;font-size:24px;font-weight:700;font-family:monospace;">${code}</p>
        </div>
        <p style="margin:0 0 20px;color:#4b5563;font-size:16px;line-height:24px;">
          Click the button below to accept your invitation and create your account:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:center;padding:10px 0;">
              <a href="${inviteUrl}" style="display:inline-block;padding:14px 32px;background-color:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;">
                Accept Invitation
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:30px 0 0;color:#6b7280;font-size:14px;line-height:20px;">
          If you weren't expecting this invitation, you can safely ignore this email.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 30px;text-align:center;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
        <p style="margin:0;color:#9ca3af;font-size:12px;">
          © ${new Date().getFullYear()} Cabana Management. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // If no API key, log and skip (development mode)
  if (!resend) {
    logger.warn('RESEND_API_KEY not configured - email not sent', {
      event: 'email.skipped',
      to: '[redacted]',
      code,
    });
    return;
  }

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    logger.info('Invitation email sent', {
      event: 'email.sent',
      to: '[redacted]',
      messageId: result.data?.id,
    });
  } catch (error) {
    logger.error('Failed to send invitation email', {
      event: 'email.failed',
      to: '[redacted]',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw new Error('Failed to send invitation email');
  }
}

