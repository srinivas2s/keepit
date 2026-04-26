import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all alerts for a user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('alerts')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ alerts: data || [] });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

// PATCH - Mark alert as read
export async function PATCH(request: NextRequest) {
  try {
    const { alertId, markAll } = await request.json();
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    if (markAll) {
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('user_id', userId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else if (alertId) {
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', alertId)
        .eq('user_id', userId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update alerts' }, { status: 500 });
  }
}
