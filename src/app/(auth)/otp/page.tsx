"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

const OTP_LENGTH = 6;

export default function OtpPage() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle digit input
  const handleChange = (index: number, value: string) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value.slice(-1); // keep last digit only
    setOtp(updated);
    setError("");

    // Move focus forward
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const updated = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => { updated[i] = char; });
    setOtp(updated);
    // Focus the next empty box or last box
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  // Resend OTP with cooldown
  const handleResend = () => {
    setResendTimer(30);
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    inputRefs.current[0]?.focus();

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);

    // trigger resend OTP API call here
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }
    setError("");
    // verify OTP logic
    console.log("OTP submitted:", code);
  };

  const isFilled = otp.every((d) => d !== "");

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-[450px] rounded-[28px] bg-white px-8 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-zinc-200">

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[32px] font-black tracking-[0.18em] text-zinc-950">
            Fleeter
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Premium Vehicle Booking</p>
        </div>

        {/* Icon */}
        <div className="mt-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 border border-green-100">
            <ShieldCheck className="h-8 w-8 text-green-500" />
          </div>
        </div>

        {/* Heading */}
        <div className="mt-5 text-center">
          <h2 className="text-[24px] font-semibold text-zinc-950">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
            We&apos;ve sent a 6-digit verification code to your email address. Enter it below to continue.
          </p>
        </div>

        {/* OTP Inputs */}
        <form className="mt-7" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`
                  h-14 w-12 rounded-xl border text-center text-[22px] font-bold text-zinc-900
                  outline-none transition-all duration-150 caret-transparent
                  ${digit
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-zinc-200 bg-white text-zinc-900"
                  }
                  focus:border-green-500 focus:ring-2 focus:ring-green-100
                `}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <p className="mt-3 text-center text-[13px] text-red-500">*{error}</p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={!isFilled}
            className="mt-6 h-12 w-full rounded-xl bg-green-500 text-sm text-white hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Verify & Continue
          </Button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-4">
          <div className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs font-medium tracking-[0.2em] text-zinc-400">
            DIDN&apos;T RECEIVE IT?
          </span>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        {/* Resend */}
        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-zinc-400">
              Resend code in{" "}
              <span className="font-semibold text-zinc-700">
                {resendTimer}s
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm font-semibold text-zinc-950 hover:text-zinc-600 transition-colors"
            >
              Resend Code
            </button>
          )}
        </div>

        {/* Back to register */}
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            ← Back to Sign Up
          </button>
        </div>
      </div>
    </main>
  );
}