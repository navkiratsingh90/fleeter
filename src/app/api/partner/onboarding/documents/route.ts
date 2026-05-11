import { auth } from "@/auth";
import uploadToCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import PartnerDocs from "@/models/partnerDocs-model";
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

    const formData = await req.formData();

    const aadhar = formData.get("aadhar") as Blob | null;
    const rc = formData.get("rc") as Blob | null;
    const license = formData.get("license") as Blob | null;

    if (!aadhar || !rc || !license) {
      return NextResponse.json(
        {
          success: false,
          message: "All documents are required",
        },
        { status: 400 }
      );
    }

    const uploadPayload: any = {
      owner: user._id,
      status: "pending",
    };

    const aadharUrl = await uploadToCloudinary(aadhar);

    if (!aadharUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload aadhar",
        },
        { status: 500 }
      );
    }

    uploadPayload.aadharUrl = aadharUrl;

    const licenseUrl = await uploadToCloudinary(license);

    if (!licenseUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload license",
        },
        { status: 500 }
      );
    }

    uploadPayload.licenseUrl = licenseUrl;

    const rcUrl = await uploadToCloudinary(rc);

    if (!rcUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload RC",
        },
        { status: 500 }
      );
    }

    uploadPayload.rcUrl = rcUrl;

    const partnerDocs = await PartnerDocs.findOneAndUpdate(
      {
        owner: user._id,
      },
      {
        $set: uploadPayload,
      },
      {
        upsert: true,
        new: true,
      }
    );

    if (user.partnerOnboardingSteps < 2) {
      user.partnerOnboardingSteps = 2;
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Documents uploaded successfully",
        docs: partnerDocs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Partner Docs Upload Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}