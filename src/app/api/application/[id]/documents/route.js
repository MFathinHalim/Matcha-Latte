import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import imagekit from "@/lib/imagekit";

import Application from "@/models/Application";

export async function POST(
  request,
  context
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

    const decoded =
      verifyToken(token);

    const { id } =
      await context.params;

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

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    const requirement =
      formData.get(
        "requirement"
      );

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message:
            "File wajib diupload",
        },
        { status: 400 }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const uploaded =
      await imagekit.upload({
        file: buffer,
        fileName: file.name,
        folder:
          "/matcha-latte",
      });

    application.documents.push({
      requirement,

      fileName:
        uploaded.name,

      fileUrl:
        uploaded.url,
    });

    await application.save();

    return NextResponse.json({
      success: true,
      document:
        application.documents[
          application.documents
            .length - 1
        ],
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