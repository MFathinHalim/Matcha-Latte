"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Phone, MapPin, Save } from "lucide-react";
import { COLORS } from "@/constants/colors";

export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    village: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    if (data.success) {
      // Pastikan string kosong dipilih jika properti undefined di db
      setForm({
        fullName: data.user.fullName || "",
        phone: data.user.phone || "",
        province: data.user.province || "",
        city: data.user.city || "",
        district: data.user.district || "",
        village: data.user.village || "",
      });
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    const res = await fetch("/api/profile/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      alert("Profil berhasil diupdate");
    } else {
      alert(data.message);
    }
  }

  return (
    <div className="min-h-screen w-full px-6 py-10 md:px-16 lg:px-32 flex flex-col justify-start" style={{ background: COLORS.background, color: COLORS.text }}>
      <div className="w-full max-w-3xl mx-auto">
        
        {/* BACK BUTTON */}
        <button onClick={() => router.back()} className="border-none bg-transparent p-0 mb-6 cursor-pointer flex items-center justify-center transition-transform active:scale-90" style={{ color: COLORS.text }}>
          <ArrowLeft size={24} className="md:w-8 md:h-8" />
        </button>

        {/* HEADER */}
        <h1 className="text-xl md:text-3xl font-bold mb-1 tracking-tight text-center md:text-left">Edit Profil</h1>
        <p className="text-sm md:text-base mb-8 md:mb-12 opacity-80 text-center md:text-left">Perbarui informasi identitas dan domisili akun anda</p>

        {/* INPUT FORM */}
        <form onSubmit={saveProfile} className="flex flex-col gap-6">
          
          {/* GRIDS UTAMA DATA PERSONAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NAMA LENGKAP */}
            <div className="flex flex-col gap-2">
              <label className="text-sm md:text-base font-bold flex items-center gap-2 opacity-90">
                <User size={16} /> Nama Lengkap
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full p-4 rounded-xl border-2 text-sm md:text-base font-medium outline-none bg-transparent transition-all"
                style={{ borderColor: "#2f3745", color: COLORS.text }}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            {/* NOMOR TELEPON (LOCKED / READ-ONLY) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm md:text-base font-bold flex items-center gap-2 opacity-50">
                <Phone size={16} /> No. Telepon (Tidak dapat diubah)
              </label>
              <input
                type="text"
                value={form.phone}
                disabled
                className="w-full p-4 rounded-xl border-2 text-sm md:text-base font-medium outline-none cursor-not-allowed select-none opacity-40 bg-transparent"
                style={{ borderColor: "#2f3745", color: COLORS.text }}
              />
            </div>
          </div>

          {/* BOX KELOMPOK ALAMAT DOMISILI */}
          <div className="mt-2 p-5 rounded-2xl border-2 flex flex-col gap-5" style={{ borderColor: "#2f3745" }}>
            <h3 className="m-0 text-base md:text-lg font-bold flex items-center gap-2 opacity-95">
              <MapPin size={18} /> Informasi Wilayah / Domisili
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* PROVINSI */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs md:text-sm font-semibold opacity-80">Provinsi</label>
                <input
                  type="text"
                  value={form.province}
                  onChange={(e) => setForm({ ...form, province: e.target.value })}
                  className="w-full p-3 rounded-xl border text-sm bg-transparent outline-none"
                  style={{ borderColor: "rgba(255,255,255,0.15)", color: COLORS.text }}
                  placeholder="Contoh: Jawa Barat"
                />
              </div>

              {/* KOTA / KABUPATEN */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs md:text-sm font-semibold opacity-80">Kota / Kabupaten</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full p-3 rounded-xl border text-sm bg-transparent outline-none"
                  style={{ borderColor: "rgba(255,255,255,0.15)", color: COLORS.text }}
                  placeholder="Contoh: Bandung"
                />
              </div>

              {/* KECAMATAN */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs md:text-sm font-semibold opacity-80">Kecamatan</label>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  className="w-full p-3 rounded-xl border text-sm bg-transparent outline-none"
                  style={{ borderColor: "rgba(255,255,255,0.15)", color: COLORS.text }}
                  placeholder="Contoh: Coblong"
                />
              </div>

              {/* KELURAHAN / DESA */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs md:text-sm font-semibold opacity-80">Kelurahan / Desa</label>
                <input
                  type="text"
                  value={form.village}
                  onChange={(e) => setForm({ ...form, village: e.target.value })}
                  className="w-full p-3 rounded-xl border text-sm bg-transparent outline-none"
                  style={{ borderColor: "rgba(255,255,255,0.15)", color: COLORS.text }}
                  placeholder="Contoh: Dago"
                />
              </div>
            </div>
          </div>

          {/* BUTTON SIMPAN */}
          <div className="mt-4">
            <button
              type="submit"
              className="w-full md:w-auto md:min-w-[180px] border-none p-4 rounded-xl font-bold text-sm md:text-base text-white cursor-pointer transition-transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
              style={{ background: COLORS.primary }}
            >
              <Save size={18} />
              Simpan Perubahan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}