import { auth } from "@/auth";
import connectDb from "@/lib/db";
import uploadToCloudinary from "@/lib/cloudinary";
import Vehicle from "@/models/vehicle-model";
import User from "@/models/user-model";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.email) {
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
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const vehicle = await Vehicle.findOne({
      owner: partner._id,
    });

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehicle not found",
        },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    const image = formData.get("image") as File | null;
    const waitingCharge = formData.get("waitingCharge");
    const baseFare = formData.get("baseFare");
    const pricePerKm = formData.get("pricePerKm");
	console.log(baseFare , pricePerKm);
	
    let updated = false;

    // Upload image
    if (image && image.size > 0) {
      const imageUrl = await uploadToCloudinary(image);

      vehicle.imageUrl = imageUrl;
      updated = true;
    }

    // Update pricing
    if (baseFare !== null && baseFare !== "") {
      vehicle.baseFare = Number(baseFare);
      updated = true;
    }

    if (waitingCharge !== null && waitingCharge !== "") {
      vehicle.waitingCharge = Number(waitingCharge);
      updated = true;
    }

    if (pricePerKm !== null && pricePerKm !== "") {
      vehicle.pricePerKm = Number(pricePerKm);
      updated = true;
    }

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          message: "No data provided to update",
        },
        { status: 400 }
      );
    }

    // Send for review again
    vehicle.status = "pending";
    vehicle.rejectionReason = undefined;

    await vehicle.save();

    // Move onboarding to next step
    if (partner.partnerOnboardingSteps < 6) {
      partner.partnerOnboardingSteps = 6;
      await partner.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Pricing updated successfully",
        vehicle,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Pricing Update Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
	try {
	  await connectDb();
  
	  const session = await auth();
  
	  if (!session || !session.user?.email) {
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
			message: "User not found",
		  },
		  { status: 404 }
		);
	  }
  
	  const vehicle = await Vehicle.findOne({
		owner: partner._id,
	  });
  
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
		  message: "Pricing fetched successfully",
		  vehicle,
		},
		{ status: 200 }
	  );
	} catch (error) {
	  console.error("Pricing Update Error:", error);
  
	  return NextResponse.json(
		{
		  success: false,
		  message: "Something went wrong",
		},
		{ status: 500 }
	  );
	}
  }