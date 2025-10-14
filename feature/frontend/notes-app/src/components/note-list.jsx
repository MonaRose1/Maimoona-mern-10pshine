import { NoteCard } from "./note-card.jsx";
import { EmptyState } from "./empty-state.jsx";

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
      {notes.map((note) => {
        const noteId = note._id || note.id;
        return (
          <NoteCard
            key={noteId}
            id={noteId}
            title={note.title}
            content={note.content}
            tags={note.tags}
            isPinned={note.isPinned}
            updatedAt={note.updatedAt}
            color={note.color}
            onClick={() => onNoteClick(noteId)}
            isSelected={selectedNoteId === noteId}
          />
        );
      })}
    </div>
  );
}
