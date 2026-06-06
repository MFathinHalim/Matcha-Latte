"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateApplicationPage() {
  const router = useRouter();

  const [serviceType, setServiceType] =
    useState("ktp");

  const [description, setDescription] =
    useState("");

  async function createApplication(e) {
    e.preventDefault();

    const res = await fetch(
      "/api/application/create",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          serviceType,
          description,
        }),
      }
    );

    const data = await res.json();

    if (!data.success) {
      return alert(data.message);
    }

    router.push("/applications");
  }

  return (
    <div>
      <h1>Buat Pengajuan</h1>

      <form
        onSubmit={createApplication}
      >
        <select
          value={serviceType}
          onChange={(e) =>
            setServiceType(
              e.target.value
            )
          }
        >
          <option value="ktp">
            KTP
          </option>

          <option value="kk">
            KK
          </option>

          <option value="akta_kelahiran">
            Akta Kelahiran
          </option>
        </select>

        <br />
        <br />

        <textarea
          placeholder="Deskripsi"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <button type="submit">
          Buat Pengajuan
        </button>
      </form>
    </div>
  );
}