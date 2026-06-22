import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  try {
    const { count, error } = await supabase
      .from('inscricao_trilha')
      .select('*', { count: 'exact', head: true })
      .eq('pago', true);

    if (error) throw error;

    res.status(200).json({ total: count || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar vagas' });
  }
}