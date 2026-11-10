import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from "resend";
import {
  createSubscriptionReminderEmail,
  type SubscriptionReminderType,
} from "@/lib/emails/subscription-reminder";
// Initialize Resend email service
const resend = new Resend(process.env.RESEND_API_KEY);
// ============================================
// SUBSCRIPTION REMINDER SAFETY SETTINGS
// ============================================

// Keep automatic email delivery disabled during development.
// Automatic reminder delivery remains disabled until production launch.
const REMINDER_EMAILS_ENABLED = false;
// Email address authorized for future testing.
const REMINDER_TEST_EMAIL = process.env.REMINDER_TEST_EMAIL;
type ReminderType =
  | "expiry_7_days"
  | "expiry_3_days"
  | "expiry_1_day"
  | "subscription_expired";

type ReservationResult =
  | { reserved: true; notificationId: string }
  | { reserved: false; reason: "duplicate" | "error" };

async function reserveNotification(
  userId: string,
  email: string,
  notificationType: ReminderType,
  expirationDate: string
): Promise<ReservationResult> {
  const { data, error } = await supabaseAdmin
    .from("subscription_email_notifications")
    .insert({
      user_id: userId,
      email,
      notification_type: notificationType,
      subscription_expires_at: expirationDate,
      status: "pending",
      claimed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    // PostgreSQL unique-constraint violation.
    if (error.code === "23505") {
      return { reserved: false, reason: "duplicate" };
    }

    console.error("Notification reservation failed:", error);

    return { reserved: false, reason: "error" };
  }

  return {
    reserved: true,
    notificationId: data.id,
  };
}
async function retryFailedNotification(
  userId: string,
  notificationType: ReminderType,
  expirationDate: string
): Promise<ReservationResult> {
  const { data, error } = await supabaseAdmin
    .from("subscription_email_notifications")
    .update({
      status: "pending",
      claimed_at: new Date().toISOString(),
      error_message: null,
    })
    .eq("user_id", userId)
    .eq("notification_type", notificationType)
    .eq("subscription_expires_at", expirationDate)
    .eq("status", "failed")
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Notification retry reservation failed:", error);

    return {
      reserved: false,
      reason: "error",
    };
  }

  if (!data) {
    return {
      reserved: false,
      reason: "duplicate",
    };
  }

  return {
    reserved: true,
    notificationId: data.id,
  };
}
// ============================================
// MARK NOTIFICATION AS SENT
// ============================================
async function markNotificationSent(
  notificationId: string,
  resendEmailId: string
): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("subscription_email_notifications")
    .update({
      status: "sent",
      resend_email_id: resendEmailId,
      sent_at: new Date().toISOString(),
      error_message: null,
    })
    .eq("id", notificationId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Unable to mark notification as sent:", error);
    return false;
  }

  if (!data) {
    console.error("Notification was not updated as sent.");
    return false;
  }

  return true;
}
async function markNotificationFailed(
  notificationId: string,
  errorMessage: string
): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("subscription_email_notifications")
    .update({
      status: "failed",
      error_message: errorMessage.slice(0, 500),
      sent_at: null,
    })
    .eq("id", notificationId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Unable to mark notification as failed:", error);
    return false;
  }

  if (!data) {
    console.error("Notification was not updated as failed.");
    return false;
  }

  return true;
}

// ============================================
// MARK NOTIFICATION AS FAILED
// ============================================
// Identify notification attempts that may have been interrupted.
// This function does not modify or resend notifications.

async function findStalePendingNotifications() {
  const thirtyMinutesAgo = new Date(
    Date.now() - 30 * 60 * 1000
  ).toISOString();

  const { data, error } = await supabaseAdmin
    .from("subscription_email_notifications")
    .select("id, user_id, notification_type, claimed_at")
    .eq("status", "pending")
    .lt("claimed_at", thirtyMinutesAgo)
    .limit(100);

  if (error) {
    console.error("Unable to check pending notifications:", error);
    return [];
  }

  return data ?? [];
}
async function sendSubscriptionReminder(
  notificationId: string,
  email: string,
  firstName: string,
  plan: string,
  isTrial: boolean,
  reminderType: SubscriptionReminderType,
  expirationDate: string
): Promise<boolean> {
  // Block all email delivery until explicitly enabled.
  if (!REMINDER_EMAILS_ENABLED) {
    console.log("Subscription reminder emails are disabled.");
    return false;
  }

  // Only allow the designated test email during development.
  if (
    !REMINDER_TEST_EMAIL ||
    email.trim().toLowerCase() !==
      REMINDER_TEST_EMAIL.trim().toLowerCase()
  ) {
    console.log("Subscription reminder blocked: test email only.");
    return false;
  }

  try {
    // Generate the personalized email.
    const emailContent = createSubscriptionReminderEmail({
      firstName,
      plan,
      isTrial,
      reminderType,
      expirationDate,
    });

    // Send the email through Resend.
    const { data, error } = await resend.emails.send({
      from: "LinkCard <contact@getlinkcard.com>",
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (error || !data?.id) {
      console.error("Resend rejected subscription reminder:", error);

      await markNotificationFailed(
        notificationId,
        error?.message ?? "Resend did not return an email ID"
      );

      return false;
    }

    // Record the email as accepted by Resend.
    const recorded = await markNotificationSent(
      notificationId,
      data.id
    );

    if (!recorded) {
      console.error(
        "Resend accepted the email, but the database update failed."
      );

      // Do not retry automatically here:
      // the email may already have been delivered.
      return false;
    }

    return true;
  } catch (error) {
    console.error("Subscription reminder sending error:", error);

    // A network error may occur after Resend accepted the email.
    // Keep the notification pending for investigation rather
    // than automatically retrying an uncertain delivery.
    return false;
  }
}
// ============================================
// PREPARE TEST SUBSCRIPTION REMINDER
// ============================================

function prepareTestReminder() {
  const testEmail = process.env.REMINDER_TEST_EMAIL?.trim();

  if (!testEmail) {
    return null;
  }

  // Create a sample expiration date 7 days from now.
  const expirationDate = new Date();
  expirationDate.setUTCDate(expirationDate.getUTCDate() + 7);

  // Generate the sample email.
  const emailContent = createSubscriptionReminderEmail({
    firstName: "Mohamed",
    plan: "digital_plus",
    isTrial: false,
    reminderType: "expiry_7_days",
    expirationDate: expirationDate.toISOString(),
  });

  return {
    recipient: testEmail,
    subject: emailContent.subject,
    html: emailContent.html,
  };
}
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

const testEmailConfigured = Boolean(
  process.env.REMINDER_TEST_EMAIL?.trim()
);
  if (!cronSecret) {
    console.error("CRON_SECRET is not configured");

    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Retrieve customer subscriptions from Supabase.
const { data: profiles, error } = await supabaseAdmin
  .from("profiles")
  .select(
    "id, first_name, last_name, plan, subscription_status, trial_ends_at, subscription_ends_at"
  );

if (error) {
  console.error("Unable to load subscriptions:", error);

  return NextResponse.json(
    { error: "Unable to load subscriptions" },
    { status: 500 }
  );
}
// ============================================
// SECURE CUSTOMER EMAIL LOOKUP
// ============================================

// Retrieve authentication accounts using the
// Supabase Admin API (server-side only).

const customerEmails = new Map<string, string>();

let page = 1;
const perPage = 1000;

while (true) {
  const {
    data: { users },
    error: usersError,
  } = await supabaseAdmin.auth.admin.listUsers({
    page,
    perPage,
  });

  if (usersError) {
    console.error("Unable to retrieve customer emails:", usersError);

    return NextResponse.json(
      { error: "Unable to retrieve customer emails" },
      { status: 500 }
    );
  }

  for (const account of users) {
    if (account.email) {
      customerEmails.set(account.id, account.email);
    }
  }

  if (users.length < perPage) {
    break;
  }

  page++;
}
const now = new Date();
const today = Date.UTC(
  now.getUTCFullYear(),
  now.getUTCMonth(),
  now.getUTCDate()
);

const reminderCounts = {
  expiry_7_days: 0,
  expiry_3_days: 0,
  expiry_1_day: 0,
  subscription_expired: 0,
};
// Count emails successfully accepted by Resend.
let emailsSent = 0;

for (const profile of profiles ?? []) {
// Never process subscription reminders for the administrator.
if (profile.id === process.env.LINKCARD_ADMIN_USER_ID) {
  continue;
}
  // Skip accounts without a valid email address.
  if (!customerEmails.has(profile.id)) {
    continue;
  }

  // NFC customers have lifetime access.
  if (profile.plan === "nfc") {
    continue;
  }

  if (
    profile.subscription_status !== "active" &&
    profile.subscription_status !== "trialing"
  ) {
    continue;
  }

  const expirationDate =
    profile.subscription_status === "trialing"
      ? profile.trial_ends_at
      : profile.subscription_ends_at;

  if (!expirationDate) continue;

  const expiry = new Date(expirationDate);

  if (Number.isNaN(expiry.getTime())) continue;

  const expiryDay = Date.UTC(
    expiry.getUTCFullYear(),
    expiry.getUTCMonth(),
    expiry.getUTCDate()
  );

  const daysUntilExpiry = Math.round(
    (expiryDay - today) / (1000 * 60 * 60 * 24)
  );
  // Determine which reminder this subscription needs.
let reminderType: ReminderType | null = null;

if (daysUntilExpiry === 7 && now < expiry) {
  reminderType = "expiry_7_days";
} else if (daysUntilExpiry === 3 && now < expiry) {
  reminderType = "expiry_3_days";
} else if (daysUntilExpiry === 1 && now < expiry) {
  reminderType = "expiry_1_day";
} else if (daysUntilExpiry <= 0 && now >= expiry) {
  reminderType = "subscription_expired";
}

// Count eligible reminders.
if (reminderType) {
  reminderCounts[reminderType]++;
}
// ============================================
// EMAIL DELIVERY SAFETY CHECK
// ============================================

// Do not reserve notifications while delivery is disabled.
if (!REMINDER_EMAILS_ENABLED) {
  continue;
}
// ============================================
// TEST ACCOUNT SAFETY CHECK
// ============================================

// Only process the designated test email.
// This prevents reminders from reaching other customers
// while the system is under development.

const customerEmail = customerEmails.get(profile.id);

if (!customerEmail || !REMINDER_TEST_EMAIL) {
  continue;
}

if (
  customerEmail.trim().toLowerCase() !==
  REMINDER_TEST_EMAIL.trim().toLowerCase()
) {
  continue;
}

// Never send subscription reminders to the administrator.
if (profile.id === process.env.LINKCARD_ADMIN_USER_ID) {
  continue;
}

// Only continue when a reminder is required.
if (!reminderType) {
  continue;
}
// Do not reserve notifications when email delivery is disabled.
if (!REMINDER_EMAILS_ENABLED) {
  continue;
}
// ============================================
// RESERVE SUBSCRIPTION NOTIFICATION
// ============================================

// Reserve this reminder in Supabase.
// The unique database constraint prevents duplicates.
// First, try to reserve a new notification.
let reservation = await reserveNotification(
  profile.id,
  customerEmail,
  reminderType,
  expiry.toISOString()
);

// If a notification already exists, attempt to recover it
// only if its previous status is "failed".
// Automatic retries are temporarily disabled.
// Failed notifications require manual investigation
// to avoid accidentally sending duplicate emails.

// If the reminder already exists, do not create another.
if (!reservation.reserved) {
  if (reservation.reason === "duplicate") {
    console.log("Subscription reminder already reserved.");
  } else {
    console.error("Unable to reserve subscription reminder.");
  }

  continue;
}

// The notification is now reserved in Supabase.
console.log(
  "Subscription reminder reserved:",
  reservation.notificationId
);
// Send the reserved subscription reminder.
const emailSent = await sendSubscriptionReminder(
  reservation.notificationId,
  customerEmail,
  profile.first_name || "there",
  profile.plan,
  profile.subscription_status === "trialing",
  reminderType,
  expiry.toISOString()
);

if (emailSent) {
  emailsSent++;
  console.log("Subscription reminder successfully submitted.");
} else {
  console.log("Subscription reminder was not submitted successfully.");
}

} // End of customer-processing loop

// Check for potentially interrupted notification attempts.
const staleNotifications = await findStalePendingNotifications();
// Prepare a sample reminder without sending an email.
const testReminder = prepareTestReminder();

const testReminderPreview = testReminder
  ? {
      configured: true,
      subject: testReminder.subject,
      recipientMatchesConfiguredEmail:
        testReminder.recipient.toLowerCase() ===
        REMINDER_TEST_EMAIL?.trim().toLowerCase(),
    }
  : {
      configured: false,
      subject: null,
      recipientMatchesConfiguredEmail: false,
    };
return NextResponse.json({
  success: true,
  message: "Subscription reminder preview completed.",
  reminderCounts,
  emailsSent,
  testEmailConfigured,
  testReminderPreview,
  stalePendingNotifications: staleNotifications.length,
  requiresInvestigation: staleNotifications.length > 0,
});
}
