import { useCallback, useState } from 'react';
import type { Tool } from './types/shape';
import { useViewport } from './hooks/useViewport';
import { useShapes } from './hooks/useShapes';
import { useHotkeys } from './hooks/useHotkeys';
import { Canvas } from './components/Canvas';
import { TopBar } from './components/TopBar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { LayersPanel } from './components/LayersPanel';
import { hitTest, screenToCanvas } from './utils/geometry';
import { DEFAULT_TEXT_COLOR, DEFAULT_FONT_SIZE } from './constants/shapes';

/** App собирает холст и три панели. */
function App() {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const { camera, isPanning, spacePressed, containerRef, handlers } = useViewport();
  const {
    shapes,
    selectedId,
    selectedShape,
    addShape,
    updateShape,
    selectShape,
    removeShape,
    startDrag,
    updateDrag,
    endDrag,
    dragState,
    isDrawing,
    beginDraw,
    updateDraw,
    endDraw,
    undo,
    redo,
  } = useShapes();

  const getMousePos = useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return screenToCanvas(
        { x: e.clientX - rect.left, y: e.clientY - rect.top },
        camera
      );
    },
    [camera, containerRef]
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      handlers.onMouseDown(e);
      if (spacePressed || e.button === 1 || isPanning) {
        return;
      }
      const point = getMousePos(e);
      // Рисование фигур
      if (activeTool === 'rectangle' || activeTool === 'ellipse' || activeTool === 'triangle' || 
          activeTool === 'diamond' || activeTool === 'polygon' || activeTool === 'line' || activeTool === 'arrow') {
        beginDraw(point, activeTool);
        return;
      }
      // Создание текста
      if (activeTool === 'text') {
        const newShape = {
          type: 'text' as const,
          x: point.x,
          y: point.y,
          width: 120,
          height: 40,
          text: 'Text',
          fontSize: DEFAULT_FONT_SIZE,
          textColor: DEFAULT_TEXT_COLOR,
          textAlign: 'left' as const,
        };
        addShape(newShape);
        setActiveTool('select');
        return;
      }
      // Создание изображения
      if (activeTool === 'image') {
        const newShape = {
          type: 'image' as const,
          x: point.x,
          y: point.y,
          width: 200,
          height: 150,
          fill: '#000000',
          opacity: 1,
        };
        addShape(newShape);
        setActiveTool('select');
        return;
      }
      if (activeTool === 'select') {
        const hit = hitTest(shapes, point);
        if (hit) {
          selectShape(hit.id);
          startDrag(hit.id, point);
        } else {
          selectShape(null);
        }
      }
    },
    [
      activeTool,
      beginDraw,
      getMousePos,
      handlers,
      isPanning,
      selectShape,
      shapes,
      spacePressed,
      startDrag,
      addShape,
    ]
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.buttons !== 1 || spacePressed) return;
      const point = getMousePos(e);
      // Сначала рисование, затем перемещение уже существующей фигуры.
      if (isDrawing) {
        updateDraw(point);
        return;
      }
      if (dragState.isDragging && activeTool === 'select') {
        updateDrag(point);
      }
    },
    [
      activeTool,
      dragState.isDragging,
      getMousePos,
      isDrawing,
      spacePressed,
      updateDrag,
      updateDraw,
    ]
  );

  const handleCanvasMouseUp = useCallback(() => {
    endDraw();
    endDrag();
  }, [endDraw, endDrag]);

  const handleCanvasMouseLeave = useCallback(() => {
    endDraw();
    endDrag();
  }, [endDraw, endDrag]);

  /** Удаление выделенной фигуры: хоткей Delete/Backspace и кнопка в панели слоёв. */
  const deleteSelectedShape = useCallback(() => {
    if (selectedId) {
      removeShape(selectedId);
    }
  }, [selectedId, removeShape]);
  useHotkeys(setActiveTool, spacePressed, undo, redo, deleteSelectedShape);

  const handleShapeSelect = useCallback(
    (id: string | null, e: React.MouseEvent) => {
      e.stopPropagation();
      if (activeTool !== 'select') return;
      const point = getMousePos(e);
      selectShape(id);
      if (id) {
        startDrag(id, point);
      }
    },
    [activeTool, getMousePos, selectShape, startDrag]
  );

  return (
    <div className="h-full w-full">
      <TopBar activeTool={activeTool} onToolChange={setActiveTool} />
      <LayersPanel shapes={shapes} selectedId={selectedId} onSelect={selectShape} onDelete={removeShape} />
      <Canvas
        camera={camera}
        shapes={shapes}
        selectedId={selectedId}
        activeTool={activeTool}
        isPanning={isPanning}
        spacePressed={spacePressed}
        containerRef={containerRef}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseLeave}
        onSelectShape={handleShapeSelect}
      />
      <PropertiesPanel selectedShape={selectedShape} onUpdateShape={updateShape} />
    </div>
  );
}

export default App;