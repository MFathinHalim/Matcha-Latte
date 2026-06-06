import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Application from "@/models/Application";

export async function POST(request, context) {
  try {
    const token =
      request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Belum login",
        },
        { status: 401 }
      );
    }

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

    const { id } = await context.params;

    await connectDB();

    const application =
      await Application.findOne({
        _id: id,
        userId: decoded.id,
      });

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

    if (application.status !== "draft") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Pengajuan sudah pernah disubmit",
        },
        { status: 400 }
      );
    }

    application.status =
      "pending_review";

    application.submittedAt =
      new Date();

    await application.save();

    return NextResponse.json({
      success: true,
      message:
        "Pengajuan berhasil dikirim",
      application,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}