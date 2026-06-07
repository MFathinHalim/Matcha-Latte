import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";

export async function getAdminUser(
  request
) {
  const token =
    request.cookies.get("token")?.value;

  if (!token) return null;

  const decoded =
    verifyToken(token);

  if (!decoded) return null;

  const user =
    await User.findById(
      decoded.id
    );

  if (!user) return null;

  return user;
}

export async function requireAdmin(
  request
) {
  const token =
    request.cookies.get("token")
      ?.value;

  if (!token) {
    throw new Error(
      "Belum login"
    );
  }

  const decoded =
    verifyToken(token);

  if (!decoded) {
    throw new Error(
      "Token tidak valid"
    );
  }

  await connectDB();

  const user =
    await User.findById(
      decoded.id
    );

  if (!user) {
    throw new Error(
      "User tidak ditemukan"
    );
  }

  if (
    user.role !== "admin" &&
    user.role !==
      "superadmin"
  ) {
    throw new Error(
      "Akses ditolak"
    );
  }

  return user;
}