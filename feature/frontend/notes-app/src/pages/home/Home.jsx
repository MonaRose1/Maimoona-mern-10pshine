import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { NoteList } from "@/components/note-list";
import { NoteEditor } from "@/components/note-editor";
import { SearchDialog } from "@/components/search-dialog";
import { FolderDialog } from "@/components/folder-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Home() {
  const [notes, setNotes] = useState([
    {
      id: "1",
      title: "Welcome to NotePro",
      content:
        "<h2>Getting Started</h2><p>This is your first note! Here are some features you can explore:</p><ul><li>Rich text formatting with the toolbar</li><li>Organize notes with folders and tags</li><li>Pin important notes to the top</li><li>Search across all your notes</li><li>Toggle between light and dark mode</li></ul>",
      tags: ["welcome", "tutorial"],
      isPinned: true,
      color: "#3b82f6",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Meeting Notes - Q1 Planning",
      content:
        "<h3>Agenda</h3><p>Discussed the roadmap for Q1 2024. Key focus areas include:</p><ul><li>Product improvements</li><li>User experience enhancements</li><li>Performance optimization</li></ul>",
      folderId: "work",
      tags: ["work", "planning", "important"],
      isPinned: true,
      color: "#8b5cf6",
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 3600000),
    },
    {
      id: "3",
      title: "Recipe Ideas",
      content:
        "<p>Try the new pasta recipe with cherry tomatoes, garlic, and fresh basil. Don't forget to add parmesan!</p>",
      folderId: "personal",
      tags: ["personal", "cooking"],
      isPinned: false,
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 86400000),
    },
  ]);

  const [folders, setFolders] = useState([
    {
      id: "work",
      name: "Work",
      color: "#3b82f6",
      noteCount: 1,
      isExpanded: true,
    },
    {
      id: "personal",
      name: "Personal",
      color: "#10b981",
      noteCount: 1,
      isExpanded: false,
    },
  ]);

  const [selectedNoteId, setSelectedNoteId] = useState("1");
  const [selectedFolderId, setSelectedFolderId] = useState();
  const [showPinned, setShowPinned] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const filteredNotes = showPinned
    ? notes.filter((n) => n.isPinned)
    : selectedFolderId
    ? notes.filter((n) => n.folderId === selectedFolderId)
    : notes;

  const pinnedCount = notes.filter((n) => n.isPinned).length;

  const handleNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "",
      content: "",
      folderId: selectedFolderId,
      tags: [],
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const handleSaveNote = (data) => {
    setNotes(
      notes.map((note) =>
        note.id === selectedNoteId
          ? { ...note, ...data, updatedAt: new Date() }
          : note
      )
    );
  };

  const handleDeleteNote = () => {
    setNotes(notes.filter((n) => n.id !== selectedNoteId));
    setSelectedNoteId(notes[0]?.id || "");
  };

  const handleCreateFolder = (name, color) => {
    const newFolder = {
      id: Date.now().toString(),
      name,
      color,
      noteCount: 0,
      isExpanded: false,
    };
    setFolders([...folders, newFolder]);
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const searchResults = notes
    .filter(
      (n) =>
        n.title.toLowerCase().includes("") ||
        n.content.toLowerCase().includes("")
    )
    .slice(0, 5);

  const sidebarStyle = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full">
        <AppSidebar
          folders={folders}
          selectedFolderId={selectedFolderId}
          onFolderSelect={(id) => {
            setSelectedFolderId(id);
            setShowPinned(false);
          }}
          onNewNote={handleNewNote}
          onNewFolder={() => setFolderDialogOpen(true)}
          showPinned={showPinned}
          onShowPinned={() => {
            setShowPinned(true);
            setSelectedFolderId(undefined);
          }}
          pinnedCount={pinnedCount}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b border-border gap-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-lg font-semibold">
                {showPinned
                  ? "Pinned Notes"
                  : selectedFolderId
                  ? folders.find((f) => f.id === selectedFolderId)?.name ||
                    "All Notes"
                  : "All Notes"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                data-testid="button-search"
                className="min-h-9"
              >
                <Search className="h-5 w-5" />
              </Button>
              <ThemeToggle />
            </div>
          </header>
          <div className="flex flex-1 overflow-hidden">
            <div className="w-96 border-r border-border overflow-y-auto">
              <NoteList
                notes={filteredNotes}
                selectedNoteId={selectedNoteId}
                onNoteClick={setSelectedNoteId}
                onNewNote={handleNewNote}
              />
            </div>
            <div className="flex-1 overflow-hidden">
              {selectedNote ? (
                <NoteEditor
                  key={selectedNote.id}
                  noteId={selectedNote.id}
                  initialTitle={selectedNote.title}
                  initialContent={selectedNote.content}
                  initialTags={selectedNote.tags}
                  initialPinned={selectedNote.isPinned}
                  onSave={handleSaveNote}
                  onDelete={handleDeleteNote}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a note to view
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        results={searchResults}
        onSearch={handleSearch}
        onResultClick={(id) => setSelectedNoteId(id)}
      />

      <FolderDialog
        open={folderDialogOpen}
        onOpenChange={setFolderDialogOpen}
        onSave={handleCreateFolder}
      />
    </SidebarProvider>
  );
}
