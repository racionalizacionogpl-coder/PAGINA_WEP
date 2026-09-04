import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { QuipucamayocHero } from './components/QuipucamayocHero';
import { DocModal } from './components/DocModal';
import { EditHeadersModal } from './components/EditHeadersModal';
import { ActiveDocModal } from './types';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UnmsmLogo } from './components/UnmsmLogo';
import { QuipucamayocLogo } from './components/QuipucamayocLogo';

export default function App() {
  const [activeDoc, setActiveDoc] = useState<ActiveDocModal>(null);
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [editHeadersOpen, setEditHeadersOpen] = useState(false);
  const [keyResetCounter, setKeyResetCounter] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReset = () => {
    // Clear all app state keys
    const prefixes = [
      'kpi_edit_corporativo_',
      'quipucamayoc_pools_positions_',
      'quipucamayoc_action_buttons_',
      'quipucamayoc_navbar_items_',
      'quipucamayoc_kpi_cards_order_',
    ];

    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && prefixes.some((p) => key.startsWith(p))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));

    // Force re-render of components
    setKeyResetCounter((prev) => prev + 1);
    triggerToast('Valores, posiciones y pools restablecidos');
  };

  const handleSelectNode = (nodeKey: string) => {
    setActiveDoc(nodeKey);
  };

  return (
    <div
      key={keyResetCounter}
      className="min-h-screen bg-[#f1f5f9] text-[#1e293b] antialiased selection:bg-sky-100 selection:text-sky-900 flex flex-col justify-between"
    >
      {/* Fixed Header with Quipucamayoc & UNMSM OGP & Floating Menu */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenDoc={setActiveDoc}
        onReset={handleReset}
        onOpenEditHeaders={() => setEditHeadersOpen(true)}
      />

      <div className="flex-1">
        {/* Quipucamayoc Portal & 3D Interactive Ecosystem Section (Image 1) */}
        <QuipucamayocHero
          onExploreSystems={() => setActiveDoc('sistemas')}
          onSelectNode={handleSelectNode}
        />
      </div>

      {/* Corporate Footer with UNMSM & Quipucamayoc Identifiers */}
      <footer className="bg-white border-t border-slate-200/90 py-10 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <UnmsmLogo variant="dark" className="h-10" showText={true} />
            <div className="hidden sm:block h-6 w-px bg-slate-200" />
            <QuipucamayocLogo size="sm" />
          </div>

          <div className="flex flex-col items-center md:items-end text-xs text-slate-500 gap-1.5 text-center md:text-right">
            <div className="flex items-center gap-2 font-medium text-slate-700">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Universidad Nacional Mayor de San Marcos · Fundada en 1551</span>
            </div>
            <p>
              Oficina General de Planificación (OGP) · Oficina de Procesos y Desarrollo Organizacional
            </p>
            <p className="text-[11px] text-slate-400">
              Centro de Documentación Oficial y Ecosistema Quipucamayoc · Lima, Perú
            </p>
          </div>

        </div>
      </footer>

      {/* Unified Documentation Viewer & Editor Modal */}
      <DocModal activeDoc={activeDoc} onClose={() => setActiveDoc(null)} />

      {/* Centralized Header Editor Modal for Equipo, Documento, Dashboard, etc. */}
      <EditHeadersModal
        isOpen={editHeadersOpen}
        onClose={() => setEditHeadersOpen(false)}
      />

      {/* Persistent Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
