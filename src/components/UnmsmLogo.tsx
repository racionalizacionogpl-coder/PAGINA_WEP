import React from 'react';
import unmsmEscudoShield from '../assets/unmsm_escudo_shield.svg';
import unmsmEscudoFull from '../assets/unmsm_escudo.svg';

interface UnmsmLogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'color';
  useFullLogo?: boolean;
}

export const UnmsmLogo: React.FC<UnmsmLogoProps> = ({
  className = 'h-12',
  showText = true,
  variant = 'dark',
  useFullLogo = false,
}) => {
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-800';
  const subColor = variant === 'light' ? 'text-slate-300' : 'text-slate-600';
  const logoSrc = useFullLogo ? unmsmEscudoFull : unmsmEscudoShield;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official UNMSM University Coat of Arms Logo Frame */}
      <div className="relative flex items-center justify-center p-1 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 transition-all duration-200 shrink-0">
        <img
          src={logoSrc}
          alt="Escudo Oficial UNMSM - Universidad Nacional Mayor de San Marcos"
          className="h-11 sm:h-12 w-auto shrink-0 object-contain drop-shadow-xs transition-transform duration-200 hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Official Text: UNMSM + Oficina General de Planificación */}
      {showText && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-serif font-black tracking-wider text-xl sm:text-2xl ${textColor}`}>
              UNMSM
            </span>
          </div>
          <span className={`text-[11px] sm:text-xs font-medium tracking-tight ${subColor}`}>
            Oficina General de Planificación
          </span>
        </div>
      )}
    </div>
  );
};

