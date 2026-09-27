import React, { useState } from 'react';
import { X, Box, CheckCircle } from 'lucide-react';

interface AddProductModalProps {
  onClose: () => void;
  onSuccess: (productName: string) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Minuman');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('50');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSuccess(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#D32F2F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5" />
            <h3 className="text-sm font-bold">Tambah Produk Baru</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Nama Produk
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Kopi Susu Aren"
              className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D32F2F]"
              >
                <option>Minuman</option>
                <option>Makanan</option>
                <option>Sembako</option>
                <option>Snack / UMKM</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Stok Awal
              </label>
              <input
                type="number"
                min="1"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D32F2F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Harga Jual (Rp)
            </label>
            <input
              type="number"
              min="500"
              step="500"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="15000"
              className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-1.5 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Simpan ke Master Data</span>
          </button>
        </form>
      </div>
    </div>
  );
};
