export type ShapeTypes = 'circle' | 'rect';

export type ShapeListType = {
  id: string;
  type: ShapeTypes;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type AddShapeType = ShapeListType & {
  eventStartX: number;
  eventStartY: number;
  shapeStartX: number;
  shapeStartY: number;
  targetEl?: EventTarget | null;
};
