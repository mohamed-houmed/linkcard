import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const ADMIN_USER_ID = "11112ab7-2f6e-43e0-b1d6-86d09a5d402a";

export async function DELETE(request: Request) {
  try {
    // 1. Verify the person making the request
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // 2. Only the LinkCard admin can delete accounts
    if (user.id !== ADMIN_USER_ID) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // 3. Get the account we want to delete
    const { userId } = await request.json();

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Never allow the admin account to delete itself
    if (userId === ADMIN_USER_ID) {
      return NextResponse.json(
        { error: "The admin account cannot be deleted." },
        { status: 400 }
      );
    }

    // 4. Create privileged Supabase client
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 5. Delete the user's LinkCard data

    const { error: appointmentsError } = await supabaseAdmin
      .from("appointments")
      .delete()
      .eq("owner_id", userId);

    if (appointmentsError) throw appointmentsError;

    const { error: meetingTypesError } = await supabaseAdmin
      .from("meeting_types")
      .delete()
      .eq("user_id", userId);

    if (meetingTypesError) throw meetingTypesError;

    const { error: bookingSettingsError } = await supabaseAdmin
      .from("booking_settings")
      .delete()
      .eq("user_id", userId);

    if (bookingSettingsError) throw bookingSettingsError;

    const { error: socialLinksError } = await supabaseAdmin
      .from("social_links")
      .delete()
      .eq("user_id", userId);

    if (socialLinksError) throw socialLinksError;

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) throw profileError;

    // 6. Finally delete the Supabase Authentication account
    const { error: deleteAuthError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteAuthError) throw deleteAuthError;

    return NextResponse.json({
      success: true,
      message: "LinkCard account deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete account." },
      { status: 500 }
    );
  }
}