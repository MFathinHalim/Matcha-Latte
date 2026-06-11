"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, ShieldAlert, UserX, FileText, Clock, CheckCircle2, XCircle, FileCheck } from "lucide-react";
import { COLORS } from "@/constants/colors";

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    if (data.success) {
      setStats(data.stats);
    }
  }

  if (!stats) return <p className="p-6 text-center" style={{ color: COLORS.text }}>Loading...</p>;

  return (
    <div className="min-h-screen w-full px-6 py-10 md:px-16 lg:px-32" style={{ background: COLORS.background, color: COLORS.text }}>
      <div className="max-w-5xl mx-auto">
        
        {/* BACK BUTTON & HEADER */}
        <div className="flex items-center gap-4 mb-8 md:mb-12">
          <button onClick={() => router.back()} className="border-none bg-transparent p-0 cursor-pointer flex items-center justify-center transition-transform active:scale-90" style={{ color: COLORS.text }}>
            <ArrowLeft size={24} className="md:w-8 md:h-8" />
          </button>
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight m-0">Admin Dashboard</h1>
            <p className="m-0 text-sm md:text-base opacity-70">Statistik dan analisis data sistem</p>
          </div>
        </div>

        {/* SECTION 1: MANAJEMEN USER */}
        <h2 className="text-base md:text-xl font-bold mb-4 opacity-90">Manajemen Pengguna</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          
          <div className="border-2 rounded-2xl p-5 flex items-center justify-between" style={{ borderColor: "#2f3745" }}>
            <div>
              <p className="m-0 text-xs md:text-sm font-medium opacity-60">Total User</p>
              <h3 className="m-0 text-2xl md:text-3xl font-extrabold mt-1">{stats.totalUsers}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500"><Users size={24} /></div>
          </div>

          <div className="border-2 rounded-2xl p-5 flex items-center justify-between" style={{ borderColor: "#2f3745" }}>
            <div>
              <p className="m-0 text-xs md:text-sm font-medium opacity-60">Total Admin</p>
              <h3 className="m-0 text-2xl md:text-3xl font-extrabold mt-1">{stats.totalAdmins}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${COLORS.primary}15`, color: COLORS.primary }}><ShieldAlert size={24} /></div>
          </div>

          <div className="border-2 rounded-2xl p-5 flex items-center justify-between" style={{ borderColor: "#2f3745" }}>
            <div>
              <p className="m-0 text-xs md:text-sm font-medium opacity-60">User Diban</p>
              <h3 className="m-0 text-2xl md:text-3xl font-extrabold mt-1">{stats.bannedUsers}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${COLORS.danger}15`, color: COLORS.danger }}><UserX size={24} /></div>
          </div>

        </div>

        {/* SECTION 2: STATUS PENGAJUAN */}
        <h2 className="text-base md:text-xl font-bold mb-4 opacity-90">Status Pengajuan Berkas</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="border rounded-2xl p-4 text-center" style={{ borderColor: "rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)" }}>
            <FileText size={20} className="mx-auto mb-2 opacity-60" />
            <p className="m-0 text-xs font-semibold opacity-70">Draft</p>
            <h4 className="m-0 text-xl font-bold mt-1">{stats.draft}</h4>
          </div>

          <div className="border rounded-2xl p-4 text-center" style={{ borderColor: "rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)" }}>
            <Clock size={20} className="mx-auto mb-2"  />
            <p className="m-0 text-xs font-semibold opacity-70">Pending</p>
            <h4 className="m-0 text-xl font-bold mt-1">{stats.pending}</h4>
          </div>

          <div className="border rounded-2xl p-4 text-center" style={{ borderColor: "rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)" }}>
            <CheckCircle2 size={20} className="mx-auto mb-2"  />
            <p className="m-0 text-xs font-semibold opacity-70">Approved</p>
            <h4 className="m-0 text-xl font-bold mt-1">{stats.approved}</h4>
          </div>

          <div className="border rounded-2xl p-4 text-center" style={{ borderColor: "rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)" }}>
            <XCircle size={20} className="mx-auto mb-2"  />
            <p className="m-0 text-xs font-semibold opacity-70">Rejected</p>
            <h4 className="m-0 text-xl font-bold mt-1" >{stats.rejected}</h4>
          </div>

          <div className="border rounded-2xl p-4 text-center col-span-2 lg:col-span-1" style={{ borderColor: "rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)" }}>
            <FileCheck size={20} className="mx-auto mb-2" style={{ color: COLORS.secondary }} />
            <p className="m-0 text-xs font-semibold opacity-70">Completed</p>
            <h4 className="m-0 text-xl font-bold mt-1" style={{ color: COLORS.secondary }}>{stats.completed}</h4>
          </div>

        </div>

      </div>
    </div>
  );
}