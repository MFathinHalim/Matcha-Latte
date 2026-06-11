"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileText, Check, X } from "lucide-react"; // Menggunakan Lucide Icon
import { COLORS } from "@/constants/colors";

export default function AdminApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadPage() {
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();

      if (!meData.success) {
        router.push("/login");
        return;
      }

      const role = meData.user.role;
      if (role !== "admin" && role !== "superadmin") {
        router.push("/");
        return;
      }

      const appRes = await fetch(
        `/api/admin/applications/tracking/${params.trackingCode}`
      );
      const appData = await appRes.json();

      if (!appData.success) {
        alert(appData.message);
        return;
      }

      setApplication(appData.application);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params.trackingCode) {
      loadPage();
    }
  }, [params.trackingCode]);

  async function updateStatus(status) {
    try {
      const adminNotes = prompt("Catatan admin (opsional):");

      const res = await fetch(
        `/api/admin/applications/tracking/${application.trackingCode}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            adminNotes: adminNotes || "",
          }),
        }
      );

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        await loadPage();
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    }
  }

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
  if (!application) return <p className="p-6 text-center" style={{ color: COLORS.text }}>Pengajuan tidak ditemukan</p>;

  return (
    <div
      className="min-h-screen w-full px-6 py-10 md:px-16 lg:px-32"
      style={{ background: COLORS.background, color: COLORS.text }}
    >
      <div className="max-w-5xl mx-auto">
        
        {/* TOMBOL BACK */}
        <button
          onClick={() => router.back()}
          className="border-none bg-transparent p-0 mb-6 cursor-pointer flex items-center justify-center transition-transform active:scale-90"
          style={{ color: COLORS.text }}
        >
          <ArrowLeft size={24} className="md:w-8 md:h-8" />
        </button>

        {/* HEADER DASHBOARD */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-14">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight m-0">
              Detail Pengajuan (Admin)
            </h1>
            <p className="m-0 mt-1 text-sm md:text-base opacity-70">
              Halaman kelola validasi berkas pemohon
            </p>
          </div>

          {/* BADGE STATUS */}
          <div className="self-start md:self-center">
            <span
              className="inline-block px-4 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider"
              style={{
                background: getStatusColor(application.status),
                color: COLORS.accent || "#000",
              }}
            >
              {getStatusLabel(application.status)}
            </span>
          </div>
        </div>

        {/* WRAPPER DATA GRIDS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          
          {/* KOLOM KIRI: DETAIL INFORMASI */}
          <div className="md:col-span-7 flex flex-col gap-6 md:gap-8">
            <div>
              <h2 className="text-base md:text-xl font-bold tracking-tight mb-4">
                Informasi Pengajuan
              </h2>
              
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-xs md:text-sm font-medium mb-1 opacity-60">Tracking Code</p>
                  <h3 className="m-0 text-base md:text-xl font-bold break-all">
                    {application.trackingCode}
                  </h3>
                </div>

                <div>
                  <p className="text-xs md:text-sm font-medium mb-1 opacity-60">Jenis Pengajuan</p>
                  <h3 className="m-0 text-base md:text-xl font-bold uppercase">
                    {application.serviceType.replaceAll("_", " ")}
                  </h3>
                </div>

                <div>
                  <p className="text-xs md:text-sm font-medium mb-1 opacity-60">Deskripsi Pemohon</p>
                  <h3 className="m-0 text-sm md:text-lg font-medium leading-relaxed whitespace-pre-line opacity-90">
                    {application.description || "-"}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: DOKUMEN & AKSI */}
          <div className="md:col-span-5 flex flex-col gap-8">
            
            {/* DAFTAR BERKAS */}
            <div>
              <h2 className="text-base md:text-xl font-bold tracking-tight mb-4">
                Berkas Lampiran
              </h2>
              
              {application.documents?.length === 0 ? (
                <p className="text-sm opacity-60 italic">Tidak ada dokumen yang dilampirkan</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {application.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="w-full p-4 rounded-xl flex items-center justify-between gap-4 border"
                      style={{ borderColor: "rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)" }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText size={20} className="shrink-0 opacity-70" />
                        <span className="text-sm md:text-base font-bold truncate">
                          {doc.requirement}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => window.open(doc.fileUrl, "_blank")}
                        className="border rounded-xl px-4 py-1.5 text-xs font-bold bg-white cursor-pointer shrink-0 transition-transform active:scale-95"
                        style={{ borderColor: COLORS.text, color: "#000" }}
                      >
                        Lihat
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PANEL AKSI ADMIN */}
            {application.status === "pending_review" && (
              <div className="pt-4 border-t" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                <h2 className="text-base md:text-xl font-bold tracking-tight mb-4">
                  Tindakan Validasi
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* TOMBOL APPROVE */}
                  <button
                    onClick={() => updateStatus("approved")}
                    className="flex-1 border-none p-4 rounded-xl font-bold text-sm md:text-base cursor-pointer transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ background: COLORS.success }}
                  >
                    <Check size={18} />
                    Setujui
                  </button>

                  {/* TOMBOL REJECT */}
                  <button
                    onClick={() => updateStatus("rejected")}
                    className="flex-1 border-none p-4 rounded-xl font-bold text-sm md:text-base cursor-pointer transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ background: COLORS.danger }}
                  >
                    <X size={18} />
                    Tolak
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}