import type { Camera, Point, Shape } from '../types/shape';

/**
 * Экранные координаты (clientX/clientY) → координаты канваса
 * с учётом зума и панорамирования.
 */
export function screenToCanvas(screen: Point, camera: Camera): Point {
  return {
    x: (screen.x - camera.x) / camera.scale,
    y: (screen.y - camera.y) / camera.scale,
  };
}

/** Перемещение фигуры на dx, dy в координатах канваса. */
export function moveShape(shape: Shape, dx: number, dy: number): Shape {
  return {
    ...shape,
    x: shape.x + dx,
    y: shape.y + dy,
  };
}

/**
 * Изменение размера фигуры перетаскиванием ручки `handle`
 * ('tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r') на dx, dy в координатах канваса.
 * Ручка, протащенная «насквозь», разворачивает прямоугольник — как при рисовании.
 */
export function resizeShape(shape: Shape, handle: string, dx: number, dy: number): Shape {
  let { x, y, width, height } = shape;

  if (handle.includes('l')) {
    x += dx;
    width -= dx;
  }
  if (handle.includes('r')) {
    width += dx;
  }
  if (handle.includes('t')) {
    y += dy;
    height -= dy;
  }
  if (handle.includes('b')) {
    height += dy;
  }

  if (width < 0) {
    x += width;
    width = -width;
  }
  if (height < 0) {
    y += height;
    height = -height;
  }

  return { ...shape, x, y, width, height };
}

/** Границы фигуры в координатах канваса (x,y,width,height). */
export function getShapeBounds(shape: Shape) {
  return {
    x: shape.x,
    y: shape.y,
    width: shape.width,
    height: shape.height,
  };
}

/**
 * Координаты канваса → экранные координаты.
 * Без этого пересчёта фигуры «уезжают» относительно курсора при зуме и сдвиге.
 */
export function canvasToScreen(canvas: Point, camera: Camera): Point {
  return {
    x: canvas.x * camera.scale + camera.x,
    y: canvas.y * camera.scale + camera.y,
  };
}

/** Плавный зум к точке `anchor` (в экранных координатах): точка под курсором остаётся на месте. */
export function zoomTo(camera: Camera, anchor: Point, scale: number): Camera {
  const ratio = scale / camera.scale;
  return {
    scale,
    x: anchor.x - (anchor.x - camera.x) * ratio,
    y: anchor.y - (anchor.y - camera.y) * ratio,
  };
}

/**
 * Прямоугольник по двум углам перетаскивания.
 * x/y — левый верхний угол, width/height всегда ≥ 0.
 */
export function normalizeRect(
  a: Point,
  b: Point
): Pick<Shape, 'x' | 'y' | 'width' | 'height'> {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };
}

/**
 * Фигура под точкой (координаты канваса).
 * Последняя в списке отрисовывается поверх остальных — проверяется первой.
 */
export function hitTest(shapes: readonly Shape[], point: Point): Shape | null {
  for (let i = shapes.length - 1; i >= 0; i -= 1) {
    const shape = shapes[i];

    const inside =
      point.x >= shape.x &&
      point.x <= shape.x + shape.width &&
      point.y >= shape.y &&
      point.y <= shape.y + shape.height;
    
    if (inside) return shape;
  }
  return null;
}
