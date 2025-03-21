import { createClient } from '@/supabase/server';
import NewNoteButton from '@/components/NewNoteButton';
import NoteList from '@/components/NoteList';
import { Note } from '@/types/types';
import AskAIButton from '@/components/AskAIButton';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: notes, error } = await supabase
    .from('ai_notes_notes')
    .select('*')
    .eq('user_id', user?.id)
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-6 justify-between">
        <h1 className="text-3xl text-center md:text-left font-bold mb-8">
          My Notes
        </h1>
        <div className="flex gap-6 mb-8 justify-center">
          <NewNoteButton />
          <AskAIButton />
        </div>
      </div>
      <NoteList notes={notes as Note[]} />
    </div>
  );
}
