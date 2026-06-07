import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";

import User from "@/models/User";
import Otp from "@/models/Otp";

import { sendWhatsapp } from "@/lib/fonnte";

export async function POST(
  request
) {
  try {
    const body =
      await request.json();

    const {
      fullName,
      phone,
      password,
    } = body;

    if (
      !fullName ||
      !phone ||
      !password
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Semua field wajib diisi",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const existingUser =
      await User.findOne({
        phone,
      });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message:
            "Nomor sudah digunakan",
        },
        {
          status: 409,
        }
      );
    }

    const code =
      Math.floor(
        100000 +
          Math.random() *
            900000
      ).toString();


    await Otp.deleteMany({
      phone,
    });

    await Otp.create({
      phone,
      code,
      fullName,
      password,
      used: false,
      expiresAt:
        new Date(
          Date.now() +
            5 *
              60 *
              1000
        ),
    });

    await sendWhatsapp(
      phone,
      `Kode OTP Matcha Latte: ${code}

Berlaku selama 5 menit.`
    );

    return Response.json({
      success: true,
      message:
        "OTP berhasil dikirim",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}