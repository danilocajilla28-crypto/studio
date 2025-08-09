
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const mockSupabase = {
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

const createSupabaseClient = () => {
    if (supabaseUrl && supabaseAnonKey) {
        try {
            return createClient(supabaseUrl, supabaseAnonKey);
        } catch (error) {
            console.error("Failed to create Supabase client:", error);
            return mockSupabase;
        }
    } else {
        console.warn('Supabase credentials are not configured. Using mock client.');
        return mockSupabase;
    }
};

export const supabase = createSupabaseClient();
