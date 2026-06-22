import React from 'react';
import { ChevronRight, Calendar, Footprints, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  vagasOcupadas: number;
  LIMITE_VAGAS: number;
  scrollToForm: (e: React.MouseEvent) => void;
  images: string[];
}

export default function HeroSection({ vagasOcupadas, LIMITE_VAGAS, scrollToForm, images }: HeroProps) {
  const fotoFlorestaFixa = images?.[0] || '/foto1.jpg';

  return (
    // 1. Reduzido para min-h-[72vh] (Puxa a descrição para cima)
    // 2. Removida a borda inferior para "derreter" no preto
    <section className="relative min-h-[72vh] md:min-h-[78vh] flex items-center justify-center overflow-hidden bg-zinc-950 pt-10 pb-8 px-4">
      
      {/* FUNDO DA FLORESTA */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src={fotoFlorestaFixa} 
          alt="Floresta ao fundo" 
          className="w-full h-full object-cover filter contrast-125 saturate-50 brightness-75 opacity-25 md:opacity-20" 
        />
        {/* O degradê termina em 'to-zinc-950' exato para colar com a seção de baixo */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/75 to-zinc-950" />
      </div>

      {/* Luz neon verde atrás da Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs h-64 bg-emerald-500/15 blur-[100px] pointer-events-none z-0" />

      {/* CONTEÚDO COMPACTADO (Espaçamentos verticais mais inteligentes) */}
      <div className="container mx-auto max-w-md text-center relative z-10 flex flex-col items-center">
        
        {/* Etiqueta Superior */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-[0.2em] uppercase mb-6 shadow-sm backdrop-blur-md"
        >
          🌿 Vem Para Trilha Apresenta
        </motion.div>

        {/* Logo um pouco mais compacta */}
        <motion.div 
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-32 h-32 md:w-36 md:h-36 mb-6 relative flex items-center justify-center p-1 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 shadow-2xl"
        >
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
          <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-2 border-emerald-500/30">
            <img 
              src="/logo.png" 
              alt="Vem Para Trilha" 
              className="w-full h-full object-cover scale-105" 
            />
          </div>
        </motion.div>

        {/* TÍTULO */}
        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-white mb-2">
          Trilha <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 drop-shadow-lg">
            Aldeia
          </span>
        </h1>

        {/* Localização */}
        <p className="text-zinc-300 font-medium text-xs md:text-sm flex items-center justify-center gap-1.5 mb-6 tracking-wide">
          <MapPin size={15} className="text-emerald-500" /> Chã da Peroba, Aldeia - PE
        </p>

        {/* BLOCOS SLIM */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full flex flex-col gap-2.5 mb-8 max-w-[280px]"
        >
          <div className="flex items-center justify-center gap-2 bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 text-zinc-200 text-xs font-bold py-2.5 px-4 rounded-xl border-t border-zinc-700/50 border-x border-zinc-800/50 border-b border-zinc-900 backdrop-blur-md shadow-lg uppercase tracking-wider">
            <Calendar size={13} className="text-emerald-400" />
            <span>26 de Julho, 2026</span>
          </div>

          <div className="flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-900/20 to-zinc-900/40 text-emerald-400 text-xs font-black py-2.5 px-4 rounded-xl border-t border-emerald-500/30 border-x border-emerald-500/10 border-b border-zinc-900 backdrop-blur-md shadow-lg uppercase tracking-widest">
            <Footprints size={13} className="text-emerald-400" />
            <span>13km • Ritmo Leve</span>
          </div>

          <div className="flex items-center justify-center gap-2 bg-gradient-to-b from-amber-900/10 to-zinc-900/40 text-amber-400 text-xs font-bold py-2.5 px-4 rounded-xl border-t border-amber-500/30 border-x border-amber-500/10 border-b border-zinc-900 backdrop-blur-md shadow-lg uppercase tracking-wider">
            <Clock size={13} className="text-amber-400" />
            <span>Saída às 07:00h</span>
          </div>
        </motion.div>

        {/* BOTÃO */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-[260px]"
        >
          <a 
            href="#inscricao" 
            onClick={scrollToForm} 
            className={`w-full inline-flex items-center justify-center gap-2 font-black py-3.5 px-6 rounded-xl shadow-2xl transition-all duration-300 uppercase tracking-widest text-[11px] md:text-xs cursor-pointer border ${
              vagasOcupadas >= LIMITE_VAGAS 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-400/50 text-zinc-950' 
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-400/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] hover:-translate-y-1'
            }`}
          >
            <span>{vagasOcupadas >= LIMITE_VAGAS ? 'Lista de Espera' : 'Garantir Ingresso'}</span>
            <ChevronRight size={16} />
          </a>
        </motion.div>

      </div>
    </section>
  );
}