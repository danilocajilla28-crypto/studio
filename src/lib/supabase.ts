
import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// A check to ensure you've configured your environment variables.
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("YOUR_SUPABASE");

if (!isSupabaseConfigured) {
    // This warning will show in your development console if you haven't set up your keys,
    // and in your hosting provider's build logs if you forget to set them there.
    console.warn('Supabase credentials are not configured. Please check your environment variables.')
}

// Initialize the client. If the credentials are not valid, it will still create a mock client
// to prevent the app from crashing, but it will not connect to any database.
export const supabase = isSupabaseConfigured 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        // Provide a mock client so the app doesn't crash during development if keys are missing.
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
