import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CmsRole = "admin" | "editor";

export async function requireCmsUser() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    redirect("/admin/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name, role, is_active")
    .eq("id", userId)
    .single();

  if (
    profileError ||
    !profile ||
    !profile.is_active ||
    !["admin", "editor"].includes(profile.role)
  ) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  return {
    id: userId,
    email: typeof claimsData.claims.email === "string"
      ? claimsData.claims.email
      : null,
    displayName: profile.display_name,
    role: profile.role as CmsRole,
  };
}
