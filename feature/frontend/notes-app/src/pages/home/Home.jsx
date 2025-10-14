import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { NoteList } from "@/components/note-list";
import { NoteEditorComponent } from "@/components/NoteEditorComponent";
import { SearchDialog } from "@/components/search-dialog";
import { FolderDialog } from "@/components/folder-dialog";
import { SecretPinDialog } from "@/components/secret-pin-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Search, User } from "lucide-react";
import { apiRequest } from "@/utils/helper";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef(null);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [isFirstTimePin, setIsFirstTimePin] = useState(false);

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

  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState();
  const [showPinned, setShowPinned] = useState(false);
  const [showAllNotes, setShowAllNotes] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load notes from API
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        const data = await apiRequest("/api/notes", { method: "GET" });
        setNotes(data);
        if (data.length > 0) {
          setSelectedNoteId(data[0]._id || data[0].id);
        }
      } catch (err) {
        setError(err.message || "Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Cleanup click timer on unmount
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  // Debug: Log when pinDialogOpen changes
  useEffect(() => {
    console.log("🚪 PIN Dialog Open State:", pinDialogOpen, "| First Time:", isFirstTimePin);
  }, [pinDialogOpen, isFirstTimePin]);

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
        title: "Untitled Note",
        content: "",
        folderId: selectedFolderId,
        tags: [],
        isPinned: false,
      };
      
      const createdNote = await apiRequest("/api/notes", {
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
      const updatedNote = await apiRequest(`/api/notes/${selectedNoteId}`, {
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
      await apiRequest(`/api/notes/${selectedNoteId}`, {
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

  const handleSearchClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    
    clickTimerRef.current = setTimeout(() => {
      if (clickCount + 1 >= 2) {
        // Double click detected
        console.log("Double click detected - opening Secret Safe");
        handleSecretSafeAccess();
      } else {
        // Single click - open search
        console.log("Single click - opening search");
        setSearchOpen(true);
      }
      setClickCount(0);
      clickTimerRef.current = null;
    }, 400);
  };

  const handleSecretSafeAccess = async () => {
    console.log("🔒 Attempting to access Secret Safe...");
    try {
      const response = await apiRequest("/api/secret/check-pin", {
        method: "POST"
      });
      
      console.log("✅ PIN check response:", response);
      
      if (response.hasPin) {
        console.log("📌 User has PIN - showing verification dialog");
        setIsFirstTimePin(false);
        setPinDialogOpen(true);
      } else {
        console.log("🆕 First time user - showing PIN creation dialog");
        setIsFirstTimePin(true);
        setPinDialogOpen(true);
      }
    } catch (err) {
      console.error("❌ Failed to check PIN status:", err);
      // Still show dialog even if check fails (default to first time)
      setIsFirstTimePin(true);
      setPinDialogOpen(true);
    }
  };

  const handlePinSuccess = () => {
    setPinDialogOpen(false);
    navigate("/secret-safe");
  };

  const sidebarStyle = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center">
          <div className="relative inline-flex mb-4">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center max-w-md p-8">
          <div className="rounded-full bg-red-100 p-6 inline-flex mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full">
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
          <header className="flex items-center justify-between p-4 border-b border-border gap-4 bg-white/60 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {showPinned
                  ? "📌 Pinned Notes"
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
                onClick={handleSearchClick}
                data-testid="button-search"
                className="min-h-9 hover:bg-purple-50 relative"
                title="Single click: Search | Double click: Secret Safe 🔒"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/profile')}
                className="min-h-9 hover:bg-purple-50"
                title="User Profile"
              >
                <User className="h-5 w-5" />
              </Button>
              <ThemeToggle />
            </div>
          </header>
          <div className="flex flex-1 overflow-hidden">
            <div className="w-96 border-r border-border overflow-y-auto note-list-container">
              <NoteList
                notes={filteredNotes}
                selectedNoteId={selectedNoteId}
                onNoteClick={(id) => setSelectedNoteId(id)}
                onNewNote={handleNewNote}
              />
            </div>
            <div className="flex-1 overflow-hidden">
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
                    <div className="rounded-full bg-gradient-to-br from-purple-100 to-blue-100 p-8 mb-6 inline-flex">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Select a note to view</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Choose a note from the list or create a new one to get started.
                    </p>
                    <button 
                      onClick={handleNewNote}
                      className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Create New Note
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

      <SecretPinDialog
        open={pinDialogOpen}
        onOpenChange={(open) => {
          console.log("📝 Secret PIN Dialog state changed:", open);
          setPinDialogOpen(open);
        }}
        onSuccess={handlePinSuccess}
        isFirstTime={isFirstTimePin}
      />
    </SidebarProvider>
  );
}

