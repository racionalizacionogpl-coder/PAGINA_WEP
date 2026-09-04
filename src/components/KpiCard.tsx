import React, { useState, useEffect } from 'react';
import { EditableText } from './EditableText';
import { parsePercentage } from '../utils/formatters';
import { KpiSparkline, ChartPoint } from './KpiSparkline';
import { Sparkles, Eye, EyeOff } from 'lucide-react';

interface KpiCardProps {
  id: string;
  storageKeyPrefix: string;
  defaultTitle: string;
  defaultValue: string;
  defaultBadge: string;
  defaultPercent: number;
  strokeColor: string;
  fillColor: string;
  barColor: string;
  bgColor: string;
  chartType: 'fase1' | 'inventario' | 'anexo3' | 'anexo4';
  points: ChartPoint[];
  dates: string[];
  borderClass?: string;
  hasNavyRightCap?: boolean;
  onCardClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  id,
  storageKeyPrefix,
  defaultTitle,
  defaultValue,
  defaultBadge,
  defaultPercent,
  strokeColor,
  fillColor,
  barColor,
  bgColor,
  chartType,
  points,
  dates,
  borderClass = '',
  hasNavyRightCap = false,
  onCardClick,
}) => {
  const [percent, setPercent] = useState<number>(defaultPercent);
  const [, setCurrentValueText] = useState<string>(defaultValue);
  const [isFloatingMode, setIsFloatingMode] = useState(() => {
    return localStorage.getItem(`kpi_card_floating_mode_${id}`) === 'true';
  });

  // Load saved percentage on mount if available
  useEffect(() => {
    const savedVal = localStorage.getItem('kpi_edit_corporativo_' + storageKeyPrefix + '_val');
    if (savedVal) {
      setCurrentValueText(savedVal);
      setPercent(parsePercentage(savedVal, defaultPercent));
    }
  }, [storageKeyPrefix, defaultPercent]);

  const handleValueChange = (newVal: string) => {
    setCurrentValueText(newVal);
    const parsed = parsePercentage(newVal, percent);
    setPercent(parsed);
  };

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newRatio = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    const rounded = Math.round(newRatio * 10) / 10;
    const formatted = `${rounded.toString().replace('.', ',')}%`;
    setPercent(rounded);
    setCurrentValueText(formatted);
    localStorage.setItem('kpi_edit_corporativo_' + storageKeyPrefix + '_val', formatted);

    const el = document.getElementById(`editable-${storageKeyPrefix}_val`);
    if (el) {
      el.innerText = formatted;
    }
  };

  const handleTransferTo3D = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem('quipucamayoc_floating_kpi_fase1_visible_v1', 'true');
    const kpiMap: Record<string, string> = {
      'kpi-card-fase1': 'fase1',
      'kpi-card-inventario': 'inventario',
      'kpi-card-anexo3': 'anexo3',
      'kpi-card-anexo4': 'anexo4',
    };
    if (kpiMap[id]) {
      localStorage.setItem('quipucamayoc_floating_kpi_active_kpi_v1', kpiMap[id]);
    }
    const heroEl = document.getElementById('quipucamayoc-portal-hero');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleFloating = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isFloatingMode;
    setIsFloatingMode(next);
    localStorage.setItem(`kpi_card_floating_mode_${id}`, String(next));
  };

  return (
    <div
      id={id}
      className={`relative group flex flex-col justify-between overflow-hidden cursor-pointer transition-all ${
        isFloatingMode
          ? 'bg-transparent border border-dashed border-sky-300/80 p-4 rounded-2xl shadow-none'
          : `kpi-card ${borderClass}`
      }`}
      onClick={onCardClick}
    >
      {/* Optional dark navy cap on the right edge (seen in Image 2 for Anexo 4) */}
      {hasNavyRightCap && !isFloatingMode && (
        <div
          className="absolute right-0 top-0 bottom-0 w-3 md:w-3.5 bg-[#10233f] rounded-r-[15px]"
          title="Monitoreo crítico Anexo 4"
        />
      )}

      <div>
        {/* Title and Action Buttons */}
        <div className="kpi-title flex items-center justify-between">
          <EditableText
            storageKey={`${storageKeyPrefix}_title`}
            defaultText={defaultTitle}
          />

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {/* Transfer to 3D Isometric Platform */}
            <button
              onClick={handleTransferTo3D}
              className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-md cursor-pointer transition-colors"
              title="Trasladar a la plataforma 3D flotante (ubicación de la imagen)"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            </button>

            {/* Toggle Sin fondo de ventana */}
            <button
              onClick={handleToggleFloating}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
              title={isFloatingMode ? 'Restaurar fondo de tarjeta' : 'Ver sin fondo de ventana (flotante)'}
            >
              {isFloatingMode ? <EyeOff className="w-3.5 h-3.5 text-sky-600" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Value and Badge */}
        <div className="kpi-value flex flex-wrap items-baseline gap-2.5 sm:gap-3">
          <span className="cursor-text tracking-tight">
            <EditableText
              storageKey={`${storageKeyPrefix}_val`}
              defaultText={defaultValue}
              onChange={handleValueChange}
              id={`editable-${storageKeyPrefix}_val`}
            />
          </span>
          <span className="badge-green cursor-text select-none text-[11px] sm:text-xs">
            <EditableText
              storageKey={`${storageKeyPrefix}_badge`}
              defaultText={defaultBadge}
              id={`editable-${storageKeyPrefix}_badge`}
            />
          </span>
        </div>
      </div>

      {/* Exact Trend / Area Sparkline Chart from Image 2 */}
      <div className="mt-4 mb-2">
        <KpiSparkline
          type={chartType}
          strokeColor={strokeColor}
          fillColor={fillColor}
          points={points}
          dates={dates}
        />
      </div>

      {/* Interactive Calibration Bar */}
      <div className="pt-2 border-t border-slate-100/80">
        <div
          className={`h-1.5 w-full ${bgColor} rounded-full relative cursor-pointer group-hover:h-2 transition-all`}
          onClick={handleBarClick}
          title="Haz clic para ajustar la calibración del porcentaje"
        >
          <div
            className={`absolute top-0 left-0 h-full ${barColor} rounded-full transition-all duration-300`}
            style={{ width: `${percent}%` }}
          />
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 border-2 ${barColor} bg-white rounded-full shadow-xs transition-all duration-300 group-hover:scale-125`}
            style={{ left: `${percent}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between items-center text-[10px] text-slate-400">
          <span>0%</span>
          <span className="text-slate-500 font-medium">Calibración actual: {percent}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};
