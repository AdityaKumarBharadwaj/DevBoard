import { useState } from 'react';
import NoteEditor from './NoteEditor';
import { Plus, FileText, Trash2, Clock, ChevronRight } from 'lucide-react';

const getRelativeTime = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function NotesList({ notes, loading, onAdd, onEdit, onDelete }) {
  const [selectedNote, setSelectedNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    setSelectedNote(null);
    setIsCreating(true);
  };

  const handleSave = async (data) => {
    if (isCreating) {
      await onAdd(data);
      setIsCreating(false);
    } else if (selectedNote) {
      await onEdit(selectedNote._id, data);
      setSelectedNote({ ...selectedNote, ...data });
    }
  };

  const blankNote = {
    title: 'Untitled Note',
    markdownContent: '',
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <div className="rounded-2xl border border-surface-border bg-dark-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Notes</h2>
          <button
            type="button"
            onClick={handleCreate}
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            New
          </button>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-surface-border p-8 text-center text-gray-400">
            <FileText size={32} />
            <p className="text-sm">No notes yet. Create one to start documenting your project.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => {
              const firstLine = note.markdownContent?.split('\n')[0] || 'No preview available';
              const active = selectedNote?._id === note._id && !isCreating;
              return (
                <div
                  key={note._id}
                  className={`group rounded-2xl border px-4 py-3 transition ${
                    active ? 'border-indigo-500 bg-surface-raised' : 'border-transparent bg-dark-950 hover:border-surface-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNote(note);
                        setIsCreating(false);
                      }}
                      className="text-left"
                    >
                      <p className="text-sm font-medium text-white truncate">{note.title || 'Untitled Note'}</p>
                      <p className="mt-1 text-xs text-gray-400 truncate">{firstLine}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(note._id)}
                      className="opacity-0 transition group-hover:opacity-100 text-red-400 hover:text-red-300"
                      aria-label="Delete note"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} />
                      {getRelativeTime(note.updatedAt)}
                    </span>
                    <ChevronRight size={14} className="text-gray-500" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-surface-border bg-dark-900 p-4 min-h-[520px]">
        {isCreating ? (
          <NoteEditor note={blankNote} onSave={handleSave} onClose={() => setIsCreating(false)} />
        ) : selectedNote ? (
          <NoteEditor note={selectedNote} onSave={handleSave} onClose={() => setSelectedNote(null)} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-gray-400">
            <FileText size={36} />
            <h3 className="text-lg font-semibold text-white">Select a note or create a new one</h3>
            <p className="max-w-sm text-sm">Your project notes will appear here once you start writing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
