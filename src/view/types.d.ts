type Shape = TextShape | Circle | Rectangle | Line;
type Views = Set<Shape>;

type ShapeType = "text" | "circle" | "rectangle" | "line";

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
  width: number;
  height: number;
  color: string;
};

type Line = {
  type: "line";
  start: { x: number; y: number };
  end: { x: number; y: number };
  width: number;
  color: string;
};

type KeyboardKey =
  | "ArrowDown"
  | "ArrowUp"
  | "ArrowLeft"
  | "ArrowRight"
  | "Enter"
  | "KeyE"
  | "Backspace";

type ItemView = {
  circle: Circle;
  text: TextShape;
  childLine?: Line;
  openLine?: Line;
};
