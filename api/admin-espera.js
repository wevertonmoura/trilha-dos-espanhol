import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método inválido' });

  const { senha } = req.body;

  if (senha !== process.env.SENHA_ADMIN) {
    return res.status(401).json({ error: 'Acesso negado' });
  }

  // FIFO (First In, First Out) -> O mais antigo no topo da fila
  const { data, error } = await supabase
    .from('lista_espera')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Erro ao buscar fila:", error);
    return res.status(500).json({ error: 'Erro ao buscar fila de espera' });
  }

  return res.status(200).json(data || []);
}