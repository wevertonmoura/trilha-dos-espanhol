import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://revyeudqlndidaiprabc.supabase.co';
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Método inválido');
  
  const { senha, id } = req.body;
  
  // CORREÇÃO: Lendo a variável certa que está na sua Vercel!
  const senhaCorreta = process.env.SENHA_ADMIN || process.env.VITE_SENHA_ADMIN;
  
  if (senha !== senhaCorreta) {
    console.error("Acesso negado no botão excluir");
    return res.status(401).json({ error: 'Acesso negado' });
  }

  const { error } = await supabase.from('participantes').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  
  return res.status(200).json({ success: true });
}