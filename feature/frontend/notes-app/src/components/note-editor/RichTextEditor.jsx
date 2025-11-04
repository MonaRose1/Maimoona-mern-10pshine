import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  className,
}) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      onPaste={handlePaste}
      data-placeholder={placeholder}
      className={cn(
        "prose prose-sm max-w-none focus:outline-none min-h-[200px]",
        "prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
        "prose-p:text-foreground prose-headings:text-foreground",
        "prose-strong:text-foreground prose-code:text-foreground",
        "prose-ul:text-foreground prose-ol:text-foreground",
        "dark:prose-invert",
        className,
      )}
      data-testid="editor-content"
    />
  );
}
