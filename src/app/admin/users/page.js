"use client";

import {
  useEffect,
  useState,
} from "react";

export default function UsersPage() {
  const [users, setUsers] =
    useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const res = await fetch(
      "/api/admin/users"
    );

    const data =
      await res.json();

    if (data.success) {
      setUsers(data.users);
    }
  }

  async function toggleBan(
    user
  ) {
    await fetch(
      `/api/admin/users/${user._id}/ban`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          isBanned:
            !user.isBanned,
        }),
      }
    );

    loadUsers();
  }

  async function toggleRole(
    user
  ) {
    await fetch(
      `/api/admin/users/${user._id}/role`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          role:
            user.role ===
            "admin"
              ? "user"
              : "admin",
        }),
      }
    );

    loadUsers();
  }

  return (
    <div>
      <h1>
        User Management
      </h1>

      {users.map((user) => (
        <div
          key={user._id}
          style={{
            border:
              "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <p>
            {
              user.fullName
            }
          </p>

          <p>
            {user.phone}
          </p>

          <p>
            Role:
            {" "}
            {user.role}
          </p>

          <p>
            Banned:
            {" "}
            {user.isBanned
              ? "Ya"
              : "Tidak"}
          </p>

         {user.role === "superadmin" ? (
  <p>
    <b>Super Admin</b>
  </p>
) : (
  <>
    <button
      onClick={() =>
        toggleRole(user)
      }
    >
      {user.role === "admin"
        ? "Jadikan User"
        : "Jadikan Admin"}
    </button>

    <button
      style={{
        marginLeft: 10,
      }}
      onClick={() =>
        toggleBan(user)
      }
    >
      {user.isBanned
        ? "Unban"
        : "Ban"}
    </button>
  </>
)}
        </div>
      ))}
    </div>
  );
}