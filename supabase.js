import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY_SEC,SUPABASE_URL_KEY } from './constants/secrets';

const SUPABASE_URL = SUPABASE_URL_KEY;
const SUPABASE_ANON_KEY = SUPABASE_ANON_KEY_SEC;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
