import { ArrowRight, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product } from '../../types';

export default function CatalogHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.slice(0, 12))) // show recent 12
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 w-full h-[400px] flex items-center px-8 lg:px-16 shadow-2xl backdrop-blur-md">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=2000&q=80" alt="VR Car" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block py-1 px-3 rounded-full bg-[#C00000]/20 text-[#C00000] font-bold text-[10px] uppercase tracking-widest mb-4 border border-[#C00000]/30 shadow-[0_0_10px_rgba(192,0,0,0.2)]">
            Nova Coleção 2026
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Acessórios Premium para Automóveis
          </h1>
          <p className="text-lg text-zinc-400 mb-8 max-w-xl font-medium">
            Tudo que você precisa para equipar sua loja. Peças originais, entrega rápida e garantia direto da fábrica.
          </p>
          <button className="bg-[#C00000] hover:bg-red-700 text-white font-bold px-8 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-[#C00000]/20 hover:scale-[1.02]">
            Ver Catálogo <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">Categorias</h2>
          <button className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest transition-all text-white">Ver Todas</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            'Som Automotivo', 'Iluminação', 'Segurança', 'Estética', 'Mecânica', 'Borracharia'
          ].map((cat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 text-center cursor-pointer hover:bg-white/10 transition-all group shadow-xl">
              <div className="w-12 h-12 mx-auto mb-4 bg-black/40 border border-white/10 text-[#C00000] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Tag size={20} />
              </div>
              <h3 className="font-bold text-xs text-white">{cat}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">Destaques</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
             <div className="col-span-full py-20 text-center text-zinc-500 font-medium">Carregando catálogo...</div>
          ) : products.length === 0 ? (
             <div className="col-span-full py-20 text-center text-zinc-500 font-medium">Nenhum produto em destaque no momento.</div>
          ) : products.map((item) => (
            <div key={item.id} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl overflow-hidden group shadow-xl flex flex-col">
              <div className="h-48 bg-black/40 relative m-2 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
                <span className="text-zinc-600 font-black italic text-4xl">{item.name.substring(0, 4)}</span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                 <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-bold">CÓDIGO: {item.code}</div>
                 <h3 className="font-bold text-sm text-white mb-2">{item.name}</h3>
                 <p className="text-xs text-zinc-400 mb-4 line-clamp-2 flex-1">{item.description || 'Produto de alta qualidade e durabilidade para seu veículo.'}</p>
                 <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-black text-[#C00000]">R$ {item.price?.toFixed(2) || 'Sob consulta'}</span>
                    <button className="w-10 h-10 rounded-full bg-[#C00000] hover:bg-red-700 flex items-center justify-center transition-colors shadow-lg shadow-[#C00000]/20 text-white">
                      <ArrowRight size={18} />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
