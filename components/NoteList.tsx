'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Note } from '@/types/types';
import Link from 'next/link';
import { format } from 'date-fns';
import DeleteNoteButton from './DeleteNoteButton';
import { useGetAllNotes } from '@/hooks/notehooks';
import { toast } from 'sonner';
import { useEffect } from 'react';

type Props = {
  notes: Note[];
};

function NoteList({ notes }: Props) {
  const { data: fetchedNotes, error: fetchedNotesError } =
    useGetAllNotes(notes);

  useEffect(() => {
    if (fetchedNotesError) {
      toast('Logged in', {
        description: `${fetchedNotesError}`,
      });
    }
  }, [fetchedNotesError]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {fetchedNotes.map(note => (
        <Link
          key={note.id}
          href={`/notes/${note.id}`}
          className="group relative block"
        >
          <Card className="h-full transition hover:bg-muted/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">
                {note.title}
              </CardTitle>
              <CardDescription>
                <p className="mt-2 text-xs text-muted-foreground">
                  {format(new Date(note.updated_at), 'MM/dd/yyyy')}
                </p>
              </CardDescription>
              <DeleteNoteButton noteId={note.id} />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {note.body}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default NoteList;
