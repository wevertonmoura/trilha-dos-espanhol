import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Usando as variáveis de ambiente com fallback para não quebrar na Vercel
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export default async function handler(req, res) {
  // 🛡️ TRAVA: Prevenção de bloqueio de CORS (útil se você chamar via cron job ou botão no admin)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Busca inscrições não pagas, criadas há mais de 25 minutos
    const tempoLimite = new Date(Date.now() - 25 * 60 * 1000).toISOString();
    
    // CORREÇÃO: Apontando para a tabela 'participantes' da Trilha dos Espanhóis
    const { data: pendentes, error } = await supabase
      .from('participantes')
      .select('*')
      .eq('pago', false)
      .eq('lembrete_enviado', false)
      .lt('created_at', tempoLimite);

    if (error) throw error;

    if (!pendentes || pendentes.length === 0) {
      return res.status(200).json({ message: 'Nenhum carrinho para recuperar agora.' });
    }

    // Pega o domínio automático da Vercel para o botão do e-mail
    const siteUrl = `https://${req.headers.host}`;

    // 2. Envia o e-mail para cada um
    for (const inscrito of pendentes) {
      const mailOptions = {
        from: `"Vem Para Trilha" <${process.env.EMAIL_USER}>`,
        to: inscrito.email,
        subject: '⚠️ Sua vaga na Trilha dos Espanhóis está esperando!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
            <h2 style="color: #10b981;">Olá, ${inscrito.nome}!</h2>
            <p>Vimos que você iniciou sua inscrição para a <strong>Trilha dos Espanhóis</strong>, mas o PIX expirou antes da confirmação.</p>
            <p>As vagas para o nosso transporte são restritas a apenas <strong>26 lugares</strong> e estão acabando rápido. Não queremos que você fique de fora dessa imersão na natureza e nas ruínas de Vila Nazaré!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${siteUrl}" style="background-color: #10b981; color: white; padding: 15px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; text-transform: uppercase;">Garantir minha vaga agora</a>
            </div>
            
            <p style="font-size: 12px; color: #666;">Se você já realizou o pagamento ou teve algum problema técnico, ignore este e-mail ou chame nosso suporte no WhatsApp.</p>
            <p>Nos vemos na trilha!<br><strong>Equipe Vem Para Trilha</strong></p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

      // 3. Marca no banco que o lembrete foi enviado na tabela correta
      await supabase
        .from('participantes')
        .update({ lembrete_enviado: true })
        .eq('id', inscrito.id);
    }

    return res.status(200).json({ message: `${pendentes.length} e-mails de recuperação enviados com sucesso!` });

  } catch (error) {
    console.error("Erro na recuperação do carrinho:", error);
    return res.status(500).json({ error: 'Erro interno ao processar recuperação.' });
  }
}