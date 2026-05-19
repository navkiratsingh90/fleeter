import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank-model";
import PartnerDocs from "@/models/partnerDocs-model";
import User from "@/models/user-model";
import Vehicle from "@/models/vehicle-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
   req: NextRequest,
   context: { params: Promise<{ id: string }> }
) {
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

      const partnerId = (await context.params).id;

      const partner = await User.findById(partnerId).select("-password");

      if (!partner || partner.role !== "partner") {
         return NextResponse.json(
            {
               success: false,
               message: "Partner not found",
            },
            { status: 404 }
         );
      }

      const vehicles = await Vehicle.find({ owner: partnerId });

      const bankDetails = await PartnerBank.findOne({ owner: partnerId });

      const partnerDocs = await PartnerDocs.findOne({ owner: partnerId });

      return NextResponse.json(
         {
            success: true,
            partner,
            vehicles,
            bankDetails,
            partnerDocs,
         },
         { status: 200 }
      );
   } catch (error) {
      console.log(error);

      return NextResponse.json(
         {
            success: false,
            message: "Internal server error",
         },
         { status: 500 }
      );
   }
}