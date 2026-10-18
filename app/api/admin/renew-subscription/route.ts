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

    if (user.id !== process.env.LINKCARD_ADMIN_USER_ID) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { userId } = await request.json();

    if (typeof userId !== "string" || !userId) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select("plan, subscription_status, subscription_ends_at")
        .eq("id", userId)
        .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    if (!["digital", "digital_plus"].includes(profile.plan)) {
      return NextResponse.json(
        { error: "Only monthly plans can be renewed" },
        { status: 400 }
      );
    }

    const now = new Date();

    // Extend an unexpired active subscription.
    // Otherwise, start a new month from today.
    const currentEnd = profile.subscription_ends_at
      ? new Date(profile.subscription_ends_at)
      : null;

    const startDate =
      profile.subscription_status === "active" &&
      currentEnd &&
      currentEnd > now
        ? currentEnd
        : now;

    const newEndDate = new Date(startDate);

    // Add one calendar month, preserving the time.
    // Clamp to the last day for shorter months.
    const originalDay = newEndDate.getUTCDate();

    newEndDate.setUTCDate(1);
    newEndDate.setUTCMonth(newEndDate.getUTCMonth() + 1);

    const lastDayOfTargetMonth = new Date(
      Date.UTC(
        newEndDate.getUTCFullYear(),
        newEndDate.getUTCMonth() + 1,
        0
      )
    ).getUTCDate();

    newEndDate.setUTCDate(
      Math.min(originalDay, lastDayOfTargetMonth)
    );

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        subscription_status: "active",
        subscription_ends_at: newEndDate.toISOString(),
        trial_started_at: null,
        trial_ends_at: null,
      })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription_ends_at: newEndDate.toISOString(),
    });
  } catch (error) {
    console.error("Renew subscription error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}