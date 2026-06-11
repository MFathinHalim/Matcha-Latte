"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Phone, Shield, ShieldAlert, Ban, CheckCircle } from "lucide-react";
import { COLORS } from "@/constants/colors";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (data.success) {
      setUsers(data.users);
    }
  }

  async function toggleBan(user) {
    await fetch(`/api/admin/users/${user._id}/ban`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBanned: !user.isBanned }),
    });
    loadUsers();
  }

  async function toggleRole(user) {
    await fetch(`/api/admin/users/${user._id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: user.role === "admin" ? "user" : "admin" }),
    });
    loadUsers();
  }

  return (
    <div className="min-h-screen w-full px-6 py-10 md:px-16 lg:px-32" style={{ background: COLORS.background, color: COLORS.text }}>
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8 md:mb-12">
          <button onClick={() => router.back()} className="border-none bg-transparent p-0 cursor-pointer flex items-center justify-center transition-transform active:scale-90" style={{ color: COLORS.text }}>
            <ArrowLeft size={24} className="md:w-8 md:h-8" />
          </button>
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight m-0">User Management</h1>
            <p className="m-0 text-sm md:text-base opacity-70">Kelola otorisasi dan hak akses akun pengguna</p>
          </div>
        </div>

        {/* LIST USERS */}
        <div className="flex flex-col gap-4">
          {users.map((user) => (
            <div key={user._id} className="border-2 rounded-2xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 justify-between items-center gap-4" style={{ borderColor: "#2f3745" }}>
              
              {/* DATA PROFIL USER */}
              <div className="md:col-span-7 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <User size={18} className="opacity-60" />
                  <span className="font-bold text-base md:text-xl">{user.fullName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <Phone size={14} className="opacity-60" />
                  <span>{user.phone || "-"}</span>
                </div>
                
                {/* BADGES STATUS */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5" style={{ background: user.role === "admin" || user.role === "superadmin" ? COLORS.primary : "rgba(0,0,0,0.05)", color: user.role === "admin" || user.role === "superadmin" ? "#fff" : COLORS.text }}>
                    {user.role === "admin" ? <Shield size={12} /> : user.role === "superadmin" ? <ShieldAlert size={12} /> : null}
                    Role: {user.role}
                  </span>

                  {user.isBanned && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-red-500/10 text-red-500 flex items-center gap-1">
                      <Ban size={12} /> Diban
                    </span>
                  )}
                </div>
              </div>

              {/* ACTION KENDALI PANEL */}
              <div className="md:col-span-5 flex justify-start md:justify-end items-center gap-2">
                {user.role === "superadmin" ? (
                  <span className="text-sm font-bold opacity-50 italic">Super Admin Kontrol Khusus</span>
                ) : (
                  <>
                    <button onClick={() => toggleRole(user)} className="border rounded-xl px-4 py-2.5 text-xs font-bold cursor-pointer bg-white transition-transform active:scale-95" style={{ borderColor: COLORS.text, color: "#000" }}>
                      {user.role === "admin" ? "Jadikan User" : "Jadikan Admin"}
                    </button>

                    <button onClick={() => toggleBan(user)} className="border-none rounded-xl px-4 py-2.5 text-xs font-bold text-white cursor-pointer transition-transform active:scale-95 flex items-center gap-1" style={{ background: user.isBanned ? COLORS.success : COLORS.danger }}>
                      {user.isBanned ? <CheckCircle size={14} /> : <Ban size={14} />}
                      {user.isBanned ? "Unban" : "Ban"}
                    </button>
                  </>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}