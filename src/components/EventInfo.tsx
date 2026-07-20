import { Calendar, MapPin, Trophy, Clock, Mountain, Droplets, Info, Trash2, ShieldCheck, Waves, Maximize2, Ticket, VolumeX, QrCode, Coffee, Footprints, Sun, Compass, Sparkles, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const InfoRow = ({ icon, title, text, badge }: any) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-sky-400 hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden">
    <div className="text-sky-600 mt-0.5 p-3 bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl border border-sky-200/60 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-inner">{icon}</div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-0.5">
        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{title}</h4>
        {badge && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">{badge}</span>}
      </div>
      <p className="text-slate-900 font-black text-lg md:text-xl leading-tight">{text}</p>
    </div>
  </div>
);

const CheckItem = ({ text, icon, tag }: any) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-sky-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
    <div className="flex items-center gap-3.5">
      <span className="text-sky-600 shrink-0 p-2.5 bg-sky-50 rounded-xl group-hover:bg-sky-600 group-hover:text-white transition-all shadow-sm border border-sky-100">{icon}</span>
      <span className="text-xs font-extrabold text-slate-700 group-hover:text-slate-950 transition-colors">{text}</span>
    </div>
    {tag && <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-wider shrink-0">{tag}</span>}
  </div>
);

interface EventInfoProps {
  images: string[];
  setSelectedImg: (img: string) => void;
}

export default function EventInfo({ images, setSelectedImg }: EventInfoProps) {
  return (
    // ATUALIZAÇÃO SÊNIOR: Reduzido de space-y-20 para space-y-8 (diminui os buracos brancos!)
    <div className="lg:col-span-2 space-y-8 md:space-y-10 text-slate-800 relative">
      
      {/* ENFEITE: Luzes de fundo oceânicas e solares */}
      <div className="absolute -top-10 -left-10 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/2 -right-10 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* =========================================================================
          1. DESCRIÇÃO DO EVENTO & GALERIA
         ========================================================================= */}
      <section className="relative bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-400 via-sky-600 to-amber-500" />
        
        <div className="absolute -bottom-10 -right-10 text-slate-100 pointer-events-none -z-0 transform rotate-12">
          <Compass size={240} />
        </div>

        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4 relative z-10">
          <h2 className="text-xl font-black uppercase italic text-slate-800 tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block animate-ping" />
            <span>Descrição do evento</span>
          </h2>
          <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-gradient-to-r from-sky-50 to-amber-50 text-slate-700 border border-slate-200 shadow-sm flex items-center gap-1">
            <Sparkles size={12} className="text-amber-500" /> Edição 2026
          </span>
        </div>
        
        <div className="space-y-4 text-slate-600 text-base leading-relaxed font-medium relative z-10">
          <p className="text-slate-900 font-black italic text-2xl md:text-3xl uppercase tracking-tight">
            Trilha dos <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-700 to-amber-600 drop-shadow-sm">Espanhóis</span>
          </p>
          <p>
            Uma experiência espetacular no litoral pernambucano. A equipe <span className="text-sky-600 font-black">Vem Para Trilha</span> convida você para uma manhã inesquecível unindo história colonial e natureza exuberante em <strong className="text-slate-900 font-bold">Suape, no Cabo de Santo Agostinho</strong>.
          </p>
          <div className="bg-gradient-to-r from-sky-50 via-slate-50 to-amber-50/50 p-4 rounded-2xl border border-slate-200/80 shadow-inner flex items-start gap-3">
            <span className="text-2xl mt-0.5">🌿</span>
            <p className="text-sm text-slate-600 leading-normal">
              <strong className="text-slate-900 font-bold uppercase block text-xs tracking-wider mb-0.5">O que esperar do trajeto:</strong>
              Caminharemos por trilhas cercadas de vegetação nativa, passando pelas imponentes ruínas coloniais e finalizando com o visual paradisíaco das falésias e do mar. Uma oportunidade perfeita para superar limites e recarregar as energias!
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span>📸 Explore o Cenário</span>
            </h2>
            <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">(Clique para ampliar)</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {images.map((img, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05, y: -4 }} 
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-md border-2 border-white bg-slate-100" 
                onClick={() => setSelectedImg(img)}
              >
                <img src={img} alt="Cenário da Trilha" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-950/80 via-sky-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 backdrop-blur-[1px]">
                  <Maximize2 className="text-white drop-shadow-lg mx-auto mb-1 transform scale-75 group-hover:scale-100 transition-transform" size={24} />
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest text-center">Ampliar</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SOBRE O EVENTO
         ========================================================================= */}
      <section className="relative bg-gradient-to-br from-white via-slate-50 to-sky-50/40 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
        
        <div className="absolute -bottom-6 -right-6 text-slate-200/60 pointer-events-none transform -rotate-12">
          <Footprints size={180} />
        </div>

        <div className="mb-5 border-b border-slate-200/80 pb-4 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase italic text-slate-800 tracking-wider flex items-center gap-2">
            <span className="text-sky-600">📌</span>
            <span>Sobre o evento</span>
          </h2>
          <span className="text-xs font-mono font-bold text-sky-700 bg-sky-100/80 px-3 py-1 rounded-lg border border-sky-200">#TRILHA2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          <InfoRow icon={<Calendar size={22} />} title="Data Oficial" text="16 de Agosto de 2026" badge="Domingo" />
          <InfoRow icon={<Clock size={22} />} title="Horário de Saída" text="06:30 às 11:30" badge="Manhã" />
          <a 
            href="https://www.google.com/maps/search/?api=1&query=Ruinas+do+Forte+Cabo+de+Santo+Agostinho" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block"
          >
            <InfoRow icon={<MapPin className="animate-bounce" size={22} />} title="Localização (Clique p/ GPS)" text="Cabo de Santo Agostinho, PE" badge="Abrir GPS" />
          </a>
          <InfoRow icon={<Footprints size={22} />} title="Nível do Percurso" text="10km • Ritmo Moderado" badge="Suape" />
        </div>

        <div className="mt-5 pt-5 border-t border-slate-200/80 relative z-10">
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent p-6 rounded-3xl border border-amber-300/80 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl shadow-md shrink-0">
                <Trophy size={28} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-widest bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">Lote Promocional</span>
                <p className="text-slate-900 font-black text-xl md:text-2xl tracking-tight mt-1">R$ 55 Individual <span className="text-slate-300 font-normal">|</span> R$ 100 Casadinha</p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-xs font-extrabold text-amber-900 bg-amber-200/60 px-3 py-1.5 rounded-xl border border-amber-300 shrink-0">
              ⚡ Vagas Limitadas
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. O QUE LEVAR?
         ========================================================================= */}
      <section className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden">
        
        <div className="absolute -top-10 -right-10 text-amber-100 pointer-events-none -z-0 animate-spin-slow">
          <Sun size={200} />
        </div>

        <div className="mb-5 border-b border-slate-100 pb-4 flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-xl font-black uppercase italic text-slate-800 tracking-wider flex items-center gap-2">
              <span>🎒 O que levar?</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Prepare sua mochila para aproveitar com conforto</p>
          </div>
          <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
            Check-list
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative z-10">
          <CheckItem icon={<Droplets size={20} />} text="Água  (1,5 a 2 litros)" tag="Essencial" />
          <CheckItem icon={<Sun size={20} />} text="Protetor solar e óculos" tag="UV" />
          <CheckItem icon={<Waves size={20} />} text="Roupa de banho para o mar" tag="Litoral" />
          <CheckItem icon={<Info size={20} />} text="Boné, viseira ou chapéu" tag="Conforto" />
          <CheckItem icon={<Mountain size={20} />} text="Tênis para trilha/pedras" tag="Segurança" />
          <CheckItem icon={<Trash2 size={20} />} text="Sacola para lixo pessoal" tag="Lixo Zero" />
        </div>
      </section>

      {/* =========================================================================
          4. INFORMAÇÕES IMPORTANTES
         ========================================================================= */}
      <section className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-2 border-sky-100">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-amber-500 to-sky-500" />
        
        <div className="absolute -bottom-10 -right-10 text-slate-100 pointer-events-none -z-0">
          <ShieldCheck size={260} />
        </div>

        <div className="mb-6 border-b border-slate-100 pb-4 flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-900 flex items-center gap-2.5">
              <span className="p-2 bg-amber-100 text-amber-700 rounded-xl border border-amber-200 shadow-sm"><AlertTriangle size={24}/></span>
              <span>Informações Importantes</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Regras para a boa convivência e segurança</p>
          </div>
          <span className="hidden sm:inline-block text-[10px] font-black uppercase px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200">
            ⚠️ Atenção
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4 relative z-10">
          
          <div className="bg-gradient-to-r from-red-50 via-red-50/80 to-amber-50/50 p-6 rounded-3xl border-2 border-red-200 flex gap-4 col-span-1 md:col-span-2 shadow-sm hover:shadow-md transition-all">
            <div className="p-3.5 bg-red-500 text-white rounded-2xl shrink-0 h-fit shadow-md">
              <ShieldCheck size={28}/>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-black text-red-950 uppercase text-sm tracking-widest">Acesso Restrito (Sem Penetra)</h4>
                <span className="bg-red-200 text-red-900 font-extrabold text-[9px] px-2 py-0.5 rounded uppercase">Rigoroso</span>
              </div>
              <p className="text-xs md:text-sm text-red-900/90 leading-relaxed font-semibold">
                A área do evento abrange trechos de <strong className="text-red-950 font-black underline decoration-red-400">propriedade privada e preservação</strong>. Somente participantes com pulseira e nome na lista poderão acompanhar o grupo.
              </p>
            </div>
          </div>

          <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200/80 shadow-sm flex gap-4 hover:bg-white hover:border-sky-300 hover:-translate-y-0.5 transition-all group">
            <div className="p-3 bg-sky-100 text-sky-700 rounded-xl shrink-0 h-fit group-hover:bg-sky-600 group-hover:text-white transition-colors shadow-sm"><Ticket size={24}/></div>
            <div>
              <h4 className="font-extrabold text-slate-900 uppercase text-xs mb-1 tracking-widest flex items-center justify-between">
                <span>Investimento</span>
                <span className="text-[9px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">PIX</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">R$ 55,00 (Individual) ou R$ 100,00 (Casadinha). Vagas estritamente limitadas.</p>
            </div>
          </div>

          <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200/80 shadow-sm flex gap-4 hover:bg-white hover:border-amber-300 hover:-translate-y-0.5 transition-all group">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-xl shrink-0 h-fit group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-sm"><VolumeX size={24}/></div>
            <div>
              <h4 className="font-extrabold text-slate-900 uppercase text-xs mb-1 tracking-widest flex items-center justify-between">
                <span>Som e Natureza</span>
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">Preservação</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">Não é permitido o uso de caixas de som no trajeto para preservar a fauna local.</p>
            </div>
          </div>

          <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200/80 shadow-sm flex gap-4 hover:bg-white hover:border-sky-300 hover:-translate-y-0.5 transition-all group">
            <div className="p-3 bg-sky-100 text-sky-700 rounded-xl shrink-0 h-fit group-hover:bg-sky-600 group-hover:text-white transition-colors shadow-sm"><QrCode size={24}/></div>
            <div>
              <h4 className="font-extrabold text-slate-900 uppercase text-xs mb-1 tracking-widest flex items-center justify-between">
                <span>Pagamento via PIX</span>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Automático</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">Confirmação automática e instantânea no site. Acréscimo de taxa de sistema de <strong className="text-sky-700 font-bold">R$ 1,00</strong>.</p>
            </div>
          </div>

          <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200/80 shadow-sm flex gap-4 hover:bg-white hover:border-amber-300 hover:-translate-y-0.5 transition-all group">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-xl shrink-0 h-fit group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-sm"><Coffee size={24}/></div>
            <div>
              <h4 className="font-extrabold text-slate-900 uppercase text-xs mb-1 tracking-widest flex items-center justify-between">
                <span>Café Coletivo</span>
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">Tradição</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">Pedimos com carinho que levem um item (fruta, bolo, suco) para o piquenique.</p>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-5 border-t border-slate-100 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-sm">
            <span>💡</span>
            <span><strong className="text-amber-950 font-extrabold uppercase tracking-wider">Dica de organização:</strong> Chegue com 20 minutos de antecedência no ponto de encontro para a entrega das pulseiras!</span>
          </div>
        </div>
      </section>

    </div>
  );
}