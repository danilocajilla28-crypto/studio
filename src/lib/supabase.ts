import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your project's URL and anon key.
const supabaseUrl = "YOUR_SUPABASE_URL_HERE";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY_HERE";

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("YOUR_SUPABASE")) {
    console.warn('Supabase credentials not found. Please check your src/lib/supabase.ts file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
