import type { Tool } from '../types/shape';

export const TOOLS: { id: Tool; label: string; shortcut: string }[] = [
  { id: 'select', label: 'Select', shortcut: 'V' },
  { id: 'text', label: 'Text', shortcut: 'T' },
  { id: 'rectangle', label: 'Rectangle', shortcut: 'R' },
  { id: 'line', label: 'Line', shortcut: 'L' },
  { id: 'image', label: 'Image', shortcut: '' },
];

/**
 * Клавиши инструментов. Храним и символ (`e.key`), и физический код (`e.code`):
 * так горячие клавиши работают и в нелатинской раскладке (например, русской).
 */
export const TOOL_SHORTCUTS: Record<string, Tool> = {
  V: 'select',
  v: 'select',
  KeyV: 'select',
  T: 'text',
  t: 'text',
  KeyT: 'text',
  R: 'rectangle',
  r: 'rectangle',
  KeyR: 'rectangle',
  L: 'line',
  l: 'line',
  KeyL: 'line',
  O: 'ellipse',
  o: 'ellipse',
  KeyO: 'ellipse',
  ' ': 'pan',
};

/** Клавиши истории изменений. Комбинируются с Ctrl (Windows/Linux) или Cmd (macOS). */
export const HISTORY_SHORTCUTS = {
  /** Ctrl/Cmd + Z — отменить. */
  undo: 'z',
  /** Ctrl/Cmd + Shift + Z — повторить. */
  redo: 'z',
  /** Ctrl + Y — альтернативный повтор в Windows, как в Figma. */
  redoAlt: 'y',
} as const;
