import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ymyxknvebuomftpnvutj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteXhrbnZlYnVvbWZ0cG52dXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MjkwMTIsImV4cCI6MjA3NzMwNTAxMn0.FWdATDAVZdK_a_aB-dC-njBpcbdKmQ1yP-0PxOV6V30'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'ai-app-auth',
    storage: window.localStorage
  }
})
