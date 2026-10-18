"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RenewSubscriptionButtonProps = {
  userId: string;
  plan: string;
};

export default function RenewSubscriptionButton({
  userId,
  plan,
}: RenewSubscriptionButtonProps) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleRenew() {
    const confirmed = window.confirm(
      "Renew this customer's subscription for one additional month?"
    );

    if (!confirmed) return;

    setSaving(true);

    try {
      const response = await fetch("/api/admin/renew-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to renew subscription");
      }

      alert("Subscription renewed successfully!");
      router.refresh();
    } catch (error) {
      console.error("RENEW SUBSCRIPTION ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to renew subscription."
      );
    } finally {
      setSaving(false);
    }
  }

  if (plan === "nfc") return null;

  return (
    <button
      type="button"
      onClick={handleRenew}
      disabled={saving}
      className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50"
    >
      {saving ? "Renewing..." : "Renew"}
    </button>
  );
}