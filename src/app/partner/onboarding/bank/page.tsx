// app/bank-payout/page.tsx
"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { ArrowLeft, ShieldCheck, CreditCard, Building, Phone, IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

// Type for form data
interface BankPayoutForm {
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  mobileNumber: string;
  upi: string;
}

export default function BankPayoutPage(): React.ReactElement {
  const router = useRouter()
  const [formData, setFormData] = useState<BankPayoutForm>({
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    mobileNumber: "",
    upi: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isFormValid = Boolean(
    formData.accountHolder &&
    formData.accountNumber &&
    formData.ifsc &&
    formData.mobileNumber
  );

  const handleContinue = async () => {
    try {
      console.log(formData);
      
        const data = await axios.post('/api/partner/onboarding/bank' , formData)
        console.log(data);
        router.push('/')
    } catch (error) {
        console.error(error);
        
    }
};
useEffect(() => {
  const getUserVehicle = async () => {
    try {
        const data = await axios.get('/api/partner/onboarding/bank')
        console.log(data);
        setFormData((prev) => ({...prev, accountHolder : data.data.partnerBank.accountHolder}))
         setFormData((prev) => ({...prev, accountNumber : data.data.partnerBank.accountNumber}))
          setFormData((prev) => ({...prev, ifsc : data.data.partnerBank.ifsc}))
           setFormData((prev) => ({...prev, mobileNumber : data.data.mobileNumber}))
            setFormData((prev) => ({...prev, upi : data.data.partnerBank.upi}))
    } catch (error) {
      console.error();
      
    }
  }
  getUserVehicle()
},[])
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffb] to-[#f0fdf4] flex items-center justify-center px-4 py-10 font-dm">
      <div className="w-full max-w-[560px]">
        {/* Step Badge */}
        <div className="flex justify-center mb-6">
          <Badge className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-4 py-1.5 rounded-full uppercase tracking-widest text-[11px] font-semibold hover:bg-[#f0fdf4]">
            <span className="w-4 h-4 rounded-full bg-[#22c55e] text-white grid place-items-center text-[9px] mr-2">
              1
            </span>
            Step 1 of 3
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
                  Bank & Payout Setup
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Used for partner payouts
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="mt-8 space-y-5">
              {/* Account holder name */}
              <div>
                <label className="block font-dm text-sm font-semibold text-gray-700 mb-2">
                  Account holder name
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    type="text"
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleInputChange}
                    placeholder="Enter full name as per bank"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#22c55e] focus:ring-2 focus:ring-[#f0fdf4] outline-none transition font-dm text-sm"
                  />
                </div>
              </div>

              {/* Bank account number */}
              <div>
                <label className="block font-dm text-sm font-semibold text-gray-700 mb-2">
                  Bank account number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Enter account number"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#22c55e] focus:ring-2 focus:ring-[#f0fdf4] outline-none transition font-dm text-sm"
                  />
                </div>
              </div>

              {/* IFSC code */}
              <div>
                <label className="block font-dm text-sm font-semibold text-gray-700 mb-2">
                  IFSC code
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="ifsc"
                    value={formData.ifsc}
                    onChange={handleInputChange}
                    placeholder="HDFC0001234"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#22c55e] focus:ring-2 focus:ring-[#f0fdf4] outline-none transition font-dm text-sm"
                  />
                </div>
              </div>

              {/* Mobile number */}
              <div>
                <label className="block font-dm text-sm font-semibold text-gray-700 mb-2">
                  Mobile number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="10 digit mobile number"
                    maxLength={10}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#22c55e] focus:ring-2 focus:ring-[#f0fdf4] outline-none transition font-dm text-sm"
                  />
                </div>
              </div>

              {/* UPI ID (optional) */}
              <div>
                <label className="block font-dm text-sm font-semibold text-gray-700 mb-2">
                  UPI ID <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="upi"
                    value={formData.upi}
                    onChange={handleInputChange}
                    placeholder="name@upi"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#22c55e] focus:ring-2 focus:ring-[#f0fdf4] outline-none transition font-dm text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Security / Verification Note */}
            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
              <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center shrink-0">
                <ShieldCheck size={14} className="text-[#22c55e]" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Bank details are{" "}
                <span className="font-semibold text-gray-700">verified before first payout</span>.
                This usually takes <span className="font-semibold text-gray-700">24–48 hours</span>.
              </p>
            </div>

            {/* Continue Button */}
			<Button
			disabled={!isFormValid}
			onClick={handleContinue}
			className="w-full mt-7 h-14 rounded-2xl font-syne text-[15px] font-bold tracking-tight text-white disabled:opacity-40"
			style={{
				backgroundColor: isFormValid ? "#22c55e" : "#111827",
			}}
			>
			Continue →
			</Button>

            <p className="text-center text-xs text-gray-400 mt-4">
              You can update payout details later from your profile
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
