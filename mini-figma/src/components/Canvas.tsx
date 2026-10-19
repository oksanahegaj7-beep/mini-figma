import type { Camera, Shape, Tool } from '../types/shape';
import { ShapeComponent } from './Shape';

type CanvasProps = {
  camera: Camera;
  shapes: Shape[];
  selectedId: string | null;
  activeTool: Tool;
  isPanning: boolean;
  spacePressed: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onSelectShape?: (id: string | null, e: React.MouseEvent) => void;
  onResizeShape?: (e: React.MouseEvent, handle: string) => void;
};

/** Холст на весь экран: сетка на фоне, мышь, зум колесом, панорама пробелом. */
export const Canvas = ({
  camera,
  shapes,
  selectedId,
  activeTool,
  isPanning,
  spacePressed,
  containerRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onSelectShape,
  onResizeShape,
}: CanvasProps) => {
  const gridSize = 20 * camera.scale;
  const showGrid = camera.scale > 0.2;
  const cursor = isPanning
    ? 'grabbing'
    : spacePressed || activeTool === 'pan'
      ? 'grab'
      : activeTool === 'select'
        ? 'default'
        : 'crosshair';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 top-11 left-56 right-56 select-none overflow-hidden bg-[#2f2f2f]"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={{ cursor }}
    >
      {/* Сетка на фоне */}
      {showGrid && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
            backgroundPosition: `${camera.x % gridSize}px ${camera.y % gridSize}px`,
            opacity: 0.4,
          }}
        />
      )}

      {/* Белый лист для рисования с легкой тенью */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: camera.x,
          top: camera.y,
          width: '800px',
          height: '600px',
          transform: `scale(${camera.scale}) translate(-400px, -300px)`,
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
          transformOrigin: 'center',
        }}
      />

      {/* Фигуры */}
      {shapes.map((shape) => (
        <ShapeComponent
          key={shape.id}
          shape={shape}
          isSelected={selectedId === shape.id}
          camera={camera}
          onSelect={(id, e) => onSelectShape?.(id, e)}
          onResize={onResizeShape}
        />
      ))}
    </div>
  );
};