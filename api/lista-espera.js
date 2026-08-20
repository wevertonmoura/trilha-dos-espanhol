import { createClient } from '@supabase/supabase-js';

// Usando as variáveis de ambiente com fallback para não quebrar na Vercel
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // 🛡️ TRAVA 1: Prevenção de bloqueio de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método inválido' });
  }

  const { nome, telefone } = req.body;

  try {
    if (!nome || !telefone) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }

    // Inserção na tabela lista_espera com limpeza de dados
    const { error } = await supabase
      .from('lista_espera')
      .insert([{ 
        nome: nome.trim(), 
        telefone: telefone.replace(/\D/g, '') 
      }]);

    if (error) {
      console.error("Erro interno do Supabase ao inserir na lista:", error);
      throw new Error(error.message);
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Erro na API lista-espera:", err);
    return res.status(500).json({ error: 'Erro interno ao salvar na lista' });
  }
}