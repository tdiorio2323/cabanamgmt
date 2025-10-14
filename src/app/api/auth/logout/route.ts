import { NextResponse } from 'next/server';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export async function POST() {
  try {
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Successfully logged out' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
