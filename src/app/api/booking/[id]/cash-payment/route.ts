import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking-model";
import User from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
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

    const user = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },
        { status: 404 }
      );
    }

    if (String(booking.user) !== String(user._id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Not allowed",
        },
        { status: 403 }
      );
    }

    if (
      booking.bookingStatus !== "awaiting_payment"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Booking is not awaiting payment",
        },
        { status: 400 }
      );
    }

    booking.paymentMethod = "cash";
    booking.paymentStatus = "pending";
    booking.bookingStatus = "confirmed";

    await booking.save();

    return NextResponse.json({
      success: true,
      message: "Cash payment selected",
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