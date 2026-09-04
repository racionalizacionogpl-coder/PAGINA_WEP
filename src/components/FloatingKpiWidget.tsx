import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EditableText } from './EditableText';
import { KpiSparkline, ChartPoint } from './KpiSparkline';
import {
  GripVertical,
  Move,
  Sparkles,
  X,
  ChevronDown,
  Minus,
  Plus,
  Sliders,
  TrendingUp,
  Percent,
  Copy,
  Trash2,
  Layers,
  Eye,
  EyeOff,
  RotateCcw,
} from 'lucide-react';

export interface FloatingKpiPosition {
  leftPercent: number;
  topPercent: number;
}

export type SizePreset = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface FloatingKpiItem {
  id: string;
  datasetKey: string;
  leftPercent: number;
  topPercent: number;
  textSize: SizePreset;
  chartSize: SizePreset;
  showValue?: boolean;
  showBadge?: boolean;
  showChart?: boolean;
}

interface FloatingKpiWidgetProps {
  containerRef: React.RefObject<HTMLDivElement>;
  isCustomizing?: boolean;
  onNavigateToDashboard?: () => void;
}

const STORAGE_KEY_ITEMS = 'quipucamayoc_floating_kpi_blocks_list_v3';
const STORAGE_KEY_POS = 'quipucamayoc_floating_kpi_fase1_pos_v2';
const STORAGE_KEY_VISIBLE = 'quipucamayoc_floating_kpi_fase1_visible_v1';
const STORAGE_KEY_SELECTED_KPI = 'quipucamayoc_floating_kpi_active_kpi_v1';
const STORAGE_KEY_TEXT_SIZE = 'quipucamayoc_floating_kpi_text_size_v2';
const STORAGE_KEY_CHART_SIZE = 'quipucamayoc_floating_kpi_chart_size_v2';

// Default position placed directly over the top-left isometric platform
export const DEFAULT_POSITION: FloatingKpiPosition = {
  leftPercent: 14,
  topPercent: 33,
};

const DEFAULT_ITEMS: FloatingKpiItem[] = [
  {
    id: 'kpi-cluster-primary',
    datasetKey: 'fase1',
    leftPercent: 14,
    topPercent: 33,
    textSize: 'sm',
    chartSize: 'sm',
    showValue: true,
    showBadge: true,
    showChart: true,
  },
];

interface KpiDataset {
  id: string;
  storageKeyPrefix: string;
  title: string;
  defaultValue: string;
  defaultBadge: string;
  strokeColor: string;
  fillColor: string;
  chartType: 'fase1' | 'inventario' | 'anexo3' | 'anexo4';
  dates: string[];
  points: ChartPoint[];
}

export const KPI_DATASETS: Record<string, KpiDataset> = {
  fase1: {
    id: 'kpi-card-fase1',
    storageKeyPrefix: 'kpi1',
    title: '% AVANCE FASE 1',
    defaultValue: '65,2%',
    defaultBadge: '▲ +0,0 pp vs R. 02/09 02:03 p.m.',
    strokeColor: '#0284c7',
    fillColor: '#93c5fd',
    chartType: 'fase1',
    dates: ['02/09', '02/09'],
    points: [
      { xPercent: 0, yPercent: 65, dateLabel: '02/09', isFilled: false },
      { xPercent: 100, yPercent: 65, dateLabel: '02/09', diffLabel: '+0,0', diffColor: 'slate', isFilled: true },
    ],
  },
  inventario: {
    id: 'kpi-card-inventario',
    storageKeyPrefix: 'kpi2',
    title: '% AVANCE DEL ANEXO 1',
    defaultValue: '68,0%',
    defaultBadge: '▲ +0,0 pp vs R. 02/09 12:39 p.m.',
    strokeColor: '#3b82f6',
    fillColor: '#93c5fd',
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
  anexo3: {
    id: 'kpi-card-anexo3',
    storageKeyPrefix: 'kpi3',
    title: '% AVANCE DEL ANEXO 3',
    defaultValue: '66,4%',
    defaultBadge: '▲ +0,0 pp vs R. 02/09 11:46 a.m.',
    strokeColor: '#10b981',
    fillColor: '#a7f3d0',
    chartType: 'anexo3',
    dates: ['01/09', '01/09', '02/09', '02/09'],
    points: [
      { xPercent: 0, yPercent: 58, dateLabel: '01/09', isFilled: false },
      { xPercent: 33, yPercent: 62, dateLabel: '01/09', diffLabel: '+0,1', diffColor: 'green', isFilled: false },
      { xPercent: 66, yPercent: 66, dateLabel: '02/09', diffLabel: '+0,2', diffColor: 'green', isFilled: false },
      { xPercent: 100, yPercent: 66, dateLabel: '02/09', diffLabel: '+0,0', diffColor: 'green', isFilled: true },
    ],
  },
  anexo4: {
    id: 'kpi-card-anexo4',
    storageKeyPrefix: 'kpi4',
    title: '% AVANCE DE ANEXO 4',
    defaultValue: '40,4%',
    defaultBadge: '▲ +0,4 pp vs R. 01/09 05:57 p.m.',
    strokeColor: '#8b5cf6',
    fillColor: '#c4b5fd',
    chartType: 'anexo4',
    dates: ['01/09', '01/09', '02/09', '02/09'],
    points: [
      { xPercent: 0, yPercent: 38, dateLabel: '01/09', isFilled: false },
      { xPercent: 33, yPercent: 40, dateLabel: '01/09', diffLabel: '+0,2', diffColor: 'blue', isFilled: false },
      { xPercent: 66, yPercent: 40, dateLabel: '02/09', diffLabel: '+0,0', diffColor: 'blue', isFilled: false },
      { xPercent: 100, yPercent: 40.4, dateLabel: '02/09', diffLabel: '+0,4', diffColor: 'blue', isFilled: true },
    ],
  },
};

const textClasses: Record<SizePreset, { val: string; badge: string }> = {
  xs: {
    val: 'text-xl sm:text-2xl',
    badge: 'text-[9px] px-1.5 py-0.2 font-medium',
  },
  sm: {
    val: 'text-2xl sm:text-3xl',
    badge: 'text-[10px] sm:text-[11px] px-2 py-0.5 font-bold',
  },
  md: {
    val: 'text-3xl sm:text-4xl',
    badge: 'text-xs px-2.5 py-0.5 font-bold',
  },
  lg: {
    val: 'text-4xl sm:text-5xl',
    badge: 'text-xs sm:text-sm px-3 py-1 font-bold',
  },
  xl: {
    val: 'text-5xl sm:text-6xl',
    badge: 'text-sm sm:text-base px-3.5 py-1 font-extrabold',
  },
  '2xl': {
    val: 'text-6xl sm:text-7xl lg:text-8xl',
    badge: 'text-base sm:text-lg px-4 py-1.5 font-black',
  },
};

const chartClasses: Record<SizePreset, { heightClass: string; containerWidth: string }> = {
  xs: {
    heightClass: 'h-10',
    containerWidth: 'w-[170px] sm:w-[190px]',
  },
  sm: {
    heightClass: 'h-14',
    containerWidth: 'w-[210px] sm:w-[230px]',
  },
  md: {
    heightClass: 'h-18',
    containerWidth: 'w-[260px] sm:w-[280px]',
  },
  lg: {
    heightClass: 'h-24',
    containerWidth: 'w-[310px] sm:w-[330px]',
  },
  xl: {
    heightClass: 'h-28',
    containerWidth: 'w-[360px] sm:w-[420px]',
  },
  '2xl': {
    heightClass: 'h-36',
    containerWidth: 'w-[440px] sm:w-[520px]',
  },
};

const sizeOrder: SizePreset[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

export const FloatingKpiWidget: React.FC<FloatingKpiWidgetProps> = ({
  containerRef,
  isCustomizing = false,
  onNavigateToDashboard,
}) => {
  const [items, setItems] = useState<FloatingKpiItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => ({
            ...item,
            textSize: sizeOrder.includes(item.textSize) ? item.textSize : 'sm',
            chartSize: sizeOrder.includes(item.chartSize) ? item.chartSize : 'sm',
            showValue: item.showValue !== false,
            showBadge: item.showBadge !== false,
            showChart: item.showChart !== false,
          }));
        }
      }

      // Check legacy single pos and settings
      const legacyPos = localStorage.getItem(STORAGE_KEY_POS);
      let initPos = DEFAULT_POSITION;
      if (legacyPos) {
        try {
          const p = JSON.parse(legacyPos);
          if (typeof p.leftPercent === 'number' && typeof p.topPercent === 'number') {
            initPos = p;
          }
        } catch {}
      }
      const legacyKpi = localStorage.getItem(STORAGE_KEY_SELECTED_KPI) || 'fase1';
      const legacyText = (localStorage.getItem(STORAGE_KEY_TEXT_SIZE) as SizePreset) || 'sm';
      const legacyChart = (localStorage.getItem(STORAGE_KEY_CHART_SIZE) as SizePreset) || 'sm';

      return [
        {
          id: 'kpi-cluster-primary',
          datasetKey: KPI_DATASETS[legacyKpi] ? legacyKpi : 'fase1',
          leftPercent: initPos.leftPercent,
          topPercent: initPos.topPercent,
          textSize: sizeOrder.includes(legacyText) ? legacyText : 'sm',
          chartSize: sizeOrder.includes(legacyChart) ? legacyChart : 'sm',
          showValue: true,
          showBadge: true,
          showChart: true,
        },
      ];
    } catch (e) {
      console.error('Error loading floating kpi items', e);
      return DEFAULT_ITEMS;
    }
  });

  const [visible, setVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_VISIBLE);
    return saved !== null ? saved === 'true' : true;
  });

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [openSizeMenuId, setOpenSizeMenuId] = useState<string | null>(null);
  const [openKpiMenuId, setOpenKpiMenuId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [newlyDuplicatedId, setNewlyDuplicatedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const dragStartRef = useRef<{
    id: string;
    clientX: number;
    clientY: number;
    initLeft: number;
    initTop: number;
  }>({
    id: '',
    clientX: 0,
    clientY: 0,
    initLeft: 0,
    initTop: 0,
  });

  const saveItems = useCallback((newItems: FloatingKpiItem[]) => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(newItems));
    if (newItems.length > 0) {
      localStorage.setItem(
        STORAGE_KEY_POS,
        JSON.stringify({
          leftPercent: newItems[0].leftPercent,
          topPercent: newItems[0].topPercent,
        })
      );
    }
  }, []);

  // Listen to external triggers (e.g. hero toolbar or reset buttons)
  useEffect(() => {
    const handleExternalDuplicate = () => {
      setVisible(true);
      localStorage.setItem(STORAGE_KEY_VISIBLE, 'true');
      setItems((prev) => {
        const source = prev[prev.length - 1] || DEFAULT_ITEMS[0];
        const newId = `kpi-cluster-${Date.now()}`;
        const offsetIndex = (prev.length % 5) + 1;
        let newLeft = source.leftPercent + 14;
        let newTop = source.topPercent + 8;

        if (newLeft > 78) newLeft = 12 + offsetIndex * 6;
        if (newTop > 75) newTop = 16 + offsetIndex * 5;

        newLeft = Math.max(2, Math.min(80, newLeft));
        newTop = Math.max(2, Math.min(80, newTop));

        // Copy source custom texts in localStorage
        const sourceDataset = KPI_DATASETS[source.datasetKey] || KPI_DATASETS.fase1;
        const sourceValKey =
          source.id === 'kpi-cluster-primary'
            ? `${sourceDataset.storageKeyPrefix}_val`
            : `${source.id}_${sourceDataset.storageKeyPrefix}_val`;
        const existingVal = localStorage.getItem('kpi_edit_corporativo_' + sourceValKey);

        const sourceBadgeKey =
          source.id === 'kpi-cluster-primary'
            ? `${sourceDataset.storageKeyPrefix}_badge`
            : `${source.id}_${sourceDataset.storageKeyPrefix}_badge`;
        const existingBadge = localStorage.getItem('kpi_edit_corporativo_' + sourceBadgeKey);

        const targetValKey = `${newId}_${sourceDataset.storageKeyPrefix}_val`;
        const targetBadgeKey = `${newId}_${sourceDataset.storageKeyPrefix}_badge`;

        if (existingVal) {
          localStorage.setItem('kpi_edit_corporativo_' + targetValKey, existingVal);
        }
        if (existingBadge) {
          localStorage.setItem('kpi_edit_corporativo_' + targetBadgeKey, existingBadge);
        }

        const newItem: FloatingKpiItem = {
          id: newId,
          datasetKey: source.datasetKey,
          leftPercent: Math.round(newLeft * 10) / 10,
          topPercent: Math.round(newTop * 10) / 10,
          textSize: source.textSize,
          chartSize: source.chartSize,
          showValue: source.showValue !== false,
          showBadge: source.showBadge !== false,
          showChart: source.showChart !== false,
        };

        const updated = [...prev, newItem];
        saveItems(updated);
        setNewlyDuplicatedId(newId);
        setTimeout(() => setNewlyDuplicatedId(null), 2500);
        setToastMessage(`¡Bloque duplicado! (${updated.length} en la plataforma)`);
        setTimeout(() => setToastMessage(null), 3000);
        return updated;
      });
    };

    const handleExternalReset = () => {
      setVisible(true);
      localStorage.setItem(STORAGE_KEY_VISIBLE, 'true');
      setItems(DEFAULT_ITEMS);
      saveItems(DEFAULT_ITEMS);
      setToastMessage('Posición y bloques KPI restablecidos a la plataforma');
      setTimeout(() => setToastMessage(null), 3000);
    };

    const handleStorageChange = () => {
      const isVis = localStorage.getItem(STORAGE_KEY_VISIBLE);
      if (isVis !== null) setVisible(isVis === 'true');
    };

    window.addEventListener('quipucamayoc_duplicate_floating_kpi', handleExternalDuplicate);
    window.addEventListener('quipucamayoc_reset_floating_kpis', handleExternalReset);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('quipucamayoc_duplicate_floating_kpi', handleExternalDuplicate);
      window.removeEventListener('quipucamayoc_reset_floating_kpis', handleExternalReset);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [saveItems]);

  // Handle Dragging
  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent, itemId: string) => {
    e.stopPropagation();
    const target = items.find((it) => it.id === itemId);
    if (!target) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragStartRef.current = {
      id: itemId,
      clientX,
      clientY,
      initLeft: target.leftPercent,
      initTop: target.topPercent,
    };
    setDraggingId(itemId);
  };

  useEffect(() => {
    if (!draggingId) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStartRef.current.clientX;
      const deltaY = e.clientY - dragStartRef.current.clientY;

      const deltaLeftPercent = (deltaX / rect.width) * 100;
      const deltaTopPercent = (deltaY / rect.height) * 100;

      const newLeft = Math.max(0, Math.min(85, dragStartRef.current.initLeft + deltaLeftPercent));
      const newTop = Math.max(0, Math.min(85, dragStartRef.current.initTop + deltaTopPercent));

      setItems((prev) =>
        prev.map((it) =>
          it.id === draggingId
            ? {
                ...it,
                leftPercent: Math.round(newLeft * 10) / 10,
                topPercent: Math.round(newTop * 10) / 10,
              }
            : it
        )
      );
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = touch.clientX - dragStartRef.current.clientX;
      const deltaY = touch.clientY - dragStartRef.current.clientY;

      const deltaLeftPercent = (deltaX / rect.width) * 100;
      const deltaTopPercent = (deltaY / rect.height) * 100;

      const newLeft = Math.max(0, Math.min(85, dragStartRef.current.initLeft + deltaLeftPercent));
      const newTop = Math.max(0, Math.min(85, dragStartRef.current.initTop + deltaTopPercent));

      setItems((prev) =>
        prev.map((it) =>
          it.id === draggingId
            ? {
                ...it,
                leftPercent: Math.round(newLeft * 10) / 10,
                topPercent: Math.round(newTop * 10) / 10,
              }
            : it
        )
      );
    };

    const onEndDrag = () => {
      setDraggingId(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEndDrag);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onEndDrag);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEndDrag);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEndDrag);
    };
  }, [draggingId, containerRef]);

  // Persist items when dragging completes
  useEffect(() => {
    if (!draggingId && items.length > 0) {
      saveItems(items);
    }
  }, [draggingId, items, saveItems]);

  // Duplicate an individual block
  const handleDuplicateItem = (itemId: string) => {
    const source = items.find((it) => it.id === itemId);
    if (!source) return;

    const newId = `kpi-cluster-${Date.now()}`;
    const offsetIndex = (items.length % 5) + 1;
    let newLeft = source.leftPercent + 14;
    let newTop = source.topPercent + 8;

    if (newLeft > 78) newLeft = 12 + offsetIndex * 6;
    if (newTop > 75) newTop = 16 + offsetIndex * 5;

    newLeft = Math.max(2, Math.min(80, newLeft));
    newTop = Math.max(2, Math.min(80, newTop));

    // Copy source text into new keys
    const sourceDataset = KPI_DATASETS[source.datasetKey] || KPI_DATASETS.fase1;
    const sourceValKey =
      source.id === 'kpi-cluster-primary'
        ? `${sourceDataset.storageKeyPrefix}_val`
        : `${source.id}_${sourceDataset.storageKeyPrefix}_val`;
    const existingVal = localStorage.getItem('kpi_edit_corporativo_' + sourceValKey);

    const sourceBadgeKey =
      source.id === 'kpi-cluster-primary'
        ? `${sourceDataset.storageKeyPrefix}_badge`
        : `${source.id}_${sourceDataset.storageKeyPrefix}_badge`;
    const existingBadge = localStorage.getItem('kpi_edit_corporativo_' + sourceBadgeKey);

    const targetValKey = `${newId}_${sourceDataset.storageKeyPrefix}_val`;
    const targetBadgeKey = `${newId}_${sourceDataset.storageKeyPrefix}_badge`;

    if (existingVal) {
      localStorage.setItem('kpi_edit_corporativo_' + targetValKey, existingVal);
    }
    if (existingBadge) {
      localStorage.setItem('kpi_edit_corporativo_' + targetBadgeKey, existingBadge);
    }

    const newItem: FloatingKpiItem = {
      id: newId,
      datasetKey: source.datasetKey,
      leftPercent: Math.round(newLeft * 10) / 10,
      topPercent: Math.round(newTop * 10) / 10,
      textSize: source.textSize,
      chartSize: source.chartSize,
      showValue: source.showValue !== false,
      showBadge: source.showBadge !== false,
      showChart: source.showChart !== false,
    };

    const updated = [...items, newItem];
    setItems(updated);
    saveItems(updated);
    setNewlyDuplicatedId(newId);
    setTimeout(() => setNewlyDuplicatedId(null), 2500);

    setToastMessage(`¡Bloque KPI duplicado con éxito! (${updated.length} activos)`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Delete an individual block
  const handleDeleteItem = (itemId: string) => {
    if (items.length <= 1) {
      setVisible(false);
      localStorage.setItem(STORAGE_KEY_VISIBLE, 'false');
      setToastMessage('Bloque KPI ocultado. Puedes mostrarlo desde el botón superior.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    const updated = items.filter((it) => it.id !== itemId);
    setItems(updated);
    saveItems(updated);
    setToastMessage('Bloque KPI eliminado');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Field visibility and deletion methods
  const handleDeleteField = (itemId: string, field: 'showValue' | 'showBadge' | 'showChart') => {
    setItems((prev) => {
      const updated = prev.map((it) => {
        if (it.id !== itemId) return it;
        return {
          ...it,
          [field]: false,
        };
      });
      saveItems(updated);
      return updated;
    });
    const fieldName =
      field === 'showValue'
        ? 'Valor numérico'
        : field === 'showBadge'
        ? 'Badge de variación'
        : 'Gráfico de tendencia';
    setToastMessage(`Campo "${fieldName}" eliminado. Puedes restaurarlo desde la barra o menú Ajustes.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleField = (itemId: string, field: 'showValue' | 'showBadge' | 'showChart') => {
    setItems((prev) => {
      const updated = prev.map((it) => {
        if (it.id !== itemId) return it;
        const current = it[field] !== false;
        return {
          ...it,
          [field]: !current,
        };
      });
      saveItems(updated);
      return updated;
    });
  };

  const handleRestoreAllFields = (itemId: string) => {
    setItems((prev) => {
      const updated = prev.map((it) => {
        if (it.id !== itemId) return it;
        return {
          ...it,
          showValue: true,
          showBadge: true,
          showChart: true,
        };
      });
      saveItems(updated);
      return updated;
    });
    setToastMessage('Todos los campos han sido restaurados.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Reset position of a single block to platform
  const handleResetToPlatform = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => {
      const updated = prev.map((it) =>
        it.id === itemId
          ? { ...it, leftPercent: DEFAULT_POSITION.leftPercent, topPercent: DEFAULT_POSITION.topPercent }
          : it
      );
      saveItems(updated);
      return updated;
    });
    setToastMessage('Alineado a la plataforma');
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Dataset / Metric selector
  const handleSelectKpi = (itemId: string, key: string) => {
    setItems((prev) => {
      const updated = prev.map((it) => (it.id === itemId ? { ...it, datasetKey: key } : it));
      saveItems(updated);
      return updated;
    });
    setOpenKpiMenuId(null);
  };

  // Size adjustment helpers
  const handleSetTextSize = (itemId: string, size: SizePreset) => {
    setItems((prev) => {
      const updated = prev.map((it) => (it.id === itemId ? { ...it, textSize: size } : it));
      saveItems(updated);
      return updated;
    });
  };

  const handleSetChartSize = (itemId: string, size: SizePreset) => {
    setItems((prev) => {
      const updated = prev.map((it) => (it.id === itemId ? { ...it, chartSize: size } : it));
      saveItems(updated);
      return updated;
    });
  };

  const handleStepDown = (itemId: string) => {
    const item = items.find((it) => it.id === itemId);
    if (!item) return;
    const currentIdx = sizeOrder.indexOf(item.textSize);
    if (currentIdx > 0) {
      const next = sizeOrder[currentIdx - 1];
      handleSetTextSize(itemId, next);
      handleSetChartSize(itemId, next);
    }
  };

  const handleStepUp = (itemId: string) => {
    const item = items.find((it) => it.id === itemId);
    if (!item) return;
    const currentIdx = sizeOrder.indexOf(item.textSize);
    if (currentIdx < sizeOrder.length - 1) {
      const next = sizeOrder[currentIdx + 1];
      handleSetTextSize(itemId, next);
      handleSetChartSize(itemId, next);
    }
  };

  if (!visible || items.length === 0) return null;

  return (
    <>
      {items.map((item, index) => {
        const activeDataset = KPI_DATASETS[item.datasetKey] || KPI_DATASETS.fase1;
        const currentContainerWidth = chartClasses[item.chartSize].containerWidth;
        const isDraggingThis = draggingId === item.id;
        const isHoveredThis = hoveredId === item.id;
        const isNewlyDuplicated = newlyDuplicatedId === item.id;
        const showSizeMenu = openSizeMenuId === item.id;
        const showKpiMenu = openKpiMenuId === item.id;

        // Custom storage keys for independent text editing per block
        const valStorageKey =
          item.id === 'kpi-cluster-primary'
            ? `${activeDataset.storageKeyPrefix}_val`
            : `${item.id}_${activeDataset.storageKeyPrefix}_val`;

        const badgeStorageKey =
          item.id === 'kpi-cluster-primary'
            ? `${activeDataset.storageKeyPrefix}_badge`
            : `${item.id}_${activeDataset.storageKeyPrefix}_badge`;

        return (
          <div
            key={item.id}
            id={index === 0 ? 'floating-kpi-cluster-overlay' : `floating-kpi-cluster-overlay-${item.id}`}
            style={{
              left: `${item.leftPercent}%`,
              top: `${item.topPercent}%`,
            }}
            className={`absolute z-35 select-none transition-all pointer-events-auto ${
              isDraggingThis ? 'scale-105 z-50 opacity-95' : ''
            } ${isNewlyDuplicated ? 'ring-2 ring-sky-400/80 ring-offset-2 rounded-2xl animate-pulse' : ''}`}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => {
              if (hoveredId === item.id) setHoveredId(null);
              if (openSizeMenuId === item.id) setOpenSizeMenuId(null);
              if (openKpiMenuId === item.id) setOpenKpiMenuId(null);
            }}
          >
            {/* 
              TARGET ELEMENT:
              div#floating-kpi-cluster-overlay:nth-of-type(1) > div:nth-of-type(1)
              NO WINDOW BACKGROUND:
              Completely transparent background, zero card box, allowing the isometric platform
              and scene to show through seamlessly beneath the floating numbers and sparkline!
            */}
            <div
              className={`relative flex flex-col items-start ${currentContainerWidth} p-1.5 bg-transparent transition-all group`}
            >
              {/* Floating Controls Bar (Shows on Hover or in Customization Mode) */}
              <div
                className={`flex items-center gap-1 mb-1 px-2 py-1 rounded-full bg-white/95 backdrop-blur-md border border-sky-200/90 shadow-md text-xs transition-opacity duration-200 ${
                  isHoveredThis || isCustomizing || showSizeMenu || showKpiMenu
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Drag Handle to Move anywhere on the 3D scene ("se puede trasladar") */}
                <div
                  onMouseDown={(e) => handleStartDrag(e, item.id)}
                  onTouchStart={(e) => handleStartDrag(e, item.id)}
                  className="cursor-grab active:cursor-grabbing flex items-center gap-0.5 text-sky-800 font-semibold text-[10px] sm:text-[11px] hover:text-sky-950 transition-colors"
                  title="Haz clic y arrastra para mover este bloque por la plataforma"
                >
                  <GripVertical className="w-3 h-3 text-sky-600" />
                  <Move className="w-2.5 h-2.5 text-sky-500" />
                  <span>Mover</span>
                </div>

                <div className="h-2.5 w-px bg-slate-200" />

                {/* DUPLICATE BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicateItem(item.id);
                  }}
                  id={`btn-duplicate-kpi-block-${item.id}`}
                  className="flex items-center gap-1 px-2.5 py-0.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white rounded-full font-bold text-[10px] sm:text-[11px] shadow-xs cursor-pointer transition-all hover:scale-105"
                  title="Duplicar todo este bloque (crear una copia completa)"
                >
                  <Copy className="w-3 h-3" />
                  <span>Duplicar</span>
                </button>

                <div className="h-2.5 w-px bg-slate-200" />

                {/* Quick Size Reducer / Enlarger Buttons */}
                <div className="flex items-center gap-0.5 bg-slate-100/90 rounded-full px-1 py-0.5">
                  <button
                    onClick={() => handleStepDown(item.id)}
                    disabled={item.textSize === 'xs' && item.chartSize === 'xs'}
                    className="p-0.5 text-slate-600 hover:text-sky-700 hover:bg-white rounded-full cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Reducir tamaño (Hacer más pequeño)"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <span className="text-[9px] font-bold text-slate-700 uppercase px-1">
                    {item.textSize.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleStepUp(item.id)}
                    disabled={item.textSize === '2xl' && item.chartSize === '2xl'}
                    className="p-0.5 text-slate-600 hover:text-sky-700 hover:bg-white rounded-full cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Aumentar tamaño de los campos (hasta 2XL)"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* Detailed Size Controls & Fields Popover Toggle */}
                <div className="relative">
                  <button
                    onClick={() => setOpenSizeMenuId(showSizeMenu ? null : item.id)}
                    className={`p-1 rounded-full cursor-pointer transition-colors ${
                      showSizeMenu ? 'bg-sky-100 text-sky-700' : 'text-slate-500 hover:text-sky-700 hover:bg-slate-100'
                    }`}
                    title="Ajustar tamaño y campos visibles (eliminar o restaurar)"
                  >
                    <Sliders className="w-3 h-3" />
                  </button>

                  {showSizeMenu && (
                    <div
                      className="absolute top-full left-0 mt-1.5 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-sky-100 p-3.5 z-50 text-left text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="font-bold text-slate-800 pb-1.5 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-slate-900 font-extrabold">Ajustes del Bloque</span>
                        <span className="text-[10px] text-sky-700 font-semibold px-2 py-0.5 bg-sky-50 rounded-full border border-sky-200">
                          {item.textSize.toUpperCase()} · Personalizar
                        </span>
                      </div>

                      {/* 1. Control del tamaño del indicador numérico y variación */}
                      <div className="mt-2.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1.5">
                          <span className="flex items-center gap-1.5">
                            <Percent className="w-3 h-3 text-sky-600" />
                            <span>Tamaño de Números y Badge:</span>
                          </span>
                          <span className="text-[10px] font-bold text-sky-600 uppercase">{item.textSize}</span>
                        </div>
                        <div className="grid grid-cols-6 gap-1">
                          {sizeOrder.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => handleSetTextSize(item.id, sz)}
                              className={`py-1 px-0.5 text-[9px] font-bold rounded-lg border text-center cursor-pointer transition-all ${
                                item.textSize === sz
                                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                              title={`Tamaño ${sz.toUpperCase()}`}
                            >
                              {sz.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. Control del tamaño de la línea de tendencia (Sparkline) */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1.5">
                          <span className="flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3 text-sky-600" />
                            <span>Tamaño de Gráfica:</span>
                          </span>
                          <span className="text-[10px] font-bold text-sky-600 uppercase">{item.chartSize}</span>
                        </div>
                        <div className="grid grid-cols-6 gap-1">
                          {sizeOrder.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => handleSetChartSize(item.id, sz)}
                              className={`py-1 px-0.5 text-[9px] font-bold rounded-lg border text-center cursor-pointer transition-all ${
                                item.chartSize === sz
                                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                              title={`Tamaño de gráfico ${sz.toUpperCase()}`}
                            >
                              {sz.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick preset buttons */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1 text-[10px]">
                        <button
                          onClick={() => {
                            handleSetTextSize(item.id, 'xs');
                            handleSetChartSize(item.id, 'xs');
                          }}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                        >
                          Mínimo (XS)
                        </button>
                        <button
                          onClick={() => {
                            handleSetTextSize(item.id, 'sm');
                            handleSetChartSize(item.id, 'sm');
                          }}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                        >
                          Estándar (S)
                        </button>
                        <button
                          onClick={() => {
                            handleSetTextSize(item.id, 'lg');
                            handleSetChartSize(item.id, 'lg');
                          }}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                        >
                          Grande (L)
                        </button>
                        <button
                          onClick={() => {
                            handleSetTextSize(item.id, 'xl');
                            handleSetChartSize(item.id, 'xl');
                          }}
                          className="px-2 py-0.5 rounded-md bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold cursor-pointer"
                        >
                          Extra Grande (XL)
                        </button>
                        <button
                          onClick={() => {
                            handleSetTextSize(item.id, '2xl');
                            handleSetChartSize(item.id, '2xl');
                          }}
                          className="px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-800 font-extrabold cursor-pointer"
                        >
                          Gigante (2XL)
                        </button>
                      </div>

                      {/* 3. SECCIÓN: GESTIÓN Y ELIMINACIÓN DE CAMPOS INDIVIDUALES */}
                      <div className="mt-3 pt-2.5 border-t border-slate-200/80">
                        <div className="text-[11px] font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                          <span>Campos Visibles del Bloque:</span>
                          {(!item.showValue || !item.showBadge || !item.showChart) && (
                            <button
                              onClick={() => handleRestoreAllFields(item.id)}
                              className="text-[10px] text-sky-600 hover:text-sky-800 font-bold flex items-center gap-0.5 cursor-pointer"
                              title="Restaurar todos los campos eliminados"
                            >
                              <RotateCcw className="w-2.5 h-2.5" />
                              <span>Restaurar todos</span>
                            </button>
                          )}
                        </div>
                        <div className="space-y-1">
                          {/* Campo 1: Valor Porcentual */}
                          <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-50 border border-slate-200/70 text-[11px]">
                            <span className="font-medium text-slate-700 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                              <span>Valor Numérico ({activeDataset.defaultValue})</span>
                            </span>
                            <button
                              onClick={() => handleToggleField(item.id, 'showValue')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                item.showValue !== false
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}
                              title={item.showValue !== false ? 'Eliminar este campo' : 'Mostrar este campo'}
                            >
                              {item.showValue !== false ? (
                                <>
                                  <Trash2 className="w-2.5 h-2.5" />
                                  <span>Eliminar</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-2.5 h-2.5" />
                                  <span>Mostrar</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Campo 2: Badge de Variación */}
                          <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-50 border border-slate-200/70 text-[11px]">
                            <span className="font-medium text-slate-700 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Badge Variación</span>
                            </span>
                            <button
                              onClick={() => handleToggleField(item.id, 'showBadge')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                item.showBadge !== false
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}
                              title={item.showBadge !== false ? 'Eliminar este campo' : 'Mostrar este campo'}
                            >
                              {item.showBadge !== false ? (
                                <>
                                  <Trash2 className="w-2.5 h-2.5" />
                                  <span>Eliminar</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-2.5 h-2.5" />
                                  <span>Mostrar</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Campo 3: Gráfico de Tendencia */}
                          <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-50 border border-slate-200/70 text-[11px]">
                            <span className="font-medium text-slate-700 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              <span>Gráfica de Tendencia</span>
                            </span>
                            <button
                              onClick={() => handleToggleField(item.id, 'showChart')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                item.showChart !== false
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}
                              title={item.showChart !== false ? 'Eliminar este campo' : 'Mostrar este campo'}
                            >
                              {item.showChart !== false ? (
                                <>
                                  <Trash2 className="w-2.5 h-2.5" />
                                  <span>Eliminar</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-2.5 h-2.5" />
                                  <span>Mostrar</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct restore fields button if any is hidden */}
                {(!item.showValue || !item.showBadge || !item.showChart) && (
                  <>
                    <div className="h-2.5 w-px bg-slate-200" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreAllFields(item.id);
                      }}
                      className="flex items-center gap-1 px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-bold text-[9px] sm:text-[10px] shadow-xs cursor-pointer transition-all animate-pulse"
                      title="Hacer clic para restaurar todos los campos eliminados de este bloque"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Restaurar campos</span>
                    </button>
                  </>
                )}

                <div className="h-2.5 w-px bg-slate-200" />

                {/* Quick KPI Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setOpenKpiMenuId(showKpiMenu ? null : item.id)}
                    className="flex items-center gap-0.5 font-medium text-[10px] sm:text-[11px] text-slate-700 hover:text-slate-900 cursor-pointer"
                    title="Cambiar indicador o métrica de este bloque"
                  >
                    <span className="truncate max-w-[65px] sm:max-w-[75px] font-bold text-sky-700">
                      {activeDataset.title}
                    </span>
                    <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                  </button>

                  {showKpiMenu && (
                    <div className="absolute top-full left-0 mt-1.5 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200 p-1 z-50 text-left">
                      {Object.entries(KPI_DATASETS).map(([k, d]) => (
                        <button
                          key={k}
                          onClick={() => handleSelectKpi(item.id, k)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                            item.datasetKey === k
                              ? 'bg-sky-50 text-sky-700 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span>{d.title}</span>
                          <span className="text-[10px] text-slate-400">{d.defaultValue}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-2.5 w-px bg-slate-200" />

                {/* Reset position of this block to platform */}
                <button
                  onClick={(e) => handleResetToPlatform(item.id, e)}
                  className="p-0.5 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer transition-colors"
                  title="Alinear este bloque exactamente a la plataforma superior izquierda"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                </button>

                {/* Delete / Dismiss */}
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-0.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full cursor-pointer text-xs transition-colors"
                  title={items.length > 1 ? 'Eliminar este bloque duplicado' : 'Ocultar bloque'}
                >
                  {items.length > 1 ? <Trash2 className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                </button>
              </div>

              {/* If all fields were deleted in this block */}
              {!item.showValue && !item.showBadge && !item.showChart && (
                <div className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-dashed border-sky-300 shadow-sm text-xs text-slate-600 my-1">
                  <span>Campos eliminados</span>
                  <button
                    onClick={() => handleRestoreAllFields(item.id)}
                    className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-[10px] cursor-pointer shadow-xs transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Restaurar campos</span>
                  </button>
                </div>
              )}

              {/* 
                1. FLOATING VALUE & BADGE:
                Display typography with 3D text glow and shadow floating freely in isometric space.
                Dynamically resizable (xs, sm, md, lg, xl, 2xl) with direct hover delete buttons.
              */}
              {(item.showValue !== false || item.showBadge !== false) && (
                <div
                  onMouseDown={isCustomizing ? (e) => handleStartDrag(e, item.id) : undefined}
                  onTouchStart={isCustomizing ? (e) => handleStartDrag(e, item.id) : undefined}
                  className={`flex flex-wrap items-baseline gap-1.5 sm:gap-2 py-0.5 px-1 ${
                    isCustomizing ? 'cursor-grab active:cursor-grabbing' : ''
                  }`}
                >
                  {/* Main Floating Percentage Number (Smaller by default & resizable up to 2XL) */}
                  {item.showValue !== false && (
                    <div className="relative group/val flex items-baseline">
                      <span
                        id={`floating-${activeDataset.storageKeyPrefix}_val_${item.id}`}
                        className={`${textClasses[item.textSize].val} font-black font-poppins text-slate-900 tracking-tight cursor-text transition-all leading-none`}
                        style={{
                          textShadow: '0 2px 10px rgba(255, 255, 255, 0.95), 0 3px 16px rgba(2, 132, 199, 0.25)',
                        }}
                        title="Número flotante en tiempo real (editable)"
                      >
                        <EditableText
                          storageKey={valStorageKey}
                          defaultText={activeDataset.defaultValue}
                          className="font-black text-slate-900 drop-shadow-sm"
                          id={`editable-${activeDataset.storageKeyPrefix}_val_${item.id}`}
                        />
                      </span>

                      {/* Direct delete button for numeric value field */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteField(item.id, 'showValue');
                        }}
                        id={`btn-delete-val-${item.id}`}
                        className="opacity-0 group-hover/val:opacity-100 group-hover:opacity-75 transition-opacity p-0.5 ml-0.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full cursor-pointer"
                        title="Eliminar este campo (% Valor numérico)"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Floating Badge (Smaller by default & resizable up to 2XL) */}
                  {item.showBadge !== false && (
                    <div className="relative group/badge flex items-center">
                      <span
                        id={`floating-${activeDataset.storageKeyPrefix}_badge_${item.id}`}
                        className={`inline-flex items-center rounded-full text-emerald-800 bg-emerald-100/90 border border-emerald-300/80 shadow-2xs backdrop-blur-xs cursor-text transition-all hover:scale-105 ${textClasses[item.textSize].badge}`}
                        style={{
                          boxShadow: '0 1px 6px rgba(16, 185, 129, 0.12)',
                        }}
                      >
                        <EditableText
                          storageKey={badgeStorageKey}
                          defaultText={activeDataset.defaultBadge}
                          id={`editable-${activeDataset.storageKeyPrefix}_badge_${item.id}`}
                        />
                      </span>

                      {/* Direct delete button for variation badge field */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteField(item.id, 'showBadge');
                        }}
                        id={`btn-delete-badge-${item.id}`}
                        className="opacity-0 group-hover/badge:opacity-100 group-hover:opacity-75 transition-opacity p-0.5 ml-0.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full cursor-pointer"
                        title="Eliminar este campo (Badge de variación)"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 
                2. FLOATING SPARKLINE GRAPH (SVG WITHOUT WINDOW BACKGROUND):
                Clean transparent graph floating over the isometric surface.
                Smaller height and width by default, with custom scale settings up to 2XL.
              */}
              {item.showChart !== false && (
                <div
                  className="w-full mt-0.5 select-none relative group/chart drop-shadow-xs transition-all"
                  style={{
                    filter: 'drop-shadow(0 3px 8px rgba(2, 132, 199, 0.12))',
                  }}
                >
                  <div className="pointer-events-none">
                    <KpiSparkline
                      type={activeDataset.chartType}
                      strokeColor={activeDataset.strokeColor}
                      fillColor={activeDataset.fillColor}
                      points={activeDataset.points}
                      dates={activeDataset.dates}
                      heightClass={chartClasses[item.chartSize].heightClass}
                      compact={item.chartSize === 'xs' || item.chartSize === 'sm'}
                    />
                  </div>

                  {/* Direct delete button for chart field */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteField(item.id, 'showChart');
                    }}
                    id={`btn-delete-chart-${item.id}`}
                    className="absolute top-0 right-0 opacity-0 group-hover/chart:opacity-100 group-hover:opacity-60 transition-opacity p-1 text-slate-400 hover:text-rose-600 hover:bg-white/95 shadow-xs border border-slate-200/80 rounded-full cursor-pointer pointer-events-auto"
                    title="Eliminar este campo (Gráfica de tendencia)"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Floating Indicator Subtitle (Optional click to explore full dashboard) */}
              {onNavigateToDashboard && (
                <button
                  onClick={onNavigateToDashboard}
                  className="mt-1 text-[9px] font-semibold text-slate-500 hover:text-sky-700 bg-white/70 hover:bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-200/60 shadow-2xs flex items-center gap-1 cursor-pointer transition-all"
                >
                  <span>Ver detalles</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Duplication & Action Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-sky-400/40 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none backdrop-blur-md">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};
