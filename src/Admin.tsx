import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Search, ShieldAlert, Download, Users, Clock, Send } from 'lucide-react';
import AdminEstatisticas from './components/AdminEstatisticas';
import AdminTabela from './components/AdminTabela';

interface AdminProps {
  senha: string;
  formatarMoeda: (valor: number) => string;
  fecharAdmin: () => void;
}

// Interface para sabermos a estrutura do participante
interface ParticipanteAdmin {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  pago: boolean;
  tipo_ingresso: 'com_transporte' | 'sem_transporte';
  payment_id?: string;
  created_at: string;
}

const Admin = ({ senha, formatarMoeda, fecharAdmin }: AdminProps) => {
  // Dados Principais usando a interface
  const [adminData, setAdminData] = useState<ParticipanteAdmin[]>([]);
  const [esperaData, setEsperaData] = useState<any[]>([]);
  
  // Controles de Tela
  const [abaAtual, setAbaAtual] = useState<'inscritos' | 'espera'>('inscritos');
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  
  // Ações da Tabela
  const [aprovandoId, setAprovandoId] = useState<string | null>(null); 
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  // Ao iniciar, carrega as duas listas
  useEffect(() => { 
    carregarDados(); 
    carregarListaEspera();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin-listar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha })
      });
      const data = await res.json();
      if (data && !data.error) setAdminData(data);
    } catch (err) { console.error("Falha ao carregar inscritos:", err); }
    setLoading(false);
  };

  const carregarListaEspera = async () => {
    try {
      const res = await fetch('/api/admin-espera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha })
      });
      const data = await res.json();
      if (data && !data.error) setEsperaData(data);
    } catch (err) { console.error("Falha ao carregar fila de espera:", err); }
  };

  // --- Funções de Ação ---
  const salvarEdicao = async () => {
    try {
      const res = await fetch('/api/admin-editar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha, id: editData.id, nome: editData.nome, cpf: editData.cpf, telefone: editData.telefone })
      });
      if (res.ok) {
        setAdminData(prev => prev.map(item => item.id === editId ? { ...item, ...editData } : item));
        setEditId(null);
      } else { throw new Error("Erro ao salvar"); }
    } catch (err) { alert("Erro ao salvar alterações."); }
  };

  const aprovarPagamentoManual = async (id: string) => {
    if (!window.confirm("Confirmar recebimento manual?")) return;
    setAprovandoId(id); 
    try {
      const res = await fetch('/api/admin-aprovar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha, id })
      });
      if (res.ok) setAdminData(prev => prev.map(item => item.id === id ? { ...item, pago: true } : item));
    } catch (err) { alert("Erro ao aprovar."); }
    finally { setAprovandoId(null); }
  };

  const excluirParticipante = async (id: string, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja EXCLUIR permanentemente ${nome}?`)) return;
    setExcluindoId(id);
    try {
      const res = await fetch('/api/admin-excluir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha, id })
      });
      if (res.ok) setAdminData(prev => prev.filter(item => item.id !== id));
    } catch (err) { alert("Erro ao excluir."); }
    finally { setExcluindoId(null); }
  };

  // --- 🔥 Acionamentos de WhatsApp Turbinados e Diferenciados 🔥 ---
  const chamarNoWhatsApp = (telefone: string, nome: string, pago: boolean) => {
    let numeroFormatado = (telefone || '').replace(/\D/g, ''); 
    if (numeroFormatado.length === 10 || numeroFormatado.length === 11) numeroFormatado = '55' + numeroFormatado;
    
    // Identificar o participante específico clicado para pegar o tipo de ingresso
    const participanteClicado = adminData.find(p => p.telefone === telefone && p.nome === nome);
    let nomesParaMensagem = (nome || '').split(' ')[0];
    let isPlural = false;

    // Lógica original de agrupamento por PIX para o nome do cumprimento
    if (participanteClicado && participanteClicado.payment_id) {
      const grupoDoPix = adminData.filter(p => p.payment_id === participanteClicado.payment_id);
      const primeirosNomes = grupoDoPix.map(p => p.nome.split(' ')[0]);

      if (primeirosNomes.length > 1) {
        isPlural = true;
        if (primeirosNomes.length === 2) {
          nomesParaMensagem = `${primeirosNomes[0]} e ${primeirosNomes[1]}`;
        } else {
          const ultimo = primeirosNomes.pop();
          nomesParaMensagem = `${primeirosNomes.join(', ')} e ${ultimo}`;
        }
      }
    }

    // ✅ Identificar tipo de ingresso ✅
    const eComTransporte = participanteClicado?.tipo_ingresso !== 'sem_transporte';
    
    // Começar a montar a mensagem base
    let textoIntro = `Fala, ${nomesParaMensagem}! Aqui é da organização do Vem Para Trilha.\n\n`;
    let textoLogística = eComTransporte ? 'COM TRANSPORTE inclusão, sairemos às 05:00 do Derby' : 'SEM TRANSPORTE (nos encontramos em Vila Nazaré-Gaibu às 07:00)';
    let textoBase = "";

    if (pago) {
      // ✅ AQUI FOI ALTERADO O TEXTO COM O LINK DO GRUPO E O AVISO DE PENETRAS ✅
      textoBase = `A ${isPlural ? 'inscrição de vocês' : 'sua inscrição'} (${textoLogística}) foi CONFIRMADA com sucesso! ✅⛰️🔥\n\nPor favor, já clique no link abaixo para entrar no nosso grupo oficial do WhatsApp. É por lá que vamos passar todas as informações detalhadas sobre o ponto de encontro e os horários!\n\n👉 *Link do grupo:* https://chat.whatsapp.com/LNWmn2mYhvpG21pl2NAAGP\n\n⚠️ *Aviso importante:* Pedimos que não levem acompanhantes extras ("penetras") que não estão na lista oficial, pois nosso evento tem limite de vagas e controle rigoroso de segurança, beleza?\n\nQualquer dúvida é só falar. Nos vemos na trilha! 🎒💦`;
    } else {
      textoBase = `Vi que a ${isPlural ? 'inscrição de vocês' : 'sua inscrição'} para a Trilha dos Espanhóis ficou PENDENTE. O Pix deu erro na hora de gerar?\n\nLembrando que `;
      if (eComTransporte) {
        textoBase += `como sua opção foi COM TRANSPORTE e os lugares na van são super limitados, queria confirmar se você ainda quer segurar a vaga.`;
      } else {
        textoBase += `as inscrições SEM TRANSPORTE (indo por conta própria) continuam abertas! Queria confirmar se aconteceu algo com o Pix ou se ainda quer participar.`;
      }
      textoBase += ` Se precisarem de ajuda ou preferirem transferir direto pela chave normal, me deem um alô aqui! 🚀`;
    }

    let texto = textoIntro + textoBase;
    const mensagem = encodeURIComponent(texto);
    window.open(`https://wa.me/${numeroFormatado}?text=${mensagem}`, '_blank');
  };

  const resgatarFilaDeEspera = (telefone: string, nome: string) => {
    let numeroFormatado = (telefone || '').replace(/\D/g, ''); 
    if (numeroFormatado.length === 10 || numeroFormatado.length === 11) numeroFormatado = '55' + numeroFormatado;
    const primeiroNome = (nome || '').split(' ')[0]; 
    const mensagem = encodeURIComponent(`Olá ${primeiroNome}! Aqui é da organização da Trilha dos Espanhóis. Surgiu uma vaga de desistência para a van! Você ainda tem interesse em participar?`);
    window.open(`https://wa.me/${numeroFormatado}?text=${mensagem}`, '_blank');
  };

  // Exportações
  const exportarPlanilha = () => { /* Lógica futura */ };
  const exportarPlanilhaCompleta = () => { /* Lógica futura */ };

  // Cálculos Financeiros (Somente da aba de inscritos oficiais)
  const totalPagos = adminData.filter(p => p.pago).length;
  const totalPendentes = adminData.length - totalPagos;
  
  // 💰 Lógica Avançada de Arrecadação com Casadinha Dupla 💰
  const calcularArrecadado = () => {
    const pagamentosAgrupados: Record<string, { com: number, sem: number }> = {};
    
    adminData.filter(p => p.pago).forEach(p => {
      const pixId = p.payment_id || `manual-${p.id}`; 
      if (!pagamentosAgrupados[pixId]) pagamentosAgrupados[pixId] = { com: 0, sem: 0 };
      
      if (p.tipo_ingresso === 'sem_transporte') pagamentosAgrupados[pixId].sem += 1;
      else pagamentosAgrupados[pixId].com += 1;
    });

    let total = 0;
    Object.values(pagamentosAgrupados).forEach(grupo => {
      // Matemática: Com Transporte
      total += (Math.floor(grupo.com / 2) * 200) + ((grupo.com % 2) * 110);
      // Matemática: Sem Transporte
      total += (Math.floor(grupo.sem / 2) * 140) + ((grupo.sem % 2) * 75);
    });

    return total;
  };

  const arrecadado = calcularArrecadado();
  
  // Filtros de Busca independentes
  const inscritosFiltrados = adminData.filter(p => (p.nome || '').toLowerCase().includes(busca.toLowerCase()) || (p.telefone || '').includes(busca));
  const esperaFiltrados = esperaData.filter(p => (p.nome || '').toLowerCase().includes(busca.toLowerCase()) || (p.telefone || '').includes(busca));

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 relative">
      <Loader2 className="animate-spin text-emerald-500 relative z-10" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 font-sans relative overflow-hidden z-0">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 p-6 md:p-8 rounded-[2rem] gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"><ShieldAlert size={28} className="text-zinc-950" /></div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Comando Central</h1>
              <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Vem Para Trilha</p>
            </div>
          </div>
          <button onClick={fecharAdmin} className="bg-zinc-800/80 hover:bg-zinc-700 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 text-xs font-bold uppercase transition-all border border-zinc-700 group cursor-pointer">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Voltar ao Site
          </button>
        </div>

        {/* ESTATÍSTICAS ISOLADAS */}
        <AdminEstatisticas 
          totalPagos={totalPagos} 
          totalPendentes={totalPendentes} 
          arrecadado={arrecadado} 
          formatarMoeda={formatarMoeda} 
          totalGerado={adminData.length} 
        />

        {/* CONTÊINER PRINCIPAL DAS TABELAS */}
        <div className="bg-zinc-900/60 backdrop-blur-xl rounded-[2.5rem] border border-zinc-800/80 overflow-hidden shadow-2xl">
          
          {/* NAVEGAÇÃO DE ABAS */}
          <div className="flex border-b border-zinc-800 bg-zinc-950/50">
            <button 
              onClick={() => setAbaAtual('inscritos')}
              className={`flex-1 py-5 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all ${abaAtual === 'inscritos' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-zinc-900/80' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40 cursor-pointer'}`}
            >
              <Users size={18} />
              Inscritos Oficiais
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${abaAtual === 'inscritos' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>{adminData.length}</span>
            </button>
            <button 
              onClick={() => setAbaAtual('espera')}
              className={`flex-1 py-5 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all ${abaAtual === 'espera' ? 'text-amber-500 border-b-2 border-amber-500 bg-zinc-900/80' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40 cursor-pointer'}`}
            >
              <Clock size={18} />
              Fila de Espera
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${abaAtual === 'espera' ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800 text-zinc-400'}`}>{esperaData.length}</span>
            </button>
          </div>

          <div className="p-6 md:p-8 border-b border-zinc-800/80 bg-zinc-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto flex-1">
              <div className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50"><Search size={20} className={abaAtual === 'inscritos' ? "text-emerald-500" : "text-amber-500"} /></div>
              <input type="text" placeholder={`Pesquisar na ${abaAtual === 'inscritos' ? 'lista oficial' : 'fila de espera'}...`} value={busca} onChange={(e) => setBusca(e.target.value)} className="bg-transparent border-none outline-none text-lg font-bold text-white w-full placeholder:text-zinc-600 focus:ring-0" />
            </div>
            
            {/* Botões de exportação só aparecem na aba de inscritos */}
            {abaAtual === 'inscritos' && (
              <div className="flex gap-3">
                <button onClick={exportarPlanilha} className="w-full sm:w-auto bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all border border-red-500/30 cursor-pointer">
                  <ShieldAlert size={18} /> Lista SOS
                </button>
                <button onClick={exportarPlanilhaCompleta} className="w-full sm:w-auto bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all border border-emerald-500/30 cursor-pointer">
                  <Download size={18} /> Lista Completa
                </button>
              </div>
            )}
          </div>

          {/* RENDERIZAÇÃO CONDICIONAL DA TABELA */}
          {abaAtual === 'inscritos' ? (
            <AdminTabela 
              dadosFiltrados={inscritosFiltrados}
              editId={editId}
              editData={editData}
              setEditData={setEditData}
              setEditId={setEditId}
              salvarEdicao={salvarEdicao}
              aprovarPagamentoManual={aprovarPagamentoManual}
              aprovandoId={aprovandoId}
              chamarNoWhatsApp={chamarNoWhatsApp}
              excluirParticipante={excluirParticipante}
              excluindoId={excluindoId}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-zinc-950/50 text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
                    <th className="px-6 py-4 font-black">Posição</th>
                    <th className="px-6 py-4 font-black">Data de Entrada</th>
                    <th className="px-6 py-4 font-black">Nome do Interessado</th>
                    <th className="px-6 py-4 font-black">WhatsApp</th>
                    <th className="px-6 py-4 font-black text-right">Ação Rápida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {esperaFiltrados.length > 0 ? (
                    esperaFiltrados.map((item, index) => (
                      <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center text-xs font-black">
                            #{index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-400 font-medium">
                          {new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-white uppercase">{item.nome}</td>
                        <td className="px-6 py-4 text-sm font-mono text-zinc-300">{item.telefone}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => resgatarFilaDeEspera(item.telefone, item.nome)}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-end gap-2 ml-auto cursor-pointer"
                          >
                            Resgatar <Send size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-zinc-500 text-sm font-bold">
                        <div className="flex flex-col items-center gap-3 opacity-50">
                          <Clock size={48} className="text-amber-500" />
                          <p>A fila de espera está vazia.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;