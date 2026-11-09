export type SubscriptionReminderType =
  | "expiry_7_days"
  | "expiry_3_days"
  | "expiry_1_day"
  | "subscription_expired";

type SubscriptionReminderParams = {
  firstName: string;
  plan: string;
  isTrial: boolean;
  reminderType: SubscriptionReminderType;
  expirationDate: string;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return replacements[character] ?? character;
  });
}

export function createSubscriptionReminderEmail({
  firstName,
  plan,
  isTrial,
  reminderType,
  expirationDate,
}: SubscriptionReminderParams) {
  const safeName = escapeHtml(firstName || "there");

  const planName =
    plan === "digital_plus"
      ? "Digital Plus"
      : plan === "digital"
        ? "Digital"
        : "LinkCard";

  const subscriptionLabel = isTrial
    ? "free trial"
    : "subscription";

  const daysRemaining: Record<SubscriptionReminderType, number> = {
    expiry_7_days: 7,
    expiry_3_days: 3,
    expiry_1_day: 1,
    subscription_expired: 0,
  };

  const days = daysRemaining[reminderType];

  const subject =
    reminderType === "subscription_expired"
      ? `Your LinkCard ${subscriptionLabel} has expired`
      : days === 1
        ? `Your LinkCard ${subscriptionLabel} expires tomorrow`
        : `Your LinkCard ${subscriptionLabel} expires in ${days} days`;

  const message =
    reminderType === "subscription_expired"
      ? `Your LinkCard ${subscriptionLabel} has expired. Renew or activate a subscription to restore access to the features included in your plan.`
      : `Your LinkCard ${subscriptionLabel} will expire ${
          days === 1 ? "tomorrow" : `in ${days} days`
        }. Review your account to avoid losing access to features included in your plan.`;

  const formattedDate = new Date(expirationDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }
  );

  const html = `
    <div style="background:#f4f7fb;padding:32px 16px;font-family:Arial,sans-serif;">
      <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:12px;padding:32px;">
        <h1 style="color:#2563eb;margin-top:0;">LinkCard</h1>

        <h2 style="color:#111827;">Subscription Reminder</h2>

        <p style="color:#374151;">Hello ${safeName},</p>

        <p style="color:#374151;line-height:1.7;">
          ${message}
        </p>

        <div style="background:#f3f6fc;padding:18px;border-radius:8px;margin:24px 0;">
          <p><strong>Plan:</strong> ${planName}</p>
          <p><strong>Type:</strong> ${isTrial ? "Free trial" : "Paid subscription"}</p>
          <p><strong>Expiration date:</strong> ${formattedDate}</p>
        </div>

        <p style="color:#374151;line-height:1.7;">
          You can review your subscription by signing in to LinkCard.
        </p>

        <a
          href="https://www.getlinkcard.com"
          style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:bold;"
        >
          Open LinkCard
        </a>

        <p style="color:#6b7280;font-size:13px;margin-top:32px;">
          This is an automated notification from LinkCard.
        </p>
      </div>
    </div>
  `;

  return {
    subject,
    html,
  };
}