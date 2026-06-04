import connectDb from "@/lib/db";
import User from "@/models/user-model";
import Vehicle from "@/models/vehicle-model";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	try {
	  await connectDb();
  
	  const { searchParams } = new URL(req.url);
  
	  const latitude = parseFloat(searchParams.get("latitude") || "0");
	  const longitude = parseFloat(searchParams.get("longitude") || "0");
	  const vehicleType = searchParams.get("vehicleType");
  
	  if (!latitude || !longitude || !vehicleType) {
		return Response.json({ message: "Missing data" }, { status: 400 });
	  }
	  console.log(latitude,longitude, vehicleType);
	  
	  const partners = await User.find({
		isOnline: true,
		role: "partner",
		partnerStatus: "approved",
		location: {
		  $near: {
			$geometry: {
			  type: "Point",
			  coordinates: [longitude, latitude],
			},
			$maxDistance: 10000,
		  },
		},
	  }).select("_id");
	  console.log(partners);
	  
	  if (partners.length === 0) {
		return Response.json({ message: "No partners found" });
	  }
  
	  const vehicles = await Vehicle.find({
		owner: { $in: partners },
		type: vehicleType.toLocaleLowerCase(),
		status: "approved",
		isActive: true,
	  }).lean();
  
	  return Response.json({ vehicles });
	} catch (error) {
	  console.error(error);
	  return Response.json({ error: "Server error" }, { status: 500 });
	}
  }