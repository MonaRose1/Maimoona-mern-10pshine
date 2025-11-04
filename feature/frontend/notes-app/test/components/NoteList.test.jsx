import { render, screen, fireEvent } from '../test-utils';
import NoteList from '../../src/components/note-list';
import '@testing-library/jest-dom';

describe('NoteList Component', () => {
  const mockOnNoteClick = jest.fn();
  const mockOnNewNote = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no notes provided', () => {
    render(
      <NoteList
        notes={[]}
        selectedNoteId=""
        onNoteClick={mockOnNoteClick}
        onNewNote={mockOnNewNote}
      />
    );

    expect(screen.getByText(/No notes yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Create your first note to get started/i)).toBeInTheDocument();
  });

  it('renders list of notes correctly', () => {
    const notes = [
      { _id: '1', title: 'Note 1', content: 'Content 1', updatedAt: new Date().toISOString() },
      { _id: '2', title: 'Note 2', content: 'Content 2', updatedAt: new Date().toISOString() }
    ];

    render(
      <NoteList
        notes={notes}
        selectedNoteId="1"
        onNoteClick={mockOnNoteClick}
        onNewNote={mockOnNewNote}
      />
    );

    expect(screen.getByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Note 2')).toBeInTheDocument();
    // Check that first note is selected (would have different styling)
    expect(screen.getByText('Note 1').closest('.note-item')).toHaveClass('selected');
  });

  it('calls onNoteClick when a note is clicked', () => {
    const notes = [
      { _id: '1', title: 'Test Note', content: 'Test Content', updatedAt: new Date().toISOString() }
    ];

    render(
      <NoteList
        notes={notes}
        selectedNoteId=""
        onNoteClick={mockOnNoteClick}
        onNewNote={mockOnNewNote}
      />
    );

    const noteItem = screen.getByText('Test Note').closest('.note-item');
    fireEvent.click(noteItem);

    expect(mockOnNoteClick).toHaveBeenCalledWith('1');
  });

  it('calls onNewNote when create note button is clicked', () => {
    render(
      <NoteList
        notes={[]}
        selectedNoteId=""
        onNoteClick={mockOnNoteClick}
        onNewNote={mockOnNewNote}
      />
    );

    const createButton = screen.getByTestId('button-create-note');
    fireEvent.click(createButton);

    expect(mockOnNewNote).toHaveBeenCalled();
  });

  it('displays note snippet correctly', () => {
    const longContent = 'This is a long note content that should be truncated to show only a snippet of the content';
    const notes = [
      { _id: '1', title: 'Test Note', content: longContent, updatedAt: new Date().toISOString() }
    ];

    render(
      <NoteList
        notes={notes}
        selectedNoteId=""
        onNoteClick={mockOnNoteClick}
        onNewNote={mockOnNewNote}
      />
    );

    // Should display the beginning of the content
    expect(screen.getByText(/This is a long note content/i)).toBeInTheDocument();
  });

  it('shows pinned indicator for pinned notes', () => {
    const notes = [
      { _id: '1', title: 'Pinned Note', content: 'Content', isPinned: true, updatedAt: new Date().toISOString() }
    ];

    render(
      <NoteList
        notes={notes}
        selectedNoteId=""
        onNoteClick={mockOnNoteClick}
        onNewNote={mockOnNewNote}
      />
    );

    // Should show pinned indicator
    expect(screen.getByText('📌')).toBeInTheDocument();
  });
});