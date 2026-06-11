"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Phone, Lock, Loader2 } from "lucide-react";
import { COLORS } from "@/constants/colors";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Proteksi: Jika sudah login, tendang ke dashboard
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) {
          router.replace("/");
        } else {
          setCheckingAuth(false);
        }
      } catch (error) {
        setCheckingAuth(false);
      }
    }
    checkSession();
  }, [router]);

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });

    const data = await res.json();
    if (!data.success) {
      return alert(data.message);
    }

    router.push("/");
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-3" style={{ background: COLORS.background, color: COLORS.text }}>
        <Loader2 className="animate-spin" size={32} style={{ color: COLORS.primary }} />
        <p className="text-sm opacity-70 font-medium">Memeriksa sesi Anda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-6 flex items-center justify-center" style={{ background: COLORS.background }}>
      <div className="w-full max-w-md p-8 md:p-10 rounded-2xl border-2 flex flex-col backdrop-blur-sm bg-opacity-5" style={{ borderColor: "#2f3745", backgroundColor: "rgba(255,255,255,0.02)" }}>
        
        {/* HEADER */}
        <div className="text-center md:text-left mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2" style={{ color: COLORS.text }}>
            Selamat Datang
          </h1>
          <p className="text-sm opacity-70" style={{ color: COLORS.text }}>
            Silakan masuk untuk melanjutkan ke panel dashboard Anda
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* NOMOR TELEPON */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold flex items-center gap-2 opacity-90" style={{ color: COLORS.text }}>
              <Phone size={16} /> No. Telepon
            </label>
            <input
              type="tel"
              placeholder="Masukkan nomor telepon aktif"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full p-4 rounded-xl border-2 text-sm md:text-base font-medium outline-none bg-transparent transition-all focus:border-opacity-100"
              style={{ borderColor: "#2f3745", color: COLORS.text }}
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold flex items-center gap-2 opacity-90" style={{ color: COLORS.text }}>
              <Lock size={16} /> Kata Sandi
            </label>
            <input
              type="password"
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 rounded-xl border-2 text-sm md:text-base font-medium outline-none bg-transparent transition-all"
              style={{ borderColor: "#2f3745", color: COLORS.text }}
            />
          </div>

          {/* BUTTON LOGIN */}
          <button
            type="submit"
            className="w-full border-none p-4 mt-2 rounded-xl font-bold text-sm md:text-base cursor-pointer transition-transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-md"
            style={{ background: COLORS.primary }}
          >
            <LogIn size={18} />
            Masuk Aplikasi
          </button>
        </form>

        {/* FOOTER NAV */}
        <p className="text-center text-sm opacity-70 mt-8 mb-0" style={{ color: COLORS.text }}>
          Belum bergabung?{" "}
          <span onClick={() => router.push("/register")} className="font-bold cursor-pointer underline transition-colors" style={{ color: COLORS.primary }}>
            Daftar Akun Baru
          </span>
        </p>
      </div>
    </div>
  );
}