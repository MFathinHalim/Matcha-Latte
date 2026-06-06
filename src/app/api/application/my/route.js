import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
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

    await connectDB();

    const applications = await Application.find({ userId: decoded.id }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      applications,
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