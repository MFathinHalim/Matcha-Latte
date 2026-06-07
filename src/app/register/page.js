"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [waitingOtp, setWaitingOtp] =
    useState(false);

  async function sendOtp(e) {
    e.preventDefault();

    const res = await fetch(
      "/api/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          fullName,
          phone,
          password,
        }),
      }
    );

    const data =
      await res.json();

    alert(data.message);

    if (data.success) {
      setWaitingOtp(true);
    }
  }

  async function verifyOtp(
    e
  ) {
    e.preventDefault();

    const res = await fetch(
      "/api/auth/verify-register",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          phone,
          code: otp,
        }),
      }
    );

    const data =
      await res.json();

    alert(data.message);

    if (data.success) {
      router.push("/login");
    }
  }

  return (
    <div>
      <h1>Register</h1>

      {!waitingOtp ? (
        <form
          onSubmit={sendOtp}
        >
          <input
            placeholder="Nama"
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value
              )
            }
          />

          <br />

          <input
            placeholder="Nomor HP"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
          />

          <br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <br />

          <button>
            Kirim OTP
          </button>
        </form>
      ) : (
        <form
          onSubmit={
            verifyOtp
          }
        >
          <p>
            OTP sudah
            dikirim ke WA
          </p>

          <input
            placeholder="OTP"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value
              )
            }
          />

          <br />

          <button>
            Verifikasi
          </button>
        </form>
      )}
    </div>
  );
}