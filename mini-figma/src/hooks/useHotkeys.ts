import { useEffect } from 'react';
import type { Tool } from '../types/shape';
import { HISTORY_SHORTCUTS, TOOL_SHORTCUTS } from '../constants/tools';
import { isEditableTarget } from '../utils/dom';

/**
 * Глобальные горячие клавиши редактора.
 *
 * Инструменты: V — курсор, R — прямоугольник, O — эллипс.
 * История: Ctrl/Cmd + Z — отменить, Ctrl/Cmd + Shift + Z (или Ctrl + Y) — повторить.
 * Delete/Backspace — onDelete (удаление выделенной фигуры).
 */
export const useHotkeys = (
  onToolChange: (tool: Tool) => void,
  spacePressed: boolean,
  onUndo?: () => void,
  onRedo?: () => void,
  onDelete?: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;

      const key = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;

      // Undo / Redo. Проверяем до инструментов: Ctrl+R не должен выбрать
      // прямоугольник и не должен блокировать перезагрузку страницы.
      if (mod) {
        if (key === HISTORY_SHORTCUTS.redo && e.shiftKey) {
          if (onRedo) {
            e.preventDefault();
            onRedo();
          }
        } else if (
          !e.shiftKey &&
          (key === HISTORY_SHORTCUTS.undo || key === HISTORY_SHORTCUTS.redoAlt)
        ) {
          if (onUndo) {
            e.preventDefault();
            onUndo();
          }
        }
        return;
      }

      if (e.altKey) return;

      // Удаление выделенной фигуры
      if ((key === 'delete' || key === 'backspace') && onDelete) {
        e.preventDefault();
        onDelete();
        return;
      }

      // Пробел обрабатывает useViewport (панорамирование).
      if (e.code === 'Space' || e.key === ' ') return;

      const tool = TOOL_SHORTCUTS[e.key] || TOOL_SHORTCUTS[e.code];
      if (tool) {
        e.preventDefault();
        onToolChange(tool);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToolChange, spacePressed, onUndo, onRedo, onDelete]);
};
