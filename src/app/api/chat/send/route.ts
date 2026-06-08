import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking-model";
import ChatMessage from "@/models/chatMessage-model";
import User from "@/models/user-model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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

    const body = await req.json();

    const { bookingId, text } = body;

    if (!bookingId || !text?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking ID and message are required",
        },
        { status: 400 }
      );
    }

    const currentUser = await User.findOne({
      email: session.user.email,
    });

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

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

    let sender: "user" | "driver";

    if (booking.user.toString() === currentUser._id.toString()) {
      sender = "user";
    } else if (booking.driver.toString() === currentUser._id.toString()) {
      sender = "driver";
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        { status: 403 }
      );
    }

    const message = await ChatMessage.create({
      booking: bookingId,
      sender,
      text,
    });

    return NextResponse.json({
      success: true,
      message,
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