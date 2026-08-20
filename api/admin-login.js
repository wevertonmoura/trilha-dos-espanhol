export default function handler(req, res) {
  // 🛡️ TRAVA 1: Prevenção de bloqueio de CORS na Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Trava de Método: Só aceita requisições seguras do tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { senha } = req.body;

    // 2. Puxa a senha oficial do cofre da Vercel
    const senhaOficial = process.env.SENHA_ADMIN || process.env.VITE_SENHA_ADMIN;

    // Trava de diagnóstico para o programador:
    if (!senhaOficial) {
      console.error("⚠️ ERRO CRÍTICO: A variável SENHA_ADMIN não foi configurada na Vercel.");
      return res.status(500).json({ error: 'Erro interno de configuração do servidor.' });
    }

    // 3. O Checkmate (A comparação real e invisível ao navegador)
    if (senha === senhaOficial) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ error: 'Acesso negado' });
    }
  } catch (err) {
    console.error("Erro no servidor da Vercel ao tentar logar:", err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}