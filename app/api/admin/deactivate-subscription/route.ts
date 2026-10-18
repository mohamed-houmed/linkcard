import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // Only authenticated users can continue.
    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only the LinkCard administrator can deactivate subscriptions.
    if (
      !process.env.LINKCARD_ADMIN_USER_ID ||
      user.id !== process.env.LINKCARD_ADMIN_USER_ID
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { userId } = await request.json();

    if (typeof userId !== "string" || !userId.trim()) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    // Prevent accidental deactivation of the administrator account.
    if (userId === user.id) {
      return NextResponse.json(
        { error: "You cannot deactivate your own admin subscription" },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select("id, plan")
        .eq("id", userId)
        .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Preserve the customer's plan and expiration dates.
    // Only change the subscription status.
    const { data: updatedProfile, error: updateError } =
      await supabaseAdmin
        .from("profiles")
        .update({
          subscription_status: "inactive",
        })
        .eq("id", userId)
        .select("id, plan, subscription_status")
        .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Deactivate subscription error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}