import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking-model";
import User from "@/models/user-model";
import { NextResponse } from "next/server";

export async function GET() {
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

    const partner = await User.findOne({
      email: session.user.email,
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

    if (partner.role !== "partner") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        { status: 403 }
      );
    }

    const bookings = await Booking.find({
      driver: partner._id,
    })
      .populate("user", "name email mobileNumber")
      .populate("vehicle")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}