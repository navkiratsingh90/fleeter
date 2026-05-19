// components/admin/partner-review/DocumentButtons.tsx
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface DocumentButtonsProps {
  documents: string[];
}

export function DocumentButtons({ documents }: DocumentButtonsProps): React.ReactElement {
  // Each button opens a different document – using mock URLs
  const getDocumentUrl = (docName: string) => {
    // In real app, generate based on doc name or id
    return `#`;
  };

  return (
    <div className="flex flex-wrap gap-3 justify-start">
      {documents.map((doc) => (
        <Button
          key={doc}
          variant="outline"
          className="rounded-full border-gray-200 text-gray-700 hover:border-[#22c55e] hover:text-[#22c55e] gap-2"
          asChild
        >
          <a href={getDocumentUrl(doc)} target="_blank" rel="noopener noreferrer">
            Open Full Document <ExternalLink size={14} />
          </a>
        </Button>
      ))}
    </div>
  );
}