import { Clock, Check, MessageCircle, Loader2, Trash2, Edit2, AlertCircle, Search, Bus, Footprints } from 'lucide-react';

export default function AdminTabela({
  dadosFiltrados, editId, editData, setEditData, setEditId,
  salvarEdicao, aprovarPagamentoManual, aprovandoId,
  chamarNoWhatsApp, excluirParticipante, excluindoId
}: any) {
  
  if (dadosFiltrados.length === 0) {
    return (
      <div className="p-24 text-center flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 text-zinc-700">
          <Search size={24} />
        </div>
        <p className="text-zinc-500 font-black uppercase text-xs tracking-widest">Nenhum trilheiro encontrado na busca</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-zinc-950/50 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
          <tr>
            <th className="p-6 whitespace-nowrap">Participante & Doc</th>
            <th className="p-6 whitespace-nowrap">Contato</th>
            <th className="p-6 whitespace-nowrap text-center">Pacote</th>
            <th className="p-6 whitespace-nowrap text-right">Status & Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50 text-sm">
          {dadosFiltrados.map((p: any, i: number) => (
            <tr key={i} className="hover:bg-zinc-800/30 transition-all duration-300 group">
              <td className="p-6">
                {editId === p.id ? (
                  <div className="flex flex-col gap-2">
                    <input type="text" className="w-full bg-zinc-950 border border-emerald-500/50 rounded-lg px-3 py-2 text-white font-bold text-base outline-none focus:border-emerald-500" value={editData.nome} onChange={e => setEditData({...editData, nome: e.target.value})} />
                    <input type="text" className="w-full bg-zinc-950 border border-emerald-500/50 rounded-lg px-3 py-2 text-white font-mono text-xs outline-none focus:border-emerald-500" value={editData.cpf} onChange={e => setEditData({...editData, cpf: e.target.value})} />
                  </div>
                ) : (
                  <>
                    <div className="font-black text-white text-base tracking-tight mb-1 group-hover:text-emerald-400 transition-colors">{p.nome || 'N/A'}</div>
                    <div className="flex flex-col gap-2 items-start">
                      <span className="text-[10px] bg-zinc-950 text-zinc-500 px-2 py-1 rounded font-mono uppercase border border-zinc-800">
                        {p.cpf ? `CPF: ${p.cpf}` : 'CPF Pendente'}
                      </span>
                      {p.created_at && (
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1 font-bold uppercase tracking-widest mt-1">
                          <Clock size={12} className="text-emerald-500/50" />
                          {new Date(p.created_at).toLocaleDateString('pt-BR')} às {new Date(p.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </td>
              <td className="p-6">
                {editId === p.id ? (
                  <input type="text" className="w-full bg-zinc-950 border border-emerald-500/50 rounded-lg px-3 py-2 text-white font-bold outline-none focus:border-emerald-500" value={editData.telefone} onChange={e => setEditData({...editData, telefone: e.target.value})} />
                ) : (
                  <div className="font-bold text-zinc-300 mb-1">{p.telefone || 'N/A'}</div>
                )}
                <div className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block"></span> 
                  SOS: <span className="text-zinc-400">{p.contato_emergencia || 'N/A'}</span>
                </div>
              </td>
              
              {/* NOVA COLUNA: TIPO DE PACOTE */}
              <td className="p-6 text-center">
                {p.tipo_ingresso === 'sem_transporte' ? (
                  <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-500 shadow-sm">
                    <Footprints size={14} />
                    <span className="text-[10px] font-black tracking-widest uppercase mt-0.5">Sem Transporte</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/30 px-3 py-1.5 rounded-xl text-sky-400 shadow-sm">
                    <Bus size={14} />
                    <span className="text-[10px] font-black tracking-widest uppercase mt-0.5">Com Transporte</span>
                  </div>
                )}
              </td>

              <td className="p-6 text-right">
                <div className="flex items-center justify-end gap-3">
                  {!editId && (
                    p.pago ? (
                      <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                        <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase">Pago</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 rounded-full">
                        <AlertCircle size={12} className="text-yellow-500" />
                        <span className="text-[10px] font-black text-yellow-500 tracking-widest uppercase">Pendente</span>
                      </div>
                    )
                  )}

                  <div className="flex gap-2 ml-2">
                    {editId === p.id ? (
                      <>
                        <button onClick={salvarEdicao} className="bg-emerald-600 hover:bg-emerald-500 text-zinc-950 p-2.5 rounded-xl transition-colors shadow-lg flex items-center justify-center font-bold text-xs gap-1" title="Salvar Alterações">
                          <Check size={16} /> Salvar
                        </button>
                        <button onClick={() => setEditId(null)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 p-2.5 rounded-xl transition-colors border border-zinc-700 flex items-center justify-center" title="Cancelar">
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditData({...p}); setEditId(p.id); }} className="bg-zinc-800 hover:bg-blue-600 hover:text-white text-zinc-400 p-2 rounded-xl transition-colors border border-zinc-700 hover:border-blue-500 flex items-center justify-center" title="Editar Participante">
                          <Edit2 size={16} />
                        </button>

                        {!p.pago && (
                          <button onClick={() => aprovarPagamentoManual(p.id)} disabled={aprovandoId === p.id} className="bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-400 p-2 rounded-xl transition-colors border border-zinc-700 hover:border-emerald-500 flex items-center justify-center" title="Aprovar Pagamento Manualmente">
                            {aprovandoId === p.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                          </button>
                        )}
                        <button onClick={() => chamarNoWhatsApp(p.telefone, p.nome, p.pago)} className="bg-zinc-800 hover:bg-[#25D366] hover:text-white text-zinc-400 p-2 rounded-xl transition-colors border border-zinc-700 hover:border-[#25D366] flex items-center justify-center" title="Enviar WhatsApp">
                          <MessageCircle size={16} />
                        </button>
                        <button onClick={() => excluirParticipante(p.id, p.nome)} disabled={excluindoId === p.id} className="bg-zinc-800 hover:bg-red-600 hover:text-white text-zinc-400 p-2 rounded-xl transition-colors border border-zinc-700 hover:border-red-500 flex items-center justify-center" title="Excluir Participante">
                          {excluindoId === p.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}