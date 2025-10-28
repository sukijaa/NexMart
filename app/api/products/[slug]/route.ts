import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } } // ✅ Strict, correct typing
) {
  // ✅ Fix: no need to await context.params
  const { slug } = context.params;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product: data });
}

// ✅ Optional, keeps the route dynamic
export const dynamic = "force-dynamic";
