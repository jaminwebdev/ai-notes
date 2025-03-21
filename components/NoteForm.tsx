'use client';

import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateNote, useUpdateNote } from '@/hooks/notehooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactMarkdown from 'react-markdown';
import { Note } from '@/types/types';

type Props = {
  note?: Note;
  onSuccess?: () => void;
};

function NoteForm({ note, onSuccess }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const createNote = useCreateNote();
  const updateNote = useUpdateNote();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setBody(note.body);
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = note
        ? await updateNote.mutateAsync({
            id: note.id,
            title,
            body,
          })
        : await createNote.mutateAsync({
            title,
            body,
          });

      if (result.errorMessage) {
        throw new Error(result.errorMessage);
      }

      if (!('data' in result) || !result.data || result.data.length === 0) {
        throw new Error(
          note ? 'Failed to update note' : 'Failed to create note'
        );
      }

      const updatedNote = result.data[0];
      toast(note ? 'Note Updated' : 'New Note', {
        description: `${updatedNote.title} ${
          note ? 'updated' : 'created'
        } successfully`,
      });

      if (!note) {
        setTitle('');
        setBody('');
      }

      onSuccess?.();
      if (!note) {
        router.push(`/notes/${updatedNote.id}`);
      }
    } catch (error) {
      toast('Error', {
        description:
          error instanceof Error
            ? error.message
            : note
            ? 'Failed to update note'
            : 'Failed to create a new note',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter note title"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">Content</Label>
        <Tabs defaultValue={note ? 'preview' : 'content'} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="content">
            <Textarea
              id="body"
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Enter your note content..."
              className="min-h-[200px] max-h-[300px]"
              required
            />
          </TabsContent>
          <TabsContent
            value="preview"
            className="min-h-[200px] max-h-[300px] overflow-y-auto rounded-md border p-4 prose prose-sm dark:prose-invert max-w-none"
          >
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold mb-3">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-bold mb-2">{children}</h3>
                ),
                p: ({ children }) => <p className="mb-4">{children}</p>,
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-4">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 mb-4">{children}</ol>
                ),
                li: ({ children }) => <li className="mb-1">{children}</li>,
                code: ({ children }) => (
                  <code className="bg-muted px-1 py-0.5 rounded text-sm">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-muted p-4 rounded-lg mb-4 overflow-x-auto">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-muted pl-4 italic mb-4">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {body || 'Nothing to preview'}
            </ReactMarkdown>
          </TabsContent>
        </Tabs>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={note ? updateNote.isPending : createNote.isPending}
      >
        {note ? (
          updateNote.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            'Update Note'
          )
        ) : createNote.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          'Create Note'
        )}
      </Button>
    </form>
  );
}

export default NoteForm;
