import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user-model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendMail } from "@/lib/send-mail";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    await connectDb();

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isEmailVerified) {
      return NextResponse.json(
        { message: "User already exists", success: false },
        { status: 400 }
      );
    }

 
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;

    if (existingUser && !existingUser.isEmailVerified) {
      // 🔁 Update existing unverified user
      existingUser.name = username;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpiresAt = otpExpiry;

      user = await existingUser.save();
    } else {
      user = await User.create({
        name: username,
        email,
        password: hashedPassword,
        isEmailVerified: false, 
        otp: otp,
        otpExpiresAt: otpExpiry,
      });
    }

    // 📧 Send OTP
    await sendMail(
      email,
      `Your OTP for registration is ${otp}. It expires in 10 minutes.`
    );

    return NextResponse.json(
      { message: "OTP sent to email", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}

function generateOTP(length = 6) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1).toString();
}