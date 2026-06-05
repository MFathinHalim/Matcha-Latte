"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const res = await fetch(
        "/api/auth/me"
    );

    const data = await res.json();

    if (!data.success) {
        window.location.href = "/login";
        return;
    }

    setUser(data.user);
}

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <p>ID: {user._id}</p>

      <p>Nama: {user.fullName}</p>

      <p>Telepon: {user.phone}</p>

      <p>Role: {user.role}</p>

      <br />

      <Link href="/profile/edit">
        Edit Profil
      </Link>

      <br />
      <br />

      <button
        onClick={async () => {
          await fetch(
            "/api/auth/logout",
            {
                method: "POST",
            }
            );

            window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
}