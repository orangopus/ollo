import { SupabaseClient } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';

export const SupabaseContext = createContext<SupabaseClient<any, "public", any>>({} as SupabaseClient<any, "public", any>);
