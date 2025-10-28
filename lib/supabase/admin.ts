// File: lib/supabase/admin.ts

import { createClient } from '@supabase/supabase-js';
import { Product } from '../types';

// Note: this client is for server-side *admin tasks* (like seeding) only.
// It uses the SERVICE_ROLE_KEY, which bypasses RLS.

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
}

export const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);