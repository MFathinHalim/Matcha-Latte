import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import User from "@/models/User";
import Application from "@/models/Application";

export async function PATCH(
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

    if (
      !admin ||
      (
        admin.role !== "admin" &&
        admin.role !== "superadmin"
      )
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

    const body =
      await request.json();

    const {
      status,
      adminNotes,
    } = body;

    const allowedStatus = [
      "approved",
      "rejected",
      "completed",
    ];

    if (
      !allowedStatus.includes(
        status
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Status tidak valid",
        },
        { status: 400 }
      );
    }

    const {
      trackingCode,
    } = await params;

    const application =
      await Application.findOne({
        trackingCode,
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

    application.status =
      status;

    if (adminNotes) {
      application.adminNotes =
        adminNotes;
    }

    if (
      status === "approved"
    ) {
      application.approvedAt =
        new Date();
    }

    if (
      status === "completed"
    ) {
      application.completedAt =
        new Date();
    }

    await application.save();

    return NextResponse.json({
      success: true,
      message:
        "Status berhasil diperbarui",
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