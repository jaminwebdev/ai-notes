'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useDeleteNote } from '@/hooks/notehooks';

type Props = {
  noteId: string;
};

function DeleteNoteButton({ noteId }: Props) {
  const router = useRouter();
  const noteIdParam = useSearchParams().get('noteId') || '';
  const deleteNote = useDeleteNote();

  const handleDeleteNote = async () => {
    try {
      const result = await deleteNote.mutateAsync(noteId);

      if (result.errorMessage) {
        throw new Error(result.errorMessage);
      }

      toast('Note Deleted', {
        description: 'You have successfully deleted the note',
      });

      if (noteId === noteIdParam) {
        router.replace('/');
      }
    } catch (error) {
      toast('Error', {
        description:
          error instanceof Error ? error.message : 'Failed to delete note',
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="absolute right-2 top-1/2 size-7 -translate-y-1/2 p-0 opacity-0 group-hover/item:opacity-100 [&_svg]:size-3"
          variant="ghost"
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this note?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your note
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteNote}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-24"
            disabled={deleteNote.isPending}
          >
            {deleteNote.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteNoteButton;
