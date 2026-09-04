import React from 'react';

interface QuipucamayocLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const QuipucamayocLogo: React.FC<QuipucamayocLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Andean Quipu Knot Icon from Image 1 */}
      <svg
        className={isLarge ? 'w-10 h-10' : isSmall ? 'w-6 h-6' : 'w-8 h-8'}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main horizontal chord */}
        <path
          d="M4 12 C16 10 32 10 44 12"
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Hanging knotted threads with bright Andean colors (red/coral, orange, emerald green, cyan, blue, purple) */}
        {/* Thread 1 - Red */}
        <path d="M10 12 L10 40" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="10" cy="20" r="2.5" fill="#f43f5e" />
        <circle cx="10" cy="30" r="2.5" fill="#f43f5e" />

        {/* Thread 2 - Orange */}
        <path d="M16 11.5 L16 43" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="16" cy="18" r="2.2" fill="#f97316" />
        <circle cx="16" cy="26" r="2.2" fill="#f97316" />
        <circle cx="16" cy="35" r="2.2" fill="#f97316" />

        {/* Thread 3 - Emerald Green */}
        <path d="M22 11 L22 41" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="22" cy="19" rx="3" ry="2.2" fill="#10b981" />
        <ellipse cx="22" cy="28" rx="3" ry="2.2" fill="#10b981" />
        <ellipse cx="22" cy="37" rx="2.5" ry="2" fill="#10b981" />

        {/* Thread 4 - Teal/Cyan */}
        <path d="M28 11 L28 44" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="28" cy="22" r="2.2" fill="#06b6d4" />
        <circle cx="28" cy="32" r="2.2" fill="#06b6d4" />

        {/* Thread 5 - Royal Blue */}
        <path d="M34 11.5 L34 39" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="34" cy="17" r="2.2" fill="#3b82f6" />
        <circle cx="34" cy="25" r="2.2" fill="#3b82f6" />

        {/* Thread 6 - Violet / Indigo */}
        <path d="M40 12 L40 42" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="40" cy="21" r="2.2" fill="#8b5cf6" />
        <circle cx="40" cy="33" r="2.2" fill="#8b5cf6" />
      </svg>

      {/* Typography: "Quipu" bold + "camayoc" regular */}
      <div className="flex flex-col leading-none font-poppins">
        <div className="flex items-baseline">
          <span className={`font-black tracking-tight text-slate-900 ${isLarge ? 'text-2xl' : isSmall ? 'text-sm' : 'text-lg'}`}>
            Quipu
          </span>
          <span className={`font-normal text-slate-700 ${isLarge ? 'text-2xl' : isSmall ? 'text-sm' : 'text-lg'}`}>
            camayoc
          </span>
        </div>
      </div>
    </div>
  );
};
