import { useState, MouseEvent, useRef, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';

const BoardContainer = styled.div`
  width: 100%;
  min-width: 500px;
  max-width: 1500px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const ActionsButtonWrap = styled.div`
  display: flex;
  align-items: center;
`;

const Pannel = styled.div`
  width: 100%;
  height: 700px;
  position: relative;
  border: 1px solid #e0e0e0;
  > p {
    position: absolute;
  }
`;

const Shape = styled.div<{ type: ShapeTypes; active?: boolean }>`
  position: absolute;
  outline: 1px solid #000;
  ${props =>
    props.type === 'circle' &&
    css`
      border-radius: 50%;
    `};
  ${props =>
    props.active &&
    css`
      &::after {
        content: '';
        position: absolute;
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        top: -2px;
        left: -2px;
        border: 1px dashed #dfdfdf;
      }
    `};
`;

const ActionsButton = styled.button<{ selected?: boolean }>`
  ${props =>
    props.selected &&
    css`
      font-weight: bold;
    `}
`;

// type ShapeTypes = 'rect' | 'circle' | 'edit';

type ShapeTypes = 'circle' | 'rect';

type ShapeListType = {
  id: string;
  type: ShapeTypes;
  x: number;
  y: number;
  width: number;
  height: number;
};

type AddShapeType = ShapeListType & {
  eventStartX: number;
  eventStartY: number;
  shapeStartX: number;
  shapeStartY: number;
};

const SHAPELIST: ShapeListType[] = [
  {
    id: '1',
    type: 'rect',
    x: 50,
    y: 50,
    width: 100,
    height: 150,
  },
  {
    id: '2',
    type: 'circle',
    x: 100,
    y: 200,
    width: 200,
    height: 100,
  },
];

const INIT_SHAPE: AddShapeType = {
  id: 'add',
  type: 'rect',
  x: 100,
  y: 200,
  width: 0,
  height: 0,
  eventStartX: 0,
  eventStartY: 0,
  shapeStartX: 0,
  shapeStartY: 0,
};

export default function DrawingBoard() {
  const [shapeList, setShapeList] = useState<ShapeListType[]>([...SHAPELIST]);
  const [addShape, setAddShape] = useState<ShapeListType>();
  const target = useRef<AddShapeType>();
  // const container = useRef<HTMLDivElement>(null);
  const containerPos = useRef({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<string>();
  const [mode, setMode] = useState<ShapeTypes>();
  const panel = useRef<HTMLDivElement>(null);
  const currentDrawMode = useRef<ShapeTypes>();

  const addModeMouseDown = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!currentDrawMode.current) {
        return;
      }
      const addShapeId = new Date().getTime().toString();
      target.current = {
        ...INIT_SHAPE,
        type: currentDrawMode.current,
        eventStartX: e.pageX,
        eventStartY: e.pageY,
        shapeStartX: e.pageX - containerPos.current.x,
        shapeStartY: e.pageY - containerPos.current.y,
        x: e.pageX - containerPos.current.x,
        y: e.pageY - containerPos.current.y,
        id: addShapeId,
      };
      setAddShape(() => ({
        type: currentDrawMode.current as ShapeTypes,
        x: e.pageX - containerPos.current.x,
        y: e.pageY - containerPos.current.y,
        width: 0,
        height: 0,
        id: addShapeId,
      }));
      return;
    },
    [setAddShape, setShapeList],
  );

  const addShapeMouseUp = () => {
    if (!target.current) {
      return;
    }
    const { eventStartX, eventStartY, shapeStartX, shapeStartY, ...targetShape } = target.current;
    setShapeList(list => [...list, { ...targetShape }]);
    setAddShape(undefined);

    setAddShape(undefined);
    target.current = undefined;
  };

  const addShapeMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      console.log('move');
      if (!target.current) {
        return;
      }
      let width = e.pageX - target.current.eventStartX;
      let height = e.pageY - target.current.eventStartY;
      let x = target.current.shapeStartX;
      let y = target.current.shapeStartY;
      if (width < 0) {
        width = Math.abs(width);
        x = x - width;
      }
      if (height < 0) {
        height = Math.abs(height);
        y = y - height;
      }

      target.current = { ...target.current, width, height, x, y };

      setAddShape(shape => (shape ? { ...shape, x, y, width, height } : undefined));
      return;
    },
    [setAddShape],
  );

  function handleShapeClick(e: MouseEvent<HTMLDivElement>, id: string) {
    e.stopPropagation();
    setSelectedId(id);
    const selected = shapeList.find(shape => shape.id === id);

    if (!selected) {
      return;
    }

    target.current = {
      ...selected,
      shapeStartX: selected.x,
      shapeStartY: selected.y,
      eventStartX: e.nativeEvent.clientX,
      eventStartY: e.nativeEvent.clientY,
    };
  }

  useEffect(() => {
    if (panel.current) {
      containerPos.current.x = panel.current.offsetLeft;
      containerPos.current.y = panel.current.offsetTop;
    }
  }, []);

  function addDrawEvent() {
    document.body.addEventListener('mousedown', addModeMouseDown);
    document.body.addEventListener('mousemove', addShapeMouseMove);
    document.body.addEventListener('mouseup', addShapeMouseUp);
  }

  function removeDrawEvent() {
    document.body.addEventListener('mousedown', addModeMouseDown);
    document.body.addEventListener('mousemove', addShapeMouseMove);
    document.body.addEventListener('mouseup', addShapeMouseUp);
  }

  function setDrawMode(type: ShapeTypes) {
    removeDrawEvent();
    currentDrawMode.current = type;
    addDrawEvent();
    setMode(type);
  }

  function handleClear() {
    setShapeList([]);
  }

  function handleSelectRemove() {
    if (!selectedId) {
      return;
    }
    setShapeList(shapeList.filter(({ id }) => id !== selectedId));
  }

  return (
    <BoardContainer>
      {/* {JSON.stringify(addShape)} */}
      <ActionsButtonWrap>
        <ActionsButton selected={mode === 'rect'} onClick={() => setDrawMode('rect')} disabled={mode === 'rect'}>
          Rect
        </ActionsButton>
        <ActionsButton selected={mode === 'circle'} onClick={() => setDrawMode('circle')} disabled={mode === 'circle'}>
          Circle
        </ActionsButton>
        <ActionsButton onClick={handleSelectRemove}>Remove</ActionsButton>
        <ActionsButton onClick={handleClear}>Clear</ActionsButton>
      </ActionsButtonWrap>
      <Pannel
        ref={panel}
        // onMouseDown={handlePanelMouseDown}
        // onMouseMove={handlePanelMouseMove}
        // onMouseUp={handlePanelMouseUp}
      >
        {shapeList.map(({ id, type, x, y, width, height }) => (
          <Shape
            key={id}
            type={type}
            style={{ left: x, top: y, width, height }}
            onClick={e => handleShapeClick(e, id)}
            active={selectedId === id}
          />
        ))}
        {addShape && (
          <Shape
            type={addShape.type}
            style={{ left: addShape.x, top: addShape.y, width: addShape.width, height: addShape.height }}
          />
        )}
      </Pannel>
    </BoardContainer>
  );
}
