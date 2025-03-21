'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Note } from '@/types/types';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import DeleteNoteButton from './DeleteNoteButton';

type Props = {
  notes: Note[];
};

function NoteList({ notes }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {notes.map(note => (
        <Link
          key={note.id}
          href={`/notes/${note.id}`}
          className="group relative block"
        >
          <Card className="h-full transition-colors hover:bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">
                {note.title}
              </CardTitle>
              <DeleteNoteButton noteId={note.id} />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {note.body}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(note.updated_at), {
                  addSuffix: true,
                })}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default NoteList;
