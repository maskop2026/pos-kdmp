import React, { useState } from 'react';
import { Newspaper, Calendar, ChevronRight, X } from 'lucide-react';
import { ARTICLES } from '../data/palopeData';
import { ArticleInfo } from '../types/palope';

export const LintasInfo: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleInfo | null>(null);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm mt-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-[#e60023] flex items-center justify-center">
            <Newspaper className="w-4 h-4" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Lintas Info & Berita Komunitas
          </h3>
        </div>
        <span className="text-xs font-semibold text-[#e60023] hover:underline cursor-pointer">
          Lihat Semua →
        </span>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ARTICLES.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedArticle(item)}
            className="group rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="h-44 overflow-hidden bg-gray-100 relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 bg-red-50 text-[#e60023] font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow-xs">
                {item.category}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#e60023] transition-colors line-clamp-2 leading-snug mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                  {item.snippet}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-50">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {item.date}
                </span>
                <span className="text-[#e60023] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Baca <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="relative h-48 bg-gray-100">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span className="font-bold text-[#e60023] bg-red-50 px-2 py-0.5 rounded">
                  {selectedArticle.category}
                </span>
                <span>·</span>
                <span>{selectedArticle.date}</span>
              </div>
              <h3 className="text-base font-extrabold text-gray-900 mb-3 leading-snug">
                {selectedArticle.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {selectedArticle.fullContent || selectedArticle.snippet}
              </p>
              <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
