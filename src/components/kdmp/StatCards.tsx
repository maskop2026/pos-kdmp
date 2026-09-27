import React from 'react';
import { TrendingUp, ShoppingCart, AlertTriangle, Wallet } from 'lucide-react';
import { DashboardStat } from '../../types/kdmp';

interface StatCardsProps {
  stats: DashboardStat[];
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      case 'ShoppingCart':
        return <ShoppingCart className="w-5 h-5" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5" />;
      case 'Wallet':
        return <Wallet className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getCardStyle = (variant: DashboardStat['variant']) => {
    switch (variant) {
      case 'blue':
        return {
          bg: 'bg-[#e3f2fd] border-[#bbdefb] border-l-4 border-l-[#2196f3]',
          textColor: 'text-[#0d47a1]',
          circleBg: 'bg-[#bbdefb] text-[#1565c0]',
        };
      case 'green':
        return {
          bg: 'bg-[#e8f5e9] border-[#c8e6c9] border-l-4 border-l-[#4caf50]',
          textColor: 'text-[#1b5e20]',
          circleBg: 'bg-[#c8e6c9] text-[#2e7d32]',
        };
      case 'orange':
        return {
          bg: 'bg-[#fff3e0] border-[#ffe0b2] border-l-4 border-l-[#ff9800]',
          textColor: 'text-[#e65100]',
          circleBg: 'bg-[#ffe0b2] text-[#ef6c00]',
        };
      case 'purple':
        return {
          bg: 'bg-[#f3e5f5] border-[#e1bee7] border-l-4 border-l-[#9c27b0]',
          textColor: 'text-[#4a148c]',
          circleBg: 'bg-[#e1bee7] text-[#7b1fa2]',
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const style = getCardStyle(stat.variant);
        return (
          <div
            key={stat.id}
            className={`p-4 rounded-xl border shadow-xs transition-transform hover:-translate-y-0.5 ${style.bg}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-black/60 font-medium mb-1">
                  {stat.title}
                </p>
                <h5 className={`text-lg font-extrabold tracking-tight ${style.textColor}`}>
                  {stat.value}
                </h5>
                {stat.subtext && (
                  <span className="text-[10px] text-black/50 block mt-0.5 font-medium">
                    {stat.subtext}
                  </span>
                )}
              </div>

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-xs ${style.circleBg}`}
              >
                {getIcon(stat.icon)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
