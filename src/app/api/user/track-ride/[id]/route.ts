import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking-model";
import User from "@/models/user-model";
import Vehicle from "@/models/vehicle-model";
import { NextRequest, NextResponse } from "next/server";

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

    const { id } = await params;

    const booking = await Booking.findById(id)
      .populate("user", "name email mobileNumber")
      .populate("driver", "name email mobileNumber currentLocation")
      .populate("vehicle");
      console.log(booking);
      

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error(error.message);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}