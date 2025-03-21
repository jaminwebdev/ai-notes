import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || '';

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_notes_notes')
    .insert([{ user_id: userId, text: '' }])
    .select();

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: 'Failed to create a new note.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    noteId: data[0]?.id,
  });
}
