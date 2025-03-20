import { createClient, getUser } from '@/auth/server';
import AskAIButton from '@/components/AskAIButton';
import NewNoteButton from '@/components/NewNoteButton';
import NoteTextInput from '@/components/NoteTextInput';
import HomeToast from '@/components/HomeToast';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function HomePage({ searchParams }: Props) {
  const noteIdParam = (await searchParams).noteId;
  const user = await getUser();
  const supabase = await createClient();

  const noteId = Array.isArray(noteIdParam)
    ? noteIdParam![0]
    : noteIdParam || '';

  const { data: notes, error } = await supabase
    .from('ai_notes_notes')
    .select('*')
    .eq('id', noteId);

  const note = notes ? notes[0] : null;

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <AskAIButton user={user} />
        <NewNoteButton user={user} />
      </div>

      <NoteTextInput noteId={noteId} startingNoteText={note?.text || ''} />

      <HomeToast />
    </div>
  );
}

export default HomePage;
