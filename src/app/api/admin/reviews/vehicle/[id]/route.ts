import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Vehicle from "@/models/vehicle-model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
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

    const { id: vehicleId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid vehicle id",
        },
        { status: 400 }
      );
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehicle not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        vehicle,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Vehicle Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}