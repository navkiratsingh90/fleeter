"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User } from "lucide-react";
import Image from "next/image";
import google from "./../../../../public/google.png";

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    // handle register + trigger OTP send
  };

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

        {/* Google OAuth */}
        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full flex gap-4 rounded-xl border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
          >
            <Image src={google} width={25} alt="google" />
            Continue with Google
          </Button>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-4">
          <div className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs font-medium tracking-[0.2em] text-zinc-400">
            OR
          </span>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        <h2 className="text-[24px] font-semibold text-zinc-950">
          Create Account
        </h2>

        {/* Form */}
        <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="h-12 rounded-xl text-gray-800 border-zinc-200 pl-11 text-[14px]"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="h-12 rounded-xl text-gray-800 border-zinc-200 pl-11 text-[14px]"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-12 rounded-xl text-gray-800 border-zinc-200 pl-11 text-[14px]"
            />
          </div>

          {/* Validation hint */}
          <p className="pt-1 text-[13px] text-red-500">
            {error ? `*${error}` : "*Password must be at least 6 characters"}
          </p>

          <Button
            type="submit"
            className="mt-2 h-12 w-full rounded-xl bg-green-500 text-sm text-white hover:bg-zinc-800 transition-colors"
          >
            Sign Up
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-5 text-center">
          <p className="text-sm text-zinc-500">Already have an account?</p>
          <button
            type="button"
            className="mt-1 text-sm font-semibold text-zinc-950 hover:text-zinc-600 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
}