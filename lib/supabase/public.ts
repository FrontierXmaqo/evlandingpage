import { createClient } from "@supabase/supabase-js";

/**
 * Anon-key client with no cookie/session handling — for reading public,
 * RLS-readable data (e.g. on the public landing page) without opting the
 * route into fully dynamic rendering the way the cookie-based server
 * client does.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
