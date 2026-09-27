import React, { useState } from 'react';
import { SALES_WEEK_DATA, SALES_MONTH_DATA } from '../../data/kdmpData';
import { ChartPoint } from '../../types/kdmp';

export const SalesChart: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const data = period === 'week' ? SALES_WEEK_DATA : SALES_MONTH_DATA;
  const maxVal = Math.max(...data.map((d) => d.amountJuta)) * 1.25;

  // Chart coordinates
  const svgWidth = 650;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingY = 30;

  const widthAvailable = svgWidth - paddingX * 2;
  const heightAvailable = svgHeight - paddingY * 2;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * widthAvailable;
    const y = svgHeight - paddingY - (d.amountJuta / maxVal) * heightAvailable;
    return { x, y, ...d };
  });

  // Generate cubic bezier path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const controlX = (current.x + next.x) / 2;
    pathD += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }

  // Area path closing
  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] p-5 shadow-xs h-full flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h6 className="text-sm font-bold text-gray-800">
            Grafik Penjualan ({period === 'week' ? '7 Hari Terakhir' : 'Bulan Ini'})
          </h6>
          <span className="text-[11px] text-gray-400">
            Tren omset dalam satuan Rupiah (Juta)
          </span>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'week' | 'month')}
          className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-gray-700 font-medium focus:outline-none focus:border-[#D32F2F]"
        >
          <option value="week">Minggu Ini</option>
          <option value="month">Bulan Ini</option>
        </select>
      </div>

      {/* SVG Line / Area Chart */}
      <div className="relative flex-1 flex items-center justify-center w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto max-h-[230px] overflow-visible"
        >
          <defs>
            {/* KDMP Red Gradient matching HTML */}
            <linearGradient id="kdmpSalesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D32F2F" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#D32F2F" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid horizontal lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = svgHeight - paddingY - ratio * heightAvailable;
            const val = (ratio * maxVal).toFixed(1);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#f0f0f0"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-gray-400 font-mono"
                >
                  Rp {val}jt
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#kdmpSalesGrad)" />

          {/* Smooth Line Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#D32F2F"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Point circles & X labels */}
          {points.map((p, idx) => (
            <g key={idx}>
              {/* X Axis Label */}
              <text
                x={p.x}
                y={svgHeight - 8}
                textAnchor="middle"
                className="text-[11px] fill-gray-500 font-semibold"
              >
                {p.day}
              </text>

              {/* Point Circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint?.day === p.day ? '6' : '4.5'}
                fill="#D32F2F"
                stroke="#ffffff"
                strokeWidth="2.5"
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => {
                  setHoveredPoint(p);
                  setHoverPos({ x: p.x, y: p.y });
                }}
                onMouseLeave={() => {
                  setHoveredPoint(null);
                  setHoverPos(null);
                }}
              />
            </g>
          ))}
        </svg>

        {/* Floating Tooltip matching HTML popup */}
        {hoveredPoint && hoverPos && (
          <div
            className="absolute z-20 bg-[#2B2B2B] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl pointer-events-none -translate-x-1/2 -translate-y-full mb-3"
            style={{
              left: `${(hoverPos.x / svgWidth) * 100}%`,
              top: `${(hoverPos.y / svgHeight) * 100}%`,
            }}
          >
            <div>{hoveredPoint.day}</div>
            <div className="text-red-400 font-mono">
              Rp {hoveredPoint.amountJuta} Juta
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
