"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode";

import { SERVICE_REQUIREMENTS } from "@/constants/serviceRequirements";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [application, setApplication] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [qrCode, setQrCode] =
    useState("");

  const [selectedFiles, setSelectedFiles] =
    useState({});

  async function generateQRCode(
    trackingCode
  ) {
    try {
      const url =
        `${window.location.origin}/admin/applications/${trackingCode}`;

      const qr =
        await QRCode.toDataURL(
          url
        );

      setQrCode(qr);
    } catch (error) {
      console.error(error);
    }
  }

  function isApplicationReady(
    app
  ) {
    const requirements =
      SERVICE_REQUIREMENTS[
        app.serviceType
      ] || [];

    return requirements.every(
      (requirement) =>
        app.documents?.some(
          (doc) =>
            doc.requirement ===
            requirement
        )
    );
  }

  function downloadQR() {
    const link =
      document.createElement("a");

    link.href = qrCode;

    link.download =
      `${application.trackingCode}.png`;

    link.click();
  }

  async function loadApplication() {
    try {
      const res = await fetch(
        `/api/application/${params.id}`
      );

      const data =
        await res.json();

      if (data.success) {
        setApplication(
          data.application
        );

        if (
          data.application
            .trackingCode
        ) {
          generateQRCode(
            data.application
              .trackingCode
          );
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);

      alert(
        "Gagal load data"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params.id) {
      loadApplication();
    }
  }, [params.id]);

  async function uploadDocument(
    requirement,
    file
  ) {
    if (!file) return;

    try {
      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        "requirement",
        requirement
      );

      formData.append(
        "file",
        file
      );

      const res = await fetch(
        `/api/application/${params.id}/documents`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await res.json();

      if (!data.success) {
        alert(
          data.message
        );
        return;
      }

      alert(
        "Upload berhasil"
      );

      setSelectedFiles(
        (prev) => {
          const copy = {
            ...prev,
          };

          delete copy[
            requirement
          ];

          return copy;
        }
      );

      await loadApplication();
    } catch (err) {
      console.error(err);

      alert(
        "Upload gagal"
      );
    } finally {
      setUploading(false);
    }
  }

  async function submitApplication() {
    const res = await fetch(
      `/api/application/${params.id}/submit`,
      {
        method: "POST",
      }
    );

    const data =
      await res.json();

    alert(data.message);

    if (data.success) {
      loadApplication();
    }
  }

  async function deleteApplication() {
    const ok = confirm(
      "Hapus pengajuan ini?"
    );

    if (!ok) return;

    const res = await fetch(
      `/api/application/${params.id}`,
      {
        method: "DELETE",
      }
    );

    const data =
      await res.json();

    alert(data.message);

    if (data.success) {
      router.push(
        "/applications"
      );
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!application) {
    return <p>Not found</p>;
  }

  const requirements =
    SERVICE_REQUIREMENTS[
      application.serviceType
    ] || [];

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <h1>
        Detail Pengajuan
      </h1>

      <hr />

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
        <b>Tracking:</b>{" "}
        {
          application.trackingCode
        }
      </p>

      <p>
        <b>Deskripsi:</b>{" "}
        {
          application.description
        }
      </p>

      <hr />

      <h2>
        Dokumen Wajib
      </h2>

      {requirements.map(
        (req) => {
          const uploaded =
            application.documents?.find(
              (d) =>
                d.requirement ===
                req
            );

          return (
            <div
              key={req}
              style={{
                border:
                  "1px solid #ddd",
                padding: 10,
                marginBottom: 10,
              }}
            >
              <p>
                {uploaded
                  ? "✅"
                  : "❌"}{" "}
                {req}
              </p>

              {uploaded && (
                <>
                  <button
                    onClick={() =>
                      window.open(
                        uploaded.fileUrl,
                        "_blank"
                      )
                    }
                  >
                    Lihat Dokumen
                  </button>

                  <p
                    style={{
                      fontSize:
                        12,
                    }}
                  >
                    {
                      uploaded.fileName
                    }
                  </p>
                </>
              )}

              {application.status ===
                "draft" && (
                <>
                  <input
                    type="file"
                    onChange={(
                      e
                    ) =>
                      setSelectedFiles(
                        (
                          prev
                        ) => ({
                          ...prev,
                          [req]:
                            e
                              .target
                              .files?.[0],
                        })
                      )
                    }
                  />

                  {selectedFiles[
                    req
                  ] && (
                    <>
                      <p>
                        File
                        dipilih:
                        {" "}
                        {
                          selectedFiles[
                            req
                          ]
                            .name
                        }
                      </p>

                      <button
                        disabled={
                          uploading
                        }
                        onClick={() =>
                          uploadDocument(
                            req,
                            selectedFiles[
                              req
                            ]
                          )
                        }
                      >
                        {uploading
                          ? "Uploading..."
                          : "Upload"}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          );
        }
      )}

      <hr />

      <h2>
        Dokumen Terupload
      </h2>

      {application.documents
        ?.length === 0 ? (
        <p>
          Belum ada dokumen
        </p>
      ) : (
        application.documents.map(
          (d, i) => (
            <div
              key={i}
            >
              <p>
                {
                  d.requirement
                }
              </p>

              <button
                onClick={() =>
                  window.open(
                    d.fileUrl,
                    "_blank"
                  )
                }
              >
                Open
              </button>
            </div>
          )
        )
      )}

      <hr />

      {application.status ===
        "draft" && (
        <>
          <button
            onClick={
              submitApplication
            }
          >
            Submit Pengajuan
          </button>

          <button
            onClick={
              deleteApplication
            }
            style={{
              marginLeft: 10,
            }}
          >
            Hapus
          </button>
        </>
      )}

      {application.status !==
        "draft" &&
        isApplicationReady(
          application
        ) &&
        qrCode && (
          <>
            <hr />

            <h2>
              QR Code
              Verifikasi
            </h2>

            <img
              src={qrCode}
              alt="QR Code"
              width={250}
            />

            <br />
            <br />

            <button
              onClick={
                downloadQR
              }
            >
              Download QR
            </button>
          </>
        )}
    </div>
  );
}