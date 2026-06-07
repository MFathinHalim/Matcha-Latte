import { NextResponse } from "next/server";

import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(
  request,
  context
) {
  try {
    await requireAdmin(
      request
    );

    const { id } =
      await context.params;

    const body =
      await request.json();

    const { isBanned } =
      body;

    await connectDB();

    const user =
      await User.findById(id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User tidak ditemukan",
        },
        { status: 404 }
      );
    }

    if (
      user.role ===
      "superadmin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Superadmin tidak dapat diban",
        },
        { status: 403 }
      );
    }

    user.isBanned =
      Boolean(isBanned);

    await user.save();

    return NextResponse.json({
      success: true,
      message:
        isBanned
          ? "User diban"
          : "User diunban",
      user,
    });
  } catch (error) {
    console.error(error);

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