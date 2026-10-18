import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import DeleteUserButton from "./DeleteUserButton";
import ChangePlanSelect from "./ChangePlanSelect";
import RenewSubscriptionButton from "./RenewSubscriptionButton";
import DeactivateSubscriptionButton from "./DeactivateSubscriptionButton";
import ActivateSubscriptionButton from "./ActivateSubscriptionButton";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in
  if (!user) {
    redirect("/en/login");
  }

  // Logged in but not admin
  if (user.id !== process.env.LINKCARD_ADMIN_USER_ID) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full rounded-2xl bg-white border border-slate-200 p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Access denied
          </h1>

          <p className="mt-3 text-slate-600">
            You do not have permission to access the LinkCard administration
            dashboard.
          </p>
        </div>
      </main>
    );
  }

  // Get all LinkCard authentication users
  const {
    data: { users },
    error,
  } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    throw new Error(`Unable to load users: ${error.message}`);
  }
const { data: profiles, error: profilesError } = await supabaseAdmin
  .from("profiles")
  .select(`
    id,
    first_name,
    last_name,
    slug,
    plan,
    is_published,
    subscription_status,
    trial_ends_at,
    subscription_ends_at
  `);

if (profilesError) {
  throw new Error(`Unable to load profiles: ${profilesError.message}`);
}
// ============================================
// LINKCARD SUBSCRIPTION STATISTICS
// ============================================

const now = new Date();

const customerProfiles = (profiles ?? []).filter(
  (profile) => profile.id !== process.env.LINKCARD_ADMIN_USER_ID
);

const totalCustomers = users.filter(
  (account) => account.id !== process.env.LINKCARD_ADMIN_USER_ID
).length;

const activeSubscriptions = customerProfiles.filter(
  (profile) =>
    profile.subscription_status === "active" &&
    (
      profile.plan === "nfc" ||
      (
        profile.subscription_ends_at &&
        new Date(profile.subscription_ends_at) > now
      )
    )
).length;

const trialSubscriptions = customerProfiles.filter(
  (profile) =>
    profile.subscription_status === "trialing" &&
    profile.trial_ends_at &&
    new Date(profile.trial_ends_at) > now
).length;

const inactiveSubscriptions = customerProfiles.filter(
  (profile) => profile.subscription_status === "inactive"
).length;

const expiredSubscriptions = customerProfiles.filter(
  (profile) =>
    (
      profile.subscription_status === "active" &&
      profile.plan !== "nfc" &&
      (
        !profile.subscription_ends_at ||
        new Date(profile.subscription_ends_at) <= now
      )
    ) ||
    (
      profile.subscription_status === "trialing" &&
      (
        !profile.trial_ends_at ||
        new Date(profile.trial_ends_at) <= now
      )
    )
).length;

const digitalCustomers = customerProfiles.filter(
  (profile) => profile.plan === "digital"
).length;

const digitalPlusCustomers = customerProfiles.filter(
  (profile) => profile.plan === "digital_plus"
).length;

const nfcCustomers = customerProfiles.filter(
  (profile) => profile.plan === "nfc"
).length;

// Estimated MRR based on active monthly subscriptions.
// This does not represent verified payment revenue.

const monthlyRecurringRevenue = customerProfiles.reduce(
  (total, profile) => {
    if (
      profile.subscription_status !== "active" ||
      !profile.subscription_ends_at ||
      new Date(profile.subscription_ends_at) <= now
    ) {
      return total;
    }

    if (profile.plan === "digital") {
      return total + 599;
    }

    if (profile.plan === "digital_plus") {
      return total + 1099;
    }

    return total;
  },
  0
);
// ============================================
// SUBSCRIPTIONS EXPIRING WITHIN 7 DAYS
// ============================================

const sevenDaysFromNow = new Date(now);

sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

const expiringSoon = customerProfiles
  .filter((profile) => {
    // NFC subscriptions have lifetime access.
    if (profile.plan === "nfc") {
      return false;
    }

    // Include active paid subscriptions and valid trials.
    if (
      profile.subscription_status !== "active" &&
      profile.subscription_status !== "trialing"
    ) {
      return false;
    }

    const expirationDate =
      profile.subscription_status === "trialing"
        ? profile.trial_ends_at
        : profile.subscription_ends_at;

    if (!expirationDate) {
      return false;
    }

    const expiry = new Date(expirationDate);

    return expiry > now && expiry <= sevenDaysFromNow;
  })
  .map((profile) => {
    const account = users.find(
      (account) => account.id === profile.id
    );

    const expirationDate =
      profile.subscription_status === "trialing"
        ? profile.trial_ends_at
        : profile.subscription_ends_at;

    const expiry = new Date(expirationDate!);

    const daysRemaining = Math.ceil(
      (expiry.getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return {
      id: profile.id,
      name:
        `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() ||
        "Unnamed customer",
      email: account?.email ?? "No email",
      plan: profile.plan,
      status: profile.subscription_status,
      expiresAt: expiry,
      daysRemaining,
    };
  })
  .sort(
    (a, b) =>
      a.expiresAt.getTime() - b.expiresAt.getTime()
  );

const expiringSoonCount = expiringSoon.length;
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold text-slate-900">
          LinkCard Admin
        </h1>

        <p className="mt-2 text-slate-600">
          Manage LinkCard accounts
        </p>
        {/* ============================================
    LINKCARD ADMIN STATISTICS DASHBOARD
============================================ */}

<div className="mt-10 space-y-8">
  {/* SUBSCRIPTIONS EXPIRING SOON */}
<section>
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-lg font-bold text-slate-900">
      ⚠️ Subscriptions Expiring Soon
    </h2>

    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
      {expiringSoonCount} customers
    </span>
  </div>

  <div className="overflow-x-auto rounded-2xl border border-amber-200 bg-white shadow-sm">
    {expiringSoon.length === 0 ? (
      <div className="p-6 text-center text-sm text-slate-500">
        No subscriptions expiring within the next 7 days.
      </div>
    ) : (
      <table className="w-full text-left text-sm">
        <thead className="bg-amber-50 text-slate-700">
          <tr>
            <th className="px-5 py-4">Customer</th>
            <th className="px-5 py-4">Plan</th>
            <th className="px-5 py-4">Type</th>
            <th className="px-5 py-4">Expiration</th>
            <th className="px-5 py-4">Remaining</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {expiringSoon.map((customer) => (
            <tr key={customer.id}>
              <td className="px-5 py-4">
                <p className="font-semibold text-slate-900">
                  {customer.name}
                </p>
                <p className="text-xs text-slate-500">
                  {customer.email}
                </p>
              </td>

              <td className="px-5 py-4">
                {customer.plan === "digital_plus"
                  ? "Digital Plus"
                  : "Digital"}
              </td>

              <td className="px-5 py-4">
                {customer.status === "trialing"
                  ? "Free Trial"
                  : "Paid Subscription"}
              </td>

              <td className="px-5 py-4">
                {customer.expiresAt.toLocaleDateString("en-GB")}
              </td>

              <td className="px-5 py-4">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  {customer.daysRemaining} day
                  {customer.daysRemaining !== 1 ? "s" : ""}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
</section>

  {/* OVERVIEW */}
  <section>
    <h2 className="mb-4 text-lg font-bold text-slate-900">
      Business Overview
    </h2>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Total Customers
        </p>
        <p className="mt-3 text-3xl font-bold text-slate-900">
          {totalCustomers}
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Registered customer accounts
        </p>
      </div>

      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
        <p className="text-sm font-medium text-green-700">
          Active Subscriptions
        </p>
        <p className="mt-3 text-3xl font-bold text-green-800">
          {activeSubscriptions}
        </p>
        <p className="mt-2 text-xs text-green-600">
          Currently active customers
        </p>
      </div>

      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6 shadow-sm">
        <p className="text-sm font-medium text-violet-700">
          Estimated Monthly Revenue
        </p>
        <p className="mt-3 text-3xl font-bold text-violet-800">
          {monthlyRecurringRevenue.toLocaleString("en-US")} FDJ
        </p>
        <p className="mt-2 text-xs text-violet-600">
          Estimated MRR — not verified payments
        </p>
      </div>

    </div>
  </section>

  {/* SUBSCRIPTION STATUS */}
  <section>
    <h2 className="mb-4 text-lg font-bold text-slate-900">
      Subscription Status
    </h2>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <p className="text-sm font-medium text-blue-700">
          Free Trials
        </p>
        <p className="mt-3 text-3xl font-bold text-blue-800">
          {trialSubscriptions}
        </p>
        <p className="mt-2 text-xs text-blue-600">
          Trials currently in progress
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Inactive Subscriptions
        </p>
        <p className="mt-3 text-3xl font-bold text-slate-800">
          {inactiveSubscriptions}
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Manually deactivated subscriptions
        </p>
      </div>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="text-sm font-medium text-red-700">
          Expired Subscriptions
        </p>
        <p className="mt-3 text-3xl font-bold text-red-800">
          {expiredSubscriptions}
        </p>
        <p className="mt-2 text-xs text-red-600">
          Subscriptions requiring attention
        </p>
      </div>

    </div>
  </section>

  {/* PLAN DISTRIBUTION */}
  <section>
    <h2 className="mb-4 text-lg font-bold text-slate-900">
      Plan Distribution
    </h2>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Digital
        </p>
        <p className="mt-3 text-3xl font-bold text-slate-900">
          {digitalCustomers}
        </p>
        <p className="mt-2 text-xs text-slate-400">
          599 FDJ / month
        </p>
      </div>

      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6 shadow-sm">
        <p className="text-sm font-medium text-violet-700">
          Digital Plus
        </p>
        <p className="mt-3 text-3xl font-bold text-violet-800">
          {digitalPlusCustomers}
        </p>
        <p className="mt-2 text-xs text-violet-600">
          1,099 FDJ / month
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <p className="text-sm font-medium text-amber-700">
          NFC
        </p>
        <p className="mt-3 text-3xl font-bold text-amber-800">
          {nfcCustomers}
        </p>
        <p className="mt-2 text-xs text-amber-600">
          7,999 FDJ — lifetime access
        </p>
      </div>

    </div>
  </section>

</div>
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold">
              Users ({users.length})
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
           {users.map((account) => {
  const profile = profiles?.find(
    (profile) => profile.id === account.id
  );

  return (
    <div
      key={account.id}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div>
  <p className="font-semibold text-slate-900">
    {profile
      ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() ||
        "Unnamed profile"
      : "No LinkCard profile"}
  </p>

  <p className="mt-1 text-sm text-slate-600">
    {account.email ?? "No email"}
  </p>

  <div className="mt-2 flex flex-wrap items-center gap-2">
    {profile && (
  <>
    <ChangePlanSelect
      userId={account.id}
      currentPlan={profile.plan ?? "digital"}
    />

    {account.id !== process.env.LINKCARD_ADMIN_USER_ID && (
      <RenewSubscriptionButton
        userId={account.id}
        plan={profile.plan ?? "digital"}
      />
    )}
    {account.id !== process.env.LINKCARD_ADMIN_USER_ID && (
  <DeactivateSubscriptionButton
    userId={account.id}
    subscriptionStatus={profile.subscription_status ?? "inactive"}
  />
)}
{account.id !== process.env.LINKCARD_ADMIN_USER_ID && (
  <ActivateSubscriptionButton
    userId={account.id}
    subscriptionStatus={profile.subscription_status ?? "inactive"}
  />
)}
  </>
)}

    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        profile?.is_published
          ? "bg-green-50 text-green-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {profile?.is_published ? "Published" : "Not published"}
    </span>
  </div>

  <p className="mt-2 text-[11px] text-slate-400">
    {account.id}
  </p>
  {profile && (
  <div className="mt-2 space-y-1 text-xs">
    <p className="text-slate-600">
      Subscription:{" "}
      <span className="font-semibold">
        {profile.subscription_status === "active" &&
        (profile.plan === "nfc" ||
          (profile.subscription_ends_at &&
            new Date(profile.subscription_ends_at) > new Date()))
          ? "Active"
          : profile.subscription_status === "trialing" &&
              profile.trial_ends_at &&
              new Date(profile.trial_ends_at) > new Date()
            ? "Trial"
            : "Inactive / Expired"}
      </span>
    </p>

    <p className="text-slate-500">
      Expires:{" "}
      {profile.plan === "nfc" &&
      profile.subscription_status === "active"
        ? "Lifetime"
        : profile.subscription_status === "trialing"
          ? profile.trial_ends_at
            ? new Date(profile.trial_ends_at).toLocaleDateString("en-GB")
            : "Not set"
          : profile.subscription_ends_at
            ? new Date(profile.subscription_ends_at).toLocaleDateString("en-GB")
            : "Not set"}
    </p>
  </div>
)}
</div>

                {account.id === process.env.LINKCARD_ADMIN_USER_ID ? (
  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
    ADMIN
  </span>
) : (
  <div className="flex items-center gap-3">
    {profile?.slug && (
  <a
    href={`/en/${profile.slug}`}
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100"
  >
    View profile
  </a>
)}
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      USER
    </span>

    <DeleteUserButton
      userId={account.id}
      email={account.email ?? "Unknown user"}
    />
  </div>
)}
                  </div>
  );
})}
          </div>

        </div>
      </div>
    </main>
  );
}