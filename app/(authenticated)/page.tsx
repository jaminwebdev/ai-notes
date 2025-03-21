import { createClient } from '@/supabase/server';
import NewNoteButton from '@/components/NewNoteButton';
import NoteList from '@/components/NoteList';
import { Note } from '@/types/types';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let { data: notes, error } = await supabase
    .from('ai_notes_notes')
    .select('*')
    .eq('user_id', user?.id)
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <NewNoteButton />
      </div>
      <NoteList notes={notes as Note[]} />
    </div>
  );
}
