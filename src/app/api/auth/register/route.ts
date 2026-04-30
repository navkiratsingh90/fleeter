import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user-model";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    await connectDb();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { msg: "User already exists", success: false },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { msg: "User Registered Successfully", success: true, user },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { msg: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}