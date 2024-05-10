import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { ShapeListType } from './types';

export const ShapeStyles = styled.div<{ type: 'rect' | 'circle'; active?: boolean }>`
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

type PropTypes = {
  handleClick: (id: string) => void;
  active: boolean;
  info: ShapeListType;
  handleShapeChange: (info: ShapeListType) => void;
  target: HTMLDivElement | null;
};

export default function Shape({ handleClick, active, info, handleShapeChange }: PropTypes) {
  const [transform, setTransform] = useState<{ x: number; y: number }>();
  const { id, x, y, width, height, type } = info;
  const startInfo = useRef<{ startX: number; startY: number }>();
  const actions = useMemo(() => {
    if (!active) {
      return {};
    }
    return {
      onMouseDown: mouseDown,
      onMouseMove: mouseMove,
      onMouseUp: mouseUp,
    };
  }, [active, transform]);

  function mouseDown(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    startInfo.current = { startX: e.nativeEvent.pageX, startY: e.nativeEvent.pageY };
  }
  function mouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!startInfo.current) {
      return;
    }
    const x = e.clientX - (startInfo.current?.startX || 0);
    const y = e.clientY - (startInfo.current?.startY || 0);
    setTransform({ x, y });
  }
  function mouseUp() {
    if (!transform) {
      return;
    }
    handleShapeChange({ ...info, x: x + transform.x, y: y + transform.y });
  }

  function onClick(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    handleClick(id);
    startInfo.current = undefined;
  }

  useEffect(() => {
    setTransform(undefined);
  }, [info]);

  return (
    <>
      <ShapeStyles
        onClick={onClick}
        style={{
          left: x,
          top: y,
          width,
          height,
          transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : '',
        }}
        active={active}
        type={type}
        {...actions}
      />
    </>
  );
}
