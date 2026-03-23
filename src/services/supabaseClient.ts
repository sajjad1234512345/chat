import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jcppjkrxmhefvxjcidks.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjcHBqa3J4bWhlZnZ4amNpZGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTEzNTAsImV4cCI6MjA4OTUyNzM1MH0.qVVqbJjqQGC0Cj7cSzFhR7JBtu52NOPwG64k6xI7q_Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
