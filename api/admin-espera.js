import { createClient } from '@supabase/supabase-js';

// Usando apenas as variáveis de ambiente (mais seguro e dinâmico)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // 🛡️ TRAVA 1: Prevenção de bloqueio de CORS na Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método inválido' });
  }

  try {
    const { senha } = req.body;
    
    // Autenticação via variável de ambiente (fallback seguro)
    const senhaCorreta = process.env.SENHA_ADMIN || process.env.VITE_SENHA_ADMIN;

    if (!senhaCorreta || senha !== senhaCorreta) {
      console.error("Acesso bloqueado à lista de espera: Senha inválida.");
      return res.status(401).json({ error: 'Acesso negado' });
    }

    // FIFO (First In, First Out) -> O mais antigo no topo da fila
    const { data, error } = await supabase
      .from('lista_espera')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Erro interno do Supabase ao buscar fila:", error);
      return res.status(500).json({ error: 'Erro ao buscar fila de espera' });
    }

    return res.status(200).json(data || []);

  } catch (err) {
    console.error("Erro no servidor da Vercel ao buscar fila:", err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}