import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kqpqwrqrdkskhbmasget.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcHF3cnFyZGtza2hibWFzZ2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzQ0MzQsImV4cCI6MjA3NjY1MDQzNH0.0YpA1uxrsdSgo2NnlOZw4-7XyJriEXTp7U33kwhdNS8'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
