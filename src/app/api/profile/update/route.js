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
        { success: false, message: "Token tidak valid" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fullName, province, city, district, village } = body;

    await connectDB();

    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Nomor telepon sengaja tidak di-update dari request body demi keamanan sistem
    user.fullName = fullName || user.fullName;
    user.province = province || user.province;
    user.city = city || user.city;
    user.district = district || user.district;
    user.village = village || user.village;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui",
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        province: user.province,
        city: user.city,
        district: user.district,
        village: user.village,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}