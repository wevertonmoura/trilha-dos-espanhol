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
    const { senha, id } = req.body;
    
    // Autenticação via variável de ambiente
    const senhaCorreta = process.env.SENHA_ADMIN || process.env.VITE_SENHA_ADMIN;
    
    if (!senhaCorreta || senha !== senhaCorreta) {
      console.error("Acesso bloqueado ao tentar aprovar: Senha inválida.");
      return res.status(401).json({ error: 'Acesso negado' });
    }

    // 🛡️ TRAVA 2: Garantir que o ID foi enviado
    if (!id) {
      return res.status(400).json({ error: 'ID não fornecido para aprovação.' });
    }

    // Aprovação na tabela correta (atualizando 'pago' para true)
    const { error } = await supabase.from('participantes').update({ pago: true }).eq('id', id);
    
    if (error) {
      console.error("Erro interno do Supabase ao aprovar:", error.message);
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Erro no servidor da Vercel ao aprovar:", err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}