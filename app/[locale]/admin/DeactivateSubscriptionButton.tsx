"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeactivateSubscriptionButtonProps = {
  userId: string;
  subscriptionStatus: string;
};

export default function DeactivateSubscriptionButton({
  userId,
  subscriptionStatus,
}: DeactivateSubscriptionButtonProps) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleDeactivate() {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this customer's subscription? Their paid features will become unavailable immediately."
    );

    if (!confirmed) return;

    setSaving(true);

    try {
      const response = await fetch("/api/admin/deactivate-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to deactivate subscription");
      }

      alert("Subscription deactivated successfully!");

      router.refresh();
    } catch (error) {
      console.error("DEACTIVATE SUBSCRIPTION ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to deactivate subscription."
      );
    } finally {
      setSaving(false);
    }
  }

  // No need to deactivate an already inactive subscription.
  if (subscriptionStatus === "inactive") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleDeactivate}
      disabled={saving}
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
    >
      {saving ? "Deactivating..." : "Deactivate"}
    </button>
  );
}