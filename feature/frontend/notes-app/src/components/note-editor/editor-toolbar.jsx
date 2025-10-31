import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
} from "lucide-react";

export function EditorToolbar({ onFormat }) {
  const formatButtons = [
    { icon: Bold, command: "bold", label: "Bold" },
    { icon: Italic, command: "italic", label: "Italic" },
    { icon: Code, command: "insertHTML", value: "<code></code>", label: "Code" },
  ];

  const headingButtons = [
    { icon: Heading1, command: "formatBlock", value: "h1", label: "Heading 1" },
    { icon: Heading2, command: "formatBlock", value: "h2", label: "Heading 2" },
    { icon: Heading3, command: "formatBlock", value: "h3", label: "Heading 3" },
  ];

  const listButtons = [
    { icon: List, command: "insertUnorderedList", label: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", label: "Numbered List" },
    { icon: Quote, command: "formatBlock", value: "blockquote", label: "Quote" },
  ];

  return (
    <div className="flex items-center gap-1 p-2 border-b border-border flex-wrap">
      {formatButtons.map((btn) => (
        <Button
          key={btn.command}
          variant="ghost"
          size="icon"
          onClick={() => onFormat(btn.command, btn.value)}
          title={btn.label}
          className="min-h-8"
          data-testid={`button-format-${btn.command}`}
        >
          <btn.icon className="h-4 w-4" />
        </Button>
      ))}
      <Separator orientation="vertical" className="h-6" />
      {headingButtons.map((btn) => (
        <Button
          key={btn.value}
          variant="ghost"
          size="icon"
          onClick={() => onFormat(btn.command, btn.value)}
          title={btn.label}
          className="min-h-8"
          data-testid={`button-heading-${btn.value}`}
        >
          <btn.icon className="h-4 w-4" />
        </Button>
      ))}
      <Separator orientation="vertical" className="h-6" />
      {listButtons.map((btn) => (
        <Button
          key={btn.command}
          variant="ghost"
          size="icon"
          onClick={() => onFormat(btn.command, btn.value)}
          title={btn.label}
          className="min-h-8"
          data-testid={`button-list-${btn.command}`}
        >
          <btn.icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}
