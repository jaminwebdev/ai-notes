'use client';

import {
  SidebarGroupContent as SidebarGroupContentShadCN,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SearchIcon } from 'lucide-react';
import { Input } from './ui/input';
import { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import SelectNoteButton from './SelectNoteButton';
import DeleteNoteButton from './DeleteNoteButton';
import { type Note } from '@/lib/types';
import { useGetAllNotes } from '@/hooks/notehooks';
import { toast } from 'sonner';

type Props = {
  notes: Note[];
};

function SidebarGroupContent({ notes }: Props) {
  const [searchText, setSearchText] = useState('');

  const { data: fetchedNotes, error: fetchedNotesError } =
    useGetAllNotes(notes);

  useEffect(() => {
    if (fetchedNotesError) {
      toast('Logged in', {
        description: `${fetchedNotesError}`,
      });
    }
  }, [fetchedNotesError]);

  const fuse = useMemo(() => {
    return new Fuse(fetchedNotes, {
      keys: ['title'],
      threshold: 0.4,
    });
  }, [fetchedNotes]);

  const filteredNotes = searchText
    ? fuse.search(searchText).map(result => result.item)
    : fetchedNotes;

  return (
    <SidebarGroupContentShadCN>
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-2 size-4" />
        <Input
          className="bg-muted pl-8"
          placeholder="Search your notes..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>

      <SidebarMenu className="mt-4">
        {filteredNotes.map((note: Note) => (
          <SidebarMenuItem key={note.id} className="group/item">
            {/* replace with link */}
            <SelectNoteButton note={note} />

            <DeleteNoteButton noteId={note.id} />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContentShadCN>
  );
}

export default SidebarGroupContent;
