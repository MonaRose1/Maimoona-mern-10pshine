import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export function TagInput({
  tags,
  onChange,
  placeholder = "Add tags...",
}) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onChange([...tags, inputValue.trim()]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 items-center p-2 border border-border rounded-lg bg-background">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="gap-1"
          data-testid={`badge-tag-${tag}`}
        >
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className="ml-1 hover:text-destructive"
            data-testid={`button-remove-tag-${tag}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="border-0 flex-1 min-w-[120px] focus-visible:ring-0 h-auto p-0"
        data-testid="input-tag"
      />
    </div>
  );
}
