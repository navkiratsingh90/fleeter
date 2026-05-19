// components/admin/partner-review/DocumentsList.tsx
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface DocumentsListProps {
  documents: string[];
}

export function DocumentsList({ documents }: DocumentsListProps): React.ReactElement {
  return (
    <Card className="rounded-3xl border border-gray-100 shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={20} className="text-[#22c55e]" />
          <h2 className="font-syne text-lg font-bold text-gray-900">Documents</h2>
        </div>
        <ul className="list-disc list-inside space-y-1 text-sm font-dm text-gray-600">
          {documents.map((doc) => (
            <li key={doc}>{doc}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}