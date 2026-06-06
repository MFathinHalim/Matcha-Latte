"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ApplicationsPage() {
  const [applications, setApplications] =
    useState([]);

  async function loadApplications() {
    try {
      const res = await fetch(
        "/api/application/my"
      );

      const data = await res.json();

      if (data.success) {
        setApplications(
          data.applications
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <div>
      <h1>Pengajuan Saya</h1>

      <br />

      <Link href="/applications/create">
        Buat Pengajuan
      </Link>

      <br />
      <br />

      {applications.length === 0 ? (
        <p>Belum ada pengajuan</p>
      ) : (
        applications.map((app) => (
          <div
            key={app._id}
            style={{
              border: "1px solid black",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>
              Layanan:
              {" "}
              {app.serviceType}
            </p>

            <p>
              Status:
              {" "}
              {app.status}
            </p>

            <Link
              href={`/applications/${app._id}`}
            >
              Detail
            </Link>
          </div>
        ))
      )}
    </div>
  );
}