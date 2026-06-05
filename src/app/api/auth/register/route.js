import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();

    const { fullName, phone, password } = body;

    if (!fullName || !phone || !password) {
      return Response.json(
        {
          success: false,
          message: "Semua field wajib diisi",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({
      phone,
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Nomor HP sudah digunakan",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      fullName,
      phone,
      password: hashedPassword,
      role: "user",
    });

    return Response.json(
      {
        success: true,
        message: "Registrasi berhasil",
        user: {
          id: user._id,
          fullName: user.fullName,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Terjadi kesalahan server",
      },
      { status: 500 }
    );
  }
}