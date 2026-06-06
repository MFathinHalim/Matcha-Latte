import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Application from "@/models/Application";
import User from "@/models/User";

export async function POST(request) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
            {
                success: false,
                message: "Token tidak ditemukan",
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

        const { serviceType, description } = await request.json();

        if (!serviceType) {
            return NextResponse.json(
            {
                success: false,
                message: "Jenis layanan harus diisi",
            },
            { status: 400 }
            );
        }

       await connectDB();
        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json(
            {
                success: false,
                message: "User tidak ditemukan",
            },
            { status: 404 }
            );
        }

        const tracking_code = `ML-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const application = await Application.create({
            userId: user._id,
            serviceType,
            description: description || "",
            trackingCode: tracking_code,
        });

        return NextResponse.json(
        {
            success: true,
            message: "Aplikasi berhasil diajukan",
            data: application,
        },
        { status: 201 }
        );

    } catch (error) {
        console.error("Error submitting application:", error);
        return NextResponse.json(
        {
            success: false,
            message: "Terjadi kesalahan saat mengirim aplikasi",
        },
        { status: 500 }
        );
    }
}