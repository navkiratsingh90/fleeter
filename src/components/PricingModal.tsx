"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ImagePlus,
  Trash2,
  X,
  CarFront,
} from "lucide-react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type PricingValues = {
  baseFare: string;
  pricePerKm: string;
  waitingCharge: string;
  imageFile: File | null;
};

type PricingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: PricingValues) => void | Promise<void>;
};

export default function PricingModal({
  open,
  onOpenChange,
  onSave,
}: PricingModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [baseFare, setBaseFare] = useState<string>("");
  const [pricePerKm, setPricePerKm] = useState<string>("");
  const [waitingCharge, setWaitingCharge] = useState<string>("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const canSave = useMemo(() => {
    return (
      String(baseFare).trim() !== "" &&
      String(pricePerKm).trim() !== "" &&
      String(waitingCharge).trim() !== ""
    );
  }, [baseFare, pricePerKm, waitingCharge]);

  const getPricingDetails = async () => {
    try {
      const { data } = await axios.get(
        "/api/partner/onboarding/pricing"
      );
	  console.log(data);
	  
      const vehicle = data?.vehicle;

      if (!vehicle) return;

      setBaseFare(String(vehicle.baseFare ?? ""));
      setPricePerKm(String(vehicle.pricePerKm ?? ""));
      setWaitingCharge(String(vehicle.waitingCharge ?? ""));

      if (vehicle.imageUrl) {
        setImagePreview(vehicle.imageUrl);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (open) {
      getPricingDetails();
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const preview = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(preview);
  };

  const handleRemoveImage = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!canSave) return;

    try {
      setLoading(true);

      await onSave({
        baseFare,
        pricePerKm,
        waitingCharge,
        imageFile,
      });

      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] rounded-3xl">
        <DialogHeader>
          <DialogTitle>
            Pricing and Vehicle Image
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* IMAGE SECTION */}

          <div className="rounded-2xl border-2 border-dashed p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CarFront size={18} />
                <span>Vehicle Image</span>
              </div>

              {imagePreview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex min-h-[220px] cursor-pointer items-center justify-center rounded-2xl border bg-muted"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Vehicle"
                  className="max-h-[220px] w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <ImagePlus className="mx-auto mb-3 h-10 w-10" />
                  <p>Click to upload vehicle image</p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* FIELDS */}

          <div className="space-y-4">
            <div>
              <Label>Base Fare</Label>
              <Input
                value={baseFare}
                onChange={(e) =>
                  setBaseFare(e.target.value)
                }
              />
            </div>

            <div>
              <Label>Price Per KM</Label>
              <Input
                value={pricePerKm}
                onChange={(e) =>
                  setPricePerKm(e.target.value)
                }
              />
            </div>

            <div>
              <Label>Waiting Charge</Label>
              <Input
                value={waitingCharge}
                onChange={(e) =>
                  setWaitingCharge(e.target.value)
                }
              />
            </div>
          </div>

          {/* BUTTONS */}

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={!canSave || loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}