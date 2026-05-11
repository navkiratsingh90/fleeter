import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank-model";
import User from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const ACCOUNT_REGEX = /^[0-9]{9,18}$/;
const UPI_REGEX = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;

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

      const { accountHolder, accountNumber, ifsc, upi, mobileNumber } =
         await req.json();

      if (!accountHolder || !accountNumber || !ifsc || !mobileNumber) {
         return NextResponse.json(
            {
               success: false,
               message: "Required fields are missing",
            },
            { status: 400 }
         );
      }

      const finalIfsc = ifsc.toUpperCase().trim();
      const finalAccountNumber = accountNumber.trim();
      const finalUpi = upi?.trim() || "";

      if (!ACCOUNT_REGEX.test(finalAccountNumber)) {
         return NextResponse.json(
            {
               success: false,
               message: "Invalid account number",
            },
            { status: 400 }
         );
      }

      if (!IFSC_REGEX.test(finalIfsc)) {
         return NextResponse.json(
            {
               success: false,
               message: "Invalid IFSC code",
            },
            { status: 400 }
         );
      }

      if (finalUpi && !UPI_REGEX.test(finalUpi)) {
         return NextResponse.json(
            {
               success: false,
               message: "Invalid UPI ID",
            },
            { status: 400 }
         );
      }

      const partnerBank = await PartnerBank.findOneAndUpdate(
         {
            owner: user._id,
         },
         {
            $set: {
               owner: user._id,
               accountHolder,
               accountNumber: finalAccountNumber,
               ifsc: finalIfsc,
               upi: finalUpi,
               status: "added",
            },
         },
         {
            upsert: true,
            new: true,
         }
      );

      if (user.partnerOnboardingSteps < 3) {
         user.partnerOnboardingSteps = 3;
      }
      user.mobileNumber = mobileNumber;
      await user.save();

      return NextResponse.json(
         {
            success: true,
            message: "Bank details added successfully",
            bank: partnerBank,
         },
         { status: 200 }
      );
   } catch (error) {
      console.error("Partner Bank Error:", error);

      return NextResponse.json(
         {
            success: false,
            message: "Internal server error",
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

      const partnerBank = await PartnerBank.findOne({
         owner: user._id,
      });

      if (!partnerBank) {
         return NextResponse.json(
            {
               success: false,
               message: "Bank details not found",
            },
            { status: 404 }
         );
      }

      return NextResponse.json(
         {
            success: true,
            message: "Bank details fetched successfully",
            partnerBank,
         },
         {
            status: 200,
         }
      );
   } catch (error) {
      console.error("Fetch Partner Bank Error:", error);

      return NextResponse.json(
         {
            success: false,
            message: "Internal server error",
         },
         {
            status: 500,
         }
      );
   }
}
