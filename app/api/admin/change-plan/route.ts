import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ALLOWED_PLANS = ["digital", "digital_plus", "nfc"];

export async function POST(request: Request) {
  try {
    // Verify the person making the request
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

    // Only the LinkCard admin can change plans
    if (user.id !== process.env.LINKCARD_ADMIN_USER_ID) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { userId, plan } = await request.json();

    if (!userId || !ALLOWED_PLANS.includes(plan)) {
      return NextResponse.json(
        { error: "Invalid user or plan" },
        { status: 400 }
      );
    }

    // Service-role client performs the database update
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ plan })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("Change plan error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}