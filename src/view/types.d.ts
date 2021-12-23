type Shape = TextShape | Circle | Rectangle | MultiLine;
type Views = Set<Shape>;
type ShapeType = "text" | "circle";
type TextShape = {
  type: "text";
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
};

type Circle = {
  type: "circle";
  x: number;
  y: number;
  r: number;
  filled: boolean;
  color: string;
};

type Rectangle = {
  type: "rectangle";
  x: number;
  y: number;
  height: number;
  width: number;
  rotation: number;
  color: string;
};

type MultiLine = {
  type: "multiline";
  xs: number[];
  ys: number[];
  rotation: number;
  color: string;
};
