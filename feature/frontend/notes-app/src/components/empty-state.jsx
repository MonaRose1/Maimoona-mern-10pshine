import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-gradient-to-br from-purple-100 to-blue-100 p-8 mb-6">
        <FileText className="h-16 w-16 text-purple-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6 text-base">{description}</p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction} 
          data-testid="button-empty-action"
          className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
