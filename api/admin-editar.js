import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // 1. Segurança de Rota: Só aceita requisições do tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { senha, id, nome, cpf, telefone } = req.body;

  // 2. Validação do Administrador
  if (senha !== process.env.SENHA_ADMIN) {
    return res.status(401).json({ error: 'Acesso negado' });
  }

  if (!id) {
    return res.status(400).json({ error: 'ID do participante em falta.' });
  }

  try {
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