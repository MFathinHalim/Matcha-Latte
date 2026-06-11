"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, User, Phone, Lock, MessageSquare, CheckCircle, Loader2 } from "lucide-react";
import { COLORS } from "@/constants/colors";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [waitingOtp, setWaitingOtp] = useState(false);
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

  async function sendOtp(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phone, password }),
    });

    const data = await res.json();
    alert(data.message);

    if (data.success) {
      setWaitingOtp(true);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/verify-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code: otp }),
    });

    const data = await res.json();
    alert(data.message);

    if (data.success) {
      router.push("/login");
    }
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
            {waitingOtp ? "Verifikasi Akun" : "Daftar Akun"}
          </h1>
          <p className="text-sm opacity-70" style={{ color: COLORS.text }}>
            {waitingOtp ? "Masukkan kode rahasia yang Anda terima" : "Lengkapi formulir di bawah untuk membuat akun baru"}
          </p>
        </div>

        {/* STEP 1: FORM PENDAFTARAN */}
        {!waitingOtp ? (
          <form onSubmit={sendOtp} className="flex flex-col gap-5">
            {/* NAMA LENGKAP */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold flex items-center gap-2 opacity-90" style={{ color: COLORS.text }}>
                <User size={16} /> Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full p-4 rounded-xl border-2 text-sm md:text-base font-medium outline-none bg-transparent transition-all"
                style={{ borderColor: "#2f3745", color: COLORS.text }}
              />
            </div>

            {/* NOMOR TELEPON */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold flex items-center gap-2 opacity-90" style={{ color: COLORS.text }}>
                <Phone size={16} /> No. Telepon (WhatsApp)
              </label>
              <input
                type="tel"
                placeholder="Contoh: 0812345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full p-4 rounded-xl border-2 text-sm md:text-base font-medium outline-none bg-transparent transition-all"
                style={{ borderColor: "#2f3745", color: COLORS.text }}
              />
            </div>

            {/* KATA SANDI */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold flex items-center gap-2 opacity-90" style={{ color: COLORS.text }}>
                <Lock size={16} /> Kata Sandi
              </label>
              <input
                type="password"
                placeholder="Buat sandi yang aman"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 rounded-xl border-2 text-sm md:text-base font-medium outline-none bg-transparent transition-all"
                style={{ borderColor: "#2f3745", color: COLORS.text }}
              />
            </div>

            {/* BUTTON SEND OTP */}
            <button
              type="submit"
              className="w-full border-none p-4 mt-2 rounded-xl font-bold text-sm md:text-base cursor-pointer transition-transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-md"
              style={{ background: COLORS.primary }}
            >
              <UserPlus size={18} />
              Daftar & Kirim OTP
            </button>
          </form>
        ) : (
          /* STEP 2: FORM VERIFIKASI OTP */
          <form onSubmit={verifyOtp} className="flex flex-col gap-5">
            <div className="p-4 rounded-xl text-sm font-medium flex items-center gap-3 border" style={{ backgroundColor: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.2)", color: "#10b981" }}>
              <MessageSquare size={18} />
              Sistem telah mengirim kode OTP ke WhatsApp Anda.
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold opacity-90" style={{ color: COLORS.text }}>
                Masukkan Kode OTP
              </label>
              <input
                type="text"
                placeholder="------"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-4 rounded-xl border-2 font-bold tracking-[6px] text-center text-lg outline-none bg-transparent transition-all"
                style={{ borderColor: "#2f3745", color: COLORS.text }}
              />
            </div>

            {/* BUTTON VERIFY */}
            <button
              type="submit"
              className="w-full border-none p-4 rounded-xl font-bold text-sm md:text-base text-white cursor-pointer transition-transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-md"
              style={{ background: "#10b981" }}
            >
              <CheckCircle size={18} />
              Verifikasi Sekarang
            </button>
          </form>
        )}

        {/* FOOTER NAV */}
        <p className="text-center text-sm opacity-70 mt-8 mb-0" style={{ color: COLORS.text }}>
          Sudah terdaftar?{" "}
          <span onClick={() => router.push("/login")} className="font-bold cursor-pointer underline transition-colors" style={{ color: COLORS.primary }}>
            Masuk Sekarang
          </span>
        </p>
      </div>
    </div>
  );
}