import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user-model";
import Vehicle from "@/models/vehicle-model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid vehicle id" },
        { status: 400 }
      );
    }

    const { reason } = await req.json();

    if (!reason?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Rejection reason is required",
        },
        { status: 400 }
      );
    }

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return NextResponse.json(
        { success: false, message: "Vehicle not found" },
        { status: 404 }
      );
    }

    vehicle.status = "rejected";
    vehicle.rejectionReason = reason.trim();

    await vehicle.save();

    return NextResponse.json(
      {
        success: true,
        message: "Vehicle rejected successfully",
        vehicle,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reject Vehicle Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}