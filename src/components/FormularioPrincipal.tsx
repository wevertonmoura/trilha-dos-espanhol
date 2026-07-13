import React, { useState, useEffect } from 'react';
import { ChevronRight, Loader2, AlertCircle, Plus, Trash2, Copy, QrCode, CheckCircle, Hourglass, Clock, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import { validarCPF, formatarMoeda } from '../utils/helpers';

interface FormularioProps {
  vagasOcupadas: number;
  verificandoVagas: boolean;
  LIMITE_VAGAS: number;
}

export default function FormularioPrincipal({ vagasOcupadas, verificandoVagas, LIMITE_VAGAS }: FormularioProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [telaAtual, setTelaAtual] = useState<'formulario' | 'pix'>('formulario');
  const [statusPagamento, setStatusPagamento] = useState<'pendente' | 'pago'>('pendente');
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const [listaEsperaNome, setListaEsperaNome] = useState('');
  const [listaEsperaFone, setListaEsperaFone] = useState('');
  const [entrouLista, setEntrouLista] = useState(false);

  const taxaPix = 1;
  
  const calcularValorIngressos = (qtd: number) => {
    const pares = Math.floor(qtd / 2); 
    const avulsos = qtd % 2;          
    return (pares * 100) + (avulsos * 55);
  };

  const [qrCodePix, setQrCodePix] = useState(''); 
  const [qrCodeImg, setQrCodeImg] = useState(''); 
  const [copiado, setCopiado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(900); 

  const [participants, setParticipants] = useState([
    { name: '', email: '', phone: '', cpf: '', emergencyName: '', emergencyPhone: '' }
  ]);

  // TRAVA O SCROLL DA PÁGINA QUANDO O MODAL DO PIX ESTIVER ABERTO (Sênior UX)
  useEffect(() => {
    if (telaAtual === 'pix') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [telaAtual]);

  // TIMER DO PIX OTIMIZADO
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (telaAtual === 'pix' && statusPagamento === 'pendente' && tempoRestante > 0) {
      timer = setInterval(() => setTempoRestante(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [telaAtual, statusPagamento, tempoRestante]);

  const formatarTempo = (segundos: number) => {
    const m = Math.floor(segundos / 60).toString().padStart(2, '0');
    const s = (segundos % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // CHECKER DE PAGAMENTO OTIMIZADO
  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval> | undefined;
    if (paymentId && statusPagamento === 'pendente' && telaAtual === 'pix') {
      intervalo = setInterval(async () => {
        try {
          const res = await fetch(`/api/checar-pagamento?paymentId=${paymentId}`);
          const data = await res.json();
          if (data.status === 'approved') {
            setStatusPagamento('pago');
            clearInterval(intervalo);
          }
        } catch (err) { console.error("Erro ao checar status do pix:", err); }
      }, 3000);
    }
    return () => clearInterval(intervalo);
  }, [paymentId, statusPagamento, telaAtual]);

  const removeParticipant = (index: number) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
  };

  const addParticipant = () => {
    if (vagasOcupadas + participants.length >= LIMITE_VAGAS) {
      alert("Atenção: Vagas insuficientes para adicionar outro acompanhante!");
      return;
    }
    setParticipants([...participants, { name: '', email: '', phone: '', cpf: '', emergencyName: '', emergencyPhone: '' }]);
  };

  const updateParticipant = (index: number, field: string, value: string) => {
    const newParticipants = [...participants];
    let v = value;
    if (field === 'phone' || field === 'emergencyPhone' || field === 'listaEsperaFone') {
      v = v.replace(/\D/g, "").slice(0, 11); 
      if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`; 
      if (v.length > 10) v = `${v.slice(0, 10)}-${v.slice(10)}`; 
    } else if (field === 'cpf') {
      v = v.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    newParticipants[index] = { ...newParticipants[index], [field]: v };
    setParticipants(newParticipants);
  };

  const handleListaEspera = async (e: React.FormEvent) => {
    e.preventDefault();
    if (listaEsperaNome.trim().length < 3 || listaEsperaFone.length < 14) {
      alert("Preencha seus dados corretamente!"); 
      return;
    }

    try {
      await fetch('/api/lista-espera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: listaEsperaNome, telefone: listaEsperaFone })
      });

      setEntrouLista(true);
    } catch (err) {
      console.error("Erro ao registrar lista de espera:", err);
      alert("Houve um erro ao registrar. Tente novamente!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (vagasOcupadas + participants.length > LIMITE_VAGAS) {
      setErrorMsg(`Infelizmente não temos vagas suficientes disponíveis agora.`);
      return;
    }

    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      if (p.name.trim().length < 3) { setErrorMsg(i === 0 ? `Preencha o nome do Titular.` : `Preencha o nome do Acompanhante ${i}.`); return; }
      
      if (i === 0) {
        if (p.phone.replace(/\D/g, '').length < 10) { setErrorMsg(`WhatsApp incompleto no Titular.`); return; }
        if (!validarCPF(p.cpf)) { setErrorMsg(`⚠️ CPF Inválido! Verifique o número digitado pelo Titular.`); return; }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(p.email)) { setErrorMsg("Digite um e-mail válido."); return; }
        if (p.emergencyName.trim().length < 2 || p.emergencyPhone.replace(/\D/g, '').length < 10) { 
          setErrorMsg("Preencha corretamente os dados de Emergência (SOS)."); return; 
        }
      }
    }
    
    if (!termsAccepted) { setErrorMsg("Aceite o termo de responsabilidade e regras de cancelamento."); return; }

    setLoading(true);
    setErrorMsg('');
    setStatusPagamento('pendente');

    try {
      const mainEmergency = `${participants[0].emergencyName} - ${participants[0].emergencyPhone}`;
      const mainEmail = participants[0].email;
      const valorTotal = Number((calcularValorIngressos(participants.length) + taxaPix).toFixed(2));

      const response = await fetch('/api/gerar-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantes: participants,
          valorTotal: valorTotal,
          emailPrincipal: mainEmail,
          contatoEmergencia: mainEmergency
        })
      });

      const mpData = await response.json();
      if (!response.ok) throw new Error(mpData.error || "Erro ao processar inscrição no servidor.");

      if (mpData.point_of_interaction?.transaction_data) {
        setQrCodePix(mpData.point_of_interaction.transaction_data.qr_code);
        setQrCodeImg(mpData.point_of_interaction.transaction_data.qr_code_base64);
        setPaymentId(mpData.id); 
        setTelaAtual('pix');
        setTempoRestante(900); 
      } else {
        throw new Error("Erro ao gerar o PIX. Verifique a configuração.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const copiarPix = () => {
    navigator.clipboard.writeText(qrCodePix);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000); 
  };

  const reiniciarCompra = () => {
    window.location.reload();
  };

  // INPUT EM TEMA CLARO: FUNDO SUAVE E BORDA LIMPA
  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold text-sm outline-none transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 hover:border-slate-300 shadow-sm placeholder-slate-400";

  return (
    <section id="inscricao" className="lg:sticky lg:top-8 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-[2.5rem] p-6 md:p-10 shadow-2xl text-slate-800">
      
      {/* ESTADO 1: VERIFICANDO VAGAS */}
      {verificandoVagas ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <Loader2 className="animate-spin text-sky-600 mb-4" size={40} />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verificando Vagas...</p>
        </div>
      ) : 
      
      /* ESTADO 2: VAGAS ESGOTADAS -> LISTA DE ESPERA VIP */
      vagasOcupadas >= LIMITE_VAGAS && telaAtual === 'formulario' ? (
        <div className="animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
              <Hourglass size={28} className="text-red-500" />
            </div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">ESGOTADO!</h2>
            <p className="text-slate-500 text-xs font-bold mt-2">Todas as vagas foram preenchidas.</p>
          </div>
          
          {!entrouLista ? (
            <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-sky-600 text-[10px] font-black uppercase tracking-widest text-center mb-6">Lista de Espera VIP</h3>
              <form onSubmit={handleListaEspera} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Seu Nome</label>
                  <input required type="text" value={listaEsperaNome} onChange={e => setListaEsperaNome(e.target.value)} className={inputClass} placeholder="Nome e Sobrenome" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Seu WhatsApp</label>
                  <input required type="tel" value={listaEsperaFone} onChange={e => {
                    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
                    if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
                    if (v.length > 10) v = `${v.slice(0, 10)}-${v.slice(10)}`;
                    setListaEsperaFone(v);
                  }} className={inputClass} placeholder="(81) 99999-9999" />
                </div>
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-4 rounded-xl shadow-lg mt-4 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer">
                  Entrar na Lista VIP <ChevronRight size={16}/>
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-sky-50 border border-sky-200 p-6 rounded-3xl text-center space-y-4">
              <CheckCircle className="text-sky-600 mx-auto" size={40} />
              <p className="text-sky-800 font-bold text-sm">Você foi adicionado à lista de espera com sucesso!</p>
              <p className="text-slate-500 text-xs">Se alguma vaga abrir, entraremos em contato com você via WhatsApp.</p>
            </div>
          )}
        </div>
      ) : 
      
      /* ESTADO 3: FORMULÁRIO NORMAL DE COMPRA */
      telaAtual === 'formulario' ? (
        <>
          <div className="text-center mb-10 relative">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">INSCRIÇÃO</h2>
            <p className="text-sky-600 text-sm font-extrabold mt-1 tracking-widest">R$ 55 INDIVIDUAL | R$ 100 CASADINHA</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {participants.map((participant, index) => (
              <div key={index} className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 relative shadow-sm overflow-hidden">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${index === 0 ? 'bg-sky-600' : 'bg-amber-500'}`}></div>

                <div className="flex justify-between items-center mb-5 pl-2 border-b border-slate-200 pb-2.5">
                  <h3 className={`text-[11px] font-black uppercase tracking-widest ${index === 0 ? 'text-sky-700' : 'text-slate-600'}`}>
                    {index === 0 ? "👤 Titular da Inscrição (Responsável)" : `👥 Acompanhante ${index}`}
                  </h3>
                  {index > 0 && (
                    <button type="button" onClick={() => removeParticipant(index)} className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer" title="Remover Acompanhante"><Trash2 size={16} /></button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome Completo</label>
                    <input type="text" value={participant.name} onChange={e => updateParticipant(index, 'name', e.target.value)} className={inputClass} placeholder="Ex: João Silva" />
                  </div>

                  {index === 0 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">WhatsApp</label>
                          <input type="tel" value={participant.phone} onChange={e => updateParticipant(index, 'phone', e.target.value)} className={inputClass} placeholder="(81) 99999-9999" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">CPF (Necessário para a compra)</label>
                          <input type="text" required value={participant.cpf} onChange={e => updateParticipant(index, 'cpf', e.target.value)} className={inputClass} placeholder="000.000.000-00" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">E-mail</label>
                        <input type="email" value={participant.email} onChange={e => updateParticipant(index, 'email', e.target.value)} className={inputClass} placeholder="seu@gmail.com" />
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <label className="text-[10px] font-black uppercase text-amber-600 ml-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse"></span>
                          Contato de Emergência (SOS)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input type="text" value={participant.emergencyName} onChange={e => updateParticipant(index, 'emergencyName', e.target.value)} className={inputClass} placeholder="Nome do Parente/Amigo" />
                          <input type="tel" value={participant.emergencyPhone} onChange={e => updateParticipant(index, 'emergencyPhone', e.target.value)} className={inputClass} placeholder="(81) 99999-9999" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {/* BOTÃO DA CASADINHA TURBINADO (TEMA OCEANO/ÂMBAR) */}
            {vagasOcupadas + participants.length < LIMITE_VAGAS && (
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button" 
                onClick={addParticipant} 
                className="w-full py-4 px-6 bg-gradient-to-r from-sky-50 via-sky-100/50 to-sky-50 hover:from-sky-100 hover:to-sky-100 border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-2xl text-sky-700 hover:text-sky-900 font-black transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-wider shadow-sm group cursor-pointer"
              >
                <span className="w-6 h-6 rounded-full bg-sky-200/60 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <Plus size={16} />
                </span>
                <span>Adicionar Acompanhante (Casadinha)</span>
              </motion.button>
            )}

            <label className="flex items-start gap-3 pt-4 border-t border-slate-200 cursor-pointer group">
              <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-1 h-5 w-5 accent-sky-600 cursor-pointer rounded shrink-0 transition-all" />
              <span className="text-[11px] text-slate-500 font-bold leading-relaxed select-none group-hover:text-slate-700 transition-colors">
                Aceito o Termo de Responsabilidade (declaro estar em boas condições de saúde). Li e aceito o{' '}
                <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.dispatchEvent(new CustomEvent('abrirModalJuridico', { detail: 'regulamento' })); }} className="text-sky-600 underline hover:text-sky-700 cursor-pointer font-extrabold">Regulamento</span>{' '}
                e a{' '}
                <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.dispatchEvent(new CustomEvent('abrirModalJuridico', { detail: 'reembolso' })); }} className="text-sky-600 underline hover:text-sky-700 cursor-pointer font-extrabold">Política de Reembolso</span>.
              </span>
            </label>

            {errorMsg && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2"><AlertCircle size={16}/> {errorMsg}</div>}
            
            <button disabled={loading} className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-black py-5 rounded-2xl shadow-[0_10px_25px_rgba(2,132,199,0.3)] hover:shadow-[0_15px_30px_rgba(2,132,199,0.45)] transition-all uppercase tracking-widest flex items-center justify-center gap-3 text-sm mt-4 cursor-pointer">
              {loading ? <Loader2 className="animate-spin text-white" /> : <>Finalizar Inscrição (R$ {formatarMoeda(calcularValorIngressos(participants.length) + taxaPix)}) <ChevronRight size={20} /></>}
            </button>
          </form>
        </>
      ) : (
        /* ESTADO 4: MODAL FIXO E CENTRALIZADO DO PIX EM TEMA CLARO */
        <>
          {/* PLACEHOLDER NO FUNDO PARA A PÁGINA NÃO ENCOLHER */}
          <div className="py-16 text-center space-y-4 animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto animate-pulse border border-sky-100">
              <QrCode className="text-sky-600 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
              {statusPagamento === 'pago' ? 'Inscrição Confirmada!' : 'PIX Gerado com Sucesso!'}
            </h3>
            <p className="text-slate-500 text-xs max-w-xs mx-auto">
              {statusPagamento === 'pago' 
                ? 'Sua vaga está garantida na Trilha dos Espanhóis.' 
                : 'O painel de pagamento está fixado no centro da sua tela. Efetue o pagamento para garantir sua vaga.'}
            </p>
            <button 
              onClick={reiniciarCompra} 
              className="mt-4 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer"
            >
              Fazer Nova Inscrição
            </button>
          </div>

          {/* OVERLAY CENTRALIZADA E IMÓVEL QUE TRAVA O QR CODE NA TELA DO USUÁRIO */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 md:p-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border-2 border-sky-400/40 rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] text-center space-y-6 text-slate-800">
              
              {statusPagamento === 'pago' ? (
                <div className="py-2 space-y-6 flex flex-col items-center animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_10px_25px_rgba(16,185,129,0.3)]">
                    <CheckCircle size={40} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-black uppercase italic text-slate-900 tracking-tighter">Pagamento <br /> Confirmado!</h2>
                  <p className="text-slate-500 font-bold text-sm max-w-xs mx-auto">
                    O comprovante e os detalhes da sua inscrição foram enviados para o e-mail: <strong className="text-sky-600">{participants[0].email}</strong>
                  </p>

                  <div className="space-y-3 text-left w-full max-w-md mx-auto pt-2 pb-2">
                    {participants.map((p, index) => (
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.2 }} key={index} 
                        className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm"
                      >
                        <div className="bg-sky-100 p-2.5 rounded-lg shrink-0">
                          <Ticket className="text-sky-600" size={20} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">
                            {index === 0 ? "Titular" : "Acompanhante"}
                          </p>
                          <p className="text-slate-900 font-bold uppercase truncate text-sm">{p.name}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <button onClick={reiniciarCompra} className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer">
                    Concluir e Fazer Nova Inscrição
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-14 h-14 bg-sky-50 rounded-full flex items-center justify-center border border-sky-100"><QrCode className="text-sky-600 w-8 h-8 animate-pulse" /></div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Escaneie o PIX</h2>
                    <p className="text-xs text-slate-500 font-medium">Pague agora para confirmar automaticamente sua inscrição!</p>
                  </div>

                  {qrCodeImg && (
                    <div className="flex justify-center my-4">
                      <div className="bg-white p-3 rounded-2xl border-2 border-sky-200 shadow-lg">
                        <img src={`data:image/jpeg;base64,${qrCodeImg}`} alt="PIX" className="w-48 h-48 rounded-lg object-contain mx-auto" />
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-sky-600 to-amber-500"></div>
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">Valor Total a Pagar</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">R$ {formatarMoeda(calcularValorIngressos(participants.length) + taxaPix)}</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider text-left">Ou copie o código PIX abaixo:</p>
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 pl-4 rounded-xl border border-slate-200">
                      <input 
                        type="text" 
                        readOnly 
                        value={qrCodePix} 
                        className="w-full bg-transparent text-xs font-mono text-slate-600 outline-none select-all truncate font-semibold"
                      />
                      <button onClick={copiarPix} className={`px-4 py-3 rounded-lg text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${copiado ? 'bg-emerald-500 text-white shadow-md' : 'bg-sky-600 hover:bg-sky-700 text-white'}`}>
                        {copiado ? <CheckCircle size={14} /> : <Copy size={14} />} 
                        {copiado ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>

                    {tempoRestante > 0 ? (
                      <div className="flex flex-col items-center justify-center gap-2 pt-2">
                        <p className="text-[10px] uppercase tracking-widest text-amber-600 font-extrabold animate-pulse">⌛ Aguardando confirmação do banco...</p>
                        <div className="flex items-center gap-2 text-xl font-mono bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 text-slate-800 shadow-inner font-bold">
                          <Clock size={18} className="text-amber-600" />
                          <span>{formatarTempo(tempoRestante)}</span>
                        </div>
                        <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Tempo para o código expirar</p>
                      </div>
                    ) : (
                      <div className="text-red-600 font-bold text-xs mt-4 bg-red-50 p-4 rounded-xl border border-red-200">
                        Tempo expirado! Por favor, feche e gere uma nova inscrição.
                      </div>
                    )}
                  </div>

                  {/* BOTÃO PARA VOLTAR E EDITAR */}
                  <div className="border-t border-slate-100 pt-4 mt-2">
                    <button 
                      type="button"
                      onClick={() => setTelaAtual('formulario')} 
                      className="text-slate-400 hover:text-slate-700 text-[11px] font-bold uppercase tracking-widest underline cursor-pointer transition-colors"
                    >
                      ← Voltar e editar dados da inscrição
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        </>
      )}
    </section>
  );
}