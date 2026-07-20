import React from 'react';
import { Hourglass, ChevronRight, CheckCircle } from 'lucide-react';

interface ListaEsperaProps {
  listaEsperaNome: string;
  setListaEsperaNome: (val: string) => void;
  listaEsperaFone: string;
  setListaEsperaFone: (val: string) => void;
  entrouLista: boolean;
  handleListaEspera: (e: React.FormEvent) => void;
  inputClass: string;
}

export default function ListaEsperaCard({
  listaEsperaNome,
  setListaEsperaNome,
  listaEsperaFone,
  setListaEsperaFone,
  entrouLista,
  handleListaEspera,
  inputClass
}: ListaEsperaProps) {
  return (
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
  );
}