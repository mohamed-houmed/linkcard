import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    locale: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext,
) {
  const { locale } = await context.params;

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    const { error } =
      await supabase.auth.exchangeCodeForSession(
        code,
      );

    if (!error) {
      return NextResponse.redirect(
        new URL(
          `/${locale}/dashboard`,
          requestUrl.origin,
        ),
      );
    }
  }

  return NextResponse.redirect(
    new URL(
      `/${locale}/login?error=confirmation`,
      requestUrl.origin,
    ),
  );
}