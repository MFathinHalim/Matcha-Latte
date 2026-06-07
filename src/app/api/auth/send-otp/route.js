import { NextResponse } from "next/server";

import Otp from "@/models/Otp";

import { connectDB } from "@/lib/mongodb";
import { sendWhatsapp } from "@/lib/fonnte";

export async function POST(
  request
) {
  try {
    const body =
      await request.json();

    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Nomor wajib diisi",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const code =
      Math.floor(
        100000 +
          Math.random() *
            900000
      ).toString();

    await Otp.deleteMany({
      phone,
      used: false,
    });

    await Otp.create({
      phone,
      code,
      expiresAt: new Date(
        Date.now() +
          5 * 60 * 1000
      ),
    });

    const fonnteResult =
      await sendWhatsapp(
        phone,
        `Kode OTP Matcha Latte: ${code}

Berlaku selama 5 menit.`
      );

    return NextResponse.json({
      success: true,
      message:
        "OTP berhasil dikirim",
      otp:
        process.env
          .NODE_ENV ===
        "development"
          ? code
          : undefined,
      fonnte:
        fonnteResult,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
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