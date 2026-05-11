import connectDb from "@/lib/db";
import User from "@/models/user-model";
import Vehicle from "@/models/vehicle-model";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const VEHICLE_REGEX = /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,2}[0-9]{4}$/;

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const { vehicleModel, number, type } = await req.json();

    if (!vehicleModel || !number || !type) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const finalNumber = number.toUpperCase().replace(/\s+/g, "");

    if (!VEHICLE_REGEX.test(finalNumber)) {
      return NextResponse.json(
        { success: false, message: "Invalid vehicle number" },
        { status: 400 }
      );
    }

    const duplicateVehicle = await Vehicle.findOne({
      number: finalNumber,
      owner: { $ne: user._id },
    });

    if (duplicateVehicle) {
      return NextResponse.json(
        { success: false, message: "Vehicle number already exists" },
        { status: 409 }
      );
    }

    const existingVehicle = await Vehicle.findOne({
      owner: user._id,
    });

    if (existingVehicle) {
      existingVehicle.vehicleModel = vehicleModel;
      existingVehicle.number = finalNumber;
      existingVehicle.type = type;

      await existingVehicle.save();

      return NextResponse.json(
        {
          success: true,
          message: "Vehicle updated successfully",
          vehicle: existingVehicle,
        },
        { status: 200 }
      );
    }

    const newVehicle = await Vehicle.create({
      owner: user._id,
      vehicleModel,
      number: finalNumber,
      type,
    });

    if (user.partnerOnboardingSteps < 1) {
      user.partnerOnboardingSteps = 1;
    }

    user.role = "partner";

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Vehicle added successfully",
        vehicle: newVehicle,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Vehicle API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req : NextRequest){
	connectDb()
	try {
		await connectDb();

		const session = await auth();
	
		if (!session || !session.user?.email) {
		  return NextResponse.json(
			{ success: false, message: "Unauthorized" },
			{ status: 401 }
		  );
		}
	
		const user = await User.findOne({ email: session.user.email });
	
		if (!user) {
		  return NextResponse.json(
			{ success: false, message: "User not found" },
			{ status: 404 }
		  );
		}

		const existingVehicle = await Vehicle.findOne({
		  owner: user._id,
		});
		if (existingVehicle){
			return NextResponse.json(
			{
				success: true,
				message: "Vehicle sent successfully",
				vehicle: existingVehicle,
			},
			{ status: 201 }
			);
		}
		else{
			return NextResponse.json(
				{
					success: true,
					message: "No vehicle Found",
					vehicle: null,
				},
				{ status: 201 }
				);
		}
	} catch (error) {
		console.error(error);
		
	}
}