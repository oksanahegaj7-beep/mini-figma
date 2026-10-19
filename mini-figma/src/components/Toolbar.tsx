import type { Tool } from '../types/shape';
import { TOOLS } from '../constants/tools';

type ToolbarProps = {
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
    case 'rectangle':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="12" height="10" rx="1" />
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

/** Панель инструментов слева. */
export const Toolbar = ({ activeTool, onToolChange }: ToolbarProps) => {
  return (
    <div className="fixed left-0 top-12 z-10 hidden flex-col gap-1 bg-[#1e1e1e] p-2">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          type="button"
          title={`${tool.label} (${tool.shortcut})`}
          aria-pressed={activeTool === tool.id}
          onClick={() => onToolChange(tool.id)}
          className={`flex h-9 w-9 items-center justify-center rounded transition-colors focus:outline-none ${
            activeTool === tool.id
              ? 'bg-[#3c3c3c] text-white'
              : 'text-zinc-400 hover:bg-[#2c2c2c] hover:text-white'
          }`}
        >
          {getToolIcon(tool.id)}
        </button>
      ))}
    </div>
  );
};