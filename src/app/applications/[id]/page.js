"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode";
import { ArrowLeft, FileText } from "lucide-react"; // Mengimpor ikon Lucide
import { COLORS } from "@/constants/colors";
import { SERVICE_REQUIREMENTS } from "@/constants/serviceRequirements";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [selectedFiles, setSelectedFiles] = useState({});

  function getStatusLabel(status) {
    switch (status) {
      case "draft": return "Draft";
      case "pending_review": return "menunggu";
      case "approved": return "disetujui";
      case "rejected": return "ditolak";
      default: return status;
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case "pending_review": return COLORS.warning;
      case "approved": return COLORS.success;
      case "rejected": return COLORS.danger;
      default: return COLORS.secondary;
    }
  }

  async function generateQRCode(trackingCode) {
    try {
      const url = `${window.location.origin}/admin/applications/${trackingCode}`;
      const qr = await QRCode.toDataURL(url);
      setQrCode(qr);
    } catch (error) {
      console.error(error);
    }
  }

  function isApplicationReady(app) {
    const requirements = SERVICE_REQUIREMENTS[app.serviceType] || [];
    return requirements.every((requirement) =>
      app.documents?.some((doc) => doc.requirement === requirement),
    );
  }

  function downloadQR() {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `${application.trackingCode}.png`;
    link.click();
  }

  async function loadApplication() {
    try {
      const res = await fetch(`/api/application/${params.id}`);
      const data = await res.json();

      if (data.success) {
        setApplication(data.application);
        if (data.application.trackingCode) {
          generateQRCode(data.application.trackingCode);
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params.id) {
      loadApplication();
    }
  }, [params.id]);

  async function uploadDocument(requirement, file) {
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("requirement", requirement);
      formData.append("file", file);

      const res = await fetch(`/api/application/${params.id}/documents`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Upload berhasil");
      setSelectedFiles((prev) => {
        const copy = { ...prev };
        delete copy[requirement];
        return copy;
      });
      await loadApplication();
    } catch (err) {
      console.error(err);
      alert("Upload gagal");
    } finally {
      setUploading(false);
    }
  }

  async function submitApplication() {
    const res = await fetch(`/api/application/${params.id}/submit`, {
      method: "POST",
    });
    const data = await res.json();
    alert(data.message);
    if (data.success) {
      loadApplication();
    }
  }

  async function deleteApplication() {
    const ok = confirm("Hapus pengajuan ini?");
    if (!ok) return;

    const res = await fetch(`/api/application/${params.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    alert(data.message);
    if (data.success) {
      router.push("/applications");
    }
  }

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!application) return <p className="p-6 text-center">Not found</p>;

  const ready = isApplicationReady(application);
  const requirements = SERVICE_REQUIREMENTS[application.serviceType] || [];

  // ================= TAMPILAN 1: UPLOAD DOKUMEN (BELUM READY) =================
  if (!ready) {
    return (
      <div 
        className="min-h-screen w-full px-6 py-10 md:px-16 lg:px-32 flex flex-col justify-start" 
        style={{ background: COLORS.background, color: COLORS.text }}
      >
        <div className="w-full max-w-4xl mx-auto">
          {/* TOMBOL BACK */}
          <button 
            onClick={() => router.back()} 
            className="border-none bg-transparent p-0 mb-6 cursor-pointer flex items-center justify-center transition-transform active:scale-90"
            style={{ color: COLORS.text }}
          >
            <ArrowLeft size={24} className="md:w-8 md:h-8" />
          </button>

          <h1 className="text-xl md:text-3xl font-bold mb-1 tracking-tight">Upload Dokumen</h1>
          <p className="text-sm md:text-base mb-8 md:mb-12" style={{ color: "#555" }}>
            Upload dokumen sesuai persyaratan
          </p>

          <div className="flex flex-col gap-4 md:gap-6">
            {requirements.map((req) => {
              const uploaded = application.documents?.find((d) => d.requirement === req);

              return (
                <div 
                  key={req} 
                  className="flex justify-between items-center py-4 md:py-6 border-b" 
                  style={{ borderColor: "rgba(0,0,0,0.08)" }}
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    {/* ICON BERGANTI KE LUCIDE-REACT */}
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.04)" }}>
                      <FileText size={22} className="md:w-8 md:h-8" style={{ color: COLORS.text }} />
                    </div>
                    <div>
                      <div className="font-bold text-sm md:text-xl text-slate-800">{req}</div>
                      <div className="text-xs md:text-sm mt-0.5" style={{ color: uploaded ? COLORS.success : "#777" }}>
                        {uploaded ? "Sudah diupload" : "Belum diupload"}
                      </div>
                    </div>
                  </div>

                  {uploaded ? (
                    <button
                      onClick={() => window.open(uploaded.fileUrl, "_blank")}
                      className="border rounded-xl px-5 py-2 text-xs md:text-sm font-bold bg-white cursor-pointer transition-transform active:scale-95"
                      style={{ borderColor: COLORS.text }}
                    >
                      Lihat
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        id={`file-${req}`}
                        hidden
                        type="file"
                        onChange={(e) =>
                          setSelectedFiles((prev) => ({
                            ...prev,
                            [req]: e.target.files?.[0],
                          }))
                        }
                      />
                      {!selectedFiles[req] ? (
                        <button
                          onClick={() => document.getElementById(`file-${req}`)?.click()}
                          className="border rounded-xl px-5 py-2 text-xs md:text-sm font-bold bg-white cursor-pointer transition-transform active:scale-95"
                          style={{ borderColor: COLORS.text }}
                        >
                          Pilih File
                        </button>
                      ) : (
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="text-[10px] md:text-xs max-w-[150px] truncate" style={{ color: "#555" }}>
                            {selectedFiles[req].name}
                          </span>
                          <button
                            disabled={uploading}
                            onClick={() => uploadDocument(req, selectedFiles[req])}
                            className="border-none rounded-xl px-4 py-2 text-xs md:text-sm font-bold cursor-pointer disabled:opacity-50"
                            style={{ background: COLORS.primary }}
                          >
                            Upload
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {application.status === "draft" && (
            <button
              onClick={submitApplication}
              className="w-full mt-10 md:mt-14 border-none rounded-2xl p-4 md:p-5 font-bold text-sm md:text-base cursor-pointer shadow-sm transition-transform active:scale-[0.99]"
              style={{ background: COLORS.primary }}
            >
              Lanjutkan
            </button>
          )}
          <p className="mt-4 text-xs md:text-sm" style={{ color: "#777" }}>* Dokumen wajib</p>
        </div>
      </div>
    );
  }

  // ================= TAMPILAN 2: DETAIL PENGAJUAN (SUDAH READY / SUBMITTED) =================
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

        {/* JUDUL UTAMA */}
        <h1 className="text-xl font-bold tracking-tight mb-8 md:text-3xl md:mb-14">
          Detail Pengajuan
        </h1>

        {/* WRAPPER GRID UTAMA */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          
          {/* KOLOM KIRI (QR CODE & KODE TRACKING) */}
          <div className="md:col-span-5 flex flex-col items-center md:items-stretch gap-6 md:gap-8">
            {/* QR CODE SECTION */}
            {application.status !== "draft" && isApplicationReady(application) && qrCode && (
              <div className="flex flex-col items-center w-full">
                <div 
                  className="rounded-3xl p-5 border flex items-center justify-center bg-white"
                  style={{ borderColor: COLORS.text }}
                >
                  <img src={qrCode} alt="QR" className="block w-[150px] h-[150px] md:w-[220px] md:h-[220px]" />
                </div>

                <button
                  onClick={downloadQR}
                  className="border-none bg-transparent mt-3 text-sm md:text-base font-semibold cursor-pointer"
                  style={{ color: COLORS.text }}
                >
                  Download QR
                </button>
              </div>
            )}

            {/* TRACKING CARD */}
            <div
              className="w-full border rounded-2xl p-5 md:p-7 bg-transparent"
              style={{ borderColor: COLORS.text }}
            >
              <h2 className="m-0 text-lg md:text-2xl font-bold tracking-tight break-all">
                {application.trackingCode}
              </h2>

              <p className="mt-1 mb-4 uppercase text-xs md:text-sm font-semibold tracking-wider opacity-70">
                {application.serviceType.replaceAll("_", " ")}
              </p>

              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs md:text-sm font-bold"
                style={{
                  background: getStatusColor(application.status),
                  color: COLORS.accent || "#000",
                }}
              >
                {getStatusLabel(application.status)}
              </span>
            </div>
          </div>

          {/* KOLOM KANAN (INFORMASI DETAIL PENGAJUAN) */}
          <div className="md:col-span-7 flex flex-col gap-6 md:gap-8">
            <h2 className="text-base md:text-2xl font-bold tracking-tight">
              Informasi Pengajuan
            </h2>

            <div className="flex flex-col gap-6 md:gap-8">
              {/* JENIS PENGAJUAN */}
              <div>
                <p className="text-xs md:text-sm font-medium mb-1" style={{ color: "#555" }}>
                  Jenis Pengajuan
                </p>
                <h3 className="m-0 text-base md:text-2xl font-bold">
                  {application.serviceType.replaceAll("_", " ").toUpperCase()}
                </h3>
              </div>

              {/* DESKRIPSI */}
              <div>
                <p className="text-xs md:text-sm font-medium mb-1" style={{ color: "#555" }}>
                  Deskripsi
                </p>
                <h3 className="m-0 text-sm md:text-lg font-bold leading-relaxed whitespace-pre-line">
                  {application.description || "-"}
                </h3>
              </div>

              {/* DOKUMEN */}
              <div>
                <p className="text-xs md:text-sm font-medium mb-2" style={{ color: "#555" }}>
                  Dokumen
                </p>
                <div className="flex flex-col gap-3">
                  {application.documents?.map((doc, index) => (
                    <button
                      key={index}
                      onClick={() => window.open(doc.fileUrl, "_blank")}
                      className="w-full border-none p-4 rounded-xl text-left text-sm md:text-base font-bold cursor-pointer transition-transform active:scale-[0.99] flex items-center gap-2"
                      style={{ background: COLORS.primary, color: COLORS.text }}
                    >
                      <FileText size={18} />
                      {doc.fileName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ACTION BUTTONS UNTUK DRAFT */}
        {application.status === "draft" && (
          <div className="mt-14 flex gap-4 max-w-sm md:ml-auto">
            <button
              onClick={submitApplication}
              className="flex-1 border-none p-4 rounded-xl font-bold text-sm md:text-base cursor-pointer"
              style={{ background: COLORS.primary }}
            >
              Submit Pengajuan
            </button>

            <button
              onClick={deleteApplication}
              className="border-none p-4 rounded-xl font-bold text-sm md:text-base cursor-pointer"
              style={{ background: COLORS.danger }}
            >
              Hapus
            </button>
          </div>
        )}

      </div>
    </div>
  );
}