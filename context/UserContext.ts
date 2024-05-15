import { SupabaseClient, User } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';

export const UserContext = createContext<User | null>(null);
