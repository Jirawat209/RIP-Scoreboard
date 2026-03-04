import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hkpmtxggyvhkujrrjafx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrcG10eGdneXZoa3VqcnJqYWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MTAxNDUsImV4cCI6MjA4ODE4NjE0NX0.JGIaFeuVBk6rJdD-vTN43lIX6y_lm_Y0G8EDRrd284s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
