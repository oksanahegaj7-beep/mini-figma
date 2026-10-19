import type { Camera, Shape } from '../types/shape';
import { canvasToScreen } from '../utils/geometry';
import { TransformHandles } from './TransformHandles';
import { Image as ImageIcon } from 'lucide-react';

type ShapeProps = {
  shape: Shape;
  isSelected: boolean;
  camera: Camera;
  onSelect?: (id: string, e: React.MouseEvent) => void;
  onResize?: (e: React.MouseEvent, handle: string) => void;
};

/** Рендер одной фигуры: координаты канваса → экран через utils/geometry. */
export const ShapeComponent = ({ shape, isSelected, camera, onSelect, onResize }: ShapeProps) => {
  const { x: screenX, y: screenY } = canvasToScreen({ x: shape.x, y: shape.y }, camera);
  const screenWidth = shape.width * camera.scale;
  const screenHeight = shape.height * camera.scale;

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: screenX,
    top: screenY,
    width: screenWidth,
    height: screenHeight,
    border: shape.stroke ? `${shape.strokeWidth || 1}px solid ${shape.stroke}` : 'none',
    backgroundColor: shape.fill || 'transparent',
    pointerEvents: 'none',
    opacity: shape.opacity ?? 1,
    transform: shape.rotation ? `rotate(${shape.rotation}deg)` : undefined,
    transformOrigin: 'center',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(shape.id, e);
  };

  const renderShape = () => {
    if (shape.type === 'rectangle') {
      return <div style={baseStyle} onMouseDown={handleClick} />;
    }
    if (shape.type === 'ellipse') {
      return <div style={{ ...baseStyle, borderRadius: '50%' }} onMouseDown={handleClick} />;
    }
    if (shape.type === 'triangle') {
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: shape.fill || '#6366f1',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
          onMouseDown={handleClick}
        />
      );
    }
    if (shape.type === 'diamond') {
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: shape.fill || '#6366f1',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }}
          onMouseDown={handleClick}
        />
      );
    }
    if (shape.type === 'polygon') {
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: shape.fill || '#6366f1',
            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
          }}
          onMouseDown={handleClick}
        />
      );
    }
    if (shape.type === 'star') {
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: shape.fill || '#6366f1',
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          }}
          onMouseDown={handleClick}
        />
      );
    }
    if (shape.type === 'line' || shape.type === 'arrow') {
      return (
        <div
          style={{
            position: 'absolute',
            left: screenX,
            top: screenY,
            width: screenWidth,
            height: screenHeight,
            pointerEvents: 'none',
          }}
          onMouseDown={handleClick}
        >
          <svg
            width={screenWidth}
            height={screenHeight}
            viewBox={`0 0 ${Math.max(1, shape.width)} ${Math.max(1, shape.height)}`}
            style={{ overflow: 'visible' }}
          >
            <line
              x1={0}
              y1={0}
              x2={shape.width}
              y2={shape.height}
              stroke={shape.stroke || '#000000'}
              strokeWidth={shape.strokeWidth || 2}
              markerEnd={shape.type === 'arrow' ? 'url(#arrowhead)' : undefined}
            />
            {shape.type === 'arrow' && (
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill={shape.stroke || '#000000'} />
                </marker>
              </defs>
            )}
          </svg>
        </div>
      );
    }
    if (shape.type === 'text') {
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: (shape.fontSize || 16) * camera.scale,
            color: shape.textColor || '#000000',
            fontFamily: shape.fontFamily || 'system-ui',
            textAlign: shape.textAlign || 'left',
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: shape.textAlign === 'center' ? 'center' : shape.textAlign === 'right' ? 'flex-end' : 'flex-start',
          }}
          onMouseDown={handleClick}
        >
          {shape.text || 'Text'}
        </div>
      );
    }
    if (shape.type === 'image') {
      if (!shape.imageUrl) {
        // Картинка ещё не выбрана — рисуем видимый placeholder вместо невидимой фигуры
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: 'transparent',
              border: '1px dashed #9ca3af',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              color: '#6b7280',
              fontSize: 11 * camera.scale,
            }}
            onMouseDown={handleClick}
          >
            <ImageIcon size={Math.max(14, 20 * camera.scale)} />
            <span>Нет изображения</span>
          </div>
        );
      }
      return (
        <div
          style={{
            ...baseStyle,
            backgroundImage: `url(${shape.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          onMouseDown={handleClick}
        />
      );
    }
    return null;
  };

  return (
    <div style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      {renderShape()}
      {isSelected && <TransformHandles shape={shape} camera={camera} onResize={onResize} />}
    </div>
  );
};