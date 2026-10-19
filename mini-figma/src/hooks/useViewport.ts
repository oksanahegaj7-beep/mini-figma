import { useCallback, useEffect, useRef, useState } from 'react';
import type { Camera, Point } from '../types/shape';
import { zoomTo } from '../utils/geometry';

export const MIN_SCALE = 0.1; // 10%
export const MAX_SCALE = 4; // 400%
const ZOOM_SPEED = 0.001;

/**
 * Камера: панорамирование при зажатом пробеле + мышь,
 * зум колесом от 10% до 400%, центрирование при старте.
 */
export const useViewport = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Центрирование при старте: начало координат канваса — в центре экрана
  const [camera, setCamera] = useState<Camera>(() => ({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    scale: 1,
  }));
  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  const panOrigin = useRef<Point | null>(null);

  // Отслеживание пробела: нажат / отпущен
  useEffect(() => {
    const isSpace = (e: KeyboardEvent) => e.code === 'Space' || e.key === ' ';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSpace(e)) return;
      e.preventDefault();
      setSpacePressed(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!isSpace(e)) return;
      e.preventDefault();
      setSpacePressed(false);
      setIsPanning(false);
      panOrigin.current = null;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Зум колесом. Нативный слушатель с passive: false: React регистрирует
  // onWheel пассивным, и там preventDefault() не работает.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Зум к курсору: точка под ним остаётся на месте (математика — в utils/geometry)
      setCamera((prev) => {
        const factor = 1 - e.deltaY * ZOOM_SPEED;
        const nextScale = Math.min(Math.max(prev.scale * factor, MIN_SCALE), MAX_SCALE);
        return zoomTo(prev, { x: mouseX, y: mouseY }, nextScale);
      });
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Пока идёт панорамирование — следим за мышью на всём окне
  useEffect(() => {
    if (!isPanning) return;

    const handleMouseMove = (e: MouseEvent) => {
      const origin = panOrigin.current;
      if (!origin) return;

      const dx = e.clientX - origin.x;
      const dy = e.clientY - origin.y;
      panOrigin.current = { x: e.clientX, y: e.clientY };

      setCamera((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      panOrigin.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Панорамирование: пробел + ЛКМ или средняя кнопка мыши
      if (spacePressed || e.button === 1) {
        e.preventDefault();
        panOrigin.current = { x: e.clientX, y: e.clientY };
        setIsPanning(true);
      }
    },
    [spacePressed]
  );

  return {
    camera,
    setCamera,
    isPanning,
    spacePressed,
    containerRef,
    handlers: { onMouseDown },
  };
};