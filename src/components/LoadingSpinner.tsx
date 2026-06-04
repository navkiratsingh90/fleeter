"use client";

interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({
  text = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-14 w-14 rounded-full border-4 border-zinc-200" />
          <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-black" />
        </div>

        <p className="text-sm font-semibold text-zinc-700">
          {text}
        </p>
      </div>
    </div>
  );
}