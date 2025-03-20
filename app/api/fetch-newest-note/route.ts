import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/auth/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || '';

  const supabase = await createClient();

  const { data: notes, error } = await supabase
    .from('ai_notes_notes')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !notes || notes.length === 0) {
    return NextResponse.json(
      { error: 'Failed to fetch the newest note.' },
      { status: 500 }
    );
  }

  const newestNoteId = notes[0]?.id;

  return NextResponse.json({
    newestNoteId,
  });
}
