import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ozoffxmrvyanboydvakh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96b2ZmeG1ydnlhbmJveWR2YWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MDcyNDYsImV4cCI6MjA1MTM4MzI0Nn0.J4o8q8h_SjtiRBGMpwgCHwueFjO6lrtC2Ov3LKOicdE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
