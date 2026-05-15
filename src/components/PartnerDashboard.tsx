// app/partner-onboarding/page.tsx
"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Car,
  FileText,
  Building,
  Eye,
  Video,
  DollarSign,
  CheckSquare,
  Radio,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Step definition
interface OnboardingStep {
  id: string;
  label: string;
  icon: React.ElementType;
  status: "completed" | "active" | "pending";
  route? : string
}

const STEPS: OnboardingStep[] = [
  { id: "vehicle", label: "Vehicle", icon: Car, status: "completed" , route : '/partner/onboarding/vehicle' },
  { id: "documents", label: "Documents", icon: FileText, status: "completed", route : '/partner/onboarding/documents' },
  { id: "bank", label: "Bank", icon: Building, status: "active", route : '/partner/onboarding/bank' },
  { id: "review", label: "Review", icon: Eye, status: "pending" },
  { id: "videoKyc", label: "Video KYC", icon: Video, status: "pending" },
  { id: "pricing", label: "Pricing", icon: DollarSign, status: "pending" },
  { id: "finalReview", label: "Final Review", icon: CheckSquare, status: "pending" },
  { id: "live", label: "Live", icon: Radio, status: "pending" },
];

const completedCount = STEPS.filter((s) => s.status === "completed").length;
const totalSteps = STEPS.length;
const progressValue = (completedCount / totalSteps) * 100;


export default function PartnerOnboardingPage(): React.ReactElement {
  const [steps, setSteps] = useState<OnboardingStep[]>(STEPS);
  const router = useRouter()
  // Mock: In a real app, you'd update status based on user actions
  const handleContinue = () => {
    alert("Continue to next step (Bank details)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] font-dm">
      <main className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-10">
          <Badge className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-4 py-1.5 rounded-full uppercase tracking-widest text-[11px] font-semibold">
            Onboarding Progress
          </Badge>
          <h1 className="font-syne text-3xl md:text-4xl font-extrabold text-gray-900 mt-4">
            Complete all steps to activate your account
          </h1>
        </div>

        <Card className="rounded-3xl border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
          <CardContent className="p-6 md:p-8">
            {/* Overall Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                  Overall Progress
                </p>
                <Badge variant="outline" className="rounded-full bg-gray-50 text-gray-600">
                  {completedCount} / {totalSteps} completed
                </Badge>
              </div>
              <Progress value={progressValue} className="h-2 rounded-full" />
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 cursor-pointer lg:grid-cols-4 gap-4">
              {steps.map((step) => {
                const Icon = step.icon;
                const isCompleted = step.status === "completed";
                const isActive = step.status === "active";
                return (
                  <div
					onClick={() => {
						if (step.route) {
						router.push(step.route);
						}
					}}
                    key={step.id}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                      isCompleted
                        ? "border-[#bbf7d0] bg-[#f0fdf4]"
                        : isActive
                        ? "border-[#22c55e] bg-white shadow-md"
                        : "border-gray-100 bg-white opacity-70"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        isCompleted
                          ? "bg-[#22c55e] text-white"
                          : isActive
                          ? "bg-[#22c55e] text-white"
                          : "bg-gray-100 text-gray-400"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Icon size={18} />
                      )}
                    </div>
                    <div>
                      <p
                        className={cn(
                          "font-syne font-bold text-sm",
                          isCompleted || isActive ? "text-gray-900" : "text-gray-400"
                        )}
                      >
                        {step.label}
                      </p>
                      {isActive && (
                        <span className="text-[10px] text-[#22c55e] font-medium">In progress</span>
                      )}
                      {isCompleted && (
                        <span className="text-[10px] text-[#16a34a] font-medium">Completed</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}