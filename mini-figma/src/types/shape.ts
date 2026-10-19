/** Точка; система координат (экран или канвас) определяется контекстом. */
export type Point = {
  x: number;
  y: number;
};

/** Типы фигур, которые умеет создавать редактор. */
export type ShapeType = 
  | 'rectangle' 
  | 'ellipse' 
  | 'triangle' 
  | 'line' 
  | 'arrow' 
  | 'star' 
  | 'polygon' 
  | 'diamond'
  | 'text'
  | 'image';

/** Единая фигура: различные типы объектов. */
export type Shape = {
  id: string;
  type: ShapeType;
  /** Координаты и размеры в системе координат канваса. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** CSS-цвет заливки, например `#6366f1`. */
  fill?: string;
  /** CSS-цвет обводки. */
  stroke?: string;
  strokeWidth?: number;
  /** Для текста */
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  /** Для изображения */
  imageUrl?: string;
  opacity?: number;
  /** Для линий */
  points?: Point[];
  /** Для поворота */
  rotation?: number;
};

/** Инструменты редактора. */
export type Tool = 
  | 'select' 
  | 'rectangle' 
  | 'ellipse' 
  | 'triangle' 
  | 'line' 
  | 'arrow' 
  | 'star' 
  | 'polygon' 
  | 'diamond'
  | 'text'
  | 'image'
  | 'pan'
  | 'shapes';

/** Камера: сдвиг канваса в экранных пикселях и масштаб. */
export type Camera = {
  x: number;
  y: number;
  scale: number;
};