import type { Tool } from '../types/shape';
import { ShapesMenu } from './ShapesMenu';

type TopBarProps = {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
};

const getToolIcon = (toolId: Tool) => {
  switch (toolId) {
    case 'select':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 2L12 9H7L4 12V2Z" />
        </svg>
      );
    case 'text':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M3 3h10v2H9v8H7V5H3V3z" />
        </svg>
      );
    case 'rectangle':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="12" height="10" rx="1" />
        </svg>
      );
    case 'line':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
          <line x1="2" y1="14" x2="14" y2="2" />
        </svg>
      );
    case 'image':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3zm1 0v6.586l2-2 3 3 2-2 3 3V3H3zm0 10h10V9.414l-3-3-2 2-3-3L3 8.414V13z" />
        </svg>
      );
    case 'ellipse':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <ellipse cx="8" cy="8" rx="6" ry="5" />
        </svg>
      );
    case 'pan':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 2L10 6H6L8 2ZM8 14L10 10H6L8 14ZM2 8L6 10V6L2 8ZM14 8L10 10V6L14 8Z" />
        </svg>
      );
    default:
      return null;
  }
};

export const TopBar = ({ activeTool, onToolChange }: TopBarProps) => {
  const mainTools: Tool[] = ['select', 'text', 'rectangle', 'line', 'image'];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex h-11 items-center bg-[#2c2c2c] px-2">
      <div className="flex items-center gap-0.5">
        {mainTools.map((tool) => (
          <button
            key={tool}
            type="button"
            title={`${tool}`}
            aria-pressed={activeTool === tool}
            onClick={() => onToolChange(tool)}
            className={`flex h-7 w-7 items-center justify-center rounded-sm transition-colors focus:outline-none ${
              activeTool === tool
                ? 'bg-[#3c3c3c] text-white'
                : 'text-zinc-400 hover:bg-[#3c3c3c] hover:text-white'
            }`}
          >
            {getToolIcon(tool)}
          </button>
        ))}
        <ShapesMenu onSelectShape={onToolChange} />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-sm font-medium text-zinc-200">
        mini-figma
      </div>
    </header>
  );
};