import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user-model";
import Vehicle from "@/models/vehicle-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (
      !session ||
      !session.user?.email ||
      session.user?.role !== "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const totalPartners = await User.countDocuments({
      role: "partner",
    });

    const totalApprovedPartners = await User.countDocuments({
      role: "partner",
      partnerStatus: "approved",
    });

    const totalPendingPartners = await User.countDocuments({
      role: "partner",
      partnerStatus: "pending",
    });

    const totalRejectedPartners = await User.countDocuments({
      role: "partner",
      partnerStatus: "rejected",
    });

    const pendingPartnerUsers = await User.find(
      {
        role: "partner",
        partnerStatus: "pending",
        partnerOnboardingSteps: 3,
      },
    );

    const partnerIds = pendingPartnerUsers.map((p) => p._id);

    const partnerVehicles = await Vehicle.find(
      {
        owner: { $in: partnerIds },
      },
    );

    const vehicleTypeMap = new Map(
      partnerVehicles.map((v) => [String(v.owner), v.type])
    );

    const pendingPartnersReviews = pendingPartnerUsers.map((p) => ({
      _id: p._id,
      name: p.username,
      email: p.email,
      vehicleType: vehicleTypeMap.get(String(p._id)) || "Not Added",
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Dashboard data fetched successfully",
        stats: {
          totalPartners,
          totalApprovedPartners,
          totalPendingPartners,
          totalRejectedPartners,
        },
        pendingPartnersReviews,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("ADMIN DASHBOARD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}