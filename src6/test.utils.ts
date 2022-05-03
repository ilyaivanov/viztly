import { MyCanvas } from "./canvas";

export const createDummyContext = (): CanvasContextMock => {
  //@ts-expect-error
  const dummyContext: CanvasContextMock = {
    figures: [],

    clearRect: () => {
      dummyContext.figures = [];
    },

    fillRect: (x, y, w, h, color) => {
      dummyContext.figures.push({ type: "rect", x, y, w, h, color });
    },

    fillCircle: (x, y, r, color) => {
      dummyContext.figures.push({ type: "circle", x, y, color, r });
    },

    fillTextAtMiddle: (x, y, text, color) => {
      dummyContext.figures.push({ type: "text", x, y, color, text });
    },
  };
  return dummyContext;
};

export const expectToHaveRect = (
  ctx: CanvasContextMock,
  x: number,
  y: number,
  color: string
) => {
  const res = ctx.figures.find(
    (f) => f.type == "rect" && f.x === x && f.y === y && f.color === color
  );

  if (!res) throw new Error(`Can't find a ${color} rect at ${x},${y}`);
};

export const expectToHaveCircle = (
  ctx: CanvasContextMock,
  x: number,
  y: number,
  color?: string
) => {
  const res = ctx.figures.find(
    (f) => f.type == "circle" && f.x === x && f.y === y
  );

  if (!res) throw new Error(`Can't find a circle at ${x},${y}`);

  if (color && color !== res.color) {
    throw new Error(
      `Found circle at ${x},${y}, but it has a different color: ${res.color}`
    );
  }
};

//calculate distance between two points
export const distance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

type RenderedFigure = Circle | Text | Rectangular;

type Circle = {
  type: "circle";
  x: number;
  y: number;
  r: number;
  color: string;
};
type Text = {
  type: "text";
  x: number;
  y: number;
  text: string;
  color: string;
};
type Rectangular = {
  type: "rect";
  x: number;
  y: number;
  h: number;
  w: number;
  color: string;
};

export type CanvasContextMock = MyCanvas & {
  figures: RenderedFigure[];
};
