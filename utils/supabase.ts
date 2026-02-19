import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://xtyrfrqbqiclrjlnlfsi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0eXJmcnFicWljbHJqbG5sZnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0OTA4NDMsImV4cCI6MjA4NzA2Njg0M30.J_jiysOdXVrHIqYq2Yl1wAR0tF06hVhLdYqCTqXQPYk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});
