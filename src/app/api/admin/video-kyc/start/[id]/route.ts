import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id: partnerId } = await params;

    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid partner ID",
        },
        { status: 400 }
      );
    }

    const roomId = `kyc-${partnerId}-${Date.now()}`;

    const partner = await User.findOneAndUpdate(
      {
        _id: partnerId,
        role: "partner",
      },
      {
        $set: {
          videoKycRoomId: roomId,
          videoKycStatus: "in_progress",
          partnerOnboardingSteps: 4,
        },
      },
      {
        new: true,
        select: "-password",
      }
    );

    if (!partner) {
      return NextResponse.json(
        {
          success: false,
          message: "Partner not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Video KYC room created successfully",
        roomId,
        partner,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Create KYC Room Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}