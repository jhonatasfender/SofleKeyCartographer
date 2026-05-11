import { supabase } from "./supabaseClient";

export async function upsertAppUser(params: {
  clerkUserId: string;
  email?: string | null;
}): Promise<{ id: string } | null> {
  const { clerkUserId, email } = params;
  const { data, error } = await supabase
    .from("app_users")
    .upsert(
      { clerk_user_id: clerkUserId, email: email ?? null },
      { onConflict: "clerk_user_id" },
    )
    .select("id")
    .single();

  if (error) {
    console.error("Failed to upsert app user", error);
    return null;
  }
  return data as { id: string };
}
