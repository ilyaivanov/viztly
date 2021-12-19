import { sp } from "../src3/design";
import { Circle, Shape, ShapeType, TextShape, Views } from "./views";

//x,y is a coordinate of a circle center, everything else is calculated
export const checkItemAt = (
  views: Views,
  x: number,
  y: number,
  title?: string
) => {
  const circle = getClosestShape(views, "circle", x, y) as Circle;
  if (getDistance(circle.x, circle.y, x, y) > 0.1)
    throw new Error(
      `Couldn't find circle for item at ${x},${y}. Closest circle at ${circle.x},${circle.y}`
    );

  const textX = x + sp.circleToTextDistance;
  const textY = y + 0.32 * sp.fontSize;
  const text = getClosestShape(views, "text", textX, textY) as TextShape;
  if (getDistance(text.x, text.y, textX, textY) > 0.1)
    throw new Error(
      `Couldn't find text for item at ${textX},${textY}. Closest text at ${text.x},${text.y}`
    );

  if (title && text.text !== title)
    throw new Error(
      `Found text at correct position, but text has wrong title. Expected: '${title}', given: '${text.text}'`
    );
};

export const checkItemAtIsSelected = (views: Views, x: number, y: number) => {
  const circle = getClosestShape(views, "circle", x, y) as Circle;
  if (getDistance(circle.x, circle.y, x, y) > 0.1)
    throw new Error(
      `Couldn't find circle for item at ${x},${y}. Closest circle at ${circle.x},${circle.y}`
    );
  else if (circle.color !== sp.selectedCircle) {
    throw new Error(`Circle at ${x},${y} is not selected`);
  }
};

const getClosestShape = (
  views: Views,
  type: ShapeType,
  x: number,
  y: number
): Shape | undefined => {
  let distance = Number.POSITIVE_INFINITY;
  let shapeFound: Shape | undefined;
  const check = (shape: Shape) => {
    if (shape.type === type) {
      const d = getDistance(x, y, shape.x, shape.y);
      if (d < distance) {
        distance = d;
        shapeFound = shape;
      }
    }
  };

  views.forEach(check);
  return shapeFound;
};

const getDistance = (x1: number, y1: number, x2: number, y2: number): number =>
  Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
