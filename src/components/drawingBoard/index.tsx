import { useState, MouseEvent } from 'react';
import styled, { css } from 'styled-components';

const BoardContainer = styled.div`
  width: 100%;
  min-width: 500px;
  max-width: 1500px;
  margin: 0 auto;
  padding: 20px 0;
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
`;

const Shape = styled.div<{ type: ShapeTypes }>`
  position: absolute;
  border: 1px solid #000;
  ${props =>
    props.type === 'circle' &&
    css`
      border-radius: 50%;
    `};
`;

const ActionsButton = styled.button``;

type ShapeTypes = 'circle' | 'rect';

type ShapeListType = {
  id: string;
  type: ShapeTypes;
  x: number;
  y: number;
  width: number;
  height: number;
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

const INIT_SHAPE: ShapeListType = {
  id: 'add',
  type: 'rect',
  x: 100,
  y: 200,
  width: 0,
  height: 0,
};

export default function DrawingBoard() {
  const [shapeList, setShapeList] = useState<ShapeListType[]>([...SHAPELIST]);
  const [addShape, setAddShape] = useState<ShapeListType>();

  const mouseDown = (e: MouseEvent) => {
    setAddShape({ ...INIT_SHAPE, x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!addShape) {
      return;
    }
    const width = e.nativeEvent.offsetX - (addShape?.x || 0);
    const height = e.nativeEvent.offsetY - (addShape?.y || 0);
    setAddShape({ ...addShape, width, height });
  };
  const onMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    if (!addShape) {
      return;
    }
    const width = e.nativeEvent.offsetX - (addShape?.x || 0);
    const height = e.nativeEvent.offsetY - (addShape?.y || 0);
    setShapeList([...shapeList, { ...addShape, width, height }]);
    setAddShape(undefined);
  };
  return (
    <BoardContainer>
      <ActionsButtonWrap>
        <ActionsButton>Rect</ActionsButton>
        <ActionsButton>Circle</ActionsButton>
        <ActionsButton>Remove</ActionsButton>
        <ActionsButton>Clear</ActionsButton>
      </ActionsButtonWrap>
      <Pannel onMouseDown={mouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
        {shapeList.map(({ id, type, x, y, width, height }) => (
          <Shape key={id} type={type} style={{ left: x, top: y, width, height }} />
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
