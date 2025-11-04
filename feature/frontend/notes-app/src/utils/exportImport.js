// Utility functions for exporting and importing notes

/**
 * Export notes to a JSON file
 * @param {Array} notes - Array of notes to export
 * @param {String} filename - Name of the file to export to
 */
export const exportNotes = (notes, filename = 'notes-export.json') => {
  try {
    // Create a copy of notes with only essential data
    const exportData = notes.map(note => ({
      id: note._id || note.id,
      title: note.title,
      content: note.content,
      tags: note.tags || [],
      isPinned: note.isPinned || false,
      color: note.color || '#3b82f6',
      folderId: note.folderId || null,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    }));

    // Create JSON string
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('Export failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Import notes from a JSON file
 * @param {File} file - JSON file to import
 * @returns {Promise<Object>} - Result of import operation
 */
export const importNotes = async (file) => {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          
          // Validate data structure
          if (!Array.isArray(jsonData)) {
            throw new Error('Invalid file format: Expected an array of notes');
          }
          
          // Validate each note
          const validNotes = [];
          const errors = [];
          
          jsonData.forEach((note, index) => {
            if (validateNoteStructure(note)) {
              validNotes.push(note);
            } else {
              errors.push(`Invalid note at index ${index}`);
            }
          });
          
          resolve({
            success: true,
            notes: validNotes,
            errors: errors
          });
        } catch (parseError) {
          resolve({
            success: false,
            error: 'Failed to parse JSON file: ' + parseError.message
          });
        }
      };
      
      reader.onerror = () => {
        resolve({
          success: false,
          error: 'Failed to read file'
        });
      };
      
      reader.readAsText(file);
    } catch (error) {
      resolve({
        success: false,
        error: error.message
      });
    }
  });
};

/**
 * Validate note structure
 * @param {Object} note - Note object to validate
 * @returns {Boolean} - Whether the note structure is valid
 */
const validateNoteStructure = (note) => {
  if (!note.title || typeof note.title !== 'string') return false;
  if (note.content && typeof note.content !== 'string') return false;
  if (note.tags && !Array.isArray(note.tags)) return false;
  if (note.isPinned && typeof note.isPinned !== 'boolean') return false;
  if (note.color && typeof note.color !== 'string') return false;
  if (note.folderId && typeof note.folderId !== 'string') return false;
  
  return true;
};

/**
 * Export notes to a CSV file
 * @param {Array} notes - Array of notes to export
 * @param {String} filename - Name of the file to export to
 */
export const exportNotesToCSV = (notes, filename = 'notes-export.csv') => {
  try {
    // Create CSV header
    const headers = ['Title', 'Content', 'Tags', 'Pinned', 'Color', 'Folder ID', 'Created At', 'Updated At'];
    let csvContent = headers.join(',') + '\n';
    
    // Add note data
    notes.forEach(note => {
      const row = [
        `"${(note.title || '').replace(/"/g, '""')}"`,
        `"${(note.content || '').replace(/"/g, '""')}"`,
        `"${(note.tags || []).join(';')}"`,
        note.isPinned ? 'true' : 'false',
        note.color || '#3b82f6',
        note.folderId || '',
        note.createdAt || '',
        note.updatedAt || ''
      ];
      csvContent += row.join(',') + '\n';
    });
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('CSV Export failed:', error);
    return { success: false, error: error.message };
  }
};