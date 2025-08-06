import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your project's URL and anon key.
const supabaseUrl = "https://gnungfapaoevkjmywbbl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdudW5nZmFwYW9ldmtqbXl3YmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDMwODgsImV4cCI6MjA3MDAxOTA4OH0.5Xg2IhjcDqD2_cjdVpKPucBHPrm22wXSAsHuK1Cfu2k";

const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("YOUR_SUPABASE");

if (!isSupabaseConfigured) {
    console.warn('Supabase credentials not found. Please check your src/lib/supabase.ts file. Using mock data.')
}

// Only create a client if the credentials are valid
export const supabase = isSupabaseConfigured 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        // Provide a mock client so the app doesn't crash
        from: () => ({
            select: async () => ({ data: [], error: { message: 'Supabase not configured' } }),
            insert: async () => ({ data: [], error: { message: 'Supabase not configured' } }),
            update: async () => ({ data: [], error: { message: 'Supabase not configured' } }),
            delete: async () => ({ data: [], error: { message: 'Supabase not configured' } }),
            upsert: async () => ({ data: [], error: { message: 'Supabase not configured' } }),
        }),
        auth: {
            getUser: async () => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
        },
        storage: {
            from: () => ({
                upload: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
                getPublicUrl: () => ({ data: { publicUrl: '' } }),
            })
        }
    } as any;
