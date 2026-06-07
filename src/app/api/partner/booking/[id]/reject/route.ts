import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking-model";
import User from "@/models/user-model";
import axios from "axios";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
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

    const { id } = await params;
    
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
    await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/emit`, {
      event : "reject-booking",
      userId : booking.user,
      data : "idle"
    })
    await booking.deleteOne()

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