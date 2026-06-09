import { Package, Users, DollarSign, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Orçamentos (Hoje)', value: '12', subtitle: '+2 vs ontem', isPositive: true },
          { title: 'Valor em Estoque', value: 'R$ 1.2M', subtitle: '1,402 itens catalogados', border: 'border-l-4 border-l-[#C00000]' },
          { title: 'Produtos em Baixa', value: '8', subtitle: 'Abaixo do estoque mínimo', isAlert: true },
        ].map((stat, i) => (
          <div key={i} className={`bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 shadow-xl ${stat.border || ''}`}>
            <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1">{stat.title}</div>
            <div className={`text-3xl font-bold text-white`}>{stat.value}</div>
            <div className={`mt-2 text-[10px] font-bold tracking-tight ${stat.isPositive ? 'text-green-400' : stat.isAlert ? 'text-[#C00000]' : 'text-zinc-400'}`}>
              {stat.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">
        <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold tracking-tight text-white">Produtos em Destaque</h2>
            <button className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest transition-all text-white">Ver Tudo</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            {[
              { type: 'PNEU', name: 'Pneu Pirelli Scorpion 255/55', price: 'R$ 1.849,90' },
              { type: 'LED', name: 'Kit LED H7 Ultra Premium', price: 'R$ 450,00' },
              { type: 'MULT', name: "Central Multimídia 10' 4K", price: 'R$ 2.190,00' },
            ].map((p, i) => (
              <div key={i} className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center">
                <div className="w-full h-32 bg-zinc-800 rounded-xl mb-3 flex items-center justify-center overflow-hidden border border-white/5">
                  <span className="text-zinc-600 font-black italic text-4xl">{p.type}</span>
                </div>
                <span className="text-xs font-bold text-white">{p.name}</span>
                <span className="text-[#C00000] text-sm font-black mt-1">{p.price}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-[#111111]/40 border border-white/10 rounded-3xl p-6 flex flex-col">
          <h2 className="text-xl font-bold tracking-tight mb-6 text-white">Ações Rápidas</h2>
          <div className="space-y-3">
            <button className="w-full bg-[#C00000] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#C00000]/20 hover:bg-red-700 transition-all text-sm">
              <span className="text-lg leading-none">➕</span> Novo Orçamento
            </button>
            <button className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-3 hover:bg-white/10 transition-all text-sm">
              <span className="text-lg leading-none">📦</span> Adicionar Produto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
