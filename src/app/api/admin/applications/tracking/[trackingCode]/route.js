import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import User from "@/models/User";
import Application from "@/models/Application";

export async function GET(
  request,
  { params }
) {
  try {
    const token =
      request.cookies.get("token")
        ?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Belum login",
        },
        { status: 401 }
      );
    }

    const decoded =
      verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Token tidak valid",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const admin =
      await User.findById(
        decoded.id
      );

    if (!admin) {
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
      admin.role !== "admin" &&
      admin.role !== "superadmin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Akses ditolak",
        },
        { status: 403 }
      );
    }

    const {
      trackingCode,
    } = await params;

    const application =
      await Application.findOne({
        trackingCode,
      })
        .populate(
          "userId",
          "fullName phone nik"
        )
        .lean();

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Pengajuan tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application,
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