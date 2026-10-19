import type { Tool } from '../types/shape';
import { useState } from 'react';

type ShapesMenuProps = {
  onSelectShape: (tool: Tool) => void;
};

const shapeOptions: { id: Tool; label: string; icon: React.ReactNode }[] = [
  { 
    id: 'ellipse', 
    label: 'Эллипс', 
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="8" cy="8" rx="6" ry="5"/></svg>
  },
  { 
    id: 'triangle', 
    label: 'Треугольник', 
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2L14 14H2L8 2Z"/></svg>
  },
  { 
    id: 'diamond', 
    label: 'Ромб', 
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="4" width="8" height="8" transform="rotate(45 8 8)"/></svg>
  },
  { 
    id: 'line', 
    label: 'Линия', 
    icon: <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5"><line x1="2" y1="8" x2="14" y2="8"/></svg>
  },
  { 
    id: 'arrow', 
    label: 'Стрелка', 
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 8h10m0 0L8 4m4 4l-4 4"/></svg>
  },
  { 
    id: 'star', 
    label: 'Звезда', 
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.3l2.5 5.1 5.6.8-4.1 4 1 5.6L8 13.3 3 16l1-5.6L0 7.2l5.6-.8L8 1.3z"/></svg>
  },
  { 
    id: 'polygon', 
    label: 'Пятиугольник', 
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l5 3v4l-5 3-5-3V4l5-3z"/></svg>
  },
];

export const ShapesMenu = ({ onSelectShape }: ShapesMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-7 w-7 items-center justify-center rounded-sm text-zinc-400 hover:bg-[#3c3c3c] hover:text-white transition-colors"
        title="Фигуры"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 3h8v2H4V3zm-2 4h12v2H2V7zm4 4h4v2H6v-2z"/>
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-30 w-40 rounded border border-[#3c3c3c] bg-[#1e1e1e] shadow-lg">
          {shapeOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onSelectShape(option.id);
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-zinc-200 hover:bg-[#2c2c2c]"
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};