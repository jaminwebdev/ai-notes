'use client';

import { useParams } from 'next/navigation';
import { SidebarMenuButton } from './ui/sidebar';
import Link from 'next/link';

import { type Note } from '@/types/types';

type Props = {
  note: Note;
};

function SelectNoteButton({ note }: Props) {
  const { id } = useParams<{ id: string }>();

  return (
    <SidebarMenuButton
      asChild
      className={`items-start gap-0 pr-12 ${
        note.id === id && 'bg-sidebar-accent/50'
      }`}
    >
      <Link href={`/notes/${note.id}`} className="flex h-fit flex-col">
        <p className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap">
          {note.title}
        </p>
        <p className="text-muted-foreground text-xs">
          {new Date(note.updated_at).toLocaleString()}
        </p>
      </Link>
    </SidebarMenuButton>
  );
}

export default SelectNoteButton;
