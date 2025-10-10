import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function SearchDialog({
  open,
  onOpenChange,
  results,
  onSearch,
  onResultClick,
}) {
  const [query, setQuery] = useState("");

  const handleSearch = (value) => {
    setQuery(value);
    onSearch(value);
  };

  const handleResultClick = (noteId) => {
    onResultClick(noteId);
    onOpenChange(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-testid="dialog-search">
        <DialogHeader>
          <DialogTitle>Search Notes</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, content, or tags..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
            autoFocus
            data-testid="input-search"
          />
        </div>
        <div className="max-h-96 overflow-y-auto space-y-2">
          {results.length === 0 && query && (
            <p className="text-center text-muted-foreground py-8">
              No notes found
            </p>
          )}
          {results.length === 0 && !query && (
            <p className="text-center text-muted-foreground py-8">
              Start typing to search...
            </p>
          )}
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleResultClick(result.id)}
              className="w-full text-left p-3 rounded-lg hover-elevate active-elevate-2 border border-border"
              data-testid={`button-result-${result.id}`}
            >
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">
                    {result.title || "Untitled"}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {result.content}
                  </p>
                  <span className="text-xs text-muted-foreground mt-1 inline-block">
                    {formatDistanceToNow(result.updatedAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
