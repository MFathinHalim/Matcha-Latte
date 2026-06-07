"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AdminApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [application, setApplication] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  async function loadPage() {
    try {
      const meRes =
        await fetch("/api/auth/me");

      const meData =
        await meRes.json();

      if (!meData.success) {
        router.push("/login");
        return;
      }

      const role =
        meData.user.role;

      if (
        role !== "admin" &&
        role !== "superadmin"
      ) {
        router.push(
          "/applications"
        );
        return;
      }

      const appRes =
        await fetch(
          `/api/admin/applications/tracking/${params.trackingCode}`
        );

      const appData =
        await appRes.json();

      if (!appData.success) {
        alert(
          appData.message
        );
        return;
      }

      setApplication(
        appData.application
      );
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
      const adminNotes = prompt(
        "Catatan admin (opsional):"
      );

      const res = await fetch(
        `/api/admin/applications/tracking/${application.trackingCode}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
            adminNotes:
              adminNotes || "",
          }),
        }
      );

      const data =
        await res.json();

      alert(data.message);

      if (data.success) {
        await loadPage();
      }
    } catch (error) {
      console.error(error);

      alert(
        "Terjadi kesalahan"
      );
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!application) {
    return (
      <p>
        Pengajuan tidak ditemukan
      </p>
    );
  }

  return (
    <div>
      <h1>
        Detail Pengajuan
      </h1>

      <hr />

      <p>
        <b>Tracking Code:</b>{" "}
        {
          application.trackingCode
        }
      </p>

      <p>
        <b>Jenis:</b>{" "}
        {
          application.serviceType
        }
      </p>

      <p>
        <b>Status:</b>{" "}
        {
          application.status
        }
      </p>

      <p>
        <b>Deskripsi:</b>{" "}
        {
          application.description
        }
      </p>

      <hr />

      <h2>Dokumen</h2>

      {application.documents
        ?.length === 0 ? (
        <p>
          Tidak ada dokumen
        </p>
      ) : (
        application.documents.map(
          (doc, index) => (
            <div
              key={index}
            >
              <p>
                {
                  doc.requirement
                }
              </p>

              <button
                onClick={() =>
                  window.open(
                    doc.fileUrl,
                    "_blank"
                  )
                }
              >
                Lihat
              </button>
            </div>
          )
        )
      )}
      <hr />

<h2>Aksi Admin</h2>

{application.status ===
  "pending_review" && (
  <>
    <button
      onClick={() =>
        updateStatus(
          "approved"
        )
      }
    >
      Approve
    </button>

    <button
      style={{
        marginLeft: 10,
      }}
      onClick={() =>
        updateStatus(
          "rejected"
        )
      }
    >
      Reject
    </button>
  </>
)}
    </div>
  );
}