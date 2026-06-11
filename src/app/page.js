"use client";

import { useEffect, useState } from "react";
import Link from "next/navigation"; // Menggunakan navigation Next.js modern
import { useRouter } from "next/navigation";
import { ChevronRight, Plus, LogIn, LogOut, User, ShieldCheck } from "lucide-react"; 
import { COLORS } from "@/constants/colors";

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  // Fetch data user dari /api/auth/me
  async function loadUser() {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Gagal load data user:", error);
    }
  }

  async function loadApplications() {
    try {
      const res = await fetch("/api/application/my");
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Fungsi penanganan proses Logout keluar aplikasi
  async function handleLogout() {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
    if (!confirmLogout) return;

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      
      if (data.success) {
        setUser(null);
        setApplications([]);
      } else {
        alert(data.message || "Gagal melakukan logout");
      }
    } catch (error) {
      console.error("Terjadi kesalahan sistem saat logout:", error);
      alert("Gagal terhubung ke server untuk logout");
    }
  }

  useEffect(() => {
    Promise.all([loadUser(), loadApplications()]);
  }, []);

  function getStatusColor(status) {
    switch (status) {
      case "approved": return COLORS.success;
      case "rejected": return COLORS.danger;
      case "pending_review": return COLORS.warning;
      default: return COLORS.secondary;
    }
  }

  function getStatusLabel(status) {
    switch (status) {
      case "approved": return "disetujui";
      case "rejected": return "ditolak";
      case "pending_review": return "menunggu";
      case "draft": return "draft";
      default: return status;
    }
  }

  if (loading) return <p className="p-6 text-center" style={{ color: COLORS.text }}>Loading...</p>;

  return (
    <div 
      className="min-h-screen w-full px-6 py-10 md:px-16 lg:px-32" 
      style={{ background: COLORS.background, color: COLORS.text }}
    >
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER USER DENGAN TOMBOL AKSI */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 md:mb-14 pb-6" style={{ borderColor: "#2f3745" }}>
          <div>
            <h2 className="m-0 text-xl md:text-3xl font-bold">
              {user ? `Halo, ${user.fullName}` : "Halo, Tamu"}
            </h2>
            <p className="m-0 mt-1 text-sm md:text-base opacity-70">
              {user ? "Selamat Datang Kembali" : "Silakan login untuk membuat pengajuan"}
            </p>
          </div>

          {/* GRUP TOMBOL UTILITAS AKUN (HANYA MUNCUL JIKA USER LOGIN) */}
          {user && (
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {/* Tombol Khusus Admin (Hanya tampil jika role adalah admin) */}
              {user.role === "admin" && (
                <button
                  onClick={() => router.push("/admin")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-xs md:text-sm transition-transform active:scale-95 bg-amber-500/10 border-amber-500/30 text-amber-500"
                >
                  <ShieldCheck size={16} /> Panel Admin
                </button>
              )}

              {/* Tombol Sunting Profil */}
              <button
                onClick={() => router.push("/profile/edit")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-semibold text-xs md:text-sm transition-transform active:scale-95 bg-white/5"
                style={{ borderColor: "#2f3745", color: COLORS.text }}
              >
                <User size={16} /> Edit Profil
              </button>

              {/* Tombol Keluar / Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 font-semibold text-xs md:text-sm text-red-400 bg-red-500/10 transition-transform active:scale-95 hover:bg-red-500/20"
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          )}
        </div>

        {/* KONDISI: BANNER LOGIN / BUAT PENGAJUAN */}
        {!user ? (
          <button onClick={() => router.push("/login")} className="w-full text-left block mb-10 md:mb-14 bg-transparent p-0 border-none cursor-pointer">
            <div 
              className="border-4 rounded-[20px] p-5 md:p-8 flex justify-between items-center transition-transform active:scale-[0.99]"
              style={{ borderColor: COLORS.danger, color: COLORS.text }}
            >
              <div>
                <h3 className="m-0 mb-1.5 text-lg md:text-2xl font-bold">
                  Masuk Akun / Login
                </h3>
                <p className="m-0 text-sm md:text-base opacity-70">
                  Anda harus login terlebih dahulu sebelum dapat mengunggah pengajuan berkas
                </p>
              </div>

              <div 
                className="w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white shrink-0"
                style={{ background: COLORS.danger }}
              >
                <LogIn size={20} className="md:w-6 md:h-6" />
              </div>
            </div>
          </button>
        ) : (
          <button onClick={() => router.push("/applications/create")} className="w-full text-left block mb-10 md:mb-14 bg-transparent p-0 border-none cursor-pointer">
            <div 
              className="border-4 rounded-[20px] p-5 md:p-8 flex justify-between items-center transition-transform active:scale-[0.99]"
              style={{ borderColor: COLORS.primary, color: COLORS.text }}
            >
              <div>
                <h3 className="m-0 mb-1.5 text-lg md:text-2xl font-bold">
                  Buat Pengajuan
                </h3>
                <p className="m-0 text-sm md:text-base opacity-70">
                  Unggah berkas yang dibutuhkan untuk pengajuan
                </p>
              </div>

              <div 
                className="w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white shrink-0"
                style={{ background: COLORS.secondary }}
              >
                <Plus size={24} className="md:w-8 md:h-8" />
              </div>
            </div>
          </button>
        )}

        {/* TITLE SECTION */}
        <h2 className="mb-6 md:mb-8 text-xl md:text-2xl font-bold">
          Pengajuan Saya
        </h2>

        {/* DESIGN LIST STRUKTUR RESPONSIVE DESKTOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {applications.length === 0 ? (
            <div className="md:col-span-2 text-center py-14 text-sm md:text-base opacity-60">
              Belum ada pengajuan
            </div>
          ) : (
            applications.map((app) => (
              <button 
                key={app._id} 
                onClick={() => router.push(`/applications/${app._id}`)} 
                className="w-full text-left bg-transparent p-0 border-none cursor-pointer block"
              >
                <div 
                  className="border-2 rounded-[20px] p-5 md:p-6 flex justify-between items-center transition-all hover:opacity-90 active:scale-[0.99] h-full"
                  style={{ borderColor: "#2f3745", color: COLORS.text }}
                >
                  <div className="flex flex-col justify-between h-full gap-2">
                    <div>
                      <h3 className="m-0 mb-1 text-lg md:text-xl font-bold break-all">
                        {app.trackingCode}
                      </h3>
                      <p className="m-0 text-sm md:text-base uppercase tracking-wide opacity-80">
                        {app.serviceType.replaceAll("_", " ")}
                      </p>
                    </div>
                    
                    <div className="mt-2">
                      <span 
                        className="px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold"
                        style={{ 
                          background: getStatusColor(app.status), 
                          color: COLORS.accent || "#000"
                        }}
                      >
                        {getStatusLabel(app.status)}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 opacity-70">
                    <ChevronRight size={24} className="md:w-8 md:h-8" />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

      </div>
    </div>
  );
}