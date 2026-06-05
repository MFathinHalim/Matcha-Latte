import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function PUT(request) {
  try {
    const token = request.cookies.get("token")?.value;

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: "Token tidak valid",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      fullName,
      phone,
    } = body;

    await connectDB();

    const user = await User.findById(
      decoded.id
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Cek nomor telepon kalau berubah
    if (
      phone &&
      phone !== user.phone
    ) {
      const existingPhone =
        await User.findOne({
          phone,
        });

      if (existingPhone) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Nomor telepon sudah digunakan",
          },
          { status: 409 }
        );
      }
    }

    user.fullName =
      fullName || user.fullName;

    user.phone =
      phone || user.phone;

    await user.save();

    return NextResponse.json({
      success: true,
      message:
        "Profil berhasil diperbarui",
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}