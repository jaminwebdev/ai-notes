'use client';

import { User } from '@supabase/supabase-js';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useCreateNote } from '@/hooks/notehooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import NoteForm from './NoteForm';

function NewNoteButton() {
  const [open, setOpen] = useState(false);
  const createNote = useCreateNote();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={createNote.isPending}>
          {createNote.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            'New Note'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Add a new note to your collection.
          </DialogDescription>
        </DialogHeader>
        <NoteForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default NewNoteButton;
