import type { Shape } from '../types/shape';

type LayersPanelProps = {
  shapes: Shape[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

export const LayersPanel = ({ shapes, selectedId, onSelect }: LayersPanelProps) => {
  return (
    <div className="fixed left-0 top-11 bottom-0 z-10 flex w-56 flex-col gap-2 bg-[#1e1e1e] p-4">
      <h3 className="text-sm font-medium text-zinc-200">Слои</h3>
      <div className="flex-1 overflow-auto">
        {shapes.length === 0 ? (
          <div className="text-xs text-zinc-500">Пусто</div>
        ) : (
          <div className="flex flex-col gap-1">
            {shapes.map((shape, index) => (
              <button
                key={shape.id}
                onClick={() => onSelect(shape.id)}
                className={`rounded px-2 py-0.5 text-left text-xs transition-colors ${
                  selectedId === shape.id
                    ? 'bg-[#3c3c3c] text-white'
                    : 'text-zinc-200 hover:bg-[#2c2c2c]'
                }`}
              >
                {index + 1}. {shape.type}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};