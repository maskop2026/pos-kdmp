import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_BANNERS } from '../data/palopeData';

interface BannerSliderProps {
  onSelectCategory?: (category: string) => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({ onSelectCategory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_BANNERS.length);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-sm mt-5 group">
      {/* Images */}
      <div className="relative h-44 sm:h-56 md:h-64 lg:h-72 w-full overflow-hidden bg-gray-200">
        {HERO_BANNERS.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex flex-col justify-center px-6 sm:px-12 text-white">
              <span className="inline-block bg-[#e60023] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 w-max">
                Promo Spesial
              </span>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold max-w-md drop-shadow">
                {banner.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-200 mt-1 max-w-sm drop-shadow hidden sm:block">
                {banner.subtitle}
              </p>
              {onSelectCategory && (
                <button
                  type="button"
                  onClick={() => onSelectCategory(banner.category)}
                  className="mt-3 px-4 py-1.5 rounded-full bg-white text-[#cc001f] hover:bg-red-50 text-xs font-bold w-max shadow transition-transform active:scale-95"
                >
                  {banner.ctaText} →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Control buttons */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#cc001f] shadow-md flex items-center justify-center transition-all opacity-90 hover:opacity-100"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#cc001f] shadow-md flex items-center justify-center transition-all opacity-90 hover:opacity-100"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {HERO_BANNERS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
