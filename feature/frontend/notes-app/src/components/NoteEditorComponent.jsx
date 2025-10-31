import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Star, Save, Trash2, Tag, 
  Bold, Italic, Underline, List, ListOrdered,
  Paperclip, FileText, Image as ImageIcon, X
} from 'lucide-react';

export const NoteEditorComponent = ({
  noteId,
  initialTitle = "",
  initialContent = "",
  initialTags = [],
  initialPinned = false,
  onSave,
  onDelete
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState(initialTags);
  const [isPinned, setIsPinned] = useState(initialPinned);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [attachments, setAttachments] = useState([]);
  const contentRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setTags(initialTags);
    setIsPinned(initialPinned);
  }, [initialTitle, initialContent, initialTags, initialPinned]);

  const handleSave = async () => {
    if (!title.trim()) return;
    
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        content: content,
        tags,
        isPinned,
        attachments
      });
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await onDelete();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTag();
    }
  };

  // Rich text formatting
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  // File attachment handling
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type === 'application/pdf' || file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length > 0) {
      const newAttachments = validFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        file: file
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const removeAttachment = (index) => {
    const updated = attachments.filter((_, i) => i !== index);
    setAttachments(updated);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2 flex-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-lg font-semibold border-none shadow-none focus-visible:ring-0"
            dir="ltr"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPinned(!isPinned)}
            className={isPinned ? "text-yellow-500" : "text-muted-foreground"}
          >
            <Star className={`h-4 w-4 ${isPinned ? "fill-current" : ""}`} />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tags */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Tags:</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="hover:text-foreground"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add tag..."
            className="text-sm"
            dir="ltr"
          />
          <Button onClick={addTag} size="sm" variant="outline">
            Add
          </Button>
        </div>
      </div>

      {/* Rich Text Toolbar */}
      <div className="px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-1 flex-wrap">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('bold')}
            title="Bold"
            type="button"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('italic')}
            title="Italic"
            type="button"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('underline')}
            title="Underline"
            type="button"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-border mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('insertUnorderedList')}
            title="Bullet List"
            type="button"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('insertOrderedList')}
            title="Numbered List"
            type="button"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-border mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => fileInputRef.current?.click()}
            title="Attach File (PDF/PNG)"
            type="button"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="px-4 py-3 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Attachments ({attachments.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg text-sm group"
              >
                {attachment.type === 'application/pdf' ? (
                  <FileText className="h-4 w-4 text-red-500" />
                ) : (
                  <ImageIcon className="h-4 w-4 text-blue-500" />
                )}
                <span className="max-w-[200px] truncate">{attachment.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(attachment.size / 1024).toFixed(1)}KB)
                </span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  type="button"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Editor */}
      <div className="flex-1 p-4 overflow-auto">
        <textarea
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your note..."
          dir="ltr"
          className="w-full h-full outline-none resize-none border-none bg-transparent text-foreground p-0"
          style={{ 
            minHeight: "400px",
            direction: "ltr",
            textAlign: "left",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            fontFamily: "inherit"
          }}
        />
      </div>
    </div>
  );
};
