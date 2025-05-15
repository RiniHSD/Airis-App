import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ygxpxkcavqianejopbul.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlneHB4a2NhdnFpYW5lam9wYnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Mjc1NzIsImV4cCI6MjA2MjMwMzU3Mn0.yPQ6Fg1m7mBJHEbzYGedlPWyF9K57SbJbQQi2bpiDI8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
