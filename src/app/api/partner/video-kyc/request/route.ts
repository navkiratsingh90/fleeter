import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const partner = await User.findOne({
      email: session.user.email,
    });

    if (!partner) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (partner.videoKycStatus !== "rejected") {
      return NextResponse.json(
        {
          success: false,
          message:
            "KYC can only be resubmitted when the current status is rejected",
        },
        { status: 400 }
      );
    }

    // Reset KYC details
    partner.videoKycStatus = "pending";
    partner.videoKycRejectionReason = undefined;
    partner.videoKycRoomId = undefined;

    await partner.save();

    return NextResponse.json(
      {
        success: true,
        message: "Video KYC resubmission request created successfully",
        data: {
          videoKycStatus: partner.videoKycStatus,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Video KYC Resubmit Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}