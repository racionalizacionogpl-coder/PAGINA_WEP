import React, { useState } from 'react';
import { KpiCard } from './KpiCard';
import { EditableText } from './EditableText';
import { Move, ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';

interface KpiCardsProps {
  onSelectKpi?: (kpiKey: string) => void;
}

interface KpiCardConfig {
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
  hasNavyRightCap?: boolean;
  dates: string[];
  points: any[];
}

const STORAGE_KEY_ORDER = 'quipucamayoc_kpi_cards_order_v2';

const DEFAULT_KPI_CONFIGS: KpiCardConfig[] = [
  {
    id: 'kpi-card-fase1',
    storageKeyPrefix: 'kpi1',
    defaultTitle: '% AVANCE FASE 1',
    defaultValue: '65,2%',
    defaultBadge: '▲ +0,0 pp vs R. 02/09 02:03 p.m.',
    defaultPercent: 65.2,
    strokeColor: '#1e293b',
    fillColor: '#cbd5e1',
    barColor: 'border-slate-800 bg-slate-800',
    bgColor: 'bg-slate-100',
    chartType: 'fase1',
    dates: ['02/09', '02/09'],
    points: [
      { xPercent: 0, yPercent: 65, dateLabel: '02/09', isFilled: false },
      { xPercent: 100, yPercent: 65, dateLabel: '02/09', diffLabel: '+0,0', diffColor: 'slate', isFilled: true },
    ],
  },
  {
    id: 'kpi-card-inventario',
    storageKeyPrefix: 'kpi2',
    defaultTitle: '% AVANCE DEL ANEXO 1 (INVENTARIO)',
    defaultValue: '68,0%',
    defaultBadge: '▲ +0,0 pp vs R. 02/09 12:39 p.m.',
    defaultPercent: 68.0,
    strokeColor: '#3b82f6',
    fillColor: '#93c5fd',
    barColor: 'border-blue-500 bg-blue-500',
    bgColor: 'bg-blue-50',
    chartType: 'inventario',
    dates: ['01/09', '01/09', '02/09', '02/09', '02/09'],
    points: [
      { xPercent: 0, yPercent: 82, dateLabel: '01/09', isFilled: false },
      { xPercent: 25, yPercent: 88, dateLabel: '01/09', diffLabel: '+1,0', diffColor: 'blue', isFilled: false },
      { xPercent: 50, yPercent: 88, dateLabel: '02/09', diffLabel: '+0,0', diffColor: 'blue', isFilled: false },
      { xPercent: 75, yPercent: 36, dateLabel: '02/09', diffLabel: '-18,0', diffColor: 'red', isFilled: false },
      { xPercent: 100, yPercent: 40, dateLabel: '02/09', diffLabel: '+0,0', diffColor: 'blue', isFilled: true },
    ],
  },
  {
    id: 'kpi-card-anexo3',
    storageKeyPrefix: 'kpi3',
    defaultTitle: '% AVANCE DEL ANEXO 3 (F. CARACT.)',
    defaultValue: '66,4%',
    defaultBadge: '▲ +0,0 pp vs R. 02/09 11:46 a.m.',
    defaultPercent: 66.4,
    strokeColor: '#10b981',
    fillColor: '#a7f3d0',
    barColor: 'border-emerald-500 bg-emerald-500',
    bgColor: 'bg-emerald-50',
    chartType: 'anexo3',
    dates: ['01/09', '01/09', '02/09', '02/09'],
    points: [
      { xPercent: 0, yPercent: 58, dateLabel: '01/09', isFilled: false },
      { xPercent: 33, yPercent: 62, dateLabel: '01/09', diffLabel: '+0,1', diffColor: 'green', isFilled: false },
      { xPercent: 66, yPercent: 66, dateLabel: '02/09', diffLabel: '+0,2', diffColor: 'green', isFilled: false },
      { xPercent: 100, yPercent: 66, dateLabel: '02/09', diffLabel: '+0,0', diffColor: 'green', isFilled: true },
    ],
  },
  {
    id: 'kpi-card-anexo4',
    storageKeyPrefix: 'kpi4',
    defaultTitle: '% AVANCE DE ANEXO 4 (INDICADORES)',
    defaultValue: '40,4%',
    defaultBadge: '▲ +0,4 pp vs R. 01/09 05:57 p.m.',
    defaultPercent: 40.4,
    strokeColor: '#8b5cf6',
    fillColor: '#c4b5fd',
    barColor: 'border-indigo-500 bg-indigo-500',
    bgColor: 'bg-indigo-50',
    hasNavyRightCap: true,
    chartType: 'anexo4',
    dates: ['01/09', '01/09'],
    points: [
      { xPercent: 0, yPercent: 40, dateLabel: '01/09', isFilled: false },
      { xPercent: 100, yPercent: 44, dateLabel: '01/09', diffLabel: '+0,4', diffColor: 'green', isFilled: true },
    ],
  },
];

export const KpiCards: React.FC<KpiCardsProps> = ({ onSelectKpi }) => {
  const [cardsOrder, setCardsOrder] = useState<KpiCardConfig[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ORDER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing kpi cards order', e);
      }
    }
    return DEFAULT_KPI_CONFIGS;
  });

  const [reorderMode, setReorderMode] = useState(false);

  const saveOrder = (newOrder: KpiCardConfig[]) => {
    setCardsOrder(newOrder);
    localStorage.setItem(STORAGE_KEY_ORDER, JSON.stringify(newOrder));
  };

  const handleMoveCard = (index: number, direction: 'prev' | 'next') => {
    const targetIdx = direction === 'prev' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= cardsOrder.length) return;
    const updated = [...cardsOrder];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    saveOrder(updated);
  };

  const handleResetOrder = () => {
    saveOrder(DEFAULT_KPI_CONFIGS);
  };

  return (
    <main id="kpi-dashboard-grid" className="px-4 sm:px-6 md:px-8 -mt-12 relative z-10 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Reordering Controls Bar */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              <EditableText
                storageKey="header_kpi_section"
                defaultText="Métricas Oficiales de Avance (Dashboard)"
                className="font-bold text-slate-600 hover:text-slate-900"
                showIconOnHover={true}
              />
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setReorderMode(!reorderMode)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                reorderMode
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-white'
              }`}
              title="Mover y reorganizar posición de las tarjetas de métricas"
            >
              <Move className="w-3.5 h-3.5" />
              <span>{reorderMode ? 'Listo / Guardar Orden' : 'Mover Tarjetas'}</span>
            </button>

            {reorderMode && (
              <button
                onClick={handleResetOrder}
                className="p-1.5 bg-white text-slate-400 hover:text-slate-700 rounded-full border border-slate-200 cursor-pointer"
                title="Restablecer orden inicial"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Responsive Grid with Reorderable KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cardsOrder.map((card, index) => {
            const isFirst = index === 0;
            const isLast = index === cardsOrder.length - 1;

            return (
              <div key={card.id} className="relative group">
                {/* Reorder Floating Controls */}
                {reorderMode && (
                  <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full border border-sky-300 shadow-md">
                    <span className="text-[10px] font-bold text-sky-800">
                      Posición {index + 1}
                    </span>
                    <button
                      onClick={() => handleMoveCard(index, 'prev')}
                      disabled={isFirst}
                      className="p-1 text-slate-600 hover:text-sky-700 disabled:opacity-20 cursor-pointer"
                      title="Mover antes"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveCard(index, 'next')}
                      disabled={isLast}
                      className="p-1 text-slate-600 hover:text-sky-700 disabled:opacity-20 cursor-pointer"
                      title="Mover después"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <KpiCard
                  id={card.id}
                  storageKeyPrefix={card.storageKeyPrefix}
                  defaultTitle={card.defaultTitle}
                  defaultValue={card.defaultValue}
                  defaultBadge={card.defaultBadge}
                  defaultPercent={card.defaultPercent}
                  strokeColor={card.strokeColor}
                  fillColor={card.fillColor}
                  barColor={card.barColor}
                  bgColor={card.bgColor}
                  chartType={card.chartType}
                  hasNavyRightCap={card.hasNavyRightCap}
                  dates={card.dates}
                  points={card.points}
                  onCardClick={() => onSelectKpi && onSelectKpi(card.chartType)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};
