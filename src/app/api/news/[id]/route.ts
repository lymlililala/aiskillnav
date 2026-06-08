import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Support slug lookup: /api/news/some-slug
  const isNumeric = /^\d+$/.test(id);
  if (isNumeric) {
    const { data, error } = await supabaseAdmin
      .from('news')
      .select('*')
      .eq('id', Number(id))
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
  }
  // slug 用 limit(1) 取首条，避免 .single() 在 slug 缺失或重复时抛错
  const { data, error } = await supabaseAdmin
    .from('news')
    .select('*')
    .eq('slug', id)
    .order('published_at', { ascending: false })
    .limit(1);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const row = data?.[0];
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(row);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { data, error } = await supabaseAdmin
    .from('news')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', Number(id))
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error } = await supabaseAdmin.from('news').delete().eq('id', Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
