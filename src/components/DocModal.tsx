import React, { useState, useEffect } from 'react';
import { ActiveDocModal, DocItem } from '../types';
import { UNMSM_FACULTIES } from '../data/initialData';
import { INITIAL_DOCS } from '../data/initialDocs';
import { DocumentEditorModal } from './DocumentEditorModal';
import { EditableText } from './EditableText';
import {
  X,
  FileText,
  Calendar,
  BookOpen,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Building2,
  Search,
  Monitor,
  FolderArchive,
  Users,
  Bell,
  Download,
  ExternalLink,
  Sparkles,
  Layers,
  Plus,
  Edit3,
  Trash2,
  RotateCcw,
  Tag,
  ArrowRight,
} from 'lucide-react';

interface DocModalProps {
  activeDoc: ActiveDocModal;
  onClose: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: string;
}

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Dra. Jeri Ramón Ruffner',
    role: 'Rectora de la UNMSM',
    department: 'Alta Dirección Universitaria',
    status: 'Líder Institucional',
  },
  {
    id: 'team-2',
    name: 'Director General de Planificación',
    role: 'Dirección General OGP',
    department: 'Oficina General de Planificación',
    status: 'Dirección Estratégica',
  },
  {
    id: 'team-3',
    name: 'Jefatura de la Oficina de Procesos',
    role: 'Líder Técnico de Gestión por Procesos',
    department: 'OGP - Oficina de Desarrollo y Procesos',
    status: 'Coordinación General',
  },
  {
    id: 'team-4',
    name: 'Especialistas Metodológicos y de Calidad',
    role: 'Asesores de Levantamiento y Documentación',
    department: 'OGP - Equipo de Calidad',
    status: 'Asesoría Técnica',
  },
  {
    id: 'team-5',
    name: 'Comité de Calidad de las 20 Facultades',
    role: 'Enlaces Oficiales de Procesos',
    department: '20 Facultades UNMSM',
    status: 'Validación en Campo',
  },
  {
    id: 'team-6',
    name: 'Equipo de Sistemas Quipucamayoc',
    role: 'Plataforma y Soporte Digital',
    department: 'OGP / Red Telemática UNMSM',
    status: 'Desarrollo Digital',
  },
];

const STORAGE_KEY_DOCS = 'kpi_edit_corporativo_custom_docs_v1';
const STORAGE_KEY_TEAM = 'quipucamayoc_team_members_v1';

export const DocModal: React.FC<DocModalProps> = ({ activeDoc, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEAM);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_TEAM_MEMBERS;
  });
  const [docs, setDocs] = useState<DocItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DOCS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved docs', e);
      }
    }
    return INITIAL_DOCS;
  });

  const [activeSelectedDoc, setActiveSelectedDoc] = useState<DocItem | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [isNewDoc, setIsNewDoc] = useState(false);
  const [editingTargetDoc, setEditingTargetDoc] = useState<DocItem | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Sync to localStorage
  const saveDocsList = (updatedDocs: DocItem[]) => {
    setDocs(updatedDocs);
    localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(updatedDocs));
  };

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Determine which doc or view to focus on based on activeDoc prop
  useEffect(() => {
    if (!activeDoc) return;
    if (activeDoc === 'plan-gestion') {
      const match = docs.find((d) => d.id === 'doc-plan-gestion' || d.category === 'gestion');
      setActiveSelectedDoc(match || null);
      setSelectedCategory('gestion');
    } else if (activeDoc === 'plan-cronograma') {
      const match = docs.find((d) => d.id === 'doc-plan-cronograma' || d.category === 'cronograma');
      setActiveSelectedDoc(match || null);
      setSelectedCategory('cronograma');
    } else if (activeDoc === 'bitacora') {
      const match = docs.find((d) => d.id === 'doc-bitacora' || d.category === 'bitacora');
      setActiveSelectedDoc(match || null);
      setSelectedCategory('bitacora');
    } else if (activeDoc === 'recursos') {
      const match = docs.find((d) => d.category === 'formatos' || d.id === 'doc-anexo-1');
      setActiveSelectedDoc(match || null);
      setSelectedCategory('formatos');
    } else if (activeDoc === 'dashboard') {
      setSelectedCategory('dashboard');
      setActiveSelectedDoc(null);
    } else if (activeDoc === 'equipos') {
      setSelectedCategory('equipos');
      setActiveSelectedDoc(null);
    } else if (activeDoc.startsWith('doc-')) {
      const match = docs.find((d) => d.id === activeDoc);
      if (match) {
        setActiveSelectedDoc(match);
        setSelectedCategory(match.category);
      }
    }
  }, [activeDoc, docs]);

  if (!activeDoc) return null;

  // Handlers for Document Editing & Rewriting
  const handleOpenEdit = (docToEdit: DocItem) => {
    setEditingTargetDoc(docToEdit);
    setIsNewDoc(false);
    setEditorOpen(true);
  };

  const handleOpenNew = () => {
    setEditingTargetDoc(null);
    setIsNewDoc(true);
    setEditorOpen(true);
  };

  const handleSaveDoc = (updatedDoc: DocItem) => {
    let newDocs: DocItem[];
    if (isNewDoc) {
      newDocs = [updatedDoc, ...docs];
      showToast(`Documento "${updatedDoc.title}" creado exitosamente.`);
    } else {
      newDocs = docs.map((d) => (d.id === updatedDoc.id ? updatedDoc : d));
      showToast(`Documento "${updatedDoc.title}" actualizado.`);
    }
    saveDocsList(newDocs);
    setActiveSelectedDoc(updatedDoc);
    setEditorOpen(false);
  };

  const handleDeleteDoc = (docId: string) => {
    const newDocs = docs.filter((d) => d.id !== docId);
    saveDocsList(newDocs);
    if (activeSelectedDoc && activeSelectedDoc.id === docId) {
      setActiveSelectedDoc(newDocs[0] || null);
    }
    setEditorOpen(false);
    showToast('Documento eliminado correctamente.');
  };

  const handleResetDocs = () => {
    if (window.confirm('¿Deseas restablecer todos los documentos a su versión inicial oficial?')) {
      saveDocsList(INITIAL_DOCS);
      setActiveSelectedDoc(INITIAL_DOCS[0]);
      showToast('Documentos restablecidos a la versión original de la OGP.');
    }
  };

  const handleUpdateMember = (id: string, field: keyof TeamMember, val: string) => {
    const updated = teamMembers.map((m) => (m.id === id ? { ...m, [field]: val } : m));
    setTeamMembers(updated);
    localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(updated));
    showToast('Integrante del equipo actualizado.');
  };

  const handleAddMember = () => {
    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: 'Nuevo Integrante',
      role: 'Especialista / Coordinador',
      department: 'Oficina General de Planificación',
      status: 'Activo',
    };
    const updated = [...teamMembers, newMember];
    setTeamMembers(updated);
    localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(updated));
    showToast('Nuevo integrante añadido al equipo.');
  };

  const handleDeleteMember = (id: string) => {
    const updated = teamMembers.filter((m) => m.id !== id);
    setTeamMembers(updated);
    localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(updated));
    showToast('Integrante eliminado.');
  };

  const handleResetTeam = () => {
    setTeamMembers(DEFAULT_TEAM_MEMBERS);
    localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(DEFAULT_TEAM_MEMBERS));
    showToast('Equipo restablecido a valores originales.');
  };

  const filteredFaculties = UNMSM_FACULTIES.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDocs = docs.filter((d) => {
    const matchesCategory =
      selectedCategory === 'todos' || d.category === selectedCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.code && d.code.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const isSpecialView =
    activeDoc === 'dashboard' ||
    activeDoc === 'sistemas' ||
    activeDoc === 'soluciones' ||
    activeDoc === 'equipos' ||
    activeDoc === 'novedades' ||
    activeDoc === 'eventos';

  return (
    <>
      <div
        id="doc-modal-backdrop"
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div
          id="doc-modal-card"
          className="bg-white rounded-2xl max-w-6xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main Top Header */}
          <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center bg-slate-50 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-poppins text-slate-900 flex items-center gap-2">
                  <EditableText
                    storageKey="header_doc_modal_title"
                    defaultText="Centro de Documentación y Gestión de Procesos"
                    className="font-bold"
                    showIconOnHover={true}
                  />
                  <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full shrink-0">
                    {docs.length} documentos
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  UNMSM · Oficina General de Planificación (OGP) · Edición y Control Oficial
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenNew}
                id="btn-nuevo-documento"
                className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                title="Crear un nuevo documento, anexo o directriz"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Documento</span>
              </button>

              <button
                onClick={handleResetDocs}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Restablecer todos los documentos originales"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                id="close-doc-modal-btn"
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader: Category Navigation & Search */}
          <div className="px-5 py-2.5 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'todos', label: 'Todos los Documentos' },
                { id: 'gestion', label: 'Plan de Gestión' },
                { id: 'cronograma', label: 'Cronograma' },
                { id: 'bitacora', label: 'Bitácora' },
                { id: 'formatos', label: 'Formatos & Anexos' },
                { id: 'normativa', label: 'Normativas & Guías' },
                { id: 'dashboard', label: 'Dashboard 20 Facultades' },
                { id: 'equipos', label: 'Equipo de Trabajo' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (cat.id === 'dashboard' || cat.id === 'equipos') {
                      // switch to dashboard or team view
                      setActiveSelectedDoc(null);
                    }
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-white text-sky-800 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar documento o texto..."
                className="w-full pl-8 pr-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Modal Main Body */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* If Dashboard view is selected */}
            {selectedCategory === 'dashboard' || activeDoc === 'dashboard' ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600 shrink-0" />
                      <EditableText
                        storageKey="header_dashboard_modal_title"
                        defaultText="Monitoreo Oficial por Facultad (20 Facultades UNMSM)"
                        className="font-bold text-slate-900"
                        showIconOnHover={true}
                      />
                    </h3>
                    <p className="text-xs text-slate-500">Supervisión en tiempo real del progreso de implementación y validación</p>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Facultad</th>
                        <th className="px-4 py-3 text-center">Estado</th>
                        <th className="px-4 py-3 text-center">Avance Fase 1</th>
                        <th className="px-4 py-3 text-center">Anexo 3</th>
                        <th className="px-4 py-3 text-center">Anexo 4</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredFaculties.map((fac, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {fac.name}
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                fac.status === 'Líder'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : fac.status === 'Avanzado'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : fac.status === 'En progreso'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {fac.status}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-semibold text-slate-800 w-8 text-right">{fac.progress}%</span>
                              <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-blue-600 h-full rounded-full"
                                  style={{ width: `${fac.progress}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-center font-medium text-slate-600">{fac.annex3}</td>
                          <td className="px-4 py-2.5 text-center font-medium text-slate-600">{fac.annex4}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : selectedCategory === 'equipos' || activeDoc === 'equipos' ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600 shrink-0" />
                      <EditableText
                        storageKey="header_team_modal_title"
                        defaultText="Equipo de Trabajo - Gestión por Procesos (OGP)"
                        className="font-bold text-slate-900"
                        showIconOnHover={true}
                      />
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      <EditableText
                        storageKey="header_team_modal_desc"
                        defaultText="Líderes, coordinadores y especialistas responsables de la modernización institucional y gestión por procesos"
                        className="text-slate-500"
                        showIconOnHover={true}
                      />
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddMember}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Añadir nuevo miembro al equipo"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir Miembro</span>
                    </button>
                    <button
                      onClick={handleResetTeam}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Restablecer integrantes a valores originales"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Team Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-shadow relative group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {member.status}
                          </span>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Eliminar del equipo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-1 mt-1">
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleUpdateMember(member.id, 'name', e.target.value)}
                            className="w-full text-sm font-bold text-slate-900 bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-indigo-400 focus:outline-none transition-all"
                            title="Haz clic para editar nombre"
                          />
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => handleUpdateMember(member.id, 'role', e.target.value)}
                            className="w-full text-xs font-semibold text-indigo-700 bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-indigo-400 focus:outline-none transition-all"
                            title="Haz clic para editar cargo"
                          />
                          <input
                            type="text"
                            value={member.department}
                            onChange={(e) => handleUpdateMember(member.id, 'department', e.target.value)}
                            className="w-full text-[11px] text-slate-500 bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-indigo-400 focus:outline-none transition-all"
                            title="Haz clic para editar dependencia"
                          />
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>UNMSM · OGP</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Edit3 className="w-2.5 h-2.5" /> editable
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Two-Column Document Manager: Sidebar List + Detail & Edit View */
              <>
                {/* Left: Document List Sidebar */}
                <div className="w-full md:w-80 border-r border-slate-200 overflow-y-auto bg-slate-50/50 p-3 space-y-2 shrink-0 max-h-60 md:max-h-none">
                  <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Lista ({filteredDocs.length})</span>
                    <button
                      onClick={handleOpenNew}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Nuevo
                    </button>
                  </div>

                  {filteredDocs.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No se encontraron documentos con este criterio.
                    </div>
                  ) : (
                    filteredDocs.map((item) => {
                      const isSelected = activeSelectedDoc?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setActiveSelectedDoc(item)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer group text-left ${
                            isSelected
                              ? 'bg-white border-sky-400 shadow-md ring-1 ring-sky-300'
                              : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                              {item.code || item.category}
                            </span>
                            <span className="text-slate-400">{item.date}</span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-800 group-hover:text-sky-700 line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                            {item.description}
                          </p>

                          {/* Quick Hover Controls */}
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-medium">{item.type}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEdit(item);
                                }}
                                className="text-sky-600 hover:text-sky-800 flex items-center gap-0.5 font-semibold"
                                title="Editar o reescribir"
                              >
                                <Edit3 className="w-3 h-3" /> Editar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`¿Seguro que deseas eliminar "${item.title}"?`)) {
                                    handleDeleteDoc(item.id);
                                  }
                                }}
                                className="text-rose-500 hover:text-rose-700"
                                title="Eliminar documento"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Right: Active Document Full Content & Rewrite/Edit Panel */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
                  {activeSelectedDoc ? (
                    <div className="space-y-5">
                      {/* Document Meta Header */}
                      <div className="border-b border-slate-200 pb-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                              {activeSelectedDoc.code || 'DOC-UNMSM'}
                            </span>
                            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                              {activeSelectedDoc.status}
                            </span>
                            <span className="text-xs text-slate-500">
                              {activeSelectedDoc.type} · {activeSelectedDoc.size || 'Oficial'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(activeSelectedDoc)}
                              id="btn-editar-documento-activo"
                              className="px-4 py-1.5 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Reescribir / Editar</span>
                            </button>

                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `¿Seguro que deseas eliminar "${activeSelectedDoc.title}"?`
                                  )
                                ) {
                                  handleDeleteDoc(activeSelectedDoc.id);
                                }
                              }}
                              className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>

                        <h1 className="text-2xl font-bold font-poppins text-slate-900 leading-snug">
                          {activeSelectedDoc.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                          <span>
                            <strong>Responsable:</strong> {activeSelectedDoc.author}
                          </span>
                          <span>·</span>
                          <span>
                            <strong>Fecha:</strong> {activeSelectedDoc.date}
                          </span>
                        </div>

                        {activeSelectedDoc.description && (
                          <div className="mt-3 p-3 bg-sky-50/70 border border-sky-100 rounded-xl text-xs text-sky-900">
                            <strong>Resumen:</strong> {activeSelectedDoc.description}
                          </div>
                        )}

                        {activeSelectedDoc.tags && activeSelectedDoc.tags.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                            <Tag className="w-3 h-3 text-slate-400" />
                            {activeSelectedDoc.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Full Document Text / Markdown Body */}
                      <div className="bg-slate-50/40 p-5 rounded-2xl border border-slate-200">
                        <div className="text-xs uppercase font-bold text-slate-400 mb-3 flex items-center justify-between">
                          <span>Texto del Documento</span>
                          <span className="text-[11px] text-slate-500 lowercase">
                            editable en tiempo real
                          </span>
                        </div>
                        <div className="prose prose-sm max-w-none text-slate-800 font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                          {activeSelectedDoc.content}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400">
                      <FileText className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
                      <p className="text-sm font-medium text-slate-600">
                        Selecciona un documento para visualizarlo, editarlo o reescribirlo.
                      </p>
                      <button
                        onClick={handleOpenNew}
                        className="mt-3 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition-colors"
                      >
                        Crear nuevo documento
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Universidad Nacional Mayor de San Marcos · Gestión por Procesos OGP</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors font-semibold cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-70 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Full Document Editor Modal */}
      <DocumentEditorModal
        isOpen={editorOpen}
        doc={editingTargetDoc}
        isNew={isNewDoc}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveDoc}
        onDelete={handleDeleteDoc}
      />
    </>
  );
};
