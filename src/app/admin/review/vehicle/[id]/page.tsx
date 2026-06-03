"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Clock3,
  ShieldCheck,
  CarFront,
  FileText,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  IndianRupee,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IVehicle } from "@/models/vehicle-model";
import { useParams, useRouter } from "next/navigation";

type PartnerStatus = "pending" | "approved" | "rejected";

type Partner = {
  _id?: string;
  name: string;
  email: string;
  partnerStatus: PartnerStatus;
};

type Vehicle = {
  _id?: string;
  type?: string;
  number?: string;
  vehicleModel?: string;
  imageUrl?: string;
  baseFare?: number;
  pricePerKm?: number;
  waitingCharge?: number;
  status?: "pending" | "approved" | "rejected";
};

type BankDetails = {
  accountHolder?: string;
  accountNumber?: string;
  ifsc?: string;
  upi?: string;
};

type DocumentMap = {
  aadharUrl?: string;
  licenseUrl?: string;
  rcUrl?: string;
};

const STATUS_STYLES: Record<PartnerStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-0 py-3">
      <span className="text-[14px] text-gray-400">{label}</span>
      <span className="text-[14px] font-bold text-gray-900 text-right break-all">
        {value}
      </span>
    </div>
  );
}

export default function VendorReviewPage() {
	const vehicleId = useParams()
	const router = useRouter()
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [status, setStatus] = useState<PartnerStatus>("pending");
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [vehicle ,setVehicle] = useState<IVehicle | null>(null)

  // Replace these with your fetched data
  const partner: Partner = {
    name: "Ankush Sahu",
    email: "ankush25102002@gmail.com",
    partnerStatus: status,
  };

  const handleApproveConfirm = async () => {
    if (!vehicle?._id) return;

    try {
      setLoadingApprove(true);
      const {data} = await axios.patch(`/api/admin/reviews/vehicle/${vehicle?._id}/approve`);
	  console.log(data);
      setStatus("approved");
      setApproveDialogOpen(false);
	  router.push('/')
    } catch (error) {
      console.error("Approve error:", error);
    } finally {
      setLoadingApprove(false);
    }
  };
  const handleRejectConfirm = async () => {
    if (!vehicle?._id || !rejectionReason.trim()) return;

    try {
      setLoadingReject(true);
      const data = await axios.patch(`/api/admin/reviews/vehicle/${vehicle?._id}/reject`, {
        reason: rejectionReason.trim(),
      });
	  console.log(data);
	  
      setStatus("rejected");
      setRejectDialogOpen(false);
	  router.push('/')
    } catch (error) {
      console.error("Reject error:", error);
    } finally {
      setLoadingReject(false);
    }
  };
  const getVehicleDetails = async () => {
	try {
		console.log(vehicleId.id);
		
		const {data} = await axios.get(`/api/admin/reviews/vehicle/${vehicleId.id}`)
		setVehicle(data.vehicle)
		console.log(data);
		
	} catch (error) {
		console.error(error);
		
	}
  }
  useEffect(() => {
	getVehicleDetails()
  },[])
  if (!vehicle) return <div>Loading...</div>
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] font-dm">
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
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
              <h1 className="font-syne text-xl font-bold text-gray-900">
                {partner.name}
              </h1>
              <p className="text-xs text-gray-500">{partner.email}</p>
            </div>
          </div>

          <Badge
            className={cn(
              "rounded-full border px-4 py-1.5",
              STATUS_STYLES[partner.partnerStatus]
            )}
          >
            <Clock3 className="mr-1 h-3 w-3" />
            {partner.partnerStatus}
          </Badge>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden rounded-3xl border-gray-100 shadow-md">
              <CardContent className="p-0">
                <div className="flex min-h-[420px] items-center justify-center bg-white sm:min-h-[560px]">
                  <img
                    src={vehicle.imageUrl}
                    alt="Vehicle"
                    className="h-full w-full max-h-[760px] object-contain p-4 sm:p-6 lg:p-8"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="overflow-hidden rounded-3xl border-gray-100 shadow-md">
				<CardContent className="p-6">
					<div className="mb-4 flex items-center gap-2">
					<CarFront className="h-5 w-5 text-green-600" />
					<h2 className="font-syne text-lg font-bold text-gray-900">
						Vehicle Details
					</h2>
					</div>

					<div className="space-y-1">
					<DetailRow
						label="Vehicle Type"
						value={vehicle.type || "N/A"}
					/>

					<div className="border-t border-gray-100" />

					<DetailRow
						label="Registration Number"
						value={vehicle.number || "N/A"}
					/>

					<div className="border-t border-gray-100" />

					<DetailRow
						label="Vehicle Model"
						value={vehicle.vehicleModel || "N/A"}
					/>
					</div>
				</CardContent>
				</Card>
				<Card className="overflow-hidden rounded-3xl border-gray-100 shadow-md">
  <CardContent className="p-6">
    <div className="mb-4 flex items-center gap-2">
      <IndianRupee className="h-5 w-5 text-green-600" />
      <h2 className="font-syne text-lg font-bold text-gray-900">
        Pricing Configuration
      </h2>
    </div>

    <div className="space-y-1">
      <DetailRow
        label="Base Fare"
        value={
          vehicle.baseFare !== undefined
            ? `₹ ${vehicle.baseFare}`
            : "N/A"
        }
      />

      <div className="border-t border-gray-100" />

      <DetailRow
        label="Price Per KM"
        value={
          vehicle.pricePerKm !== undefined
            ? `₹ ${vehicle.pricePerKm}`
            : "N/A"
        }
      />

      <div className="border-t border-gray-100" />

      <DetailRow
        label="Waiting Charge"
        value={
          vehicle.waitingCharge !== undefined
            ? `₹ ${vehicle.waitingCharge}`
            : "N/A"
        }
      />
    </div>
  </CardContent>
</Card>
            <Card className="rounded-3xl border-gray-100 shadow-md">
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <h2 className="font-syne text-lg font-bold text-gray-900">
                    Admin Check
                  </h2>
                </div>

                <p className="mb-5 text-sm text-gray-500">
                  Verify documents carefully before approving.
                </p>

                <div className="space-y-3">
                  <Button
                    onClick={() => setApproveDialogOpen(true)}
                    className="h-12 w-full rounded-xl bg-green-600 py-6 text-base font-semibold hover:bg-green-700"
                  >
                    Approve
                  </Button>

                  <Button
                    onClick={() => setRejectDialogOpen(true)}
                    variant="outline"
                    className="h-12 w-full rounded-xl border-red-200 py-6 text-base font-semibold text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-syne text-xl">
              Approve Partner
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to approve{" "}
              <span className="font-semibold">{partner.name}</span>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
              disabled={loadingApprove}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApproveConfirm}
              disabled={loadingApprove}
            >
              {loadingApprove ? "Approving..." : "Yes, Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-syne text-xl">
              Reject Partner Application
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <Label htmlFor="rejectionReason">Rejection Reason</Label>
            <Textarea
              id="rejectionReason"
              placeholder="Enter reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
            {!rejectionReason.trim() && (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <AlertCircle className="h-4 w-4" />
                Rejection reason is required
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
				handleRejectConfirm()
				setRejectDialogOpen(false)
			  }}
              disabled={loadingReject}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={!rejectionReason.trim() || loadingReject}
            >
              {loadingReject ? "Rejecting..." : "Confirm Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}