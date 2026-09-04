import React, { useState, useEffect } from 'react';
import { X, Check, RotateCcw, Edit3, Sparkles, LayoutDashboard, FileText, Users, Heading } from 'lucide-react';

interface EditHeadersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

interface HeaderFields {
  // Navigation & Button headers
  navEquipo: string;
  navDocumentos: string;
  navDashboard: string;

  // Main Page Section headers
  heroTitle: string;
  heroTagline: string;
  heroDescription: string;

  // Pool & Subheaders
  poolEquiposTitle: string;
  poolEquiposSubtitle: string;
  kpiSectionHeader: string;
  docModalTitle: string;
  dashboardModalTitle: string;
  teamModalTitle: string;
}

const DEFAULT_HEADERS: HeaderFields = {
  navEquipo: 'Equipo',
  navDocumentos: 'Documentos',
  navDashboard: 'Dashboard de Avance',

  heroTitle: 'Centro de Documentación de la Gestión por Procesos',
  heroTagline: 'IMPLEMENTACIÓN DE LA GESTIÓN POR PROCESOS · 20 FACULTADES',
  heroDescription:
    'Los documentos que rigen el proyecto, en su versión vigente. Haz clic en cualquier texto de esta pantalla para editar los campos de manera interactiva.',

  poolEquiposTitle: '% de Anexo 3',
  poolEquiposSubtitle: '(Ficha caracterización)',
  kpiSectionHeader: 'Métricas Oficiales de Avance (Dashboard)',
  docModalTitle: 'Centro de Documentación y Gestión de Procesos',
  dashboardModalTitle: 'Monitoreo Oficial por Facultad (20 Facultades UNMSM)',
  teamModalTitle: 'Equipo de Trabajo - Oficina General de Planificación (OGP)',
};

const STORAGE_MAP: { [K in keyof HeaderFields]: string } = {
  navEquipo: 'header_nav_equipo',
  navDocumentos: 'header_nav_documentos',
  navDashboard: 'header_nav_dashboard',
  heroTitle: 'hero_title',
  heroTagline: 'hero_tagline',
  heroDescription: 'hero_description',
  poolEquiposTitle: 'header_pool_equipos_title_v2',
  poolEquiposSubtitle: 'header_pool_equipos_subtitle_v2',
  kpiSectionHeader: 'header_kpi_section',
  docModalTitle: 'header_doc_modal_title',
  dashboardModalTitle: 'header_dashboard_modal_title',
  teamModalTitle: 'header_team_modal_title',
};

export const EditHeadersModal: React.FC<EditHeadersModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [formData, setFormData] = useState<HeaderFields>(DEFAULT_HEADERS);
  const [activeTab, setActiveTab] = useState<'prioritarios' | 'todos'>('prioritarios');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loaded: Partial<HeaderFields> = {};
      (Object.keys(STORAGE_MAP) as Array<keyof HeaderFields>).forEach((key) => {
        const storageKey = 'kpi_edit_corporativo_' + STORAGE_MAP[key];
        const val = localStorage.getItem(storageKey);
        if (val !== null && val !== undefined) {
          loaded[key] = val;
        } else {
          loaded[key] = DEFAULT_HEADERS[key];
        }
      });
      setFormData(loaded as HeaderFields);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof HeaderFields, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    (Object.keys(STORAGE_MAP) as Array<keyof HeaderFields>).forEach((key) => {
      const storageKey = 'kpi_edit_corporativo_' + STORAGE_MAP[key];
      localStorage.setItem(storageKey, formData[key]);
    });

    // Also sync the nav list storage if it exists
    try {
      const navSaved = localStorage.getItem('quipucamayoc_navbar_items_v2');
      if (navSaved) {
        const navList = JSON.parse(navSaved);
        const updatedNav = navList.map((item: any) => {
          if (item.id === 'equipos' || item.label.toLowerCase().includes('equipo')) {
            return { ...item, label: formData.navEquipo };
          }
          return item;
        });
        localStorage.setItem('quipucamayoc_navbar_items_v2', JSON.stringify(updatedNav));
      }
    } catch (e) {
      console.error(e);
    }

    // Trigger update event
    window.dispatchEvent(new CustomEvent('kpi_header_updated'));

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      if (onSaved) onSaved();
      onClose();
    }, 900);
  };

  const handleReset = () => {
    if (window.confirm('¿Restablecer los encabezados a sus nombres originales?')) {
      (Object.keys(STORAGE_MAP) as Array<keyof HeaderFields>).forEach((key) => {
        const storageKey = 'kpi_edit_corporativo_' + STORAGE_MAP[key];
        localStorage.removeItem(storageKey);
      });
      setFormData(DEFAULT_HEADERS);
      window.dispatchEvent(new CustomEvent('kpi_header_updated'));
      if (onSaved) onSaved();
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl">
              <Heading className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-poppins">
                Editar Encabezados de la Página
              </h2>
              <p className="text-xs text-slate-500">
                Personaliza directamente los encabezados de Equipo, Documentos y Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('prioritarios')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'prioritarios'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Encabezados Principales (Equipo · Documento · Dashboard)
          </button>
          <button
            onClick={() => setActiveTab('todos')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'todos'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Todos los Encabezados y Títulos
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-5">
          {activeTab === 'prioritarios' ? (
            <div className="space-y-4">
              {/* 1. Encabezado de Equipo */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Users className="w-4 h-4" />
                  <span>1. Encabezado de EQUIPO</span>
                </div>
                <label className="block text-xs font-medium text-slate-600">
                  Nombre en el menú de navegación y botones:
                </label>
                <input
                  type="text"
                  value={formData.navEquipo}
                  onChange={(e) => handleChange('navEquipo', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ej: Equipo, Gestión de Equipos, Equipo OGP"
                />

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500">
                      Título en el Pool 3D:
                    </label>
                    <input
                      type="text"
                      value={formData.poolEquiposTitle}
                      onChange={(e) => handleChange('poolEquiposTitle', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500">
                      Subtítulo en el Pool 3D:
                    </label>
                    <input
                      type="text"
                      value={formData.poolEquiposSubtitle}
                      onChange={(e) => handleChange('poolEquiposSubtitle', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500">
                    Título en la vista del Equipo:
                  </label>
                  <input
                    type="text"
                    value={formData.teamModalTitle}
                    onChange={(e) => handleChange('teamModalTitle', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* 2. Encabezado de Documento */}
              <div className="p-4 bg-sky-50/60 border border-sky-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
                  <FileText className="w-4 h-4" />
                  <span>2. Encabezado de DOCUMENTO / DOCUMENTOS</span>
                </div>
                <label className="block text-xs font-medium text-slate-600">
                  Nombre en el botón de la barra superior:
                </label>
                <input
                  type="text"
                  value={formData.navDocumentos}
                  onChange={(e) => handleChange('navDocumentos', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Ej: Documentos, Gestor Documental, Documentación"
                />

                <div className="pt-1">
                  <label className="block text-[11px] font-medium text-slate-500">
                    Título principal de la sección de documentos:
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitle}
                    onChange={(e) => handleChange('heroTitle', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500">
                    Título en el visor modal de documentos:
                  </label>
                  <input
                    type="text"
                    value={formData.docModalTitle}
                    onChange={(e) => handleChange('docModalTitle', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* 3. Encabezado de Dashboard */}
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>3. Encabezado de DASHBOARD</span>
                </div>
                <label className="block text-xs font-medium text-slate-600">
                  Nombre en el botón principal azul de la barra superior:
                </label>
                <input
                  type="text"
                  value={formData.navDashboard}
                  onChange={(e) => handleChange('navDashboard', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Dashboard de Avance, Monitoreo Oficial, Panel de Control"
                />

                <div className="pt-1">
                  <label className="block text-[11px] font-medium text-slate-500">
                    Encabezado de la sección de Métricas / KPIs:
                  </label>
                  <input
                    type="text"
                    value={formData.kpiSectionHeader}
                    onChange={(e) => handleChange('kpiSectionHeader', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500">
                    Título del Dashboard de las 20 Facultades:
                  </label>
                  <input
                    type="text"
                    value={formData.dashboardModalTitle}
                    onChange={(e) => handleChange('dashboardModalTitle', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tagline superior (Oficina General de Planificación):
                </label>
                <input
                  type="text"
                  value={formData.heroTagline}
                  onChange={(e) => handleChange('heroTagline', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción principal del Centro de Documentación:
                </label>
                <textarea
                  rows={3}
                  value={formData.heroDescription}
                  onChange={(e) => handleChange('heroDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500">
                <p>
                  <strong>Tip de edición directa:</strong> También puedes hacer clic directamente sobre
                  cualquier texto o título en la página para editarlo al instante sin necesidad de abrir este formulario.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Originales</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Encabezados</span>
            </button>
          </div>
        </div>
      </div>

      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-70 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>¡Encabezados guardados y actualizados en toda la página!</span>
        </div>
      )}
    </div>
  );
};
