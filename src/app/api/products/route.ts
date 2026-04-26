import { NextRequest, NextResponse } from 'next/server';
import { supabase, calculateStatus } from '@/lib/supabase';

// GET - Fetch all products for a user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Recalculate statuses
    const products = (data || []).map(p => ({
      ...p,
      status: calculateStatus(p.expiry_date),
    }));

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    const product = {
      ...body,
      user_id: userId,
      qr_code: `keepit-${Date.now()}`,
      status: calculateStatus(body.expiry_date),
    };

    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// DELETE - Delete a product
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const userId = request.headers.get('x-user-id');

    if (!userId || !id) {
      return NextResponse.json({ error: 'User ID and product ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
