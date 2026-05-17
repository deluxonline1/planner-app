/**
 * Supabase browser client — zameni implementaciju kada povežeš backend.
 * Primer: createBrowserClient iz @supabase/ssr
 */


import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);



export function createSupabaseBrowserClient() {
  return null as unknown;
}
