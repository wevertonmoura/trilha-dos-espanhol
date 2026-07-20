import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { validarCPF } from '../utils/helpers';

import ListaEsperaCard from './ListaEsperaCard';
import ParticipantesForm from './ParticipantesForm';
import PixModal from './PixModal';

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
    if (telaAtual === 'pix') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [telaAtual]);

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
        <ListaEsperaCard 
          listaEsperaNome={listaEsperaNome}
          setListaEsperaNome={setListaEsperaNome}
          listaEsperaFone={listaEsperaFone}
          setListaEsperaFone={setListaEsperaFone}
          entrouLista={entrouLista}
          handleListaEspera={handleListaEspera}
          inputClass={inputClass}
        />
      ) : 
      
      /* ESTADO 3: FORMULÁRIO NORMAL DE COMPRA */
      telaAtual === 'formulario' ? (
        <ParticipantesForm 
          participants={participants}
          updateParticipant={updateParticipant}
          removeParticipant={removeParticipant}
          addParticipant={addParticipant}
          vagasOcupadas={vagasOcupadas}
          LIMITE_VAGAS={LIMITE_VAGAS}
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          errorMsg={errorMsg}
          loading={loading}
          handleSubmit={handleSubmit}
          calcularValorIngressos={calcularValorIngressos}
          taxaPix={taxaPix}
          inputClass={inputClass}
        />
      ) : (
        /* ESTADO 4: MODAL FIXO E CENTRALIZADO DO PIX EM TEMA CLARO */
        <PixModal 
          statusPagamento={statusPagamento}
          participants={participants}
          qrCodeImg={qrCodeImg}
          qrCodePix={qrCodePix}
          copiado={copiado}
          copiarPix={copiarPix}
          tempoRestante={tempoRestante}
          formatarTempo={formatarTempo}
          calcularValorIngressos={calcularValorIngressos}
          taxaPix={taxaPix}
          setTelaAtual={setTelaAtual}
          reiniciarCompra={reiniciarCompra}
        />
      )}
    </section>
  );
}