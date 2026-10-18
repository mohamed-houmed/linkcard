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

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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

    if (userId === user.id) {
      return NextResponse.json(
        { error: "You cannot modify your own admin subscription" },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select("id, plan, subscription_status")
        .eq("id", userId)
        .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    if (profile.subscription_status !== "inactive") {
      return NextResponse.json(
        { error: "Only inactive subscriptions can be activated" },
        { status: 400 }
      );
    }

    const now = new Date();

    let subscriptionEndsAt: string | null = null;

    if (profile.plan !== "nfc") {
      const expiry = new Date(now);

      expiry.setUTCMonth(expiry.getUTCMonth() + 1);

      subscriptionEndsAt = expiry.toISOString();
    }

    const { data: updatedProfile, error: updateError } =
      await supabaseAdmin
        .from("profiles")
        .update({
          subscription_status: "active",
          subscription_ends_at: subscriptionEndsAt,
          trial_started_at: null,
          trial_ends_at: null,
        })
        .eq("id", userId)
        .eq("subscription_status", "inactive")
        .select("id, plan, subscription_status, subscription_ends_at")
        .maybeSingle();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    if (!updatedProfile) {
      return NextResponse.json(
        { error: "Subscription status changed. Refresh and try again." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Activate subscription error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}