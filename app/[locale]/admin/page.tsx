import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import DeleteUserButton from "./DeleteUserButton";

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
            {users.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {account.email ?? "No email"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {account.id}
                  </p>
                </div>

                {account.id === process.env.LINKCARD_ADMIN_USER_ID ? (
  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
    ADMIN
  </span>
) : (
  <div className="flex items-center gap-3">
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
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}