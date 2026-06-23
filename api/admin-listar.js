import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://revyeudqlndidaiprabc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Prevenção de bloqueio de CORS na Vercel
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
    
    // 1. Usa estritamente a variável oficial da Vercel (sem fallback hardcoded)
    const senhaCorreta = process.env.SENHA_ADMIN;

    if (!senhaCorreta || senha !== senhaCorreta) {
      console.error("Acesso bloqueado na listagem: Senha inválida.");
      return res.status(401).json({ error: 'Acesso negado' });
    }

    // 2. BUSCA NA GAVETA CERTA ("participantes")
    const { data, error } = await supabase
      .from('participantes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro interno do Supabase:", error.message);
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(200).json(data || []);

  } catch (err) {
    console.error("Erro no servidor da Vercel:", err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}