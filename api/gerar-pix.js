import { createClient } from '@supabase/supabase-js';

// Fallback robusto para garantir que a Vercel encontre a URL no back-end
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { participantes, valorTotal, emailPrincipal, contatoEmergencia } = req.body;
  const LIMITE_VAGAS_TRANSPORTE = 26;

  try {
    // =====================================================================
    // 🛡️ TRAVA 1: VERIFICAÇÃO DE VAGAS NO TRANSPORTE (Inteligente)
    // =====================================================================
    const qtdComTransporte = participantes.filter(p => p.tipo === 'com_transporte').length;

    if (qtdComTransporte > 0) {
      const { count, error: erroCount } = await supabase
        .from('participantes')
        .select('*', { count: 'exact', head: true })
        .eq('pago', true)
        .eq('tipo_ingresso', 'com_transporte'); 

      if (erroCount) {
        throw new Error('Erro ao checar limite de vagas no banco de dados.');
      }

      if (count + qtdComTransporte > LIMITE_VAGAS_TRANSPORTE) {
        return res.status(400).json({ 
          error: `Inscrição barrada: Temos apenas ${LIMITE_VAGAS_TRANSPORTE - count} vaga(s) no transporte! Ajuste sua compra.` 
        });
      }
    }

    // =====================================================================
    // 🛡️ TRAVA 2: VALIDAÇÃO DE PREÇO (Casadinha Dinâmica)
    // =====================================================================
    const qtdSemTransporte = participantes.filter(p => p.tipo === 'sem_transporte').length;

    // Matemática: Com Transporte
    const paresCom = Math.floor(qtdComTransporte / 2);
    const avulsosCom = qtdComTransporte % 2;
    const valorCom = (paresCom * 200) + (avulsosCom * 110);

    // Matemática: Sem Transporte
    const paresSem = Math.floor(qtdSemTransporte / 2);
    const avulsosSem = qtdSemTransporte % 2;
    const valorSem = (paresSem * 140) + (avulsosSem * 75);

    // Valor Total + R$ 1,00 de taxa
    const valorEsperado = valorCom + valorSem + 1; 

    if (Number(valorTotal) !== valorEsperado) {
      return res.status(400).json({ 
        error: 'Tentativa de manipulação de valor detectada. A transação foi bloqueada por segurança.' 
      });
    }

    // =====================================================================
    // GERAÇÃO DO PIX E INSERÇÃO DE DADOS
    // =====================================================================
    const cpfTitular = participantes[0].cpf.replace(/\D/g, '');
    const telefoneTitular = participantes[0].phone.replace(/\D/g, '');
    const webhookUrl = `https://${req.headers.host}/api/webhook`;

    const payerName = participantes[0].name.trim().split(" ");
    const firstName = payerName[0];
    const lastName = payerName.length > 1 ? payerName.slice(1).join(" ") : "Participante";
    
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `pix-${Date.now()}-${cpfTitular}` 
      },
      body: JSON.stringify({
        transaction_amount: Number(valorEsperado), 
        description: `Trilha dos Espanhois - ${participantes[0].name}`,
        payment_method_id: 'pix',
        payer: {
          email: emailPrincipal,
          first_name: firstName,
          last_name: lastName,
          identification: { type: 'CPF', number: cpfTitular }
        },
        external_reference: emailPrincipal, 
        notification_url: webhookUrl
      })
    });

    const mpData = await response.json();

    if (!mpData.id) {
      return res.status(400).json({ error: 'Erro na API do Mercado Pago', details: mpData });
    }

    const idDoPagamento = mpData.id.toString();

    const dadosParaSalvar = participantes.map((p, index) => {
      const cpfLimpo = p.cpf ? p.cpf.replace(/\D/g, '') : null;
      
      return {
        nome: p.name || 'Sem Nome',
        email: index === 0 ? emailPrincipal : (p.email || emailPrincipal),
        telefone: index === 0 ? telefoneTitular : (p.phone ? p.phone.replace(/\D/g, '') : telefoneTitular),
        cpf: index === 0 ? cpfLimpo : null, 
        contato_emergencia: contatoEmergencia || null,
        tipo_ingresso: p.tipo || 'com_transporte', 
        pago: false,
        payment_id: idDoPagamento 
      };
    });

    const { error: erroInsert } = await supabase.from('participantes').insert(dadosParaSalvar);
    
    if (erroInsert) {
      console.error("Erro do Supabase:", erroInsert);
      throw new Error(`Erro do Banco de Dados: ${erroInsert.message}`);
    }

    return res.status(200).json(mpData);

  } catch (error) {
    console.error("Erro no Servidor:", error);
    return res.status(500).json({ error: error.message || 'Erro interno ao processar inscrição' });
  }
}