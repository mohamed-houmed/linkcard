"use client";

import { useState } from "react";

type DeleteUserButtonProps = {
  userId: string;
  email: string;
};

export default function DeleteUserButton({
  userId,
  email,
}: DeleteUserButtonProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Permanently delete ${email}?\n\nThis will delete the LinkCard account and its associated data. This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete account");
      }

      alert("Account deleted successfully.");

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete account."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete account"}
    </button>
  );
}