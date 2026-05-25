// "use client"
// import axios from 'axios'
// import { useParams } from 'next/navigation'
// import React from 'react'

// const page = () => {
// 	const {id}  = useParams()
// 	const handleGetData = async () => {
// 		try {
// 			const data = await axios.get("url")
// 			console.log(data);
			
// 		} catch (error) {
// 			console.error(error);
			
// 		}
// 	}
//   return (
// 	<div>page</div>
//   )
// }

// export default page
// app/admin/partners/review/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CarFront,
  Building2,
  FileText,
  ShieldCheck,
  Clock3,
  CircleCheckBig,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import axios from "axios";

// Helper Components
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function DocumentPreview({ title }: { title: string }) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="font-syne font-semibold text-gray-900">{title}</h3>
      </div>
      <CardContent className="p-5 flex flex-col items-center justify-center min-h-[200px] bg-gradient-to-br from-white to-gray-50">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CircleCheckBig className="h-6 w-6" />
        </div>
        <p className="text-center text-xs text-gray-500">
          Document preview will appear here
        </p>
      </CardContent>
      <div className="border-t border-gray-200 p-3 text-center">
        <Button variant="outline" size="sm" className="rounded-full text-green-600 border-green-200 hover:bg-green-50">
          Open Full Document
        </Button>
      </div>
    </Card>
  );
}

// Main Page
export default function PartnerReviewPage() {
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const { id } = useParams();

const [partner, setPartner] = useState<any>(null);

const [loading, setLoading] = useState(true)
  const handleApproveConfirm = () => {
    alert("Partner approved (demo)");
    setApproveDialogOpen(false);
  };

  const handleRejectConfirm = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    alert(`Partner rejected. Reason: ${rejectionReason}`);
    setRejectDialogOpen(false);
    setRejectionReason("");
  };
  const handleGetPartner = async () => {
    try {
  
      const data = await axios.get(
        `/api/admin/partners/review/${id}`
      );
  
      console.log(data.data);
  
      setPartner(data.data);
  
    } catch (error: any) {
  
      console.log(
        error.response?.data?.message
      );
  
    } finally {
  
      setLoading(false);
  
    }
  };
  useEffect(() => {

    if (id) {
      handleGetPartner();
    }
  
  }, [id]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] font-dm">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-gray-300"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-syne text-xl font-bold text-gray-900">{partner.name}</h1>
              <p className="text-xs text-gray-500">{partner.email}</p>
            </div>
          </div>
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 rounded-full px-4 py-1.5">
            <Clock3 className="h-3 w-3 mr-1" />
            {partner.status}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-3xl border-gray-100 shadow-md overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CarFront className="h-5 w-5 text-green-600" />
                  <h2 className="font-syne text-lg font-bold text-gray-900">Vehicle Details</h2>
                </div>
                <div className="space-y-1">
                  <DetailRow label="Vehicle Type" value={partner.vehicle.type} />
                  <DetailRow label="Registration Number" value={partner.vehicle.registrationNumber} />
                  <DetailRow label="Model" value={partner.vehicle.model} />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-gray-100 shadow-md overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-green-600" />
                  <h2 className="font-syne text-lg font-bold text-gray-900">Documents</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {partner.documents.map((doc : any) => (
                    <DocumentPreview key={doc} title={doc} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="rounded-3xl border-gray-100 shadow-md overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-green-600" />
                  <h2 className="font-syne text-lg font-bold text-gray-900">Bank Details</h2>
                </div>
                <div className="space-y-1">
                  <DetailRow label="Account Holder" value={partner.bank.accountHolder} />
                  <DetailRow label="Account Number" value={partner.bank.accountNumber} />
                  <DetailRow label="IFSC Code" value={partner.bank.ifscCode} />
                  <DetailRow label="UPI" value={partner.bank.upi} />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-gray-100 shadow-md overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <h2 className="font-syne text-lg font-bold text-gray-900">Admin Check</h2>
                </div>
                <p className="text-sm text-gray-500 mb-5">
                  Verify documents carefully before approving.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => setApproveDialogOpen(true)}
                    className="w-full bg-green-600 hover:bg-green-700 rounded-xl py-6 text-base font-semibold"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => setRejectDialogOpen(true)}
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 rounded-xl py-6 text-base font-semibold"
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Approve Confirmation Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-syne text-xl">Approve Partner</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve <span className="font-semibold">{partner.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleApproveConfirm}>
              Yes, Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog with Reason */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-syne text-xl">Reject Partner Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. This will be shared with the partner.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <Label htmlFor="rejectionReason" className="text-sm font-medium">
              Rejection Reason
            </Label>
            <Textarea
              id="rejectionReason"
              placeholder="Enter reason (e.g., Invalid documents, incomplete details...)"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={!rejectionReason.trim()}
            >
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}