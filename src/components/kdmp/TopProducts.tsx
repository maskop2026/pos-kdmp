import React from 'react';
import { INITIAL_TOP_PRODUCTS } from '../../data/kdmpData';

export const TopProducts: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] p-5 shadow-xs h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h6 className="text-sm font-bold text-gray-800">Produk Terlaris</h6>
        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
          Top 4 Outlet
        </span>
      </div>

      <div className="flex flex-col gap-3.5 flex-1 justify-center">
        {INITIAL_TOP_PRODUCTS.map((prod) => (
          <div key={prod.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              {/* Rank pill */}
              <div className="w-6 text-center">
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black ${
                    prod.rank === 1
                      ? 'bg-[#D32F2F] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {prod.rank}
                </span>
              </div>

              {/* Avatar thumbnail */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs shrink-0 shadow-xs"
                style={{ backgroundColor: prod.avatarBg, color: prod.avatarColor }}
              >
                {prod.name.slice(0, 2).toUpperCase()}
              </div>

              {/* Name & Sold Count */}
              <div>
                <p className="text-xs font-bold text-gray-800 group-hover:text-[#D32F2F] transition-colors leading-tight">
                  {prod.name}
                </p>
                <span className="text-[11px] text-gray-400 font-medium">
                  {prod.soldCount} Terjual
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold font-mono text-gray-700 block">
                Rp {(prod.revenue / 1000).toLocaleString('id-ID')}k
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
