import React, { useState, useEffect } from 'react';
import { X, Lock, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// IMPORTAÇÕES
import Admin from './Admin';
import HeroSection from './components/HeroSection';
import EventInfo from './components/EventInfo';
import Footer from './components/Footer';
import FormularioPrincipal from './components/FormularioPrincipal'; 
import { formatarMoeda } from './utils/helpers'; 

const TrilhaAldeia = () => {
  const [telaAdmin, setTelaAdmin] = useState<'nao' | 'login' | 'painel'>('nao');
  const [senhaAdmin, setSenhaAdmin] = useState('');
  const [erroLoginAdmin, setErroLoginAdmin] = useState('');
  
  const LIMITE_VAGAS = 50;
  const [vagasOcupadas, setVagasOcupadas] = useState(0);
  const [verificandoVagas, setVerificandoVagas] = useState(true);
  
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const images = ["/foto1.jpg", "/foto2.jpg", "/foto3.jpg", "/foto4.jpg"];

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        const res = await fetch('/api/checar-vagas');
        const data = await res.json();
        setVagasOcupadas(data.total || 0);
      } catch (err) {
        console.error("Erro ao checar vagas");
      } finally {
        setVerificandoVagas(false);
      }
    };
    fetchVagas();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setTelaAdmin('login'); 
    }
  }, []);

  const handleLoginAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroLoginAdmin('');
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha: senhaAdmin })
      });
      if (res.ok) setTelaAdmin('painel');
      else setErroLoginAdmin('Senha incorreta.');
    } catch { setErroLoginAdmin('Erro de comunicação.'); }
  };

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('inscricao')?.scrollIntoView({ behavior: 'smooth' });
  };

  // TELA DO COFRE ADMIN (Mantida escura para sensação de segurança e sigilo)
  if (telaAdmin === 'login') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-900/20 blur-[120px] rounded-full pointer-events-none"></div>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md">
          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-sky-600"></div>
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                <Lock size={28} className="text-sky-500" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Acesso Restrito</h2>
            </div>
            <form onSubmit={handleLoginAdmin} className="space-y-6">
              <input type="password" autoFocus placeholder="SENHA MESTRE" value={senhaAdmin} onChange={(e) => setSenhaAdmin(e.target.value)} className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-5 py-4 text-white text-center text-lg font-mono tracking-[0.2em] outline-none focus:border-sky-500" />
              {erroLoginAdmin && <div className="text-red-500 text-xs font-bold text-center animate-in shake">{erroLoginAdmin}</div>}
              <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(2,132,199,0.3)] transition-all uppercase tracking-widest text-xs cursor-pointer">Desbloquear Cofre</button>
            </form>
            <button onClick={() => setTelaAdmin('nao')} className="w-full mt-6 text-zinc-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"><ArrowLeft size={12} /> Voltar</button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (telaAdmin === 'painel') return <Admin senha={senhaAdmin} formatarMoeda={formatarMoeda} fecharAdmin={() => setTelaAdmin('nao')} />;

  return (
    // ATUALIZAÇÃO SÊNIOR: Fundo trocado de bg-zinc-950 (preto) para bg-slate-50 (clarinho)
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-sky-500 selection:text-white overflow-x-hidden">
      
      <AnimatePresence>
        {selectedImg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer" onClick={() => setSelectedImg(null)}>
            <button className="absolute top-6 right-6 text-white bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-all cursor-pointer"><X size={28}/></button>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={selectedImg} className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain border border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>

      <HeroSection vagasOcupadas={vagasOcupadas} LIMITE_VAGAS={LIMITE_VAGAS} scrollToForm={scrollToForm} images={images} />

      <main className="container mx-auto px-4 md:px-6 py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <EventInfo images={images} setSelectedImg={setSelectedImg} />
          <div className="lg:col-span-1 mt-10 lg:mt-0">
            <FormularioPrincipal vagasOcupadas={vagasOcupadas} verificandoVagas={verificandoVagas} LIMITE_VAGAS={LIMITE_VAGAS} />
          </div>
        </div>
      </main>

      {/* BOTÃO CHICLETE GLOBAL (RODAPÉ MOBILE) - TEMA CLARO E OCEANO */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 border-t border-slate-200 px-5 py-3.5 z-40 md:hidden flex items-center justify-between backdrop-blur-lg shadow-[0_-10px_25px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Investimento</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900 tracking-tight">R$ 55</span>
            <span className="text-[10px] text-slate-500 font-medium">/ indiv.</span>
          </div>
        </div>
        <a 
          href="#inscricao"
          onClick={scrollToForm}
          className="bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 text-white font-black text-xs uppercase tracking-widest py-3 px-6 rounded-xl shadow-[0_5px_15px_rgba(2,132,199,0.35)] flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <span>Garantir Vaga</span>
          <ChevronRight size={16} />
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default TrilhaAldeia;