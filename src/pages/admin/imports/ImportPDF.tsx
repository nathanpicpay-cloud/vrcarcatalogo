import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Play, Save } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

interface ExtractedProduct {
  code: string;
  name: string;
  price: number;
}

export default function ImportPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuthStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setExtractedData(null);
      setError(null);
      setSuccess(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/imports/pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Falha ao processar o PDF');
      }

      const data = await response.json();
      if (data.success && data.extractedData) {
        setExtractedData(data.extractedData);
      } else {
        setError(data.error || 'Erro desconhecido ao analisar dados');
      }
    } catch (err: any) {
      setError(err.message || 'Erro de rede');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!extractedData || extractedData.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      const response = await fetch('/api/imports/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ products: extractedData })
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar produtos');
      }

      const data = await response.json();
      if (data.success) {
        setSuccess(`${data.count} produtos importados com sucesso!`);
        setExtractedData(null);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao comunicar com servidor');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-mono tracking-tight text-white uppercase">Importação Local OCR (PDF)</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
          <Upload className="w-12 h-12 text-zinc-500 mb-4" />
          <h2 className="text-lg font-medium text-white mb-2">Anexar Catálogo PDF</h2>
          <p className="text-zinc-400 text-sm mb-6 max-w-sm">
            Faça upload do arquivo PDF do seu fornecedor. O sistema fará a extração (OCR/Texto) localmente para preparar os produtos.
          </p>
          
          <input 
            type="file" 
            accept="application/pdf"
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
            id="pdf-upload"
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-white text-black px-6 py-2 rounded font-medium hover:bg-zinc-200 transition-colors"
          >
            Selecionar Arquivo
          </button>

          {file && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-400 bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
              <FileText className="w-4 h-4" />
              <span className="truncate max-w-[200px]">{file.name}</span>
            </div>
          )}
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-lg p-6 flex flex-col">
          <h2 className="text-lg font-medium text-white mb-4">Ações de Processamento</h2>
          
          <div className="space-y-4 flex-1">
            <button
              onClick={handleProcess}
              disabled={!file || isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-[#C00000] text-white px-6 py-3 rounded font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing && !extractedData ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              {isProcessing && !extractedData ? 'Processando OCR/Texto...' : 'Iniciar Extração Local'}
            </button>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-3 text-red-400">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md flex items-start gap-3 text-green-400">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{success}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {extractedData && (
        <div className="bg-zinc-900 border border-white/10 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Dados Extraídos ({extractedData.length})</h2>
             <button
              onClick={handleSave}
              disabled={isProcessing}
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
               {isProcessing && <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
              <Save className="w-4 h-4" />
              Salvar no Catálogo
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-black/50">
                <tr>
                  <th className="px-6 py-3 font-medium">Código</th>
                  <th className="px-6 py-3 font-medium">Nome do Produto</th>
                  <th className="px-6 py-3 font-medium">Preço (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {extractedData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="px-6 py-3 font-mono text-zinc-300">{item.code || '-'}</td>
                    <td className="px-6 py-3 text-white">{item.name || '-'}</td>
                    <td className="px-6 py-3 text-emerald-400">{item.price ? `R$ ${item.price.toFixed(2)}` : 'R$ 0.00'}</td>
                  </tr>
                ))}
                {extractedData.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
                      Nenhum produto detectado. Verifique o formato do PDF.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
