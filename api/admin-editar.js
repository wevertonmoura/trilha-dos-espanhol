import { createClient } from '@supabase/supabase-js';

// Usando apenas as variáveis de ambiente com fallback seguro
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

  // 1. Segurança de Rota: Só aceita requisições do tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { senha, id, nome, cpf, telefone } = req.body;

  try {
    // 2. Validação do Administrador com fallback
    const senhaCorreta = process.env.SENHA_ADMIN || process.env.VITE_SENHA_ADMIN;
    
    if (!senhaCorreta || senha !== senhaCorreta) {
      console.error("Acesso bloqueado ao editar: Senha inválida.");
      return res.status(401).json({ error: 'Acesso negado' });
    }

    if (!id) {
      return res.status(400).json({ error: 'ID do participante em falta.' });
    }

    // 3. Executa a atualização na tabela correta ("participantes")
    const { error } = await supabase
      .from('participantes')
      .update({
        nome: nome?.trim(),
        cpf: cpf,
        telefone: telefone
      })
      .eq('id', id);

    if (error) {
      console.error("Erro do Supabase ao editar:", error.message);
      return res.status(400).json({ error: error.message });
    }

    // Retorna sucesso para o React atualizar a tabela no ecrã
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Erro crítico no servidor de edição:", err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}