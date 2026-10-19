import { useCallback, useMemo, useRef, useState } from 'react';
import type { Point, Shape, ShapeType } from '../types/shape';
import { moveShape, normalizeRect, resizeShape } from '../utils/geometry';
import { DEFAULT_SHAPE_FILL } from '../constants/shapes';

let idSeq = 0;
const nextId = () => `shape-${Date.now().toString(36)}-${(idSeq += 1)}`;

/** Сколько шагов истории храним. */
const HISTORY_LIMIT = 100;
/** Меньше этого в координатах канваса — считаем, что был клик, а не перетаскивание. */
const CLICK_SIZE = 2;
/** Размер фигуры, созданной одним кликом. */
const DEFAULT_SIZE = 100;

type DragState = {
  isDragging: boolean;
  startMouse: Point;
  startShape: Shape | null;
};

type ResizeState = {
  isResizing: boolean;
  handle: string;
  startMouse: Point;
  startShape: Shape | null;
};

/** История изменений: снимки фигур до и после текущего состояния. */
type ShapesHistory = {
  past: Shape[][];
  present: Shape[];
  future: Shape[][];
};

/**
 * Состояние фигур: список, добавление, изменение, выделение, перетаскивание
 * и история для Undo/Redo.
 */
export const useShapes = () => {
  const [history, setHistory] = useState<ShapesHistory>({
    past: [],
    present: [],
    future: [],
  });
  const [selectedIdState, setSelectedId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startMouse: { x: 0, y: 0 },
    startShape: null,
  });

  const shapes = history.present;

  // Если фигура исчезла (например, её отменили через Undo) — выделение снимается.
  // Вычисляем при рендере, чтобы не запускать лишний эффект с setState.
  const selectedId = useMemo(
    () =>
      selectedIdState !== null && shapes.some((shape) => shape.id === selectedIdState)
        ? selectedIdState
        : null,
    [selectedIdState, shapes]
  );

  // Снимок до начала перетаскивания: всё перетаскивание — один шаг истории,
  // а не отдельная запись на каждое движение мыши.
  const dragSnapshot = useRef<Shape[] | null>(null);
  const dragMoved = useRef(false);

  const selectedShape = useMemo(
    () => shapes.find((shape) => shape.id === selectedId) ?? null,
    [shapes, selectedId]
  );

  /** Изменяет текущее состояние, сохраняя предыдущее в историю. */
  const commit = useCallback((updater: (shapes: Shape[]) => Shape[]) => {
    setHistory((prev) => {
      const next = updater(prev.present);
      if (next === prev.present) return prev;
      return {
        past: [...prev.past, prev.present].slice(-HISTORY_LIMIT),
        present: next,
        future: [],
      };
    });
  }, []);

  /** Изменяет текущее состояние без записи в историю (для перетаскивания). */
  const setPresent = useCallback((updater: (shapes: Shape[]) => Shape[]) => {
    setHistory((prev) => {
      const next = updater(prev.present);
      if (next === prev.present) return prev;
      return { ...prev, present: next };
    });
  }, []);

  const addShape = useCallback(
    (shape: Omit<Shape, 'id'> & { type: ShapeType }) => {
      const id = nextId();
      commit((prev) => [...prev, { ...shape, id }]);
      setSelectedId(id);
      return id;
    },
    [commit]
  );

  const updateShape = useCallback(
    (id: string, updates: Partial<Shape>) => {
      commit((prev) =>
        prev.map((shape) => (shape.id === id ? { ...shape, ...updates } : shape))
      );
    },
    [commit]
  );

  const selectShape = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const removeShape = useCallback(
    (id: string) => {
      commit((prev) => prev.filter((shape) => shape.id !== id));
      setSelectedId((prev) => (prev === id ? null : prev));
    },
    [commit]
  );

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      return {
        past: prev.past.slice(0, -1),
        present: previous,
        future: [prev.present, ...prev.future].slice(0, HISTORY_LIMIT),
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const [next, ...rest] = prev.future;
      return {
        past: [...prev.past, prev.present].slice(-HISTORY_LIMIT),
        present: next,
        future: rest,
      };
    });
  }, []);

  const startDrag = useCallback(
    (id: string, mouse: Point) => {
      if (!selectedShape || selectedShape.id !== id) {
        setSelectedId(id);
      }
      const shape = shapes.find((s) => s.id === id);
      if (!shape) return;
      dragSnapshot.current = shapes;
      dragMoved.current = false;
      setDragState({
        isDragging: true,
        startMouse: { x: mouse.x, y: mouse.y },
        startShape: shape,
      });
    },
    [selectedShape, shapes]
  );

  const updateDrag = useCallback(
    (mouse: Point) => {
      if (!dragState.isDragging || !dragState.startShape) return;
      const dx = mouse.x - dragState.startMouse.x;
      const dy = mouse.y - dragState.startMouse.y;
      if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) return;
      const newShape = moveShape(dragState.startShape, dx, dy);
      dragMoved.current = true;
      setPresent((prev) =>
        prev.map((shape) => (shape.id === newShape.id ? newShape : shape))
      );
      setDragState((prev) => ({
        ...prev,
        startMouse: { x: mouse.x, y: mouse.y },
        startShape: newShape,
      }));
    },
    [
      dragState.isDragging,
      dragState.startMouse.x,
      dragState.startMouse.y,
      dragState.startShape,
      setPresent,
    ]
  );

  const endDrag = useCallback(() => {
    // Фиксируем одно перемещение целиком, только если фигура реально сдвинулась.
    if (dragMoved.current && dragSnapshot.current) {
      const snapshot = dragSnapshot.current;
      setHistory((prev) => ({
        past: [...prev.past, snapshot].slice(-HISTORY_LIMIT),
        present: prev.present,
        future: [],
      }));
    }
    dragSnapshot.current = null;
    dragMoved.current = false;
    setDragState({
      isDragging: false,
      startMouse: { x: 0, y: 0 },
      startShape: null,
    });
  }, []);

  // --- Изменение размера за ручки трансформации ---

  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    handle: '',
    startMouse: { x: 0, y: 0 },
    startShape: null,
  });
  const resizeSnapshot = useRef<Shape[] | null>(null);
  const resizeMoved = useRef(false);

  /** Начало ресайза: снимок состояния, весь жест — один шаг истории. */
  const startResize = useCallback(
    (id: string, handle: string, mouse: Point) => {
      const shape = shapes.find((s) => s.id === id);
      if (!shape) return;
      resizeSnapshot.current = shapes;
      resizeMoved.current = false;
      setResizeState({
        isResizing: true,
        handle,
        startMouse: { x: mouse.x, y: mouse.y },
        startShape: shape,
      });
    },
    [shapes]
  );

  /** Размер считается от исходной фигуры и полного смещения курсора. */
  const updateResize = useCallback(
    (mouse: Point) => {
      if (!resizeState.isResizing || !resizeState.startShape) return;
      const dx = mouse.x - resizeState.startMouse.x;
      const dy = mouse.y - resizeState.startMouse.y;
      if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) return;
      const newShape = resizeShape(resizeState.startShape, resizeState.handle, dx, dy);
      resizeMoved.current = true;
      setPresent((prev) =>
        prev.map((shape) => (shape.id === newShape.id ? newShape : shape))
      );
    },
    [
      resizeState.isResizing,
      resizeState.handle,
      resizeState.startMouse.x,
      resizeState.startMouse.y,
      resizeState.startShape,
      setPresent,
    ]
  );

  const endResize = useCallback(() => {
    // Фиксируем один ресайз целиком, только если фигура реально изменилась.
    if (resizeMoved.current && resizeSnapshot.current) {
      const snapshot = resizeSnapshot.current;
      setHistory((prev) => ({
        past: [...prev.past, snapshot].slice(-HISTORY_LIMIT),
        present: prev.present,
        future: [],
      }));
    }
    resizeSnapshot.current = null;
    resizeMoved.current = false;
    setResizeState({
      isResizing: false,
      handle: '',
      startMouse: { x: 0, y: 0 },
      startShape: null,
    });
  }, []);

  // --- Создание фигуры перетаскиванием ---

  const drawRef = useRef<{ id: string; start: Point } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  /**
   * Начало рисования: `point` уже в координатах канваса
   * (App переводит через screenToCanvas — зум и панорама учитываются).
   * addShape пишет один шаг в историю, размер тянется без лишних записей.
   */
  const beginDraw = useCallback(
    (point: Point, type: ShapeType) => {
      const id = addShape({
        type,
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        fill: type === 'line' || type === 'arrow' ? undefined : DEFAULT_SHAPE_FILL,
        stroke: type === 'line' || type === 'arrow' ? '#000000' : undefined,
        strokeWidth: type === 'line' || type === 'arrow' ? 2 : 1,
      });
      drawRef.current = { id, start: point };
      setIsDrawing(true);
      return id;
    },
    [addShape]
  );

  /** Текущая позиция курсора задаёт прямоугольник от точки начала до неё. */
  const updateDraw = useCallback(
    (point: Point) => {
      const draw = drawRef.current;
      if (!draw) return;
      const rect = normalizeRect(draw.start, point);
      setPresent((prev) =>
        prev.map((shape) => (shape.id === draw.id ? { ...shape, ...rect } : shape))
      );
    },
    [setPresent]
  );

  /** Финиш: клик без тяги получает размер по умолчанию, вырожденный растяг — минимум 1px. */
  const endDraw = useCallback(() => {
    const draw = drawRef.current;
    if (!draw) return;
    drawRef.current = null;
    setIsDrawing(false);
    setPresent((prev) =>
      prev.map((shape) => {
        if (shape.id !== draw.id) return shape;
        if (shape.width < CLICK_SIZE && shape.height < CLICK_SIZE) {
          return { ...shape, width: DEFAULT_SIZE, height: DEFAULT_SIZE };
        }
        return {
          ...shape,
          width: Math.max(shape.width, 1),
          height: Math.max(shape.height, 1),
        };
      })
    );
  }, [setPresent]);

  return {
    shapes,
    selectedId,
    selectedShape,
    addShape,
    updateShape,
    selectShape,
    removeShape,
    dragState,
    startDrag,
    updateDrag,
    endDrag,
    resizeState,
    startResize,
    updateResize,
    endResize,
    isDrawing,
    beginDraw,
    updateDraw,
    endDraw,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
};
