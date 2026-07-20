import { useEffect } from 'react';
import { QrCode, CheckCircle, Ticket, Clock, Copy, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatarMoeda } from '../utils/helpers';

interface Participante {
  name: string;
  email: string;
}

interface PixModalProps {
  statusPagamento: 'pendente' | 'pago';
  participants: Participante[];
  qrCodeImg: string;
  qrCodePix: string;
  copiado: boolean;
  copiarPix: () => void;
  tempoRestante: number;
  formatarTempo: (segundos: number) => string;
  calcularValorIngressos: (qtd: number) => number;
  taxaPix: number;
  setTelaAtual: (val: 'formulario' | 'pix') => void;
  reiniciarCompra: () => void;
}

export default function PixModal({
  statusPagamento,
  participants,
  qrCodeImg,
  qrCodePix,
  copiado,
  copiarPix,
  tempoRestante,
  formatarTempo,
  calcularValorIngressos,
  taxaPix,
  setTelaAtual,
  reiniciarCompra
}: PixModalProps) {

  // ✨ Trava a rolagem do site de trás para o usuário rolar apenas a tela do PIX!
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // 🛡️ LÓGICA BLINDADA DO QR CODE
  const getQrCodeImageSrc = (imgString?: string) => {
    if (!imgString) return '';
    const limpa = String(imgString).trim().replace(/(\r\n|\n|\r)/gm, '');
    if (limpa.startsWith('data:image')) return limpa;
    return `data:image/jpeg;base64,${limpa}`;
  };

  const valorExibicao = String(formatarMoeda(calcularValorIngressos(participants.length) + taxaPix)).replace('R$', '').trim();

  return (
    /* 🚀 TELA CHEIA SÓLIDA (bg-slate-50): Esconde o cabeçalho, o rodapé e foca 100% no pagamento */
    <div className="fixed inset-0 z-[99999] bg-slate-50 overflow-y-auto px-4 py-6 sm:p-10 flex justify-center items-start">
      
      <div className="w-full max-w-lg bg-white border border-slate-200/80 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-[0_15px_50px_rgba(0,0,0,0.06)] text-center space-y-5 text-slate-800 animate-in fade-in slide-in-from-bottom-8 duration-500 mb-10 mt-2 sm:mt-6">
        
        {statusPagamento === 'pago' ? (
          /* ============================================================================
             🎉 CARD DE CELEBRAÇÃO (PAGAMENTO APROVADO)
             ============================================================================ */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_10px_25px_rgba(16,185,129,0.3)]">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 inline-block mb-2 shadow-sm">
                ✨ Inscrição Garantida
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase italic text-slate-900 tracking-tighter leading-none">
                Compra <br /> Confirmada!
              </h2>
            </div>

            {/* DESTAQUE DO E-MAIL */}
            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-inner space-y-1 text-left">
              <p className="text-slate-500 font-semibold text-[11px] sm:text-xs leading-relaxed">
                📧 O comprovante e os detalhes foram enviados para:
              </p>
              <p className="text-sky-600 font-black text-xs sm:text-sm tracking-wide break-all underline decoration-sky-300">
                {participants[0]?.email}
              </p>
            </div>

            {/* LISTA DE PARTICIPANTES */}
            <div className="space-y-2 text-left pt-1 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center mb-1">
                Participantes Confirmados ({participants.length})
              </p>
              {participants.map((p, index) => (
                <motion.div 
                  initial={{ x: -15, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 + index * 0.1 }} key={index} 
                  className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm"
                >
                  <div className="bg-sky-100 p-2 rounded-lg shrink-0">
                    <Ticket className="text-sky-600" size={18} />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-[9px] uppercase text-slate-400 font-extrabold tracking-widest">
                      {index === 0 ? "Titular da Compra" : `Trilheiro(a) #${index + 1}`}
                    </p>
                    <p className="text-slate-900 font-bold uppercase truncate text-xs sm:text-sm">{p.name || 'Participante'}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button 
              onClick={reiniciarCompra} 
              className="w-full mt-2 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              Concluir e Fazer Nova Inscrição
            </button>
          </motion.div>
        ) : (
          /* ============================================================================
             ⏳ TELA DE PAGAMENTO (FUNDO BRANCO LIMPO)
             ============================================================================ */
          <>
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center border border-sky-100">
                <QrCode className="text-sky-600 w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter text-slate-900">
                {tempoRestante > 0 ? "Escaneie o PIX" : "PIX Expirado"}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Pague agora para confirmar automaticamente sua vaga!</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-sky-600 to-amber-500"></div>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-0.5">Valor Total a Pagar</p>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">R$ {valorExibicao}</p>
            </div>

            {tempoRestante > 0 ? (
              /* --- SUB-TELA: PIX ATIVO --- */
              <div className="space-y-4">
                
                {/* BLOCO DO QR CODE COMPACTO */}
                <div className="flex justify-center my-2">
                  <div className="bg-white p-2 sm:p-3 rounded-2xl border-2 border-sky-200 shadow-md min-w-[180px] min-h-[180px] sm:min-w-[200px] sm:min-h-[200px] flex items-center justify-center">
                    {qrCodeImg ? (
                      <img 
                        src={getQrCodeImageSrc(qrCodeImg)} 
                        alt="QR Code PIX Trilha" 
                        className="w-40 h-40 sm:w-48 sm:h-48 rounded-lg object-contain mx-auto animate-in fade-in duration-300" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-center p-3 space-y-1.5 max-w-[160px]">
                        <QrCode className="w-8 h-8 text-sky-400 mx-auto animate-pulse" />
                        <p className="text-[9px] text-slate-400 font-bold leading-tight">
                          Use o código Copia e Cola abaixo para pagar
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider text-left">Ou copie o código PIX:</p>
                  <div className="flex items-center gap-1.5 bg-slate-50 p-1 pl-3 rounded-xl border border-slate-200 shadow-inner">
                    <input 
                      type="text" 
                      readOnly 
                      value={qrCodePix} 
                      className="w-full bg-transparent text-[11px] sm:text-xs font-mono text-slate-600 outline-none select-all truncate font-semibold"
                    />
                    <button 
                      onClick={copiarPix} 
                      className={`px-3 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer ${
                        copiado ? 'bg-emerald-500 text-white shadow-md' : 'bg-sky-600 hover:bg-sky-700 text-white'
                      }`}
                    >
                      {copiado ? <CheckCircle size={14} /> : <Copy size={14} />} 
                      {copiado ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-1.5 pt-1">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-600 font-extrabold animate-pulse">
                    ⌛ Aguardando confirmação do banco...
                  </p>
                  <div className="flex items-center gap-1.5 text-lg sm:text-xl font-mono bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-800 shadow-inner font-bold">
                    <Clock size={16} className="text-amber-600" />
                    <span>{formatarTempo(tempoRestante)}</span>
                  </div>
                </div>

                {/* BOTÃO PARA VOLTAR E CANCELAR/EDITAR (ELEGANTEMENTE NO TOPO DA BORDA DE BAIXO) */}
                <div className="border-t border-slate-100 pt-3 mt-1">
                  <button 
                    type="button"
                    onClick={() => setTelaAtual('formulario')} 
                    className="flex items-center justify-center gap-1.5 w-full text-slate-400 hover:text-slate-700 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest cursor-pointer transition-colors"
                  >
                    <ArrowLeft size={14} /> Voltar e editar dados
                  </button>
                </div>
              </div>
            ) : (
              /* --- SUB-TELA: PIX EXPIRADO --- */
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 p-5 rounded-2xl text-center space-y-3 my-2"
              >
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-red-700 font-black uppercase text-xs sm:text-sm tracking-wide">Tempo Expirado!</h3>
                  <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed font-medium">
                    O código PIX anterior foi cancelado. Para garantir sua vaga, gere uma nova inscrição.
                  </p>
                </div>
                
                <button 
                  onClick={reiniciarCompra} 
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw size={14} />
                  Gerar Novo PIX
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}