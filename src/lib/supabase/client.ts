import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.DATABASE_URL?.replace(/^postgres(ql)?:\/\/.*@/, "https://").replace(/:\d+\/.*$/, ".supabase.co") || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseAnonKey;
  return createClient(url, key);
}
