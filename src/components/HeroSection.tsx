import React from 'react';
import { ChevronRight, Calendar, Footprints, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  vagasOcupadas: number;
  LIMITE_VAGAS: number;
  scrollToForm: (e: React.MouseEvent) => void;
  images: string[];
}

export default function HeroSection({ vagasOcupadas, LIMITE_VAGAS, scrollToForm }: HeroProps) {
  return (
    <section className="relative min-h-[78vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50/60 pt-12 pb-14 px-4">
      
      {/* =========================================================================
          CENÁRIO VETORIAL EM CÓDIGO (PRAIA, MAR E MONTANHAS VIA SVG/CSS - ZERO FOTOS!)
         ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* 1. O SOL DO LITORAL */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-tr from-amber-300/40 to-yellow-200/20 rounded-full blur-2xl" />
        
        {/* 2. AS MONTANHAS AO FUNDO (Silhuetas das colinas/falésias costeiras) */}
        <div className="absolute bottom-16 inset-x-0 w-full overflow-hidden leading-none opacity-40">
          <svg className="relative block w-full h-48 md:h-64" viewBox="0 0 1200 250" preserveAspectRatio="none">
            {/* Montanha de trás (Tom mais suave) */}
            <path d="M0,250 L0,130 Q150,60 350,110 T750,70 Q950,30 1200,120 L1200,250 Z" fill="#d97706" fillOpacity="0.15" />
            {/* Montanha da frente (Tons terrosos das ruínas) */}
            <path d="M0,250 L0,160 Q250,90 500,150 T900,100 Q1050,70 1200,150 L1200,250 Z" fill="#b45309" fillOpacity="0.2" />
          </svg>
        </div>

        {/* 3. AS ONDAS DO MAR E A PRAIA (Parte inferior vibrante e fresca) */}
        <div className="absolute bottom-0 inset-x-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-28 md:h-40" viewBox="0 0 1200 120" preserveAspectRatio="none">
            {/* Onda de fundo (Ciano/Verde Água) */}
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,30 L1200,120 L0,120 Z" fill="#06b6d4" fillOpacity="0.2" />
            {/* Onda do meio (Azul Oceano) */}
            <path d="M0,30 C200,90 450,10 650,60 C850,110 1050,30 1200,50 L1200,120 L0,120 Z" fill="#0284c7" fillOpacity="0.25" />
            {/* Onda frontal (Azul Marinho / Arrebentação da Praia) */}
            <path d="M0,60 C250,110 550,40 800,80 C1000,110 1100,60 1200,70 L1200,120 L0,120 Z" fill="#0369a1" fillOpacity="0.3" />
          </svg>
        </div>

        {/* Camada de suavização (Garante que o texto fique 100% nítido em qualquer tela) */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/40 to-transparent" />
      </div>

      {/* =========================================================================
          CONTEÚDO PRINCIPAL (TEXTOS, LOGO E BOTÕES EM ALTO CONTRASTE)
         ========================================================================= */}
      <div className="container mx-auto max-w-md text-center relative z-10 flex flex-col items-center">
        
        {/* Etiqueta Superior */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-900 text-[10px] font-black tracking-[0.2em] uppercase mb-5 shadow-sm backdrop-blur-md"
        >
          🇪🇸 Vem Para Trilha Apresenta
        </motion.div>

        {/* Logo Brilhante com Borda Oceânica */}
        <motion.div 
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-32 h-32 md:w-36 md:h-36 mb-5 relative flex items-center justify-center p-1.5 rounded-full bg-white shadow-[0_15px_35px_rgba(0,0,0,0.1)] border-2 border-sky-500/40"
        >
          <div className="absolute inset-0 rounded-full bg-sky-400/10 blur-xl animate-pulse" />
          <div className="relative z-10 w-full h-full rounded-full overflow-hidden bg-white">
            <img 
              src="/logo.png" 
              alt="Vem Para Trilha" 
              className="w-full h-full object-cover scale-105" 
            />
          </div>
        </motion.div>

        {/* TÍTULO MODERNO */}
        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-slate-900 mb-2">
          Trilha dos <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-700 to-amber-700 drop-shadow-sm">
            Espanhóis
          </span>
        </h1>

        {/* Localização */}
        <p className="text-slate-600 font-bold text-xs md:text-sm flex items-center justify-center gap-1.5 mb-6 tracking-wide">
          <MapPin size={16} className="text-amber-600 shrink-0" /> Ruínas & Litoral • Suape / Cabo de Santo Agostinho - PE
        </p>

        {/* BLOCOS INFORMATIVOS SLIM (Estilo Litoral/Pedra) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full flex flex-col gap-2.5 mb-8 max-w-[280px]"
        >
          <div className="flex items-center justify-center gap-2 bg-white/95 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-200 shadow-sm uppercase tracking-wider backdrop-blur-md">
            <Calendar size={14} className="text-sky-600" />
            <span>16 de Agosto, 2026</span>
          </div>

          <div className="flex items-center justify-center gap-2 bg-sky-50/90 text-sky-950 text-xs font-black py-2.5 px-4 rounded-xl border border-sky-200 shadow-sm uppercase tracking-widest backdrop-blur-md">
            <Footprints size={14} className="text-sky-600" />
            <span>10km • Ritmo Moderado</span>
          </div>

          <div className="flex items-center justify-center gap-2 bg-amber-50/90 text-amber-950 text-xs font-bold py-2.5 px-4 rounded-xl border border-amber-200 shadow-sm uppercase tracking-wider backdrop-blur-md">
            <Clock size={14} className="text-amber-600" />
            <span>Saída às 06:30h</span>
          </div>
        </motion.div>

        {/* BOTÃO DE GARANTIR INGRESSO */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-[260px]"
        >
          <a 
            href="#inscricao" 
            onClick={scrollToForm} 
            className={`w-full inline-flex items-center justify-center gap-2 font-black py-4 px-6 rounded-xl shadow-xl transition-all duration-300 uppercase tracking-widest text-xs cursor-pointer border ${
              vagasOcupadas >= LIMITE_VAGAS 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-400/50 text-zinc-950' 
                : 'bg-gradient-to-r from-sky-600 to-sky-700 border-sky-400/50 text-white shadow-[0_10px_25px_rgba(2,132,199,0.35)] hover:shadow-[0_15px_30px_rgba(2,132,199,0.5)] hover:-translate-y-1'
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