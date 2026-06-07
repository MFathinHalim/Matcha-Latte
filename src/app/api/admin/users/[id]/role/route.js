import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getAdminUser } from "@/lib/admin";

import User from "@/models/User";

export async function PATCH(
  request,
  context
) {
  try {
    await connectDB();

    const currentAdmin =
      await getAdminUser(
        request
      );

    if (
      !currentAdmin ||
      currentAdmin.role !==
        "superadmin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tidak memiliki akses",
        },
        { status: 403 }
      );
    }

    const { id } =
      await context.params;

    const body =
      await request.json();

    const { role } = body;

    if (
      ![
        "user",
        "admin",
        "superadmin",
      ].includes(role)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Role tidak valid",
        },
        { status: 400 }
      );
    }

    const targetUser =
      await User.findById(id);

    if (!targetUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Opsional:
    // cegah superadmin mengubah dirinya sendiri

    if (
      targetUser._id.toString() ===
      currentAdmin._id.toString()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tidak bisa mengubah role akun sendiri",
        },
        { status: 400 }
      );
    }

    targetUser.role = role;

    await targetUser.save();

    return NextResponse.json({
      success: true,
      message:
        "Role berhasil diubah",
      user: targetUser,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message,
      },
      { status: 500 }
    );
  }
}