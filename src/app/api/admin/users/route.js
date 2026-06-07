import { NextResponse } from "next/server";

import User from "@/models/User";

import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/admin";

export async function GET(
  request
) {
  try {
    await requireAdmin(
      request
    );

    await connectDB();

    const users =
      await User.find()
        .select(
          "-password"
        )
        .sort({
          createdAt: -1,
        });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
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