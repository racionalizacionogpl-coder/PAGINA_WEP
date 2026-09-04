export interface KpiItem {
  id: string;
  title: string;
  value: string;
  percent: number;
  badge: string;
  colorScheme: 'slate' | 'blue' | 'emerald' | 'indigo';
  specialBorder?: boolean;
}

export interface EditableContent {
  brandName: string;
  brandSub: string;
  navItem1: string;
  navItem2: string;
  navItem3: string;
  navButton: string;
  heroTagline: string;
  heroTitle: string;
  heroDescription: string;
  heroStatus: string;
  kpi1Title: string;
  kpi1Value: string;
  kpi1Badge: string;
  kpi2Title: string;
  kpi2Value: string;
  kpi2Badge: string;
  kpi3Title: string;
  kpi3Value: string;
  kpi3Badge: string;
  kpi4Title: string;
  kpi4Value: string;
  kpi4Badge: string;
}

export type ActiveDocModal =
  | 'plan-gestion'
  | 'plan-cronograma'
  | 'bitacora'
  | 'dashboard'
  | 'sistemas'
  | 'soluciones'
  | 'recursos'
  | 'equipos'
  | 'novedades'
  | 'eventos'
  | 'gestor-documentos'
  | string
  | null;

export interface DocItem {
  id: string;
  category: 'gestion' | 'cronograma' | 'bitacora' | 'formatos' | 'sistemas' | 'normativa' | 'personalizado';
  title: string;
  code?: string;
  description: string;
  content: string;
  type: string; // 'Excel (.xlsx)', 'Word (.docx)', 'PDF (.pdf)', 'Documento Oficial', etc.
  size?: string;
  date: string;
  author: string;
  status: 'Vigente' | 'En revisión' | 'Aprobado' | 'Borrador' | 'Oficial';
  tags: string[];
}

export interface HeroPool {
  id: string;
  title: string;
  subtitle: string;
  icon: 'chart' | 'monitor' | 'users' | 'folder' | 'shield' | 'star' | 'file' | 'activity';
  color: 'purple' | 'blue' | 'emerald' | 'navy' | 'amber' | 'rose';
  // Position as percentage relative to canvas container (0-100)
  leftPercent: number;
  topPercent: number;
  targetAction: string;
}

export interface HeroActionButton {
  id: string;
  label: string;
  variant: 'primary' | 'secondary' | 'dark' | 'outline';
  actionType: 'scroll' | 'modal' | 'custom';
  target: string;
}

export interface NavButton {
  id: string;
  label: string;
  modal?: ActiveDocModal;
  isCustom?: boolean;
}
