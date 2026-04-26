import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // In production, this would call Supabase Auth
    // const { data, error } = await supabase.auth.signInWithOtp({ phone });

    // For demo, simulate success
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
