import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return Response.json({
                success: false,
                message: "Password salah",
            }, { status: 401 });
        }
        const token = jwt.sign({
            id: user._id,
            fullName: user.fullName,
            phone: user.phone,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return Response.json({
            success: true,
            message: "Login berhasil",
            token,
        }, { status: 200 });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return Response.json({
            success: false,
            message: "Terjadi kesalahan server",
        }, { status: 500 });
    }
}