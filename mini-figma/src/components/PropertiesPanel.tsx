import type { Shape } from '../types/shape';
import { ImageUpload } from './ImageUpload';

const COLOR_PALETTE = [
  '#6366f1', // indigo-500
  '#ef4444', // red-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
  '#64748b', // slate-500
  '#000000', // black
  '#ffffff', // white
];

type PropertiesPanelProps = {
  selectedShape: Shape | null;
  onUpdateShape: (id: string, updates: Partial<Shape>) => void;
};

export const PropertiesPanel = ({
  selectedShape,
  onUpdateShape,
}: PropertiesPanelProps) => {
  if (!selectedShape) {
    return (
      <aside className="fixed right-0 top-11 bottom-0 z-10 w-56 bg-[#1e1e1e] p-4">
        <h2 className="text-xs font-medium text-zinc-200">
          Свойства
        </h2>
        <p className="mt-3 text-xs text-zinc-500">Ничего не выбрано</p>
      </aside>
    );
  }

  const handleFillChange = (color: string) => {
    onUpdateShape(selectedShape.id, { fill: color });
  };

  const handleInputChange = (
    field: 'x' | 'y' | 'width' | 'height',
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onUpdateShape(selectedShape.id, { [field]: numValue });
    }
  };

  return (
    <aside className="fixed right-0 top-11 bottom-0 z-10 w-56 bg-[#1e1e1e] p-4">
      <h2 className="text-xs font-medium text-zinc-200">
        Свойства
      </h2>

      {/* Блок "Заливка" - мгновенно открыт при выборе фигуры */}
      <div className="mt-4">
        <h3 className="text-xs font-medium text-zinc-200">
          Заливка
        </h3>

        <div className="mt-2">
          <label className="mb-1 block text-xs text-zinc-300">
            Цвет заливки
          </label>
          <div className="grid grid-cols-6 gap-0.5">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleFillChange(color)}
                className={`h-5 w-5 rounded-sm border transition-all ${
                  selectedShape.fill === color
                    ? 'border-zinc-200'
                    : 'border-zinc-600 hover:border-zinc-400'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <input
            type="color"
            value={selectedShape.fill || '#000000'}
            onChange={(e) => handleFillChange(e.target.value)}
            className="h-7 w-10 cursor-pointer rounded border border-[#3c3c3c] bg-[#2c2c2c]"
            title="Выбрать кастомный цвет"
          />
          <input
            type="text"
            value={selectedShape.fill || ''}
            onChange={(e) => handleFillChange(e.target.value)}
            placeholder="#6366f1"
            className="flex-1 rounded border border-[#3c3c3c] bg-[#2c2c2c] px-2 py-1 text-xs text-zinc-200 placeholder-zinc-500"
          />
        </div>
      </div>

      {/* Текстовые настройки */}
      {selectedShape.type === 'text' && (
        <div className="mt-4">
          <h3 className="text-xs font-medium text-zinc-200">Текст</h3>
          <div className="mt-2">
            <textarea
              value={selectedShape.text || ''}
              onChange={(e) => onUpdateShape(selectedShape.id, { text: e.target.value })}
              className="w-full rounded border border-[#3c3c3c] bg-[#2c2c2c] px-2 py-1 text-xs text-zinc-200 placeholder-zinc-500"
              rows={3}
              placeholder="Введите текст"
            />
          </div>
          <div className="mt-2 flex items-center justify-between gap-1">
            <label className="text-xs text-zinc-300">Размер</label>
            <input
              type="number"
              value={selectedShape.fontSize || 16}
              onChange={(e) => onUpdateShape(selectedShape.id, { fontSize: parseFloat(e.target.value) })}
              className="w-16 rounded border border-[#3c3c3c] bg-[#2c2c2c] px-1 py-0.5 text-xs text-zinc-200"
              min="8"
            />
          </div>
          <div className="mt-2">
            <label className="mb-1 block text-xs text-zinc-300">Выравнивание</label>
            <select
              value={selectedShape.textAlign || 'left'}
              onChange={(e) => onUpdateShape(selectedShape.id, { textAlign: e.target.value as 'left' | 'center' | 'right' })}
              className="w-full rounded border border-[#3c3c3c] bg-[#2c2c2c] px-2 py-1 text-xs text-zinc-200"
            >
              <option value="left">По левому</option>
              <option value="center">По центру</option>
              <option value="right">По правому</option>
            </select>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="color"
              value={selectedShape.textColor || '#000000'}
              onChange={(e) => onUpdateShape(selectedShape.id, { textColor: e.target.value })}
              className="h-7 w-10 cursor-pointer rounded border border-[#3c3c3c] bg-[#2c2c2c]"
            />
            <input
              type="text"
              value={selectedShape.textColor || ''}
              onChange={(e) => onUpdateShape(selectedShape.id, { textColor: e.target.value })}
              className="flex-1 rounded border border-[#3c3c3c] bg-[#2c2c2c] px-2 py-1 text-xs text-zinc-200"
            />
          </div>
        </div>
      )}

      {/* Настройки изображения */}
      {selectedShape.type === 'image' && (
        <div className="mt-4">
          <h3 className="text-xs font-medium text-zinc-200">Изображение</h3>
          <div className="mt-2">
            <ImageUpload onImageUpload={(url) => onUpdateShape(selectedShape.id, { imageUrl: url })} />
          </div>
          <div className="mt-2">
            <label className="mb-1 block text-xs text-zinc-300">
              Прозрачность: {Math.round((selectedShape.opacity ?? 1) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedShape.opacity ?? 1}
              onChange={(e) => onUpdateShape(selectedShape.id, { opacity: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              onUpdateShape(selectedShape.id, { imageUrl: undefined, fill: undefined });
            }}
            className="mt-2 w-full rounded border border-[#3c3c3c] bg-[#2c2c2c] px-2 py-1 text-xs text-red-400 hover:bg-[#3c3c3c]"
          >
            Удалить изображение
          </button>
        </div>
      )}

      {/* Координаты и размеры */}
      <div className="mt-4">
        <h3 className="text-xs font-medium text-zinc-200">
          Положение и размер
        </h3>
        <div className="mt-2 flex flex-col gap-1">
          <div className="flex items-center justify-between gap-1">
            <label className="text-xs text-zinc-300">X</label>
            <input
              type="number"
              value={Math.round(selectedShape.x * 100) / 100}
              onChange={(e) => handleInputChange('x', e.target.value)}
              className="w-24 rounded border border-[#3c3c3c] bg-[#2c2c2c] px-1 py-0.5 text-xs text-zinc-200"
            />
          </div>
          <div className="flex items-center justify-between gap-1">
            <label className="text-xs text-zinc-300">Y</label>
            <input
              type="number"
              value={Math.round(selectedShape.y * 100) / 100}
              onChange={(e) => handleInputChange('y', e.target.value)}
              className="w-24 rounded border border-[#3c3c3c] bg-[#2c2c2c] px-1 py-0.5 text-xs text-zinc-200"
            />
          </div>
          <div className="flex items-center justify-between gap-1">
            <label className="text-xs text-zinc-300">W</label>
            <input
              type="number"
              value={Math.round(selectedShape.width * 100) / 100}
              onChange={(e) => handleInputChange('width', e.target.value)}
              className="w-24 rounded border border-[#3c3c3c] bg-[#2c2c2c] px-1 py-0.5 text-xs text-zinc-200"
              min="0"
            />
          </div>
          <div className="flex items-center justify-between gap-1">
            <label className="text-xs text-zinc-300">H</label>
            <input
              type="number"
              value={Math.round(selectedShape.height * 100) / 100}
              onChange={(e) => handleInputChange('height', e.target.value)}
              className="w-24 rounded border border-[#3c3c3c] bg-[#2c2c3c] px-1 py-0.5 text-xs text-zinc-200"
              min="0"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};