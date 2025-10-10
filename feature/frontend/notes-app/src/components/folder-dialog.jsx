import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FOLDER_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#6366f1",
];

export function FolderDialog({
  open,
  onOpenChange,
  onSave,
  defaultName = "",
  defaultColor = FOLDER_COLORS[0],
}) {
  const [name, setName] = useState(defaultName);
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), selectedColor);
      setName("");
      setSelectedColor(FOLDER_COLORS[0]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-folder">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name..."
              autoFocus
              data-testid="input-folder-name"
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className="w-8 h-8 rounded-md border-2 transition-all hover-elevate active-elevate-2"
                  style={{
                    backgroundColor: color,
                    borderColor: selectedColor === color ? color : "transparent",
                    transform: selectedColor === color ? "scale(1.1)" : "scale(1)",
                  }}
                  data-testid={`button-color-${color}`}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()} data-testid="button-save-folder">
            Create Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
