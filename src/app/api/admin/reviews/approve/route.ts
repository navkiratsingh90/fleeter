import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank-model";
import PartnerDocs from "@/models/partnerDocs-model";
import User from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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

      if (partner.partnerStatus === "approved") {
         return NextResponse.json(
            {
               success: false,
               message: "Partner already approved",
            },
            { status: 400 }
         );
      }

      const partnerBank = await PartnerBank.findOne({
         owner: partner._id,
      });

      const partnerDocs = await PartnerDocs.findOne({
         owner: partner._id,
      });

      if (!partnerBank || !partnerDocs) {
         return NextResponse.json(
            {
               success: false,
               message: "Partner documents or bank details not found",
            },
            { status: 404 }
         );
      }

      partner.partnerStatus = "approved";
      partner.partnerOnboardingSteps = 4;

      partnerBank.status = "verified";
      partnerDocs.status = "approved";

      await partner.save();
      await partnerBank.save();
      await partnerDocs.save();

      return NextResponse.json(
         {
            success: true,
            message: "Partner approved successfully",
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