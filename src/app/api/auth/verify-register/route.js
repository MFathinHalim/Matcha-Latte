import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import User from "@/models/User";
import Otp from "@/models/Otp";

import { connectDB } from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();

    const { phone, code } = body;

    if (!phone || !code) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone dan OTP wajib diisi",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const otp = await Otp.findOne({
      phone,
      code,
      used: false,
    });

    if (!otp) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP salah",
        },
        {
          status: 400,
        }
      );
    }

    if (otp.expiresAt < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP kadaluarsa",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser =
      await User.findOne({
        phone: otp.phone,
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User sudah ada",
        },
        {
          status: 400,
        }
      );
    }

    console.log(otp)

    const hashedPassword =
      await bcrypt.hash(
        otp.password,
        10
      );

    await User.create({
      fullName: otp.fullName,
      phone: otp.phone,
      password: hashedPassword,
      role: "user",
    });

    otp.used = true;
    await otp.save();

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}