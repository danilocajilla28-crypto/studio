import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("YOUR_SUPABASE");

if (!isSupabaseConfigured) {
    console.warn('Supabase credentials not found or are placeholders. Please check your environment variables. Using mock data.')
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
