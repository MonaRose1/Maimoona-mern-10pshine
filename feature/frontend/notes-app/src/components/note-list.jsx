import { NoteCard } from "./note-card";
import { EmptyState } from "./empty-state";

export function NoteList({
  notes,
  selectedNoteId,
  onNoteClick,
  onNewNote,
}) {
  if (notes.length === 0) {
    return (
      <EmptyState
        title="No notes found"
        description="Create your first note to get started."
        actionLabel="Create Note"
        onAction={onNewNote}
      />
    );
  }

  return (
    <div className="grid gap-4 p-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          id={note.id}
          title={note.title}
          content={note.content}
          tags={note.tags}
          isPinned={note.isPinned}
          updatedAt={note.updatedAt}
          color={note.color}
          onClick={() => onNoteClick(note.id)}
          isSelected={selectedNoteId === note.id}
        />
      ))}
    </div>
  );
}
