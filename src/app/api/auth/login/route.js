import { generateToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { phone, password } = body;
        if (!phone || !password) {
            return Response.json({
                success: false,
                message: "Semua field wajib diisi",
            }, { status: 400 });
        }
        await connectDB();
        const user = await User.findOne({ phone });
        if (!user) {
            return Response.json({
                success: false,
                message: "Nomor HP tidak ditemukan",
            }, { status: 404 });
        }
        console.log(user.password)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return Response.json({
                success: false,
                message: "Password salah",
            }, { status: 401 });
        }
        if (user.isBanned) {
            return NextResponse.json(
                {
                success: false,
                message:
                    "Akun diblokir",
                },
                { status: 403 }
            );
        }
        const token = generateToken(user)

        const response = NextResponse.json({
            success: true,
            message: "Login berhasil",
        });

        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return Response.json({
            success: false,
            message: "Terjadi kesalahan server",
        }, { status: 500 });
    }
}