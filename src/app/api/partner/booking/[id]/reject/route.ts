import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking-model";
import User from "@/models/user-model";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
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

    const { bookingId } = await params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },
        { status: 404 }
      );
    }

    if (String(booking.driver) !== String(partner._id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Not allowed",
        },
        { status: 403 }
      );
    }

    if (booking.bookingStatus !== "requested") {
      return NextResponse.json(
        {
          success: false,
          message: "Booking already processed",
        },
        { status: 400 }
      );
    }

    booking.bookingStatus = "rejected";

    await booking.save();

    return NextResponse.json({
      success: true,
      message: "Ride rejected successfully",
      booking,
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