
import { NextRequest, NextResponse } from 'next/server';
import { sendBuilderSubmissionEmail, BuilderSubmission } from '@/lib/email';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const data: BuilderSubmission = await req.json();

    // Validate
    if (!data.profileImageUrl || !data.backgroundImageUrl || !data.title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Send email
    await sendBuilderSubmissionEmail(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('API Error in submit-builder', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
