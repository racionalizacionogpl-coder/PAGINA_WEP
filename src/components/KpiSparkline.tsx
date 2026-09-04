import React from 'react';

export interface ChartPoint {
  xPercent: number;
  yPercent: number; // 0 is bottom, 100 is top
  dateLabel: string;
  diffLabel?: string;
  diffColor?: 'green' | 'red' | 'blue' | 'slate';
  isFilled?: boolean;
}

interface KpiSparklineProps {
  type: 'fase1' | 'inventario' | 'anexo3' | 'anexo4';
  strokeColor: string;
  fillColor: string;
  points: ChartPoint[];
  dates: string[];
  heightClass?: string;
  compact?: boolean;
}

export const KpiSparkline: React.FC<KpiSparklineProps> = ({
  strokeColor,
  fillColor,
  points,
  dates,
  heightClass,
  compact = false,
}) => {
  const width = 360;
  const height = 90;
  const padTop = 22;
  const padBottom = 16;
  const chartHeight = height - padTop - padBottom;

  // Convert points to SVG coordinates
  const coords = points.map((p) => {
    const x = (p.xPercent / 100) * (width - 24) + 12;
    const y = padTop + chartHeight - (p.yPercent / 100) * chartHeight;
    return { ...p, x, y };
  });

  // Generate smooth SVG path
  let pathD = '';
  if (coords.length === 2) {
    pathD = `M ${coords[0].x} ${coords[0].y} L ${coords[1].x} ${coords[1].y}`;
  } else if (coords.length > 2) {
    pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      pathD += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
  }

  // Area path (closed down to bottom)
  const lastX = coords[coords.length - 1]?.x || width;
  const firstX = coords[0]?.x || 0;
  const bottomY = padTop + chartHeight;
  const areaD = `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

  const getDiffColorClass = (color?: string) => {
    if (color === 'red') return 'fill-red-500 font-bold text-[11px]';
    if (color === 'green') return 'fill-emerald-600 font-semibold text-[11px]';
    if (color === 'blue') return 'fill-blue-600 font-medium text-[11px]';
    return 'fill-slate-700 font-medium text-[11px]';
  };

  return (
    <div className="w-full select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={`w-full ${heightClass || 'h-24'} overflow-visible`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`grad-${strokeColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Shaded Area */}
        <path
          d={areaD}
          fill={`url(#grad-${strokeColor.replace('#', '')})`}
        />

        {/* Main Line Stroke */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & Diff badges */}
        {coords.map((pt, idx) => (
          <g key={idx} className="group/pt cursor-pointer">
            {/* Diff label above point if present */}
            {pt.diffLabel && (
              <text
                x={pt.x}
                y={pt.y - 8}
                textAnchor="middle"
                className={`${getDiffColorClass(pt.diffColor)} font-poppins`}
              >
                {pt.diffLabel}
              </text>
            )}

            {/* Point circle */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={pt.isFilled ? 4.5 : 4}
              fill={pt.isFilled ? strokeColor : '#ffffff'}
              stroke={strokeColor}
              strokeWidth="2.5"
              className="transition-transform group-hover/pt:scale-125"
            />
          </g>
        ))}
      </svg>

      {/* X-axis date labels */}
      <div className={`flex justify-between items-center px-1 font-medium text-slate-400 ${compact ? 'text-[9px] mt-0.5' : 'text-[11px]'}`}>
        {dates.map((date, idx) => (
          <span key={idx} className="tracking-tight">
            {date}
          </span>
        ))}
      </div>
    </div>
  );
};
