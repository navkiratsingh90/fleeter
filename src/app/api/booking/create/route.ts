import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking-model";
import User from "@/models/user-model";
import Vehicle from "@/models/vehicle-model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

    const {
      driverId,
      vehicleId,
      pickUpAddress,
      dropAddress,
      pickUpLocation,
      dropLocation,
      fare,
      mobileNumber,
    } = await req.json();

    if (
      !driverId ||
      !vehicleId ||
      !pickUpAddress ||
      !dropAddress ||
      !pickUpLocation?.coordinates?.length ||
      !dropLocation?.coordinates?.length ||
      !fare ||
      !mobileNumber
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

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

    const driver = await User.findById(driverId);

    if (!driver) {
      return NextResponse.json(
        {
          success: false,
          message: "Driver not found",
        },
        { status: 404 }
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

    if (String(driver._id) === String(user._id)) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot book your own vehicle",
        },
        { status: 400 }
      );
    }

    const activeBooking = await Booking.findOne({
      user: user._id,
      bookingStatus: {
        $in: [
          "requested",
          "awaiting_payment",
          "confirmed",
          "started",
        ],
      },
    });

    if (activeBooking) {
      return NextResponse.json(
        {
          success: false,
		  booking : activeBooking,
          message:
            "You already have an active booking",
        },
        { status: 200 }
      );
    }

    const booking = await Booking.create({
      user: user._id,
      driver: driver._id,
      vehicle: vehicle._id,

      pickUpAddress,
      dropAddress,

      pickupLocation: {
        type: "Point",
        coordinates: pickUpLocation.coordinates,
      },

      dropLocation: {
        type: "Point",
        coordinates: dropLocation.coordinates,
      },

      fare: Number(fare),

      driverMobileNumber:
        driver.mobileNumber || "",

      userMobileNumber: mobileNumber,

      bookingStatus: "requested",
      paymentStatus: "pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Ride request sent successfully",
        booking,
      },
      { status: 201 }
    );
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