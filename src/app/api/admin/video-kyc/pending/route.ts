import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
) {
  try {

    await connectDb();

    const session = await auth();

    if (
      !session ||
      !session.user?.email ||
      session.user.role !== "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const partners = await User.find({
      role: "partner",
      videoKycStatus: {
        $in: ["pending", "in_progress"],
      },
    }).select(
      "name email phone videoKycStatus createdAt"
    );

    return NextResponse.json(
      {
        success: true,
        partners,
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