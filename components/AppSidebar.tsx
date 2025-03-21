import { getUser, createClient } from '@/supabase/server';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import SidebarGroupContent from './SidebarGroupContent';
import { type Note } from '@/types/types';
import AskAIButton from './AskAIButton';
import NewNoteButton from './NewNoteButton';

export async function AppSidebar() {
  const user = await getUser();
  const supabase = await createClient();

  let notes: Note[] = [];

  if (user) {
    let { data, error } = await supabase.from('ai_notes_notes').select('*');
    notes = data ?? [];
  }

  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar flex justify-between">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 mt-2 text-lg">
            {user ? (
              'Your Notes 📝'
            ) : (
              <p>
                <Link href="/login" className="underline">
                  Login
                </Link>{' '}
                to see your notes
              </p>
            )}
          </SidebarGroupLabel>
          {user && <SidebarGroupContent notes={notes} />}
        </SidebarGroup>
        <SidebarGroup className="flex gap-4">
          <NewNoteButton />
          <AskAIButton />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
