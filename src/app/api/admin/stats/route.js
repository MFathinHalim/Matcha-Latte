import { NextResponse } from "next/server";

import User from "@/models/User";
import Application from "@/models/Application";

import { requireAdmin } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";

export async function GET(
  request
) {
  try {
    await requireAdmin(
      request
    );

    await connectDB();

    const totalUsers =
      await User.countDocuments();

    const totalAdmins =
      await User.countDocuments(
        {
          role: "admin",
        }
      );

    const bannedUsers =
      await User.countDocuments(
        {
          isBanned: true,
        }
      );

    const draft =
      await Application.countDocuments(
        {
          status: "draft",
        }
      );

    const pending =
      await Application.countDocuments(
        {
          status:
            "pending_review",
        }
      );

    const approved =
      await Application.countDocuments(
        {
          status:
            "approved",
        }
      );

    const rejected =
      await Application.countDocuments(
        {
          status:
            "rejected",
        }
      );

    const completed =
      await Application.countDocuments(
        {
          status:
            "completed",
        }
      );

    return NextResponse.json({
      success: true,

      stats: {
        totalUsers,
        totalAdmins,
        bannedUsers,

        draft,
        pending,
        approved,
        rejected,
        completed,
      },
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        success: false,
        message:
          error.message,
      },
      { status: 400 }
    );
  }
}