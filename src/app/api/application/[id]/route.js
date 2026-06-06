import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Application from "@/models/Application";

export async function GET(request, context) {
  try {
    const { id } = await context.params;
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

    await connectDB();
    console.log(id)
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

    return NextResponse.json({
      success: true,
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

export async function DELETE(
  request,
  { params }
) {
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

    await connectDB();

    const application =
      await Application.findOne({
        _id: params.id,
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
            "Hanya draft yang dapat dihapus",
        },
        { status: 400 }
      );
    }

    await Application.findByIdAndDelete(
      application._id
    );

    return NextResponse.json({
      success: true,
      message:
        "Pengajuan berhasil dihapus",
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