import React from 'react';
import { EditableText } from './EditableText';
import { UnmsmLogo } from './UnmsmLogo';

export const HeroSection: React.FC = () => {
  return (
    <header id="hero-section" className="hero-section px-6 md:px-8 pt-16 pb-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-4 relative z-10">
        
        {/* Top line with UNMSM - Oficina General de Planificación (Image 3) */}
        <div className="flex items-center gap-3 mb-1">
          <UnmsmLogo variant="light" className="h-9" showText={true} />
          <span className="text-slate-400 text-xs hidden md:inline">|</span>
          <div className="text-xs font-semibold tracking-wider text-sky-400 uppercase hidden md:block">
            <EditableText
              storageKey="hero_tagline"
              defaultText="IMPLEMENTACIÓN DE LA GESTIÓN POR PROCESOS · 20 FACULTADES"
              className="outline-none"
            />
          </div>
        </div>

        <div className="md:hidden text-xs font-semibold tracking-wider text-sky-400 uppercase">
          <EditableText
            storageKey="hero_tagline_mobile"
            defaultText="IMPLEMENTACIÓN DE LA GESTIÓN POR PROCESOS · 20 FACULTADES"
            className="outline-none"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight max-w-4xl font-poppins text-white">
          <EditableText
            storageKey="hero_title"
            defaultText="Centro de Documentación de la Gestión por Procesos"
            className="outline-none"
          />
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mt-1 sm:mt-2 font-light leading-relaxed">
          <EditableText
            storageKey="hero_description"
            defaultText="Los documentos que rigen el proyecto, en su versión vigente. Haz clic en cualquier texto de esta pantalla para editar los campos de manera interactiva."
            className="outline-none"
          />
        </p>

        {/* Status Chip */}
        <div className="mt-4 sm:mt-6 inline-flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 px-5 py-2.5 rounded-full w-fit backdrop-blur-md shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm text-slate-200 font-medium">
            <EditableText
              storageKey="hero_status"
              defaultText="Identificación en curso · Cierra el 30 de setiembre de 2026"
              className="outline-none"
            />
          </span>
        </div>
      </div>
    </header>
  );
};
