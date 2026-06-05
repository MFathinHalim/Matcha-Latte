"use client";

import { useEffect, useState } from "react";

export default function EditProfilePage() {
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
    });

    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.success) {
            setForm({
                fullName: data.user.fullName,
                phone: data.user.phone,
            });
        }
    }

    async function saveProfile(e) {
        e.preventDefault();

        const res = await fetch(
            "/api/profile/update",
            {
                method: "PUT",
                headers: {
                "Content-Type":
                    "application/json",
                },
                body: JSON.stringify(form),
            }
        );

        const data = await res.json();
        if (data.success) {
            alert("Profil berhasil diupdate");
        } else {
            alert(data.message);
        }
    }

    return (
        <div>
            <h1>Edit Profil</h1>

            <form onSubmit={saveProfile}>
                <input
                value={form.fullName}
                onChange={(e) =>
                    setForm({
                    ...form,
                    fullName: e.target.value,
                    })
                }
                />

                <br />

                <input
                value={form.phone}
                onChange={(e) =>
                    setForm({
                    ...form,
                    phone: e.target.value,
                    })
                }
                />

                <br />

                <button>Simpan</button>
            </form>
        </div>
    );
}