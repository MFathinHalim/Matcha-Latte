import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Berhasil keluar dari aplikasi",
    });

    // Menghapus cookie token otentikasi (sesuaikan nama 'token' dengan sistem Anda)
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Set kedaluwarsa ke masa lalu untuk menghapusnya murni
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}