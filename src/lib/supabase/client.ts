import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types'; // Assuming we'll generate this later, for now we might use any or a placeholder

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
