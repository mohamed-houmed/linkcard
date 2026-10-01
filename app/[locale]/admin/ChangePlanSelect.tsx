"use client";

import { useState } from "react";

type ChangePlanSelectProps = {
  userId: string;
  currentPlan: string;
};

export default function ChangePlanSelect({
  userId,
  currentPlan,
}: ChangePlanSelectProps) {
  const [plan, setPlan] = useState(currentPlan);
  const [saving, setSaving] = useState(false);

  async function handleChange(newPlan: string) {
    const previousPlan = plan;

    setPlan(newPlan);
    setSaving(true);

    try {
      const response = await fetch("/api/admin/change-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          plan: newPlan,
        }),
      });

      if (!response.ok) {
  const result = await response.json();
  console.error("CHANGE PLAN API ERROR:", result);

  throw new Error(result.error || "Unable to change plan");
}
    } catch (error) {
      console.error(error);
      setPlan(previousPlan);
      alert("Unable to change this user's plan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={plan}
      disabled={saving}
      onChange={(event) => handleChange(event.target.value)}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
    >
        <option value="free" disabled>
  Free (Legacy)
</option>
      <option value="digital">Digital</option>
      <option value="digital_plus">Digital Plus</option>
      <option value="nfc">NFC</option>
    </select>
  );
}