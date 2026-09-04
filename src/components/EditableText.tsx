import React, { useEffect, useRef, useState } from 'react';
import { Edit2 } from 'lucide-react';

interface EditableTextProps {
  storageKey: string;
  defaultText: string;
  className?: string;
  tag?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'a';
  onChange?: (newText: string) => void;
  id?: string;
  showIconOnHover?: boolean;
  multiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  storageKey,
  defaultText,
  className = '',
  tag = 'span',
  onChange,
  id,
  showIconOnHover = true,
  multiline = false,
}) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const [currentText, setCurrentText] = useState(defaultText);
  const [isEditing, setIsEditing] = useState(false);

  const fullKey = 'kpi_edit_corporativo_' + storageKey;

  const loadText = () => {
    const saved = localStorage.getItem(fullKey);
    if (saved !== null && saved !== undefined && saved !== '') {
      setCurrentText(saved);
      if (elementRef.current && elementRef.current.innerText !== saved) {
        elementRef.current.innerText = saved;
      }
      if (onChange) onChange(saved);
    } else {
      setCurrentText(defaultText);
      if (elementRef.current && elementRef.current.innerText !== defaultText) {
        elementRef.current.innerText = defaultText;
      }
    }
  };

  useEffect(() => {
    loadText();

    // Listen to custom header update events
    const handleStorageChange = (e: CustomEvent | StorageEvent) => {
      loadText();
    };

    window.addEventListener('kpi_header_updated' as any, handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('kpi_header_updated' as any, handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [storageKey, defaultText]);

  const handleInput = () => {
    if (elementRef.current) {
      const text = elementRef.current.innerText.trim();
      localStorage.setItem(fullKey, text);
      setCurrentText(text);
      if (onChange) onChange(text);

      // Dispatch event for other listening components
      window.dispatchEvent(
        new CustomEvent('kpi_header_updated', {
          detail: { key: storageKey, value: text },
        })
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      if (elementRef.current) {
        elementRef.current.blur();
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const Tag = tag;

  return (
    <span className="relative inline-flex items-center group/editable max-w-full">
      <Tag
        ref={elementRef as any}
        id={id || `editable-${storageKey}`}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={() => {
          handleInput();
          setIsEditing(false);
        }}
        onFocus={() => setIsEditing(true)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`outline-none transition-all cursor-text rounded px-1 -mx-1 hover:bg-black/5 hover:ring-1 hover:ring-sky-400/60 focus:bg-sky-50/20 focus:ring-2 focus:ring-sky-500 ${
          isEditing ? 'ring-2 ring-sky-500' : ''
        } ${className}`}
        title="Clic para editar directamente este encabezado"
      >
        {currentText}
      </Tag>

      {showIconOnHover && !isEditing && (
        <span
          className="ml-1 opacity-0 group-hover/editable:opacity-70 hover:!opacity-100 transition-opacity pointer-events-none shrink-0"
          title="Editable directamente"
        >
          <Edit2 className="w-3 h-3 text-sky-500 inline-block" />
        </span>
      )}
    </span>
  );
};
