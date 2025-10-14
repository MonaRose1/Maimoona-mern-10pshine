import React from "react";
import { Star, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export function NoteCard({ 
  id,
  title, 
  content, 
  tags = [],
  isPinned = false,
  updatedAt,
  color,
  onClick, 
  isSelected = false,
  className = "", 
  ...props 
}) {
  const formatDate = (date) => {
    if (!date) return '';
    const now = new Date();
    const noteDate = new Date(date);
    const diffInHours = (now - noteDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return noteDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return noteDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return noteDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary",
        className
      )}
      onClick={onClick}
      style={{ borderLeftColor: color }}
      {...props}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-sm truncate flex-1 mr-2">{title || 'Untitled'}</h4>
        {isPinned && <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />}
      </div>
      
      <p className="text-muted-foreground text-xs line-clamp-2 mb-3">
        {stripHtml(content) || 'No content'}
      </p>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}
      
      <div className="flex items-center text-xs text-muted-foreground">
        <Calendar className="h-3 w-3 mr-1" />
        {formatDate(updatedAt)}
      </div>
    </div>
  );
}
