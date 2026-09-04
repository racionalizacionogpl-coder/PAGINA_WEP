import React, { useState, useEffect } from 'react';
import { HeroPool } from '../types';
import { X, Save, Trash2, Sparkles, BarChart3, Monitor, Users, FolderArchive, Shield, Star, FileText, Activity } from 'lucide-react';

interface PoolEditorModalProps {
  isOpen: boolean;
  pool: HeroPool | null;
  isNew?: boolean;
  onClose: () => void;
  onSave: (pool: HeroPool) => void;
  onDelete?: (poolId: string) => void;
}

export const PoolEditorModal: React.FC<PoolEditorModalProps> = ({
  isOpen,
  pool,
  isNew = false,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<HeroPool>({
    id: `pool-${Date.now()}`,
    title: 'Nuevo Pool',
    subtitle: 'institucional',
    icon: 'chart',
    color: 'purple',
    leftPercent: 45,
    topPercent: 50,
    targetAction: 'metricas',
  });

  useEffect(() => {
    if (pool) {
      setFormData(pool);
    } else if (isNew) {
      setFormData({
        id: `pool-${Date.now()}`,
        title: 'Nuevo Nodo',
        subtitle: 'de proceso',
        icon: 'activity',
        color: 'blue',
        leftPercent: 50,
        topPercent: 50,
        targetAction: 'custom',
      });
    }
  }, [pool, isNew, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const iconOptions: { id: HeroPool['icon']; label: string; icon: React.ReactNode }[] = [
    { id: 'chart', label: 'Gráfico', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'monitor', label: 'Monitor / TI', icon: <Monitor className="w-4 h-4" /> },
    { id: 'users', label: 'Equipos', icon: <Users className="w-4 h-4" /> },
    { id: 'folder', label: 'Recursos', icon: <FolderArchive className="w-4 h-4" /> },
    { id: 'activity', label: 'Actividad', icon: <Activity className="w-4 h-4" /> },
    { id: 'file', label: 'Documento', icon: <FileText className="w-4 h-4" /> },
    { id: 'shield', label: 'Seguridad', icon: <Shield className="w-4 h-4" /> },
    { id: 'star', label: 'Destacado', icon: <Star className="w-4 h-4" /> },
  ];

  const colorOptions: { id: HeroPool['color']; label: string; bgClass: string }[] = [
    { id: 'purple', label: 'Púrpura', bgClass: 'bg-purple-500' },
    { id: 'blue', label: 'Celeste', bgClass: 'bg-sky-500' },
    { id: 'emerald', label: 'Esmeralda', bgClass: 'bg-emerald-500' },
    { id: 'navy', label: 'Azul Marino', bgClass: 'bg-[#10233f]' },
    { id: 'amber', label: 'Ámbar', bgClass: 'bg-amber-500' },
    { id: 'rose', label: 'Rosa / Rojo', bgClass: 'bg-rose-500' },
  ];

  return (
    <div
      className="fixed inset-0 z-70 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold font-poppins text-slate-900 text-base">
              {isNew ? 'Crear Nuevo Pool / Nodo' : 'Editar Pool / Píldora'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Title & Subtitle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Título Superior *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej. Métricas"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Subtítulo Inferior
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Ej. de impacto"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Ícono del Nodo
            </label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, icon: opt.id })}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                    formData.icon === opt.id
                      ? 'bg-sky-50 border-sky-500 text-sky-700 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {opt.icon}
                  <span className="text-[10px] mt-1 line-clamp-1">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Color Distintivo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, color: opt.id })}
                  className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer ${
                    formData.color === opt.id
                      ? 'border-slate-800 ring-2 ring-slate-800 bg-slate-50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${opt.bgClass}`} />
                  <span className="text-[11px] font-medium text-slate-700">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Position Inputs (also movable directly on canvas) */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="block font-bold text-slate-700 mb-1 text-[11px]">
              Posición en el Lienzo (% horizontal y vertical)
            </span>
            <p className="text-[10px] text-slate-400 mb-2">
              También puedes arrastrar este pool directamente con el ratón en la pantalla.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500">Horizontal (X %):</label>
                <input
                  type="number"
                  min="0"
                  max="95"
                  value={Math.round(formData.leftPercent)}
                  onChange={(e) =>
                    setFormData({ ...formData, leftPercent: Number(e.target.value) })
                  }
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Vertical (Y %):</label>
                <input
                  type="number"
                  min="0"
                  max="95"
                  value={Math.round(formData.topPercent)}
                  onChange={(e) =>
                    setFormData({ ...formData, topPercent: Number(e.target.value) })
                  }
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Modal Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            {!isNew && onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(formData.id)}
                className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Pool</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
