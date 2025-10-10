import { ChevronRight, FileText, Folder, Plus, Star } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppSidebar({
  folders,
  selectedFolderId,
  onFolderSelect,
  onNewNote,
  onNewFolder,
  showPinned,
  onShowPinned,
  pinnedCount = 0,
}) {
  const renderFolder = (folder, depth = 0) => (
    <div key={folder.id}>
      <SidebarMenuButton
        onClick={() => onFolderSelect(folder.id)}
        className={cn(
          "w-full justify-start gap-2",
          selectedFolderId === folder.id && "bg-sidebar-accent"
        )}
        style={{ paddingLeft: `${depth * 0.75 + 0.5}rem` }}
        data-testid={`button-folder-${folder.id}`}
      >
        {folder.children && folder.children.length > 0 && (
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              folder.isExpanded && "rotate-90"
            )}
          />
        )}
        <Folder
          className="h-4 w-4"
          style={{ color: folder.color }}
        />
        <span className="flex-1 text-left">{folder.name}</span>
        <span className="text-xs text-muted-foreground">{folder.noteCount}</span>
      </SidebarMenuButton>
      {folder.isExpanded && folder.children?.map((child) =>
        renderFolder(child, depth + 1)
      )}
    </div>
  );

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">NotePro</span>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            onClick={onNewNote}
            className="flex-1"
            size="sm"
            data-testid="button-new-note"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Note
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onNewFolder}
            className="min-h-8"
            data-testid="button-new-folder"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onShowPinned}
                  className={cn(showPinned && "bg-sidebar-accent")}
                  data-testid="button-pinned-notes"
                >
                  <Star className="h-4 w-4" />
                  <span>Pinned Notes</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {pinnedCount}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Folders</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {folders.map((folder) => (
                <SidebarMenuItem key={folder.id}>
                  {renderFolder(folder)}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
