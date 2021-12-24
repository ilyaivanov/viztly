type Shape = TextShape | Circle;
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

type KeyboardKey =
  | "ArrowDown"
  | "ArrowUp"
  | "ArrowLeft"
  | "ArrowRight"
  | "Enter"
  | "KeyE"
  | "Backspace";
