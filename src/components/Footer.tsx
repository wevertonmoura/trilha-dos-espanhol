// src/components/Footer.tsx

import { useState, useEffect } from 'react';
import { Users, ArrowRight, MapPin, Clock, Mail, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Desenho Vetorial Oficial do WhatsApp
const WhatsappLogo = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.195 1.871.118.579-.087 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

// Desenho Vetorial Oficial do Instagram
const InstagramLogo = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.163s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function Footer() {
  const [modalAberto, setModalAberto] = useState<'regulamento' | 'reembolso' | null>(null);

  const linkGrupoGeral = "https://chat.whatsapp.com/H5DWJOz0wcC2PntYSq1t8y"; 
  const linkInstagram = "https://www.instagram.com/vempara_trilha?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="; 
  const linkWhatsAppDireto = `https://wa.me/5581988227739?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Trilha%20dos%20Espanhóis.`;

  useEffect(() => {
    const handleOpen = (event: any) => setModalAberto(event.detail);
    window.addEventListener('abrirModalJuridico', handleOpen);
    return () => window.removeEventListener('abrirModalJuridico', handleOpen);
  }, []);

  return (
    <footer className="bg-slate-900 text-white pt-12 pb-8 border-t border-slate-800 relative overflow-hidden">
      
      {/* Luz Superior Litorânea */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-1 bg-gradient-to-r from-transparent via-sky-500/60 to-transparent blur-sm" />
      
      <div className="container mx-auto px-4 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            {/* LOGÓTIPO */}
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-sky-400/40 shadow-xl bg-white flex items-center justify-center p-1">
              <img 
                src="/logo.png" 
                alt="Vem Para Trilha Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <h3 className="text-sky-400 font-black text-xl mb-1 uppercase tracking-tight">Vem Para Trilha</h3>
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">Trilha dos Espanhóis</p>
            
            <div className="text-slate-400 text-sm space-y-1.5 mt-1">
              <p className="flex items-center justify-center md:justify-start gap-2">
                <MapPin size={16} className="text-sky-400 shrink-0"/> Cabo de Santo Agostinho - PE
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <Clock size={16} className="text-amber-500 shrink-0"/> Saída às 06:30h da manhã
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-black uppercase tracking-widest mb-4 text-sm">Contato</h4>
            <div className="space-y-3 text-slate-300 text-sm font-medium">
              <a href={linkWhatsAppDireto} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-sky-400 transition-colors">
                <WhatsappLogo className="w-4 h-4 text-emerald-400" /> (81) 98822-7739
              </a>
              <a href="mailto:vemparatrilha5@gmail.com" className="flex items-center gap-2.5 hover:text-sky-400 transition-colors">
                <Mail size={16} className="text-sky-400" /> vemparatrilha5@gmail.com
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end w-full">
            <div className="w-full max-w-sm bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 backdrop-blur-sm shadow-sm">
              <h4 className="text-white font-black uppercase tracking-widest mb-4 flex items-center justify-center gap-2 text-xs">
                Faça parte da família <Users size={16} className="text-sky-400"/>
              </h4>
              <div className="flex flex-col gap-3">
                <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} href={linkGrupoGeral} target="_blank" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest transition-colors">
                  <WhatsappLogo className="w-4 h-4" /> Entrar no Grupo
                </motion.a>
                <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} href={linkInstagram} target="_blank" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-black py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest transition-opacity">
                  <InstagramLogo className="w-4 h-4" /> Siga no Insta
                </motion.a>
              </div>
            </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-800 pt-6">
          <div className="flex flex-col items-center md:items-start gap-2.5">
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
              © 2026 Vem Para Trilha. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setModalAberto('regulamento')}
                className="text-slate-400 hover:text-sky-400 text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer underline decoration-slate-600"
              >
                Regulamento
              </button>
              <button 
                onClick={() => setModalAberto('reembolso')}
                className="text-slate-400 hover:text-sky-400 text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer underline decoration-slate-600"
              >
                Política de Reembolso
              </button>
            </div>
          </div>

          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="py-2.5 px-6 rounded-full bg-slate-800 border border-slate-700 text-sky-400 font-bold text-[10px] uppercase tracking-widest hover:bg-sky-600 hover:text-white hover:border-sky-500 flex items-center gap-2 transition-all cursor-pointer shadow-sm">
            Voltar ao Topo <ArrowRight className="-rotate-90 w-3 h-3" />
          </button>
        </div>

      </div>

      {/* MODAL JURÍDICO CLARO & LUMINOSO */}
      <AnimatePresence>
        {modalAberto && (
          <div 
            onClick={() => setModalAberto(null)} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          >
            <motion.div 
              onClick={(e) => e.stopPropagation()} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 text-slate-800 w-full max-w-2xl rounded-3xl p-6 md:p-8 max-h-[85vh] overflow-y-auto relative text-left shadow-2xl"
            >
              <button 
                onClick={() => setModalAberto(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-sky-600 font-black text-xl uppercase mb-4 border-b border-slate-200 pb-3 tracking-tight">
                {modalAberto === 'regulamento' ? 'Regulamento Oficial - Trilha dos Espanhóis' : 'Política de Reembolso e Desistência'}
              </h3>

              <div className="text-slate-600 text-sm space-y-4 leading-relaxed pr-2 font-medium">
                {modalAberto === 'regulamento' ? (
                  <>
                    <p><strong className="text-slate-900">1. DO EVENTO E PONTUALIDADE</strong><br/>A Trilha dos Espanhóis será realizada no Cabo de Santo Agostinho/Suape. A saída ocorrerá rigorosamente às <strong>06:30 da manhã</strong>. Tolerância de atraso zero para não prejudicar o planejamento e a segurança do grupo.</p>
                    
                    <p><strong className="text-slate-900">2. CONDIÇÕES FÍSICAS E DE SAÚDE</strong><br/>Ao se inscrever, o participante declara estar em plenas condições de saúde física e mental para realizar o percurso de 10km, assumindo a responsabilidade sobre sua própria integridade.</p>
                    
                    <p><strong className="text-slate-900">3. CLASSIFICAÇÃO ETÁRIA (A partir de 10 anos)</strong><br/>A idade mínima permitida para realizar o percurso é de <strong>10 anos completos</strong>. Por questões de segurança, todo menor de 18 anos deverá estar, obrigatoriamente, acompanhado por um responsável legal devidamente inscrito.</p>
                    
                    <p><strong className="text-slate-900">4. PRESERVAÇÃO AMBIENTAL (Lixo Zero)</strong><br/>O trajeto percorre áreas históricas e de preservação costeira. É estritamente proibido descartar qualquer resíduo no percurso. O atleta flagrado sujando a natureza será banido de edições futuras.</p>
                    
                    <p><strong className="text-slate-900">5. EQUIPAMENTO OBRIGATÓRIO DE HIDRATAÇÃO</strong><br/>É obrigatório o porte de recipiente próprio (mochila de hidratação ou garrafa). Em respeito ao meio ambiente, não haverá distribuição de copos plásticos descartáveis no trajeto.</p>
                  </>
                ) : (
                  <>
                    <p><strong className="text-slate-900">1. REGRA GERAL DE DESISTÊNCIA (Prazo de 7 dias)</strong><br/>Em conformidade com o Art. 49 do Código de Defesa do Consumidor, o participante tem o prazo de até 7 (sete) dias corridos <strong>após a data do pagamento</strong> para solicitar o cancelamento e obter o reembolso de 100% do valor.</p>
                    
                    <p><strong className="text-slate-900">2. A "TRAVA" DA SEMANA DO EVENTO (Atenção Máxima)</strong><br/><strong className="text-red-600">Faltando 7 dias ou menos para a realização da trilha, NÃO HAVERÁ REEMBOLSO em nenhuma hipótese.</strong> Como a organização realiza a compra antecipada e personalizada de medalhas, pulseiras de identificação e insumos estruturais exatos por atleta, desistências na semana do evento não poderão ser estornadas.</p>
                    
                    <p><strong className="text-slate-900">3. TRANSFERÊNCIA DE VAGA (Coloque um amigo no seu lugar)</strong><br/>Caso não possa comparecer e tenha perdido o prazo de estorno, sua vaga não está perdida! Você poderá repassá-la para outra pessoa de forma 100% gratuita. Basta notificar a organização pelo WhatsApp com até 24 horas de antecedência da saída, enviando nome, CPF e contato do novo titular.</p>
                    
                    <p><strong className="text-slate-900">4. ADIAMENTO POR CONDIÇÕES CLIMÁTICAS</strong><br/>A segurança é a nossa prioridade absoluta. Em caso de chuvas severas ou alertas de risco da Defesa Civil, a trilha será adiada. A inscrição de todos os atletas fica automaticamente garantida e transferida para a nova data oficial.</p>
                  </>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setModalAberto(null)}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md"
                >
                  Entendi e Concordo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </footer>
  );
}