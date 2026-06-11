"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react"; // Menggunakan Lucide Icon
import { COLORS } from "@/constants/colors";
import { SERVICE_REQUIREMENTS } from "@/constants/serviceRequirements";

export default function CreateApplicationPage() {
  const router = useRouter();

  const [serviceType, setServiceType] = useState("ktp");
  const [description, setDescription] = useState("");

  // Mengambil list dokumen dinamis berdasarkan type layanan yang dipilih
  const dynamicRequirements = SERVICE_REQUIREMENTS[serviceType] || [];

  async function createApplication(e) {
    e.preventDefault();

    const res = await fetch("/api/application/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceType,
        description,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      return alert(data.message);
    }

    router.push("/applications");
  }

  return (
    <div
      className="min-h-screen w-full px-6 py-10 md:px-16 lg:px-32 flex flex-col justify-start"
      style={{ background: COLORS.background, color: COLORS.text }}
    >
      <div className="w-full max-w-3xl mx-auto">
        
        {/* TOMBOL BACK */}
        <button
          onClick={() => router.back()}
          className="border-none bg-transparent p-0 mb-6 cursor-pointer flex items-center justify-center transition-transform active:scale-90"
          style={{ color: COLORS.text }}
        >
          <ArrowLeft size={24} className="md:w-8 md:h-8" />
        </button>

        {/* JUDUL HALAMAN */}
        <h1 className="text-xl md:text-3xl font-bold mb-1 tracking-tight text-center md:text-left">
          Buat Pengajuan
        </h1>
        <p className="text-sm md:text-base mb-8 md:mb-12 opacity-80 text-center md:text-left">
          Unggah berkas yang dibutuhkan untuk permohonan
        </p>

        {/* FORM UTAMA */}
        <form onSubmit={createApplication} className="flex flex-col gap-6 md:gap-8">
          
          {/* PILIHAN JENIS LAYANAN */}
          <div className="flex flex-col gap-2">
            <label className="text-sm md:text-lg font-bold">Jenis Layanan</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full p-4 rounded-xl border-2 text-sm md:text-base font-medium outline-none bg-transparent transition-all"
              style={{ 
                borderColor: "#2f3745", 
                color: COLORS.text,
              }}
            >
              <option value="ktp" style={{ background: COLORS.background }}>KTP</option>
              <option value="kk" style={{ background: COLORS.background }}>KK</option>
              <option value="akta_kelahiran" style={{ background: COLORS.background }}>Akta Kelahiran</option>
            </select>
          </div>

          {/* INPUT DESKRIPSI / KETERANGAN */}
          <div className="flex flex-col gap-2">
            <label className="text-sm md:text-lg font-bold">Deskripsi / Keterangan</label>
            <textarea
              placeholder="Tuliskan deskripsi atau keterangan tambahan di sini..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 rounded-xl border-2 text-sm md:text-base font-medium outline-none bg-transparent resize-none leading-relaxed transition-all"
              style={{ 
                borderColor: "#2f3745", 
                color: COLORS.text,
              }}
            />
          </div>

          {/* DOKUMEN YANG DIPERLUKAN (DINAMIS) */}
          <div className="flex flex-col gap-3">
            <label className="text-sm md:text-lg font-bold">Dokumen yang diperlukan</label>
            
            {dynamicRequirements.length === 0 ? (
              <p className="text-xs md:text-sm opacity-60 italic">Tidak ada dokumen wajib</p>
            ) : (
              <div className="flex flex-col gap-2">
                {dynamicRequirements.map((req, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 p-3.5 rounded-xl border"
                    style={{ borderColor: "rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)" }}
                  >
                    <FileText size={18} className="md:w-5 md:h-5 opacity-70" style={{ color: COLORS.text }} />
                    <span className="text-xs md:text-base font-semibold opacity-90">{req}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BUTTON SUBMIT */}
          <div className="mt-4">
            <button
              type="submit"
              className="w-full md:w-auto md:min-w-[200px] border-none p-4 rounded-xl font-bold text-sm md:text-base cursor-pointer transition-transform active:scale-[0.98] shadow-sm"
              style={{ background: COLORS.primary }}
            >
              Buat Pengajuan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}