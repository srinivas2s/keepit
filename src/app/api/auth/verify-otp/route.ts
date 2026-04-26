import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Phone and OTP are required' }, { status: 400 });
    }

    // In production, this would verify with Supabase Auth
    // const { data, error } = await supabase.auth.verifyOtp({
    //   phone,
    //   token: otp,
    //   type: 'sms',
    // });

    // For demo, accept any 4-digit OTP
    if (otp.length === 4) {
      return NextResponse.json({
        success: true,
        user: {
          id: 'demo-user-001',
          phone,
          name: '',
          email: '',
          created_at: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
