"use client";

import {
  useEffect,
  useState,
} from "react";

export default function AdminPage() {
  const [stats, setStats] =
    useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const res = await fetch(
      "/api/admin/stats"
    );

    const data =
      await res.json();

    if (data.success) {
      setStats(data.stats);
    }
  }

  if (!stats) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>
        Admin Dashboard
      </h1>

      <p>
        Total User:
        {" "}
        {
          stats.totalUsers
        }
      </p>

      <p>
        Total Admin:
        {" "}
        {
          stats.totalAdmins
        }
      </p>

      <p>
        User Diban:
        {" "}
        {
          stats.bannedUsers
        }
      </p>

      <hr />

      <p>
        Draft:
        {" "}
        {stats.draft}
      </p>

      <p>
        Pending:
        {" "}
        {
          stats.pending
        }
      </p>

      <p>
        Approved:
        {" "}
        {
          stats.approved
        }
      </p>

      <p>
        Rejected:
        {" "}
        {
          stats.rejected
        }
      </p>

      <p>
        Completed:
        {" "}
        {
          stats.completed
        }
      </p>
    </div>
  );
}