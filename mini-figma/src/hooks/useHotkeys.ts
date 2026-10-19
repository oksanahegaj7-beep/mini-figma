import { useEffect } from 'react';
import type { Tool } from '../types/shape';
import { HISTORY_SHORTCUTS, TOOL_SHORTCUTS } from '../constants/tools';

/** Поля ввода имеют собственные горячие клавиши — там мы их не перехватываем. */
const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  );
};

/**
 * Глобальные горячие клавиши редактора.
 *
 * Инструменты: V — курсор, R — прямоугольник, O — эллипс.
 * История: Ctrl/Cmd + Z — отменить, Ctrl/Cmd + Shift + Z (или Ctrl + Y) — повторить.
 */
export const useHotkeys = (
  onToolChange: (tool: Tool) => void,
  spacePressed: boolean,
  onUndo?: () => void,
  onRedo?: () => void
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
  }, [onToolChange, spacePressed, onUndo, onRedo]);
};
