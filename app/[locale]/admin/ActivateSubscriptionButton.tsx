"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ActivateSubscriptionButtonProps = {
  userId: string;
  subscriptionStatus: string;
};

export default function ActivateSubscriptionButton({
  userId,
  subscriptionStatus,
}: ActivateSubscriptionButtonProps) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleActivate() {
    const confirmed = window.confirm(
      "Have you confirmed this customer's payment? Activating will immediately restore their subscription."
    );

    if (!confirmed) return;

    setSaving(true);

    try {
      const response = await fetch("/api/admin/activate-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to activate subscription");
      }

      alert("Subscription activated successfully!");

      router.refresh();
    } catch (error) {
      console.error("ACTIVATE SUBSCRIPTION ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to activate subscription."
      );
    } finally {
      setSaving(false);
    }
  }

  if (subscriptionStatus !== "inactive") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleActivate}
      disabled={saving}
      className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50"
    >
      {saving ? "Activating..." : "Activate"}
    </button>
  );
}