import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function saveSession(data) {
  const { error } = await supabase.from('sessions').insert([data]);
  if (error) console.error('Failed to save session:', error.message);
}

export async function fetchSessions() {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchStudentSessions(studentName) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .ilike('student_name', studentName)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchCustomAlerts() {
  const { data, error } = await supabase
    .from('custom_alerts')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function saveCustomAlert(data) {
  const { data: result, error } = await supabase
    .from('custom_alerts')
    .insert([data])
    .select()
    .single();
  if (error) throw error;
  return result;
}

export async function deleteCustomAlert(id) {
  const { error } = await supabase
    .from('custom_alerts')
    .update({ is_active: false })
    .eq('id', id);
  if (error) throw error;
}
