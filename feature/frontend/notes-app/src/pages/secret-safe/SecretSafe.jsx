import { AppSidebar } from "@/components/app-sidebar";
import { NoteList } from "@/components/note-list";
import { NoteEditorComponent } from "@/components/NoteEditorComponent";
import { SearchDialog } from "@/components/search-dialog";
import { FolderDialog } from "@/components/folder-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Search, Lock, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/utils/helper";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SecretSafe() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [folders, setFolders] = useState([
    {
      id: "secret-work",
      name: "Secret Work",
      color: "#8b5cf6",
      noteCount: 0,
      isExpanded: true,
    },
    {
      id: "secret-personal",
      name: "Secret Personal",
      color: "#ec4899",
      noteCount: 0,
      isExpanded: false,
    },
  ]);

  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState();
  const [showPinned, setShowPinned] = useState(false);
  const [showAllNotes, setShowAllNotes] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load secret notes from API
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        const data = await apiRequest("/api/secret/notes", { method: "GET" });
        setNotes(data);
        if (data.length > 0) {
          setSelectedNoteId(data[0]._id || data[0].id);
        }
      } catch (err) {
        setError(err.message || "Failed to load secret notes");
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  const selectedNote = notes.find((n) => (n._id || n.id) === selectedNoteId);

  const filteredNotes = showPinned
    ? notes.filter((n) => n.isPinned)
    : showAllNotes
    ? notes
    : selectedFolderId
    ? notes.filter((n) => n.folderId === selectedFolderId)
    : notes;

  const pinnedCount = notes.filter((n) => n.isPinned).length;

  const handleNewNote = async () => {
    try {
      const newNote = {
        title: "Untitled Secret Note",
        content: "",
        folderId: selectedFolderId,
        tags: [],
        isPinned: false,
      };
      
      const createdNote = await apiRequest("/api/secret/notes", {
        method: "POST",
        body: JSON.stringify(newNote)
      });
      
      setNotes([createdNote, ...notes]);
      setSelectedNoteId(createdNote._id || createdNote.id);
    } catch (err) {
      setError(err.message || "Failed to create note");
    }
  };

  const handleSaveNote = async (data) => {
    try {
      const updatedNote = await apiRequest(`/api/secret/notes/${selectedNoteId}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
      
      setNotes(
        notes.map((note) =>
          (note._id || note.id) === selectedNoteId ? updatedNote : note
        )
      );
    } catch (err) {
      setError(err.message || "Failed to save note");
    }
  };

  const handleDeleteNote = async () => {
    try {
      await apiRequest(`/api/secret/notes/${selectedNoteId}`, {
        method: "DELETE"
      });
      
      const remainingNotes = notes.filter((n) => (n._id || n.id) !== selectedNoteId);
      setNotes(remainingNotes);
      setSelectedNoteId(remainingNotes[0]?._id || remainingNotes[0]?.id || "");
    } catch (err) {
      setError(err.message || "Failed to delete note");
    }
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
    setSearchQuery(query.toLowerCase());
  };

  const searchResults = notes
    .filter((n) => {
      if (!searchQuery) return false;
      const titleMatch = n.title?.toLowerCase().includes(searchQuery);
      const contentMatch = n.content?.toLowerCase().includes(searchQuery);
      const tagMatch = n.tags?.some(tag => tag.toLowerCase().includes(searchQuery));
      return titleMatch || contentMatch || tagMatch;
    })
    .slice(0, 10);

  const sidebarStyle = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-900 via-purple-700 to-purple-500">
        <div className="text-center">
          <div className="relative inline-flex mb-4">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-white font-medium">Loading secret notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-900 via-purple-700 to-purple-500">
        <div className="text-center max-w-md p-8">
          <div className="rounded-full bg-red-100 p-6 inline-flex mb-4">
            <Lock className="h-12 w-12 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Access Error</h3>
          <p className="text-purple-100 mb-6">{error}</p>
          <Button 
            onClick={() => navigate("/home")}
            className="bg-white text-purple-600 hover:bg-purple-50"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <AppSidebar
          folders={folders}
          selectedFolderId={selectedFolderId}
          onFolderSelect={(id) => {
            setSelectedFolderId(id);
            setShowPinned(false);
            setShowAllNotes(false);
          }}
          onNewNote={handleNewNote}
          onNewFolder={() => setFolderDialogOpen(true)}
          showAllNotes={showAllNotes}
          onShowAllNotes={() => {
            setShowAllNotes(true);
            setShowPinned(false);
            setSelectedFolderId(undefined);
          }}
          showPinned={showPinned}
          onShowPinned={() => {
            setShowPinned(true);
            setShowAllNotes(false);
            setSelectedFolderId(undefined);
          }}
          pinnedCount={pinnedCount}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b border-purple-700 gap-4 bg-purple-900/60 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/home")}
                className="text-purple-100 hover:text-white hover:bg-purple-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <SidebarTrigger data-testid="button-sidebar-toggle" className="text-purple-100" />
              <Lock className="h-5 w-5 text-purple-300" />
              <h1 className="text-lg font-bold text-white">
                {showPinned
                  ? "📌 Pinned Secret Notes"
                  : selectedFolderId
                  ? folders.find((f) => f.id === selectedFolderId)?.name ||
                    "Secret Notes"
                  : "Secret Notes"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                data-testid="button-search"
                className="text-purple-100 hover:text-white hover:bg-purple-700"
              >
                <Search className="h-5 w-5" />
              </Button>
              <ThemeToggle />
            </div>
          </header>
          <div className="flex flex-1 overflow-hidden">
            <div className="w-96 border-r border-purple-700 overflow-y-auto bg-purple-900/30">
              <NoteList
                notes={filteredNotes}
                selectedNoteId={selectedNoteId}
                onNoteClick={(id) => setSelectedNoteId(id)}
                onNewNote={handleNewNote}
              />
            </div>
            <div className="flex-1 overflow-hidden bg-purple-900/20">
              {selectedNote ? (
                <NoteEditorComponent
                  key={selectedNote._id || selectedNote.id}
                  noteId={selectedNote._id || selectedNote.id}
                  initialTitle={selectedNote.title}
                  initialContent={selectedNote.content}
                  initialTags={selectedNote.tags}
                  initialPinned={selectedNote.isPinned}
                  onSave={handleSaveNote}
                  onDelete={handleDeleteNote}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <div className="rounded-full bg-gradient-to-br from-purple-700 to-indigo-700 p-8 mb-6 inline-flex">
                      <Lock className="h-16 w-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No Secret Note Selected</h3>
                    <p className="text-purple-200 max-w-md mx-auto mb-6">
                      Choose a note from the list or create a new secret note.
                    </p>
                    <button 
                      onClick={handleNewNote}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Create Secret Note
                    </button>
                  </div>
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
