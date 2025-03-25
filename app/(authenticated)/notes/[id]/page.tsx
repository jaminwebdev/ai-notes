import { createClient } from '@/supabase/server';
import NoteForm from '@/components/NoteForm';
import { Note } from '@/lib/types';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NotePage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: note, error } = await supabase
    .from('ai_notes_notes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return (
    <div className="container mx-auto py-8">
      <NoteForm note={note as Note} />
    </div>
  );
}
