import type { Camera, Shape } from '../types/shape';
import { canvasToScreen } from '../utils/geometry';

type TransformHandlesProps = {
  shape: Shape;
  camera: Camera;
  onResize?: (e: React.MouseEvent, handle: string) => void;
};

export const TransformHandles = ({ shape, camera, onResize }: TransformHandlesProps) => {
  const { x: screenX, y: screenY } = canvasToScreen({ x: shape.x, y: shape.y }, camera);
  const screenWidth = shape.width * camera.scale;
  const screenHeight = shape.height * camera.scale;
  
  const handleSize = Math.max(6, 8 * Math.min(camera.scale, 1.5));
  const borderWidth = 1;
  
  const selectionStyle: React.CSSProperties = {
    position: 'absolute',
    left: screenX - borderWidth,
    top: screenY - borderWidth,
    width: screenWidth + borderWidth * 2,
    height: screenHeight + borderWidth * 2,
    border: `${borderWidth}px solid #3b82f6`,
    pointerEvents: 'none',
    boxSizing: 'border-box',
  };
  
  const handleStyle = (pos: string): React.CSSProperties => {
    let left = screenX - handleSize / 2;
    let top = screenY - handleSize / 2;
    if (pos === 'tr' || pos === 'br' || pos === 'r' || pos === 'mr') left = screenX + screenWidth - handleSize / 2;
    if (pos === 'bl' || pos === 'br' || pos === 'b' || pos === 'mb') top = screenY + screenHeight - handleSize / 2;
    if (pos === 't' || pos === 'b' || pos === 'mt' || pos === 'mb') left = screenX + screenWidth / 2 - handleSize / 2;
    if (pos === 'l' || pos === 'r' || pos === 'ml' || pos === 'mr') top = screenY + screenHeight / 2 - handleSize / 2;
    
    return {
      position: 'absolute',
      left,
      top,
      width: handleSize,
      height: handleSize,
      backgroundColor: '#3b82f6',
      border: '1px solid white',
      borderRadius: '50%',
      pointerEvents: 'auto',
      boxSizing: 'border-box',
      cursor: getCursor(pos),
    };
  };
  
  const getCursor = (pos: string): string => {
    switch (pos) {
      case 'tl':
      case 'br':
        return 'nwse-resize';
      case 'tr':
      case 'bl':
        return 'nesw-resize';
      case 't':
      case 'b':
        return 'ns-resize';
      case 'l':
      case 'r':
        return 'ew-resize';
      default:
        return 'default';
    }
  };
  
  return (
    <>
      <div style={selectionStyle} />
      <div style={handleStyle('tl')} onMouseDown={(e) => onResize?.(e, 'tl')} />
      <div style={handleStyle('tr')} onMouseDown={(e) => onResize?.(e, 'tr')} />
      <div style={handleStyle('bl')} onMouseDown={(e) => onResize?.(e, 'bl')} />
      <div style={handleStyle('br')} onMouseDown={(e) => onResize?.(e, 'br')} />
      <div style={handleStyle('t')} onMouseDown={(e) => onResize?.(e, 't')} />
      <div style={handleStyle('b')} onMouseDown={(e) => onResize?.(e, 'b')} />
      <div style={handleStyle('l')} onMouseDown={(e) => onResize?.(e, 'l')} />
      <div style={handleStyle('r')} onMouseDown={(e) => onResize?.(e, 'r')} />
    </>
  );
};