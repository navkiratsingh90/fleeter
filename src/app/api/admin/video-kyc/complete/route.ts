import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user-model";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    // Check admin authorization
    if (
      !session ||
      !session.user?.email ||
      session.user.role !== "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { roomId, action, reason } = await req.json();

    // Validate roomId
    if (!roomId) {
      return NextResponse.json(
        {
          success: false,
          message: "Room ID is required",
        },
        { status: 400 }
      );
    }

    // Validate action
    if (!["approved", "rejected"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid action. Must be 'approved' or 'rejected'",
        },
        { status: 400 }
      );
    }

    const partner = await User.findOne({
      videoKycRoomId: roomId,
      role: "partner",
    });

    if (!partner) {
      return NextResponse.json(
        {
          success: false,
          message: "Partner not found",
        },
        { status: 404 }
      );
    }

    if (action === "approved") {
      partner.videoKycStatus = "approved";
      partner.videoKycRejectionReason = undefined;

      // Move onboarding to next step
      partner.partnerOnboardingSteps = 5;
    }

    if (action === "rejected") {
      if (!reason || !reason.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Rejection reason is required",
          },
          { status: 400 }
        );
      }

      partner.videoKycStatus = "rejected";
      partner.videoKycRejectionReason = reason.trim();
    }

    await partner.save();

    return NextResponse.json(
      {
        success: true,
        message:
          action === "approved"
            ? "KYC approved successfully"
            : "KYC rejected successfully",
        partner,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Video KYC Action Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}