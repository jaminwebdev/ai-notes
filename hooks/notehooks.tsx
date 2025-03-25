import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createNoteAction,
  updateNoteAction,
  deleteNoteAction,
} from '@/actions/notes';
import { Note } from '@/lib/types';
import { createClient } from '@/supabase/client';

type CreateNoteInput = {
  title: string;
  body: string;
};

type UpdateNoteInput = {
  id: string;
  title: string;
  body: string;
};

export const useGetAllNotes = (notes: Note[]) => {
  const query = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const supabase = await createClient();
      const { data, error } = await supabase.from('ai_notes_notes').select('*');

      if (error) throw new Error('Failed to fetch notes');

      return data;
    },
    initialData: notes,
  });

  return query;
};

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateNoteInput) =>
      createNoteAction(input.title, input.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateNoteInput) =>
      updateNoteAction(input.id, input.title, input.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => deleteNoteAction(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}
