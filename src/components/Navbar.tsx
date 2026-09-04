import React, { useState, useEffect } from 'react';
import { ActiveDocModal, NavButton } from '../types';
import { UnmsmLogo } from './UnmsmLogo';
import { EditableText } from './EditableText';
import {
  RotateCcw,
  Download,
  Menu,
  X,
  BarChart3,
  ChevronDown,
  Edit2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Plus,
  SlidersHorizontal,
  FileText,
  Heading,
  Trash2,
} from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onOpenDoc: (doc: ActiveDocModal) => void;
  onReset: () => void;
  onOpenEditHeaders?: () => void;
}

const STORAGE_KEY_NAV = 'quipucamayoc_navbar_items_v4';

const DEFAULT_NAV_LINKS: NavButton[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'plan-gestion', label: 'Plan de gestión del proyecto', modal: 'plan-gestion' },
  { id: 'plan-cronograma', label: 'Plan de gestión del cronograma', modal: 'plan-cronograma' },
  { id: 'bitacora', label: 'Bitácora de acuerdos', modal: 'bitacora' },
];

const migrateNavItems = (items: any[]): NavButton[] => {
  return items
    .filter((item) => item.id !== 'sistemas' && item.id !== 'soluciones' && item.id !== 'recursos')
    .map((item) => {
      if (item.id === 'novedades' || (item.label && item.label.toLowerCase().includes('novedad'))) {
        return { id: 'plan-gestion', label: 'Plan de gestión del proyecto', modal: 'plan-gestion' };
      }
      if (item.id === 'eventos' || (item.label && item.label.toLowerCase().includes('evento'))) {
        return { id: 'plan-cronograma', label: 'Plan de gestión del cronograma', modal: 'plan-cronograma' };
      }
      if (item.id === 'equipos' || (item.label && item.label.toLowerCase().includes('equipo'))) {
        return { id: 'bitacora', label: 'Bitácora de acuerdos', modal: 'bitacora' };
      }
      return item;
    });
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'inicio',
  onSelectTab,
  onOpenDoc,
  onReset,
  onOpenEditHeaders,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docsDropdownOpen, setDocsDropdownOpen] = useState(false);
  const [navEditMode, setNavEditMode] = useState(false);

  const [navLinks, setNavLinks] = useState<NavButton[]>(() => {
    // Check v4 first
    const savedV4 = localStorage.getItem(STORAGE_KEY_NAV);
    if (savedV4) {
      try {
        const parsed: NavButton[] = JSON.parse(savedV4);
        const migrated = migrateNavItems(parsed);
        if (migrated.length > 0) return migrated;
      } catch (e) {
        console.error('Error parsing nav links v4', e);
      }
    }

    // Migrate from v3 or v2
    const olderSaved =
      localStorage.getItem('quipucamayoc_navbar_items_v3') ||
      localStorage.getItem('quipucamayoc_navbar_items_v2');
    if (olderSaved) {
      try {
        const parsed = JSON.parse(olderSaved);
        const migrated = migrateNavItems(parsed);
        if (migrated.length > 0) {
          localStorage.setItem(STORAGE_KEY_NAV, JSON.stringify(migrated));
          return migrated;
        }
      } catch (e) {
        console.error('Error migrating old nav items', e);
      }
    }

    localStorage.setItem(STORAGE_KEY_NAV, JSON.stringify(DEFAULT_NAV_LINKS));
    return DEFAULT_NAV_LINKS;
  });

  const saveNavLinks = (newLinks: NavButton[]) => {
    setNavLinks(newLinks);
    localStorage.setItem(STORAGE_KEY_NAV, JSON.stringify(newLinks));
  };

  const handleNavClick = (link: NavButton) => {
    if (onSelectTab) onSelectTab(link.id);
    if (link.modal) {
      onOpenDoc(link.modal);
    } else if (link.id === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Reordering Nav buttons
  const handleMoveNav = (index: number, direction: 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= navLinks.length) return;
    const newLinks = [...navLinks];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIdx];
    newLinks[targetIdx] = temp;
    saveNavLinks(newLinks);
  };

  const handleEditNavLabel = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = navLinks[index];
    const newLabel = window.prompt('Editar nombre del botón de navegación:', current.label);
    if (newLabel && newLabel.trim()) {
      const newLinks = [...navLinks];
      newLinks[index] = { ...current, label: newLabel.trim() };
      saveNavLinks(newLinks);
    }
  };

  const handleDeleteNav = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = navLinks[index];
    if (window.confirm(`¿Eliminar el botón "${current.label}" del menú de navegación?`)) {
      const newLinks = navLinks.filter((_, i) => i !== index);
      saveNavLinks(newLinks);
    }
  };

  const handleAddNavButton = () => {
    const label = window.prompt('Nombre del nuevo botón de navegación:');
    if (label && label.trim()) {
      const newId = `nav-custom-${Date.now()}`;
      const newLinks = [
        ...navLinks,
        {
          id: newId,
          label: label.trim(),
          modal: 'gestor-documentos',
          isCustom: true,
        },
      ];
      saveNavLinks(newLinks);
    }
  };

  const handleResetNav = () => {
    if (window.confirm('¿Restablecer el orden original de los botones de navegación?')) {
      saveNavLinks(DEFAULT_NAV_LINKS);
    }
  };

  return (
    <nav
      id="main-navbar"
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center shrink-0">
          <div className="flex items-center">
            <UnmsmLogo variant="dark" className="h-10" showText={true} />
          </div>
        </div>

        {/* Center: Floating Pill Navigation - Movable & Editable */}
        <div className="hidden lg:flex items-center bg-slate-100/90 p-1.5 rounded-full border border-slate-200/90 shadow-2xs gap-0.5">
          {navLinks.map((link, index) => {
            const isActive = activeTab === link.id;
            const isFirst = index === 0;
            const isLast = index === navLinks.length - 1;

            return (
              <div key={link.id} className="relative group flex items-center">
                {navEditMode && (
                  <button
                    onClick={(e) => handleMoveNav(index, 'left', e)}
                    disabled={isFirst}
                    className={`p-0.5 text-slate-400 hover:text-slate-800 ${
                      isFirst ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    title="Mover a la izquierda"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                )}

                <button
                  onClick={() => handleNavClick(link)}
                  id={`nav-link-${link.id}`}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-sky-100 text-sky-800 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-sky-600 hover:bg-white/60'
                  }`}
                  title={`Abrir ${link.label}`}
                >
                  {link.label}
                </button>

                {navEditMode && (
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={(e) => handleEditNavLabel(index, e)}
                      className="p-0.5 text-sky-600 hover:text-sky-800 cursor-pointer"
                      title="Editar nombre"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteNav(index, e)}
                      className="p-0.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                      title="Eliminar botón"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                    <button
                      onClick={(e) => handleMoveNav(index, 'right', e)}
                      disabled={isLast}
                      className={`p-0.5 text-slate-400 hover:text-slate-800 ${
                        isLast ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      title="Mover a la derecha"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Nav Customization Toggle */}
          <button
            onClick={() => setNavEditMode(!navEditMode)}
            className={`p-1.5 ml-1 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer ${
              navEditMode ? 'bg-sky-200 text-sky-800' : 'hover:bg-slate-200'
            }`}
            title="Mover y reorganizar botones del menú"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {navEditMode && (
            <button
              onClick={handleAddNavButton}
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-full cursor-pointer transition-colors"
              title="Añadir nuevo botón al menú"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Side: Quick Action & Documentation Menu */}
        <div className="flex items-center gap-2">
          
          {/* Documentation Dropdown with Directly Editable Header */}
          <div className="relative">
            <div
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <EditableText
                storageKey="header_nav_documentos"
                defaultText="Documentos"
                className="font-semibold text-slate-700 text-xs"
                showIconOnHover={true}
              />
              <button
                onClick={() => setDocsDropdownOpen(!docsDropdownOpen)}
                className="p-0.5 hover:text-slate-900 cursor-pointer"
                title="Abrir menú de documentos"
              >
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>

            {docsDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setDocsDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Gestión por Procesos OGP
                </div>
                <button
                  onClick={() => onOpenDoc('plan-gestion')}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-medium flex items-center justify-between cursor-pointer"
                >
                  <span>Plan de gestión del proyecto</span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">PDF</span>
                </button>
                <button
                  onClick={() => onOpenDoc('plan-cronograma')}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-medium flex items-center justify-between cursor-pointer"
                >
                  <span>Plan de gestión del cronograma</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">XLSX</span>
                </button>
                <button
                  onClick={() => onOpenDoc('bitacora')}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-medium flex items-center justify-between cursor-pointer"
                >
                  <span>Bitácora de acuerdos</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">Actas</span>
                </button>
                <div className="border-t border-slate-100 my-1 pt-1">
                  <button
                    onClick={() => onOpenDoc('gestor-documentos')}
                    className="w-full text-left px-4 py-2 text-xs text-sky-600 hover:bg-sky-50 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ver todos y crear nuevo</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA: Dashboard with Directly Editable Header */}
          <div
            id="nav-dashboard-container"
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full shadow-md shadow-blue-200 transition-all hover:bg-blue-700"
          >
            <button
              onClick={() => onOpenDoc('dashboard')}
              className="flex items-center gap-1.5 cursor-pointer"
              title="Abrir Dashboard de Avance"
            >
              <BarChart3 className="w-4 h-4 text-sky-200 shrink-0" />
            </button>
            <EditableText
              storageKey="header_nav_dashboard"
              defaultText="Dashboard de Avance"
              className="text-white font-bold text-xs"
              showIconOnHover={true}
            />
          </div>

          {/* Edit Headers Button */}
          {onOpenEditHeaders && (
            <button
              onClick={onOpenEditHeaders}
              className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-full cursor-pointer transition-colors shadow-2xs"
              title="Editar los nombres de los encabezados (Equipo, Documentos, Dashboard)"
            >
              <Edit3 className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden xl:inline">Editar Encabezados</span>
            </button>
          )}

          {/* Action Tools: Reset & Print */}
          <div className="hidden xl:flex items-center pl-2 border-l border-slate-200 gap-1">
            <button
              onClick={() => {
                onReset();
                handleResetNav();
              }}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Restablecer todo a valores originales"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Imprimir reporte o exportar a PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          <div className="mb-2 pb-2 border-b border-slate-100 flex items-center justify-between">
            <UnmsmLogo variant="dark" className="h-8" showText={true} />
            <button
              onClick={() => setNavEditMode(!navEditMode)}
              className="text-xs text-sky-600 font-semibold flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{navEditMode ? 'Listo' : 'Mover botones'}</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link, idx) => (
              <div key={link.id} className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                {navEditMode && (
                  <button
                    onClick={(e) => handleMoveNav(idx, 'left', e)}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => handleNavClick(link)}
                  className="flex-1 text-left text-xs font-semibold text-slate-700 truncate"
                >
                  {link.label}
                </button>
                {navEditMode && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDeleteNav(idx, e)}
                      className="p-1 text-rose-500 hover:text-rose-700"
                      title="Eliminar botón"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleMoveNav(idx, 'right', e)}
                      disabled={idx === navLinks.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <button
              onClick={() => {
                onOpenDoc('plan-gestion');
                setMobileMenuOpen(false);
              }}
              className="text-sky-600 font-semibold"
            >
              Plan de gestión
            </button>
            <button
              onClick={() => {
                onOpenDoc('plan-cronograma');
                setMobileMenuOpen(false);
              }}
              className="text-emerald-600 font-semibold"
            >
              Cronograma
            </button>
            <button
              onClick={() => {
                onOpenDoc('bitacora');
                setMobileMenuOpen(false);
              }}
              className="text-slate-700 font-semibold"
            >
              Bitácora
            </button>
            <button
              onClick={() => {
                onReset();
                handleResetNav();
              }}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Resetear
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
