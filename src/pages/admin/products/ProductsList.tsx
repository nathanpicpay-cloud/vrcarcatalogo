import { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Product } from '../../types';

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Produtos</h1>
          <p className="text-gray-400">Gerencie o catálogo de produtos e seus detalhes.</p>
        </div>
        <button className="bg-[#C00000] hover:bg-red-700 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-[#C00000]/20">
          <Plus size={18} /> Novo Produto
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        {/* Toolbar */}
        <div className="p-6 border-b border-white/10 flex gap-4 bg-black/20">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome ou código..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 pl-12 rounded-full focus:outline-none focus:border-[#C00000]/50 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-zinc-500 uppercase tracking-widest bg-black/40 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Código</th>
                <th className="px-6 py-4 font-medium">Produto</th>
                <th className="px-6 py-4 font-medium">Preço</th>
                <th className="px-6 py-4 font-medium">Estoque</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Carregando produtos...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-300">{product.code}</td>
                    <td className="px-6 py-4 font-bold text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-[#C00000]">
                          <Package size={16} />
                        </div>
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-medium">
                      R$ {product.price?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.stock <= (product.min_stock || 0) 
                        ? 'bg-orange-500/10 text-orange-500' 
                        : 'bg-green-500/10 text-green-500'
                      }`}>
                        {product.stock} un
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.active ? (
                        <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">Ativo</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-500 text-xs font-medium">Inativo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-white p-2 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-red-500 p-2 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
