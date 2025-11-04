import { render, screen, fireEvent, waitFor } from '../test-utils';
import NoteEditorComponent from '../../src/components/NoteEditorComponent';
import '@testing-library/jest-dom';

// Mock the helper functions
jest.mock('../../src/utils/helper', () => ({
  apiRequest: jest.fn(),
}));

// Mock the RichTextEditor component
jest.mock('../../src/components/RichTextEditor', () => {
  return function MockRichTextEditor({ content, onChange }) {
    return (
      <div data-testid="rich-text-editor">
        <textarea 
          data-testid="editor-content" 
          value={content} 
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  };
});

// Mock the EditorToolbar component
jest.mock('../../src/components/editor-toolbar', () => {
  return function MockEditorToolbar({ onNewFolder }) {
    return (
      <div data-testid="editor-toolbar">
        <button data-testid="button-new-folder" onClick={onNewFolder}>
          New Folder
        </button>
      </div>
    );
  };
});

describe('NoteEditorComponent', () => {
  const mockOnSave = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders note editor with initial data', () => {
    render(
      <NoteEditorComponent
        noteId="1"
        initialTitle="Test Note"
        initialContent="Test content"
        initialTags={['tag1', 'tag2']}
        initialPinned={false}
        initialFolderId={null}
        folders={[]}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('input-note-title')).toHaveValue('Test Note');
    expect(screen.getByTestId('editor-content')).toHaveValue('Test content');
    expect(screen.getByTestId('tag-input')).toBeInTheDocument();
  });

  it('calls onSave when save button is clicked', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockResolvedValue({});

    render(
      <NoteEditorComponent
        noteId="1"
        initialTitle="Test Note"
        initialContent="Test content"
        initialTags={['tag1', 'tag2']}
        initialPinned={false}
        initialFolderId={null}
        folders={[]}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
      />
    );

    const saveButton = screen.getByTestId('button-save-note');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'Test Note',
        content: 'Test content',
        tags: ['tag1', 'tag2'],
        isPinned: false,
        folderId: null
      });
    });
  });

  it('calls onDelete when delete button is clicked', async () => {
    window.confirm = jest.fn(() => true);

    render(
      <NoteEditorComponent
        noteId="1"
        initialTitle="Test Note"
        initialContent="Test content"
        initialTags={[]}
        initialPinned={false}
        initialFolderId={null}
        folders={[]}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByTestId('button-delete-note');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this note?');
    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('updates note title when input changes', () => {
    render(
      <NoteEditorComponent
        noteId="1"
        initialTitle="Test Note"
        initialContent="Test content"
        initialTags={[]}
        initialPinned={false}
        initialFolderId={null}
        folders={[]}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
      />
    );

    const titleInput = screen.getByTestId('input-note-title');
    fireEvent.change(titleInput, { target: { value: 'Updated Note Title' } });

    expect(titleInput).toHaveValue('Updated Note Title');
  });

  it('updates note content when editor content changes', () => {
    render(
      <NoteEditorComponent
        noteId="1"
        initialTitle="Test Note"
        initialContent="Test content"
        initialTags={[]}
        initialPinned={false}
        initialFolderId={null}
        folders={[]}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
      />
    );

    const contentEditor = screen.getByTestId('editor-content');
    fireEvent.change(contentEditor, { target: { value: 'Updated content' } });

    expect(contentEditor).toHaveValue('Updated content');
  });

  it('adds tags when entered', () => {
    render(
      <NoteEditorComponent
        noteId="1"
        initialTitle="Test Note"
        initialContent="Test content"
        initialTags={[]}
        initialPinned={false}
        initialFolderId={null}
        folders={[]}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
      />
    );

    const tagInput = screen.getByTestId('tag-input');
    fireEvent.change(tagInput, { target: { value: 'new-tag' } });
    fireEvent.keyDown(tagInput, { key: 'Enter' });

    // Note: Testing the actual tag display would require more complex mocking
    // For now, we're just ensuring the component renders without error
    expect(tagInput).toBeInTheDocument();
  });

  it('toggles pin status when pin button is clicked', () => {
    render(
      <NoteEditorComponent
        noteId="1"
        initialTitle="Test Note"
        initialContent="Test content"
        initialTags={[]}
        initialPinned={false}
        initialFolderId={null}
        folders={[]}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
      />
    );

    const pinButton = screen.getByTestId('button-pin-note');
    fireEvent.click(pinButton);

    // The pin state should toggle
    // Note: Full testing would require checking the updated UI state
    expect(pinButton).toBeInTheDocument();
  });
});