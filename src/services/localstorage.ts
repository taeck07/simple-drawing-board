import { ShapeListType } from '@src/components/drawingBoard/types';

const SHAPE_LIST_KEY = 'SIMEPLE_DRAWING_BOARD_SHAPE_LIST';

export function saveShapeListToLocalStorage(value: ShapeListType[]) {
  window.localStorage.setItem(SHAPE_LIST_KEY, JSON.stringify(value));
}

export function getShapeListToLocalStorage() {
  const value = window.localStorage.getItem(SHAPE_LIST_KEY);
  const shapeList = JSON.parse(value || '[]');
  return shapeList;
}
