// app/partner-onboarding/page.tsx
"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Car,
  FileText,
  Building,
  Eye,
  Video,
  DollarSign,
  CheckSquare,
  Radio,
  Clock,
  AlertCircle,
  PhoneCall,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import axios from "axios";
import PricingModal, { PricingValues } from "./PricingModal";

interface OnboardingStep {
  id: string;
  label: string;
  icon: React.ElementType;
  route?: string;
}

type NotificationConfig = {
  message: string;
  icon: React.ReactNode;
  variant: "info" | "warning" | "error" | "success";
  actionButton?: React.ReactNode;
};

const STEPS: OnboardingStep[] = [
  {
    id: "vehicle",
    label: "Vehicle",
    icon: Car,
    route: "/partner/onboarding/vehicle",
  },
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
    route: "/partner/onboarding/documents",
  },
  {
    id: "bank",
    label: "Bank",
    icon: Building,
    route: "/partner/onboarding/bank",
  },
  {
    id: "review",
    label: "Review",
    icon: Eye,
  },
  {
    id: "videoKyc",
    label: "Video KYC",
    icon: Video,
    route: "/partner/video-kyc",
  },
  {
    id: "pricing",
    label: "Pricing",
    icon: DollarSign,
    route: "/partner/pricing",
  },
  {
    id: "finalReview",
    label: "Final Review",
    icon: CheckSquare,
  },
  {
    id: "live",
    label: "Live",
    icon: Radio,
  },
];

export default function PartnerOnboardingPage(): React.ReactElement {
  const router = useRouter();
  const userData = useAppSelector((state: RootState) => state.User.userData);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const partnerOnboardingSteps = userData?.partnerOnboardingSteps ?? 0;
  const partnerStatus = userData?.partnerStatus ?? "pending";
  const rejectionReason = userData?.rejectionReason;
  const videoKycStatus = userData?.videoKycStatus ?? "pending";

  const currentStepIndex = Math.min(partnerOnboardingSteps, STEPS.length - 1);
  const currentStepLabel = STEPS[currentStepIndex]?.label ?? "Vehicle";

  const completedCount = Math.min(partnerOnboardingSteps, STEPS.length);
  const totalSteps = STEPS.length;
  const progressValue = (completedCount / totalSteps) * 100;
  const handleRequest = async () => {
    try {
        const data = await axios.get('/api/partner/video-kyc/request')
        window.location.reload()
    } catch (error) {
      console.error(error);
    }
  }
  
  const handleSavePricing = async (data: PricingValues) => {
    try {
      
      const formData = new FormData();
  
      if (data.imageFile) {
        formData.append("image", data.imageFile);
      }
  
      formData.append("baseFare", data.baseFare);
      formData.append("pricePerKm", data.pricePerKm);
      formData.append("waitingCharge", data.waitingCharge);
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const response = await axios.post(
        "/api/partner/onboarding/pricing",
        formData
      );
  
      console.log(response.data);
    } catch (error: any) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.error(error);
    }
  };
  const config = useMemo<NotificationConfig | null>(() => {
    if (partnerStatus === "rejected") {
      return {
        message: rejectionReason
          ? `Admin rejected your request: ${rejectionReason}. Please update your details and resubmit.`
          : "Admin rejected your request. Please update your details and resubmit.",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        variant: "error",
        actionButton: (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => router.push("/partner/onboarding/vehicle")}
          >
            Resubmit
          </Button>
        ),
      };
    }

    if (partnerOnboardingSteps < 3) {
      return {
        message: `You are on step ${currentStepIndex + 1} of 8: ${currentStepLabel}. Please fill in your ${currentStepLabel.toLowerCase()} details to continue.`,
        icon: <Info className="h-5 w-5 text-blue-500" />,
        variant: "info",
        actionButton: STEPS[currentStepIndex]?.route ? (
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push(STEPS[currentStepIndex].route!)}
          >
            Continue
          </Button>
        ) : null,
      };
    }

    if (partnerOnboardingSteps === 3) {
      if (partnerStatus === "pending") {
        return {
          message:
            "Your documents are under review by the admin. This usually takes 24-48 hours. You'll be notified once approved.",
          icon: <Clock className="h-5 w-5 text-amber-500" />,
          variant: "warning",
        };
      }

      if (partnerStatus === "approved") {
        return {
          message:
            "Your documents have been approved! Proceed to the next step: Video KYC.",
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
          variant: "success",
          actionButton: (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 rounded-full"
              onClick={() => router.push("/partner/video-kyc")}
            >
              Start Video KYC
            </Button>
          ),
        };
      }
    }

    if (partnerOnboardingSteps === 4) {
      if (videoKycStatus === "in_progress") {
        return {
          message:
            "Your video KYC is ready. Join the call now to complete verification.",
          icon: <PhoneCall className="h-5 w-5 text-green-600" />,
          variant: "success",
          actionButton: (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 rounded-full"
              onClick={() => router.push(`/video-kyc/${userData?.videoKycRoomId}`)}
            >
              Join Call
            </Button>
          ),
        };
      }

      if (videoKycStatus === "pending") {
        return {
          message:
            "Your video KYC request is pending. An admin will start the call soon. Please stay tuned.",
          icon: <Clock className="h-5 w-5 text-amber-500" />,
          variant: "warning",
        };
      }

      if (videoKycStatus === "approved") {
        return {
          message: "Video KYC approved! Proceed to set your pricing.",
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
          variant: "success",
          actionButton: (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 rounded-full"
              onClick={() => router.push("/partner/pricing")}
            >
              Set Pricing
            </Button>
          ),
        };
      }

      if (videoKycStatus === "rejected") {
        return {
          message: userData?.videoKycRejectionReason
            ? `Video KYC rejected: ${userData.videoKycRejectionReason}. Please contact support.`
            : "Video KYC rejected. Please contact support.",
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          variant: "error",
          actionButton: (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRequest}
            >
              Resubmit
            </Button>
          ),
        };
      }

      return {
        message: "Please complete document review before video KYC.",
        icon: <Info className="h-5 w-5 text-blue-500" />,
        variant: "info",
      };
    }

    if (partnerOnboardingSteps === 5) {
      return {
        message: "Set your pricing preferences to continue.",
        icon: <Info className="h-5 w-5 text-blue-500" />,
        variant: "info",
        actionButton: (
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push("/partner/pricing")}
          >
            Configure Pricing
          </Button>
        ),
      };
    }

    if (partnerOnboardingSteps === 6) {
      return {
        message:
          "Final review in progress. Your account will be activated soon.",
        icon: <Clock className="h-5 w-5 text-amber-500" />,
        variant: "warning",
      };
    }

    if (partnerOnboardingSteps >= 7) {
      return {
        message:
          "Congratulations! Your partner account is live. Start accepting rides now.",
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
        variant: "success",
        actionButton: (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => router.push("/partner/dashboard")}
          >
            Go To Dashboard
          </Button>
        ),
      };
    }

    return null;
  }, [
    partnerStatus,
    rejectionReason,
    partnerOnboardingSteps,
    currentStepIndex,
    currentStepLabel,
    videoKycStatus,
    router,
    userData?.videoKycRoomId,
    userData?.videoKycRejectionReason,
  ]);

  const cardBg = {
    info: "bg-blue-50 border-blue-100",
    warning: "bg-amber-50 border-amber-100",
    error: "bg-red-50 border-red-100",
    success: "bg-green-50 border-green-100",
  }[config?.variant ?? "info"];

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

        {config && (
          <div
            className={cn(
              "mb-6 rounded-2xl border p-4 flex items-center justify-between gap-4 flex-wrap",
              cardBg
            )}
          >
            <div className="flex items-center gap-3">
              {config.icon}
              <p className="text-sm font-dm text-gray-700">{config.message}</p>
            </div>
            {config.actionButton && <div>{config.actionButton}</div>}
          </div>
        )}

        <Card className="rounded-3xl border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                  Overall Progress
                </p>
                <Badge
                  variant="outline"
                  className="rounded-full bg-gray-50 text-gray-600"
                >
                  {completedCount} / {totalSteps} completed
                </Badge>
              </div>
              <Progress value={progressValue} className="h-2 rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STEPS.map((step, key) => {
                const Icon = step.icon;
                const isCompleted = key < partnerOnboardingSteps;
                const isActive = key === partnerOnboardingSteps;

                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      if (step.id == "pricing"){
                          if (userData?.videoKycStatus == "approved" && userData.partnerOnboardingSteps >= 5){
                              setPricingModalOpen(true)
                          }
                      }
                      else if (step.route) {
                        router.push(step.route);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer",
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
                          isCompleted || isActive
                            ? "text-gray-900"
                            : "text-gray-400"
                        )}
                      >
                        {step.label}
                      </p>

                      {isCompleted && (
                        <span className="text-[10px] text-[#16a34a] font-medium">
                          Completed
                        </span>
                      )}

                      {isActive && (
                        <span className="text-[10px] text-[#22c55e] font-medium">
                          In Progress
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
      <PricingModal
        open={pricingModalOpen}
        onOpenChange={setPricingModalOpen}
        onSave={handleSavePricing}
      />
    </div>
  );
}