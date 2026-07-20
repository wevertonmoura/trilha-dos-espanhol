import React from 'react';
import { QrCode, CheckCircle, Ticket, Clock, Copy, RefreshCw, AlertCircle } from 'lucide-react';
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

  // LÓGICA DO SEU SNIPPET: Previne erro no Base64 caso já venha com ou sem o prefixo data:image
  const getQrCodeImageSrc = (imgString: string) => {
    if (!imgString) return '';
    if (imgString.startsWith('data:image')) return imgString;
    return `data:image/jpeg;base64,${imgString}`;
  };

  // Previne o duplo "R$" limpando caso o helper já traga a formatação
  const valorExibicao = String(formatarMoeda(calcularValorIngressos(participants.length) + taxaPix)).replace('R$', '').trim();

  return (
    <>
      {/* PLACEHOLDER NO FUNDO DA PÁGINA PARA O LAYOUT NÃO ENCOLHER */}
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

      {/* OVERLAY FIXO E CENTRALIZADO (MODAL SÊNIOR) */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 md:p-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border-2 border-sky-400/40 rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] text-center space-y-6 text-slate-800">
          
          {statusPagamento === 'pago' ? (
            /* ============================================================================
               🎉 CARD DE CELEBRAÇÃO (LÓGICA DO SEU SNIPPET COM TEMA CLARO/ESMERALDA)
               ============================================================================ */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_10px_25px_rgba(16,185,129,0.3)]">
                <CheckCircle size={40} className="text-white" />
              </div>
              
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 inline-block mb-2 shadow-sm">
                  ✨ Inscrição Garantida
                </span>
                <h2 className="text-3xl font-black uppercase italic text-slate-900 tracking-tighter leading-none">
                  Compra <br /> Confirmada!
                </h2>
              </div>

              {/* DESTAQUE DO E-MAIL DO COMPROVANTE */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-inner space-y-1.5 text-left">
                <p className="text-slate-500 font-semibold text-xs leading-relaxed">
                  📧 O comprovante e os detalhes da sua aventura foram enviados para o e-mail:
                </p>
                <p className="text-sky-600 font-black text-sm tracking-wide break-all underline decoration-sky-300">
                  {participants[0]?.email}
                </p>
              </div>

              {/* LISTA DE PARTICIPANTES COM ANIMAÇÃO */}
              <div className="space-y-2.5 text-left pt-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center mb-2">
                  Participantes Confirmados ({participants.length})
                </p>
                {participants.map((p, index) => (
                  <motion.div 
                    initial={{ x: -15, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 + index * 0.1 }} key={index} 
                    className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center gap-3.5 shadow-sm hover:border-sky-300 transition-colors"
                  >
                    <div className="bg-sky-100 p-2.5 rounded-lg shrink-0">
                      <Ticket className="text-sky-600" size={20} />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-[9px] uppercase text-slate-400 font-extrabold tracking-widest">
                        {index === 0 ? "Titular da Compra" : `Trilheiro(a) #${index + 1}`}
                      </p>
                      <p className="text-slate-900 font-bold uppercase truncate text-sm">{p.name || 'Participante'}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={reiniciarCompra} 
                className="w-full mt-4 py-4 bg-sky-600 hover:bg-sky-700 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                Concluir e Fazer Nova Inscrição
              </button>
            </motion.div>
          ) : (
            /* ============================================================================
               ⏳ TELA DE PAGAMENTO (LÓGICA DO SNIPPET COM TEMA CLARO)
               ============================================================================ */
            <>
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-14 h-14 bg-sky-50 rounded-full flex items-center justify-center border border-sky-100">
                  <QrCode className="text-sky-600 w-8 h-8 animate-pulse" />
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">
                  {tempoRestante > 0 ? "Escaneie o PIX" : "PIX Expirado"}
                </h2>
                <p className="text-xs text-slate-500 font-medium">Pague agora para confirmar automaticamente sua inscrição!</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-sky-600 to-amber-500"></div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">Valor Total a Pagar</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">R$ {valorExibicao}</p>
              </div>

              {tempoRestante > 0 ? (
                /* --- SUB-TELA: PIX ATIVO --- */
                <div className="space-y-4">
                  {qrCodeImg && (
                    <div className="flex justify-center my-4">
                      <div className="bg-white p-3 rounded-2xl border-2 border-sky-200 shadow-lg">
                        <img 
                          src={getQrCodeImageSrc(qrCodeImg)} 
                          alt="QR Code PIX Trilha" 
                          className="w-48 h-48 rounded-lg object-contain mx-auto" 
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 pt-1">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider text-left">Ou copie o código PIX abaixo:</p>
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 pl-4 rounded-xl border border-slate-200 shadow-inner">
                      <input 
                        type="text" 
                        readOnly 
                        value={qrCodePix} 
                        className="w-full bg-transparent text-xs font-mono text-slate-600 outline-none select-all truncate font-semibold"
                      />
                      <button 
                        onClick={copiarPix} 
                        className={`px-4 py-3 rounded-lg text-xs font-bold flex items-center gap-2 shrink-0 transition-all active:scale-95 cursor-pointer ${
                          copiado ? 'bg-emerald-500 text-white shadow-md' : 'bg-sky-600 hover:bg-sky-700 text-white'
                        }`}
                      >
                        {copiado ? <CheckCircle size={14} /> : <Copy size={14} />} 
                        {copiado ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-2 pt-2">
                    <p className="text-[10px] uppercase tracking-widest text-amber-600 font-extrabold animate-pulse">
                      ⌛ Aguardando confirmação do banco...
                    </p>
                    <div className="flex items-center gap-2 text-xl font-mono bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 text-slate-800 shadow-inner font-bold">
                      <Clock size={18} className="text-amber-600" />
                      <span>{formatarTempo(tempoRestante)}</span>
                    </div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Tempo para o código expirar</p>
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
                </div>
              ) : (
                /* --- SUB-TELA: PIX EXPIRADO --- */
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center space-y-4 my-4"
                >
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-red-700 font-black uppercase text-sm tracking-wide">Tempo Expirado!</h3>
                    <p className="text-slate-600 text-xs leading-relaxed font-medium">
                      O código PIX anterior foi cancelado por segurança pelo Mercado Pago. Para garantir sua vaga, gere uma nova inscrição.
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
    </>
  );
}