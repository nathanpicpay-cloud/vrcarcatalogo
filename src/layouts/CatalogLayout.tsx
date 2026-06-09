import { Outlet, Link } from 'react-router-dom';
import { Menu, Search, ShoppingCart, User } from 'lucide-react';

export default function CatalogLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a0000] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 h-20 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-300 hover:text-white">
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#C00000] rounded-lg flex items-center justify-center font-black text-xl italic shadow-[0_0_20px_rgba(192,0,0,0.4)]">VR</div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tighter leading-tight text-white">CAR</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest leading-none">ACESSÓRIOS</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Pesquisar por Código, Marca ou Aplicação..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 px-10 text-sm focus:outline-none focus:border-[#C00000]/50 transition-colors text-white"
              />
              <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors">
              <User size={20} />
            </button>
            <Link to="/carrinho" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white relative transition-colors">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-[#C00000] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_8px_rgba(192,0,0,0.6)]">
                0
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-white/10 px-8 flex items-center justify-between text-[10px] text-zinc-500 font-mono tracking-tighter bg-black/20">
        <div>VER: 1.0.4-PREMIUM-STABLE</div>
        <div className="flex items-center gap-4">
          <span className="text-[#C00000]">● SYSTEM STATUS: OPTIMAL</span>
          <span className="opacity-50 hidden sm:inline">DATABASE: SQLITE-LOCAL-ENCRYPTED</span>
        </div>
      </footer>
    </div>
  );
}
