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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { exportNotes, importNotes, exportNotesToCSV } from "@/utils/exportImport";
import { apiRequest } from "@/utils/helper";

export function ExportImportDialog({ open, onOpenChange, onNotesImported }) {
  const [importFile, setImportFile] = useState(null);
  const [exportFormat, setExportFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState("");

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError("");
      
      // Fetch all notes
      const notes = await apiRequest("/api/notes", { method: "GET" });
      
      if (exportFormat === 'csv') {
        exportNotesToCSV(notes, `notes-export-${new Date().toISOString().split('T')[0]}.csv`);
      } else {
        exportNotes(notes, `notes-export-${new Date().toISOString().split('T')[0]}.json`);
      }
    } catch (err) {
      setError("Failed to export notes: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      setError("Please select a file to import");
      return;
    }

    try {
      setIsImporting(true);
      setError("");
      setImportResult(null);
      
      // Import notes from file
      const result = await importNotes(importFile);
      
      if (result.success) {
        setImportResult(result);
        
        // If there are valid notes, import them
        if (result.notes && result.notes.length > 0) {
          // Here you would typically send the notes to your backend
          // For now, we'll just notify the parent component
          onNotesImported(result.notes);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to import notes: " + err.message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (file.type !== 'application/json' && !file.name.endsWith('.json') && !file.name.endsWith('.csv')) {
        setError("Please select a JSON or CSV file");
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }
      
      setImportFile(file);
      setError("");
    }
  };

  const resetDialog = () => {
    setImportFile(null);
    setExportFormat('json');
    setImportResult(null);
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetDialog();
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export/Import Notes</DialogTitle>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {importResult && importResult.success && (
          <Alert>
            <AlertDescription>
              Successfully processed {importResult.notes.length} notes
              {importResult.errors && importResult.errors.length > 0 && (
                <div className="mt-2">
                  Errors: {importResult.errors.length}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-6 py-4">
          {/* Export Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Export Notes</h3>
            <div className="space-y-2">
              <Label>Format</Label>
              <div className="flex gap-2">
                <Button
                  variant={exportFormat === 'json' ? 'default' : 'outline'}
                  onClick={() => setExportFormat('json')}
                  className="flex-1"
                >
                  JSON
                </Button>
                <Button
                  variant={exportFormat === 'csv' ? 'default' : 'outline'}
                  onClick={() => setExportFormat('csv')}
                  className="flex-1"
                >
                  CSV
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? "Exporting..." : "Export All Notes"}
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>
          
          {/* Import Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Import Notes</h3>
            <div className="space-y-2">
              <Label htmlFor="import-file">Select File</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json,.csv"
                onChange={handleFileChange}
                disabled={isImporting}
              />
              <p className="text-xs text-muted-foreground">
                Supports JSON and CSV files up to 5MB
              </p>
            </div>
            <Button 
              onClick={handleImport} 
              disabled={isImporting || !importFile}
              className="w-full"
            >
              {isImporting ? "Importing..." : "Import Notes"}
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}