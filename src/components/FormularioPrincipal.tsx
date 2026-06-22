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

  useEffect(() => {
    let timer: any;
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

  useEffect(() => {
    let intervalo: any;
    if (paymentId && statusPagamento === 'pendente' && telaAtual === 'pix') {
      intervalo = setInterval(async () => {
        try {
          const res = await fetch(`/api/checar-pagamento?paymentId=${paymentId}`);
          const data = await res.json();
          if (data.status === 'approved') {
            setStatusPagamento('pago');
            clearInterval(intervalo);
          }
        } catch (err) { console.error(err); }
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

  const handleListaEspera = (e: React.FormEvent) => {
    e.preventDefault();
    if (listaEsperaNome.trim().length < 3 || listaEsperaFone.length < 14) {
      alert("Preencha seus dados corretamente!"); return;
    }
    const msg = `🚀 *LISTA VIP - TRILHA ALDEIA* 🚀%0A%0A*Nome:* ${listaEsperaNome}%0A*WhatsApp:* ${listaEsperaFone}%0A%0AOlá! Vi que as vagas esgotaram. Gostaria de entrar na lista de espera caso alguém desista!`;
    window.open(`https://wa.me/5581988227739?text=${msg}`, '_blank');
    setEntrouLista(true);
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

  // ESTILO PADRÃO DE ALTA RESPOSTA PARA TODOS OS INPUTS
  const inputClass = "w-full bg-zinc-950/90 border border-zinc-700/80 rounded-xl px-4 py-3 text-white font-bold text-sm outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 hover:border-zinc-500 shadow-inner";

  return (
    <section id="inscricao" className="lg:sticky lg:top-8 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 rounded-[2.5rem] p-6 md:p-10 shadow-2xl">
      
      {/* ESTADO 1: VERIFICANDO VAGAS */}
      {verificandoVagas ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Verificando Vagas...</p>
        </div>
      ) : 
      
      /* ESTADO 2: VAGAS ESGOTADAS -> LISTA DE ESPERA VIP */
      vagasOcupadas >= LIMITE_VAGAS && telaAtual === 'formulario' ? (
        <div className="animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <Hourglass size={28} className="text-red-500" />
            </div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">ESGOTADO!</h2>
            <p className="text-zinc-400 text-xs font-bold mt-2">Todas as vagas foram preenchidas.</p>
          </div>
          
          {!entrouLista ? (
            <div className="bg-zinc-800/40 p-6 rounded-3xl border border-zinc-700/50 shadow-inner">
              <h3 className="text-emerald-500 text-[10px] font-black uppercase tracking-widest text-center mb-6">Lista de Espera VIP</h3>
              <form onSubmit={handleListaEspera} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Seu Nome</label>
                  <input required type="text" value={listaEsperaNome} onChange={e => setListaEsperaNome(e.target.value)} className={inputClass} placeholder="Nome e Sobrenome" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Seu WhatsApp</label>
                  <input required type="tel" value={listaEsperaFone} onChange={e => {
                    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
                    if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
                    if (v.length > 10) v = `${v.slice(0, 10)}-${v.slice(10)}`;
                    setListaEsperaFone(v);
                  }} className={inputClass} placeholder="(81) 99999-9999" />
                </div>
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black py-4 rounded-xl shadow-xl mt-4 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer">
                  Entrar na Lista VIP <ChevronRight size={16}/>
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-3xl text-center space-y-4">
              <CheckCircle className="text-emerald-500 mx-auto" size={40} />
              <p className="text-emerald-400 font-bold text-sm">Você foi adicionado à lista de espera com sucesso!</p>
              <p className="text-zinc-400 text-xs">Se alguma vaga abrir, entraremos em contato com você via WhatsApp.</p>
            </div>
          )}
        </div>
      ) : 
      
      /* ESTADO 3: FORMULÁRIO NORMAL DE COMPRA */
      telaAtual === 'formulario' ? (
        <>
          <div className="text-center mb-10 relative">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">INSCRIÇÃO</h2>
            <p className="text-emerald-500 text-sm font-bold mt-1 tracking-widest">R$ 55 INDIVIDUAL | R$ 100 CASADINHA</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {participants.map((participant, index) => (
              <div key={index} className="p-6 rounded-3xl bg-zinc-800/40 border border-zinc-700/50 relative shadow-inner overflow-hidden">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${index === 0 ? 'bg-emerald-500' : 'bg-zinc-500'}`}></div>

                <div className="flex justify-between items-center mb-5 pl-2 border-b border-zinc-700/50 pb-2.5">
                  <h3 className={`text-[11px] font-black uppercase tracking-widest ${index === 0 ? 'text-emerald-400' : 'text-zinc-300'}`}>
                    {index === 0 ? "👤 Titular da Inscrição (Responsável)" : `👥 Acompanhante ${index}`}
                  </h3>
                  {index > 0 && (
                    <button type="button" onClick={() => removeParticipant(index)} className="text-zinc-500 hover:text-red-500 transition-colors p-1 cursor-pointer" title="Remover Acompanhante"><Trash2 size={16} /></button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Nome Completo</label>
                    <input type="text" value={participant.name} onChange={e => updateParticipant(index, 'name', e.target.value)} className={inputClass} placeholder="Ex: João Silva" />
                  </div>

                  {index === 0 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">WhatsApp</label>
                          <input type="tel" value={participant.phone} onChange={e => updateParticipant(index, 'phone', e.target.value)} className={inputClass} placeholder="(81) 99999-9999" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">CPF (Necessário para a compra)</label>
                          <input type="text" required value={participant.cpf} onChange={e => updateParticipant(index, 'cpf', e.target.value)} className={inputClass} placeholder="000.000.000-00" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">E-mail</label>
                        <input type="email" value={participant.email} onChange={e => updateParticipant(index, 'email', e.target.value)} className={inputClass} placeholder="seu@gmail.com" />
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <label className="text-[10px] font-black uppercase text-emerald-400 ml-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
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
            
            {/* BOTÃO DA CASADINHA TURBINADO */}
            {vagasOcupadas + participants.length < LIMITE_VAGAS && (
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button" 
                onClick={addParticipant} 
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 hover:from-emerald-500/20 hover:to-emerald-500/20 border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 rounded-2xl text-emerald-400 hover:text-white font-black transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-wider shadow-lg group cursor-pointer"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-colors">
                  <Plus size={16} />
                </span>
                <span>Adicionar Acompanhante (Casadinha)</span>
              </motion.button>
            )}

            <label className="flex items-start gap-3 pt-4 border-t border-zinc-700/50 cursor-pointer group">
              <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-1 h-5 w-5 accent-emerald-500 cursor-pointer rounded shrink-0 group-hover:ring-2 ring-emerald-500/50 transition-all" />
              <span className="text-[11px] text-zinc-400 font-bold leading-relaxed select-none group-hover:text-zinc-300 transition-colors">
                Aceito o Termo de Responsabilidade (declaro estar em boas condições de saúde). Li e aceito o{' '}
                <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.dispatchEvent(new CustomEvent('abrirModalJuridico', { detail: 'regulamento' })); }} className="text-emerald-400 underline hover:text-emerald-300 cursor-pointer">Regulamento</span>{' '}
                e a{' '}
                <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.dispatchEvent(new CustomEvent('abrirModalJuridico', { detail: 'reembolso' })); }} className="text-emerald-400 underline hover:text-emerald-300 cursor-pointer">Política de Reembolso</span>.
              </span>
            </label>

            {errorMsg && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2"><AlertCircle size={14}/> {errorMsg}</div>}
            
            <button disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_45px_rgba(16,185,129,0.5)] transition-all uppercase tracking-widest flex items-center justify-center gap-3 text-sm mt-4 cursor-pointer">
              {loading ? <Loader2 className="animate-spin text-zinc-950" /> : <>Finalizar Inscrição (R$ {formatarMoeda(calcularValorIngressos(participants.length) + taxaPix)}) <ChevronRight size={20} /></>}
            </button>
          </form>
        </>
      ) : (
        /* ESTADO 4: TELA DO PIX OU SUCESSO */
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
          {statusPagamento === 'pago' ? (
            <div className="py-2 space-y-6 flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-black uppercase italic text-white tracking-tighter">Pagamento <br /> Confirmado!</h2>
              <p className="text-zinc-400 font-bold text-sm max-w-xs mx-auto">
                O comprovante e os detalhes da sua inscrição foram enviados para o e-mail: <strong className="text-emerald-500">{participants[0].email}</strong>
              </p>

              <div className="space-y-4 text-left w-full max-w-md mx-auto pt-4 pb-2">
                {participants.map((p, index) => (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.2 }} key={index} 
                    className="bg-zinc-900/80 p-4 rounded-xl border border-emerald-500/20 flex items-center gap-4"
                  >
                    <div className="bg-emerald-500/10 p-3 rounded-lg">
                      <Ticket className="text-emerald-500" size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">
                        {index === 0 ? "Titular" : "Acompanhante"}
                      </p>
                      <p className="text-white font-bold uppercase truncate">{p.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button onClick={reiniciarCompra} className="mt-8 px-6 py-3 border border-zinc-700 hover:border-emerald-500 rounded-xl text-zinc-400 hover:text-emerald-500 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer">
                Fazer Nova Inscrição
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2"><QrCode className="text-emerald-500 w-10 h-10" /></div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Escaneie o PIX</h2>
              </div>
              {qrCodeImg && (
                <div className="flex justify-center my-6"><div className="bg-white p-3 rounded-2xl border-4 border-emerald-500/30"><img src={`data:image/jpeg;base64,${qrCodeImg}`} alt="PIX" className="w-48 h-48 rounded-lg" /></div></div>
              )}
              <div className="bg-zinc-800/40 border border-emerald-500/30 rounded-3xl p-6 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                <p className="text-xs font-bold uppercase text-zinc-500 tracking-widest mb-2">Valor total</p>
                <p className="text-5xl font-black text-white tracking-tighter">R$ {formatarMoeda(calcularValorIngressos(participants.length) + taxaPix)}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 bg-zinc-950 p-2 pl-4 rounded-xl border border-zinc-700/50">
                  <span className="text-xs font-mono text-zinc-300 truncate w-full text-left">{qrCodePix}</span>
                  <button onClick={copiarPix} className={`px-4 py-3 rounded-lg text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${copiado ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer'}`}>
                    {copiado ? <CheckCircle size={14} /> : <Copy size={14} />} 
                    {copiado ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                {tempoRestante > 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 mt-4">
                    <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold animate-pulse">Aguardando pagamento...</p>
                    <div className="flex items-center gap-2 text-2xl font-mono bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800 text-white"><Clock size={20} className="text-emerald-500" /><span>{formatarTempo(tempoRestante)}</span></div>
                    <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Tempo para o PIX expirar</p>
                  </div>
                ) : (
                  <div className="text-red-500 font-bold text-xs mt-4 bg-red-500/10 p-4 rounded-xl border border-red-500/30">Tempo expirado! Por favor, recarregue a página e gere uma nova inscrição.</div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}