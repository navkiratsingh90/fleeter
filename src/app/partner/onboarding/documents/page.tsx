"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Shield, CheckCircle, FileText, User, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
  status: "pending" | "uploaded";
  fileName?: string;
}

export default function DocumentUploadPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: "aadhaar",
      title: "Aadhaar / ID Proof",
      description: "Government issued ID",
      icon: <User size={16} />,
      required: true,
      status: "pending",
    },
    {
      id: "driving",
      title: "Driving License",
      description: "Valid driving license",
      icon: <Smartphone size={16} />,
      required: true,
      status: "pending",
    },
    {
      id: "vehicle",
      title: "Vehicle RC",
      description: "Registration Certificate",
      icon: <FileText size={16} />,
      required: true,
      status: "pending",
    },
  ]);

  const handleUpload = (docId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,application/pdf";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === docId
              ? { ...doc, status: "uploaded", fileName: file.name }
              : doc
          )
        );
      }
    };
    input.click();
  };

  const allUploaded = documents.every((doc) => doc.status === "uploaded");

  const handleContinue = () => {
    if (allUploaded) {
      alert("Documents verified! Proceeding to next step.");
    } else {
      alert("Please upload all required documents first.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] flex items-center justify-center px-4 py-10 font-dm">
      <div className="w-full max-w-[560px]">
        {/* Step Badge */}
        <div className="flex justify-center mb-6">
          <Badge className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-4 py-1.5 rounded-full uppercase tracking-widest text-[11px] font-semibold hover:bg-[#f0fdf4]">
            <span className="w-4 h-4 rounded-full bg-[#22c55e] text-white grid place-items-center text-[9px] mr-2">
              2
            </span>
            Step 2 of 3
          </Badge>
        </div>

        <Card className="rounded-3xl border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
          <CardContent className="p-8">
            {/* Header with back button */}
            <div className="relative flex items-center justify-center mb-2">
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 rounded-full"
                onClick={() => window.history.back()}
              >
                <ArrowLeft size={16} />
              </Button>

              <div className="text-center">
                <h1 className="font-syne text-2xl font-extrabold tracking-tight text-gray-900">
                  Upload Documents
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Required for verification
                </p>
              </div>
            </div>

            {/* Document List */}
            <div className="mt-8 space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`
                     border rounded-2xl p-4 transition-all 
                    ${doc.status === "uploaded"
                      ? "border-[#22c55e] bg-[#f0fdf4]"
                      : "border-gray-100 bg-white hover:border-gray-200"
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center shrink-0
                      ${doc.status === "uploaded" ? "bg-[#22c55e]" : "bg-gray-100"}
                    `}>
                      <div className={doc.status === "uploaded" ? "text-white" : "text-gray-500"}>
                        {doc.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h3 className="font-syne font-bold text-gray-900">
                          {doc.title}
                          {doc.required && <span className="text-[#22c55e] text-xs ml-1">*</span>}
                        </h3>
                        {doc.status === "uploaded" && (
                          <div className="flex items-center gap-1">
                            <CheckCircle size={14} className="text-[#22c55e]" />
                            <span className="text-[11px] text-gray-500">Uploaded</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{doc.description}</p>
                      {doc.fileName && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-white rounded-full px-2 py-1 w-fit mb-2">
                          <FileText size={12} />
                          <span className="truncate max-w-[200px]">{doc.fileName}</span>
                        </div>
                      )}
                      <Button
                        variant={doc.status === "uploaded" ? "outline" : "default"}
                        size="sm"
                        className={cn(
                          "rounded-full text-xs h-8 gap-1.5",
                          doc.status === "uploaded"
                            ? "border-gray-200 text-gray-500 hover:bg-gray-50"
                            : "bg-[#22c55e] hover:bg-[#16a34a] text-white"
                        )}
                        onClick={() => handleUpload(doc.id)}
                        disabled={doc.status === "uploaded"}
                      >
                        <Upload size={12} />
                        {doc.status === "uploaded" ? "Uploaded" : "Upload Document"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Security Notice */}
            <div className="mt-6 flex items-center gap-3 text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">
              <Shield size={18} className="text-[#22c55e] shrink-0" />
              <span>Documents are securely stored and manually verified by our team.</span>
            </div>

            {/* Continue Button */}
            <Button
              disabled={!allUploaded}
              className={cn(
                "w-full mt-8 h-14 rounded-2xl font-syne text-[15px] font-bold tracking-tight",
                allUploaded
                  ? "bg-[#22c55e] hover:bg-[#16a34a]"
                  : "bg-gray-900 hover:bg-black"
              )}
              onClick={handleContinue}
            >
              Continue →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}