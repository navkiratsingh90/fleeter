import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/booking-model";

export async function GET() {
  try {
    await connectDB();

    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const earnings = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: {
            $gte: startDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          earnings: {
            $sum: "$adminCommission",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const result = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];

      const found = earnings.find(
        (item) => item._id === dateString
      );

      result.push({
        date: dateString,
        day: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        earnings: found?.earnings || 0,
      });
    }

    const totalEarnings = result.reduce(
      (sum, item) => sum + item.earnings,
      0
    );

    const bestDay = result.reduce((max, item) =>
      item.earnings > max.earnings ? item : max
    );

    const dailyAverage = Math.round(totalEarnings / result.length);
    const todayEarnings = result[result.length - 1]?.earnings || 0;
    const yesterdayEarnings = result[result.length - 2]?.earnings || 0;
    const percentageChange = yesterdayEarnings
      ? Math.round(
          ((todayEarnings - yesterdayEarnings) / yesterdayEarnings) * 100
        )
      : 0;

    return NextResponse.json({
      success: true,
      totalEarnings,
      bestDay: bestDay.earnings,
      bestDayDate: bestDay.date,
      dailyAverage,
      todayEarnings,
      percentageChange,
      data: result,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}