// app/upload-documents/page.tsx
"use client";

import { useState, useRef, ChangeEvent } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  Upload,
  X,
  FileCheck2,
  IdCard,
  FileText,
  Car,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Document definition
interface DocumentItem {
  id: string;
  label: string;
  sub: string;
  color: string;
  bgLight: string;
  borderLight: string;
  Icon: React.ElementType;
}

const DOCUMENTS: DocumentItem[] = [
  {
    id: "aadhaar",
    label: "Aadhaar / ID Proof",
    sub: "Government issued ID",
    color: "#22c55e",
    bgLight: "#f0fdf4",
    borderLight: "#bbf7d0",
    Icon: IdCard,
  },
  {
    id: "drivingLicense",
    label: "Driving License",
    sub: "Valid driving license",
    color: "#f59e0b",
    bgLight: "#fffbeb",
    borderLight: "#fde68a",
    Icon: FileText,
  },
  {
    id: "vehicleRC",
    label: "Vehicle RC",
    sub: "Registration Certificate",
    color: "#3b82f6",
    bgLight: "#eff6ff",
    borderLight: "#bfdbfe",
    Icon: Car,
  },
];

export default function UploadDocumentsPage(): React.ReactElement {
  const [uploads, setUploads] = useState<Record<string, File | null>>({
    aadhaar: null,
    drivingLicense: null,
    vehicleRC: null,
  });

  // Force re-render of hidden file inputs after upload to allow re‑selecting same file
  const [inputKeys, setInputKeys] = useState<Record<string, number>>({
    aadhaar: 0,
    drivingLicense: 0,
    vehicleRC: 0,
  });

  const uploadedCount = Object.values(uploads).filter((f) => f !== null).length;
  const progressValue = (uploadedCount / DOCUMENTS.length) * 100;
  const allUploaded = uploadedCount === DOCUMENTS.length;

  const handleFile = (docId: string, file: File | undefined) => {
    if (file) {
      setUploads((prev) => ({ ...prev, [docId]: file }));
      setInputKeys((prev) => ({ ...prev, [docId]: (prev[docId] || 0) + 1 }));
    }
  };

  const removeFile = (docId: string) => {
    setUploads((prev) => ({ ...prev, [docId]: null }));
    setInputKeys((prev) => ({ ...prev, [docId]: (prev[docId] || 0) + 1 }));
  };

  const handleContinue = () => {
    console.log("Uploaded files:", uploads);
    alert("Documents submitted for verification (demo).");
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

            {/* Progress bar */}
            <div className="mt-8 mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                  Documents
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full px-3 py-1 text-xs",
                    allUploaded
                      ? "bg-[#f0fdf4] border-[#bbf7d0] text-[#16a34a]"
                      : "bg-gray-50 text-gray-500"
                  )}
                >
                  {uploadedCount} / {DOCUMENTS.length} uploaded
                </Badge>
              </div>
              <Progress value={progressValue} className="h-2 rounded-full" />
            </div>

            {/* Document upload cards */}
            <div className="space-y-4">
              {DOCUMENTS.map(({ id, label, sub, color, bgLight, borderLight, Icon }) => {
                const file = uploads[id];
                const inputId = `${id}-${inputKeys[id] ?? 0}`;

                return (
                  <div
                    key={id}
                    className={cn(
                      "rounded-2xl border-2 transition-all duration-200",
                      file
                        ? "border-[#bbf7d0] bg-[#f0fdf4]"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    )}
                  >
                    <div className="flex items-center gap-4 px-5 py-4">
                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0"
                        style={{
                          background: file ? "#ffffff" : bgLight,
                          borderColor: file ? "#bbf7d0" : borderLight,
                        }}
                      >
                        <Icon
                          size={20}
                          style={{ color: file ? "#22c55e" : color }}
                        />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-syne text-sm font-bold text-gray-900">
                          {label}
                        </h3>
                        <p
                          className="text-xs mt-1 truncate"
                          style={{ color: file ? "#16a34a" : "#9ca3af" }}
                        >
                          {file ? file.name : sub}
                        </p>
                      </div>

                      {/* Actions */}
                      {file ? (
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full bg-white border border-[#bbf7d0] flex items-center justify-center">
                            <FileCheck2 size={15} className="text-[#22c55e]" />
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={() => removeFile(id)}
                          >
                            <X size={14} className="text-gray-500" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                            Upload
                          </span>
                          <label
                            htmlFor={inputId}
                            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                            style={{ background: color }}
                          >
                            <Upload size={15} className="text-white" />
                          </label>
                        </div>
                      )}

                      {/* Hidden file input */}
                      <input
                        id={inputId}
                        key={inputId}
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleFile(id, e.target.files?.[0])
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Security note */}
            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
              <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center shrink-0">
                <ShieldCheck size={14} className="text-[#22c55e]" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Documents are{" "}
                <span className="font-semibold text-gray-700">
                  securely stored
                </span>{" "}
                and manually verified by our team.
              </p>
            </div>

            {/* Continue button */}
            <Button
              disabled={!allUploaded}
              className={cn(
                "w-full mt-7 h-14 rounded-2xl font-syne text-[15px] font-bold tracking-tight",
                allUploaded
                  ? "bg-[#22c55e] hover:bg-[#16a34a]"
                  : "bg-gray-900 hover:bg-black"
              )}
              onClick={handleContinue}
            >
              {allUploaded ? "All Done — Continue →" : `Continue (${uploadedCount}/${DOCUMENTS.length})`}
            </Button>

            <p className="text-center text-xs text-gray-400 mt-4">
              You can update documents later from your profile
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}