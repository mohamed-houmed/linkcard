import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import DeleteUserButton from "./DeleteUserButton";
import ChangePlanSelect from "./ChangePlanSelect";

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
  .select("id, first_name, last_name, slug, plan, is_published");

if (profilesError) {
  throw new Error(`Unable to load profiles: ${profilesError.message}`);
}
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold text-slate-900">
          LinkCard Admin
        </h1>

        <p className="mt-2 text-slate-600">
          Manage LinkCard accounts
        </p>

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
  <ChangePlanSelect
    userId={account.id}
    currentPlan={profile.plan ?? "digital"}
  />
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
  <p className="text-[11px] text-blue-500">
  Slug: {profile?.slug ?? "NO SLUG"}
</p>
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