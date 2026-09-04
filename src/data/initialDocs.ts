import { DocItem } from '../types';

export const INITIAL_DOCS: DocItem[] = [
  {
    id: 'doc-plan-gestion',
    category: 'gestion',
    code: 'PGP-UNMSM-2026-01',
    title: 'Plan de Gestión del Proyecto de Gestión por Procesos',
    description: 'Documento directriz que establece los lineamientos, metodología, gobernanza y fases de implementación en las 20 facultades de la UNMSM.',
    content: `# Plan de Gestión del Proyecto: Gestión por Procesos en la UNMSM

## 1. Propósito y Justificación
La Universidad Nacional Mayor de San Marcos (UNMSM), a través de la Oficina General de Planificación (OGP), lidera la transformación organizativa integral orientada a la Gestión por Procesos, en cumplimiento de los estándares de modernización de la gestión pública (PCM) y las exigencias de calidad educativa (SUNEDU / SINEACE).

## 2. Objetivos Estratégicos
- **Objetivo General:** Estandarizar, caracterizar y optimizar los procesos académicos, administrativos y de investigación en las 20 facultades.
- **Objetivo Específico 1:** Culminar la Fase 1 al 100% al 30 de setiembre de 2026.
- **Objetivo Específico 2:** Desplegar el catálogo institucional de indicadores (Anexo 4) para la toma de decisiones informadas.
- **Objetivo Específico 3:** Interconectar los procesos con el ecosistema Quipucamayoc y el Sistema de Trámite Cero Papel (SGD).

## 3. Gobernanza del Proyecto
- **Líder Institucional:** Rectorado y Dirección de la Oficina General de Planificación.
- **Comité Operativo:** Oficina de Procesos y Desarrollo Organizacional.
- **Puntos Focales:** Comisiones de Calidad y Procesos de cada una de las 20 Facultades.

## 4. Metodología de Trabajo
Se aplica el ciclo de Deming (PHVA: Planificar, Hacer, Verificar, Actuar) estructurado en 3 fases:
1. **Fase 1 (En curso):** Inventario (Anexo 1), Caracterización (Anexo 3), e Indicadores (Anexo 4).
2. **Fase 2:** Medición de línea base, auditorías de procesos y análisis de valor agregado.
3. **Fase 3:** Mejora continua, automatización digital y simplificación administrativa.`,
    type: 'Documento Oficial (.pdf)',
    size: '3.8 MB',
    date: '02/09/2026',
    author: 'Oficina General de Planificación (OGP)',
    status: 'Vigente',
    tags: ['Estratégico', 'Directriz', 'OGP', 'Fase 1'],
  },
  {
    id: 'doc-plan-cronograma',
    category: 'cronograma',
    code: 'PGC-CRONO-2026-F1',
    title: 'Plan de Gestión del Cronograma · Fase 1 (20 Facultades)',
    description: 'Cronograma detallado con hitos críticos, entregables parciales y fecha de cierre definitivo el 30 de setiembre de 2026.',
    content: `# Cronograma Maestro de Implementación - Fase 1

## Hitos Críticos y Plazos de Entrega

### Hito 1: Cierre del Inventario de Procesos (Anexo 1)
- **Fecha Límite:** 05 de setiembre de 2026
- **Avance Actual:** 68,0%
- **Entregable:** Matriz consolidada de procesos estratégicos, misionales y de soporte debidamente codificados.

### Hito 2: Validación de Fichas de Caracterización (Anexo 3)
- **Fecha Límite:** 18 de setiembre de 2026
- **Avance Actual:** 66,4%
- **Entregable:** Fichas técnicas completas con entradas, salidas, proveedores, clientes, requisitos de calidad y normatividad asociada.

### Hito 3: Fórmulas y Metas de Indicadores (Anexo 4)
- **Fecha Límite:** 25 de setiembre de 2026
- **Avance Actual:** 40,4%
- **Entregable:** Catálogo de indicadores con ficha metodológica, periodicidad y responsables de reporte.

### Hito 4: Consolidación y Aprobación Decanal
- **Fecha Límite:** 30 de setiembre de 2026
- **Avance Meta:** 100,0%
- **Entregable:** Resolución de Decanato de aprobación por cada Consejo de Facultad.`,
    type: 'Plan de Trabajo (.xlsx)',
    size: '1.9 MB',
    date: '02/09/2026',
    author: 'Comisión Central de Cronograma OGP',
    status: 'Vigente',
    tags: ['Cronograma', 'Plazos', 'Hitos', 'Septiembre 2026'],
  },
  {
    id: 'doc-bitacora',
    category: 'bitacora',
    code: 'BIT-ACTAS-2026-09',
    title: 'Bitácora de Control, Supervisión y Acuerdos',
    description: 'Historial de sesiones técnicas, acuerdos tomados con decanaturas y registros de recalibración semanal de avances.',
    content: `# Bitácora Oficial de Acuerdos y Supervisiones

## Registro de Entradas Recientes

### Sesión 02/09/2026 02:03 p.m.
- **Participantes:** OGP, Decanos de Ingenierías, Coordinadores de Calidad.
- **Acuerdo 1:** Emisión del Reporte Consolidado Fase 1 al 65,2%.
- **Acuerdo 2:** Asistencia técnica personalizada los días 04 y 05 para las facultades de Letras y Ciencias Sociales para acelerar sus Anexos 3.

### Sesión 02/09/2026 12:39 p.m.
- **Tema:** Ajuste metodológico del Anexo 1 (Inventario).
- **Resolución:** Se incorporan procesos de bienestar universitario y bolsa de trabajo dentro del bloque misional.

### Sesión 01/09/2026 05:57 p.m.
- **Tema:** Indicadores del Anexo 4.
- **Resolución:** Aprobación del primer paquete de 35 indicadores comunes de titulación y satisfacción de egresados.`,
    type: 'Bitácora Oficial (.pdf)',
    size: '2.1 MB',
    date: '02/09/2026',
    author: 'Secretaría Técnica de Procesos',
    status: 'Aprobado',
    tags: ['Actas', 'Acuerdos', 'Supervisión'],
  },
  {
    id: 'doc-anexo-1',
    category: 'formatos',
    code: 'OGP-ANEXO-01-v3.2',
    title: 'Anexo 1: Formato de Inventario de Procesos UNMSM v3.2',
    description: 'Plantilla oficial para listar, clasificar y jerarquizar los macroprocesos, procesos y subprocesos de cada dependencia.',
    content: `# Instructivo Técnico: Anexo 1 (Inventario de Procesos)

## 1. Estructura de la Matriz
El Anexo 1 debe contener los siguientes campos obligatorios por cada proceso:
1. **Código del Proceso:** Sigla Facultad + Tipo (PE/PO/PS) + Número correlativo.
2. **Nivel de Jerarquía:** Nivel 0 (Macroproceso), Nivel 1 (Proceso), Nivel 2 (Subproceso).
3. **Tipo de Proceso:**
   - Estratégico (PE): Planificación, calidad, gestión institucional.
   - Operativo / Misional (PO): Enseñanza y formación profesional, investigación, extensión cultural.
   - Soporte (PS): Administración, logística, soporte TI, infraestructura.
4. **Dueño o Responsable:** Cargo formal en el ROF/MOF (ej. Director de Escuela Profesional).
5. **Estado de Validación:** En borrador, Validado por OGP, Aprobado por Consejo de Facultad.`,
    type: 'Plantilla Excel (.xlsx)',
    size: '2.4 MB',
    date: '28/08/2026',
    author: 'OGP - Área de Procesos',
    status: 'Oficial',
    tags: ['Anexo 1', 'Inventario', 'Formato Oficial'],
  },
  {
    id: 'doc-anexo-3',
    category: 'formatos',
    code: 'OGP-ANEXO-03-v2.5',
    title: 'Anexo 3: Ficha Técnica de Caracterización de Proceso',
    description: 'Formato estándar para la descripción operativa, SIPOC (proveedor, entrada, proceso, salida, cliente), controles y riesgos.',
    content: `# Instructivo Técnico: Anexo 3 (Ficha de Caracterización)

## Contenido de la Ficha SIPOC
- **Nombre del Proceso:** Redacción en verbo infinitivo + sustantivo (ej. "Gestionar matrícula de pregrado").
- **Objetivo del Proceso:** Qué logra y para quién.
- **Alcance:** Desde la convocatoria hasta la publicación de listas definitivas.
- **Proveedores:** Dependencias o entidades que suministran insumos.
- **Entradas:** Documentos, solicitudes, bases de datos o materias primas.
- **Secuencia de Actividades:** Diagrama de bloques de actividades principales (1 a 8 pasos).
- **Salidas:** Productos o servicios brindados (ej. Constancia de matrícula).
- **Clientes / Usuarios:** Estudiantes, docentes, público general.
- **Riesgos y Controles:** Riesgos operacionales y medidas de mitigación.`,
    type: 'Plantilla Word (.docx)',
    size: '1.2 MB',
    date: '28/08/2026',
    author: 'OGP - Área de Procesos',
    status: 'Oficial',
    tags: ['Anexo 3', 'Caracterización', 'SIPOC'],
  },
  {
    id: 'doc-anexo-4',
    category: 'formatos',
    code: 'OGP-ANEXO-04-v2.1',
    title: 'Anexo 4: Ficha de Indicadores de Desempeño y Medición',
    description: 'Catálogo de métricas, fórmulas matemáticas, frecuencias de cálculo, fuentes de datos y umbrales de alerta.',
    content: `# Instructivo Técnico: Anexo 4 (Indicadores de Gestión)

## Requisitos de Formulación
Cada indicador debe poseer:
1. **Nombre del Indicador:** Claro y unívoco.
2. **Fórmula Matemática:** Expresión cuantitativa con variables definidas.
   *Ejemplo:* \`(N° de expedientes de grado atendidos en <= 15 días / N° total de expedientes) * 100\`
3. **Sentido del Indicador:** Creciente (mayor es mejor) o decreciente (menor es mejor).
4. **Periodicidad:** Mensual, Semestral o Anual.
5. **Línea Base:** Último valor histórico registrado (2025).
6. **Meta 2026:** Valor objetivo acordado en el POI / Plan Estratégico.
7. **Fuente de Datos:** Sistema de información institucional (ej. SUM, SGD, MAT).`,
    type: 'Plantilla Excel (.xlsx)',
    size: '1.8 MB',
    date: '28/08/2026',
    author: 'OGP - Área de Procesos',
    status: 'Oficial',
    tags: ['Anexo 4', 'Indicadores', 'Métricas'],
  },
  {
    id: 'doc-guia-metodologica',
    category: 'normativa',
    code: 'GUIA-PCM-UNMSM-2026',
    title: 'Guía Metodológica para la Gestión por Procesos en Facultades',
    description: 'Manual de 120 páginas con casos prácticos, lineamientos de la PCM y recomendaciones para la simplificación administrativa.',
    content: `# Guía Metodológica de Gestión por Procesos

## Marco Conceptual
La Gestión por Procesos es una forma de conducir la organización poniendo el foco en los resultados que generan valor para la ciudadanía y la comunidad sanmarquina.

## Pasos para la Implementación en Facultades:
1. Conformar el Comité de Procesos de la Facultad presidido por el Vicedecanato Académico.
2. Revisar el Mapa de Procesos Institucional de la UNMSM.
3. Completar el Inventario (Anexo 1) identificando todos los servicios a estudiantes y docentes.
4. Caracterizar los procesos críticos mediante el Anexo 3.
5. Definir los indicadores de medición a través del Anexo 4.
6. Presentar la carpeta final ante la Oficina General de Planificación.`,
    type: 'Manual Técnico (.pdf)',
    size: '5.2 MB',
    date: '15/08/2026',
    author: 'Equipo Metodológico OGP - UNMSM',
    status: 'Oficial',
    tags: ['Guía', 'Metodología', 'Manual', 'Capacitación'],
  },
];
