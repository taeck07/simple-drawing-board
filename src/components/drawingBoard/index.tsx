import { useState, useRef, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { AddShapeType, ShapeListType, ShapeTypes } from './types';
import Shape, { ShapeStyles } from './shape';
import { getShapeListToLocalStorage, saveShapeListToLocalStorage } from '@src/services/localstorage';

const BoardContainer = styled.div`
  width: 100%;
  min-width: 500px;
  max-width: 1500px;
  margin: 20px;
  position: relative;
`;

const ActionsButtonWrap = styled.div`
  display: flex;
  align-items: center;
`;

const Pannel = styled.div`
  width: 100%;
  height: 700px;
  position: relative;
  border: 1px solid #00000080;
  overflow: hidden;
  > p {
    position: absolute;
  }
`;

const ActionsButton = styled.button<{ selected?: boolean }>`
  ${props =>
    props.selected &&
    css`
      font-weight: bold;
    `}
`;

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
  const [shapeList, setShapeList] = useState<ShapeListType[]>(getShapeListToLocalStorage());
  const [addShape, setAddShape] = useState<ShapeListType>();
  const target = useRef<AddShapeType>();
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

  function handleShapeClick(id: string) {
    setSelectedId(id);
    const selected = shapeList.find(shape => shape.id === id);

    if (!selected) {
      return;
    }
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
    document.body.removeEventListener('mousedown', addModeMouseDown);
    document.body.removeEventListener('mousemove', addShapeMouseMove);
    document.body.removeEventListener('mouseup', addShapeMouseUp);
  }

  function setDrawMode(type: ShapeTypes) {
    removeDrawEvent();
    if (type === mode) {
      setMode(undefined);
      currentDrawMode.current = undefined;
      return;
    }
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

  const handleShapeChange = useCallback((info: ShapeListType) => {
    setShapeList(list => list.map(shape => (shape.id === info.id ? info : shape)));
  }, []);

  useEffect(() => {
    saveShapeListToLocalStorage(shapeList);
  }, [shapeList]);

  return (
    <BoardContainer>
      <ActionsButtonWrap>
        <ActionsButton selected={mode === 'rect'} onClick={() => setDrawMode('rect')}>
          Rect
        </ActionsButton>
        <ActionsButton selected={mode === 'circle'} onClick={() => setDrawMode('circle')}>
          Circle
        </ActionsButton>
        <ActionsButton onClick={handleSelectRemove}>Remove</ActionsButton>
        <ActionsButton onClick={handleClear}>Clear</ActionsButton>
      </ActionsButtonWrap>
      <Pannel ref={panel}>
        {shapeList.map(info => (
          <Shape
            key={info.id}
            info={info}
            active={info.id === selectedId}
            handleClick={handleShapeClick}
            handleShapeChange={handleShapeChange}
            target={panel.current}
          />
        ))}
        {addShape && (
          <ShapeStyles
            type={addShape.type}
            style={{ left: addShape.x, top: addShape.y, width: addShape.width, height: addShape.height }}
          />
        )}
      </Pannel>
    </BoardContainer>
  );
}
