import { Package, DollarSign } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Orçamentos (Hoje)', value: '12', subtitle: '+2 vs ontem', isPositive: true },
          { title: 'Produtos em Baixa', value: '8', subtitle: 'Abaixo do estoque mínimo', isAlert: true },
        ].map((stat, i) => (
          <div key={i} className={`bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 shadow-xl`}>
            <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1">{stat.title}</div>
            <div className={`text-3xl font-bold text-white`}>{stat.value}</div>
            <div className={`mt-2 text-[10px] font-bold tracking-tight ${stat.isPositive ? 'text-green-400' : stat.isAlert ? 'text-[#C00000]' : 'text-zinc-400'}`}>
              {stat.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#111111]/40 border border-white/10 rounded-3xl p-8 flex flex-col flex-1 items-center justify-center">
        <h2 className="text-2xl font-bold tracking-tight mb-10 text-white w-full text-center">Ações Operacionais Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <button className="h-64 w-full bg-[#C00000] text-white rounded-[2rem] font-bold flex flex-col items-center justify-center gap-6 shadow-[0_0_40px_rgba(192,0,0,0.3)] hover:scale-[1.02] transition-transform">
            <span className="text-6xl leading-none">➕</span>
            <span className="text-2xl tracking-tight">Novo Orçamento</span>
          </button>
          <button className="h-64 w-full bg-white/5 border border-white/10 text-white rounded-[2rem] font-medium flex flex-col items-center justify-center gap-6 hover:bg-white/10 hover:scale-[1.02] transition-transform">
            <span className="text-6xl leading-none">📦</span>
            <span className="text-2xl tracking-tight">Adicionar Produto</span>
          </button>
        </div>
      </div>
    </div>
  );
}
