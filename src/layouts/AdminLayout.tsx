import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Package, Settings, LogOut, LayoutDashboard, FileText } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111]/80 border-r border-white/10 backdrop-blur-xl flex flex-col fixed h-full z-10">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#C00000] rounded-lg flex items-center justify-center font-black text-xl italic shadow-[0_0_20px_rgba(192,0,0,0.4)]">VR</div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tighter leading-tight">CAR</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest leading-none">ACESSÓRIOS</span>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 space-y-1">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-r-md bg-[#C00000]/10 border-l-4 border-[#C00000] text-white transition-colors">
            <LayoutDashboard size={20} className="opacity-80" /> <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white transition-colors">
            <Package size={20} className="opacity-60" /> <span className="text-sm font-medium">Produtos</span>
          </Link>
          <Link to="/admin/budgets" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white transition-colors">
            <FileText size={20} className="opacity-60" /> <span className="text-sm font-medium">Orçamentos</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white transition-colors mt-auto">
            <Settings size={20} className="opacity-60" /> <span className="text-sm font-medium">Configurações</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center justify-start gap-3 w-full px-4 py-3 text-zinc-400 hover:text-red-400 transition-colors">
            <LogOut size={20} className="opacity-60" /> <span className="text-sm font-medium">Sair</span>
          </button>
        </nav>

        <div className="p-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-[10px] uppercase text-zinc-500 mb-2">Admin Status</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div>
              <span className="text-xs font-mono">{user?.username || 'admin'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a0000]">
        <header className="h-20 border-b border-white/10 flex flex-shrink-0 items-center justify-between px-8 backdrop-blur-md bg-black/20">
          <div className="flex-1 max-w-md">
            <div className="text-lg font-bold tracking-tight">VR Admin <span className="text-[10px] text-[#C00000] uppercase tracking-widest ml-2">Full Control</span></div>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-10 w-[1px] bg-white/10"></div>
            <div className="text-right">
              <div className="text-sm font-bold">{user?.username}</div>
              <div className="text-[10px] text-[#C00000] uppercase font-bold tracking-widest">Admin</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg text-[#C00000] font-black">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 flex flex-col h-full">
          <Outlet />
        </main>

        <footer className="h-12 border-t border-white/10 px-8 flex flex-shrink-0 items-center justify-between text-xs text-zinc-500 bg-black/20 z-10">
          <div>VR Car Acessórios &copy; 2026</div>
          <div className="flex items-center gap-4">
            Painel Administrativo
          </div>
        </footer>
      </div>
    </div>
  );
}
