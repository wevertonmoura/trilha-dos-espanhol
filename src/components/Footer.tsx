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
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function Footer() {
  const [modalAberto, setModalAberto] = useState<'regulamento' | 'reembolso' | null>(null);

  const linkGrupoGeral = "https://chat.whatsapp.com/H5DWJOz0wcC2PntYSq1t8y"; 
  const linkInstagram = "https://www.instagram.com/vempara_trilha?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="; 
  const linkWhatsAppDireto = `https://wa.me/${81988227739}?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20trilha.`;

  // Permite que qualquer botão do site dispare este modal (Ouvinte global)
  useEffect(() => {
    const handleOpen = (event: any) => setModalAberto(event.detail);
    window.addEventListener('abrirModalJuridico', handleOpen);
    return () => window.removeEventListener('abrirModalJuridico', handleOpen);
  }, []);

  return (
    <footer className="bg-zinc-950 pt-12 pb-6 border-t border-zinc-900 relative overflow-hidden mt-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent blur-sm"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-4 border border-zinc-700">
              <span className="text-zinc-500 text-xs">LOGO</span>
            </div>
            
            <h3 className="text-emerald-500 font-black text-xl mb-2 uppercase">Vem Para Trilha</h3>
            <div className="text-zinc-400 text-sm space-y-2 mt-2">
              <p className="flex items-center justify-center md:justify-start gap-2">
                <MapPin size={16} className="text-emerald-600"/> Aldeia Chã da Peroba
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <Clock size={16} className="text-emerald-600"/> 07:00 da manhã
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-bold uppercase tracking-widest mb-4 text-sm">Contato</h4>
            <div className="space-y-4 text-zinc-400 text-sm">
              <a href={linkWhatsAppDireto} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                <WhatsappLogo className="w-4 h-4 text-emerald-500" /> (81) 98822-7739
              </a>
              <a href="mailto:bldweverton@gmail.com" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                <Mail size={18} /> bldweverton@gmail.com
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end w-full">
            <div className="w-full max-w-sm bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group">
              <h4 className="text-white font-black uppercase tracking-widest mb-4 flex items-center justify-center gap-2 text-sm">
                Faça parte da família <Users size={16} className="text-emerald-500"/>
              </h4>
              <div className="flex flex-col gap-3">
                <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} href={linkGrupoGeral} target="_blank" className="w-full bg-emerald-600 text-white font-black py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest">
                  <WhatsappLogo className="w-4 h-4" /> Entrar no Grupo
                </motion.a>
                <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} href={linkInstagram} target="_blank" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest">
                  <InstagramLogo className="w-4 h-4" /> Siga no Insta
                </motion.a>
              </div>
            </div>
          </div>

        </div>

        {/* Base do Rodapé COM OS BOTÕES QUE ABREM O MODAL */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-zinc-900/80 pt-6">
          <div className="flex flex-col items-center md:items-start gap-3">
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
              © 2026 Vem Para Trilha. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setModalAberto('regulamento')}
                className="text-zinc-500 hover:text-emerald-400 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Regulamento
              </button>
              <button 
                onClick={() => setModalAberto('reembolso')}
                className="text-zinc-500 hover:text-emerald-400 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Política de Reembolso
              </button>
            </div>
          </div>

          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="py-2 px-6 rounded-full bg-zinc-900/50 border border-zinc-800 text-emerald-500 font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-800 hover:text-white flex items-center gap-2 transition-colors">
            Voltar ao Topo <ArrowRight className="-rotate-90 w-3 h-3" />
          </button>
        </div>

      </div>

      {/* A TELINHA (MODAL) QUE SALTA NA TELA */}
      <AnimatePresence>
        {modalAberto && (
          <div 
            onClick={() => setModalAberto(null)} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              onClick={(e) => e.stopPropagation()} // Impede que clicar no texto feche a tela
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto relative text-left shadow-2xl"
            >
              <button 
                onClick={() => setModalAberto(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-emerald-500 font-black text-xl uppercase mb-4 border-b border-zinc-800 pb-3">
                {modalAberto === 'regulamento' ? 'Regulamento da Trilha' : 'Política de Reembolso'}
              </h3>

              <div className="text-zinc-300 text-sm space-y-4 leading-relaxed pr-2">
                {modalAberto === 'regulamento' ? (
                  <>
                    <p><strong>1. DO EVENTO</strong><br/>A trilha "Vem Para Trilha" será realizada em Aldeia Chã da Peroba, com saída rigorosamente às 07:00 da manhã.</p>
                    <p><strong>2. CONDIÇÕES DE PARTICIPAÇÃO</strong><br/>Ao se inscrever, o participante declara estar em plenas condições de saúde física e mental para realizar o percurso, isentando a organização de qualquer responsabilidade sobre eventuais intercorrências médicas.</p>
                    <p><strong>3. PRESERVAÇÃO AMBIENTAL</strong><br/>É estritamente proibido descartar qualquer tipo de lixo (embalagens de gel, garrafas, papéis) no percurso. O atleta que for flagrado sujando a trilha será banido dos próximos eventos.</p>
                    <p><strong>4. EQUIPAMENTO OBRIGATÓRIO</strong><br/>É obrigatório o porte de recipiente próprio para hidratação (mochila de hidratação, garrafa ou copo retrátil). Em prol da natureza, não distribuiremos copos plásticos descartáveis.</p>
                  </>
                ) : (
                  <>
                    <>
                    <p><strong>1. PRAZO DE DESISTÊNCIA E REEMBOLSO</strong><br/>O participante tem o prazo legal de até 7 (sete) dias após a compra para solicitar o cancelamento com reembolso integral, <strong>desde que a solicitação seja feita com no mínimo 7 dias de antecedência da data do evento</strong>. Por conta da confecção e compra antecipada de medalhas e itens estruturais por atleta, solicitações feitas na semana da prova não poderão ser reembolsadas.</p>
                    
                    <p><strong>2. TRANSFERÊNCIA DE TITULARIDADE (VAGA)</strong><br/>Caso o atleta não possa comparecer e tenha perdido o prazo de reembolso, ele poderá transferir sua vaga para outro amigo sem custo adicional. Basta notificar a organização pelo WhatsApp com até 24 horas de antecedência da saída.</p>
                    
                    <p><strong>3. ADIAMENTO POR FORÇA MAIOR</strong><br/>Em caso de chuvas severas ou alertas que coloquem a integridade física do grupo em risco, a organização poderá adiar a trilha. A inscrição de todos fica automaticamente garantida para a nova data oficial.</p>
                  </>
                  </>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-end">
                <button 
                  onClick={() => setModalAberto(null)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
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