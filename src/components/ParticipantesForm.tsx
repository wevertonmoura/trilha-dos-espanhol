import React from 'react';
import { Plus, Trash2, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatarMoeda } from '../utils/helpers';

interface Participante {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  emergencyName: string;
  emergencyPhone: string;
}

interface ParticipantesFormProps {
  participants: Participante[];
  updateParticipant: (index: number, field: string, value: string) => void;
  removeParticipant: (index: number) => void;
  addParticipant: () => void;
  vagasOcupadas: number;
  LIMITE_VAGAS: number;
  termsAccepted: boolean;
  setTermsAccepted: (val: boolean) => void;
  errorMsg: string;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  calcularValorIngressos: (qtd: number) => number;
  taxaPix: number;
  inputClass: string;
}

export default function ParticipantesForm({
  participants,
  updateParticipant,
  removeParticipant,
  addParticipant,
  vagasOcupadas,
  LIMITE_VAGAS,
  termsAccepted,
  setTermsAccepted,
  errorMsg,
  loading,
  handleSubmit,
  calcularValorIngressos,
  taxaPix,
  inputClass
}: ParticipantesFormProps) {
  return (
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
  );
}