import { AppContent } from "../app";
import { sp } from "../view/design";

//x,y is a coordinate of a circle center, everything else is calculated
const checkItemAt = (views: Views, x: number, y: number, title?: string) => {
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

const checkItemAtIsSelected = (views: Views, x: number, y: number) => {
  const circle = getClosestShape(views, "circle", x, y) as Circle;
  if (getDistance(circle.x, circle.y, x, y) > 0.1)
    throw new Error(
      `Couldn't find circle for item at ${x},${y}. Closest circle at ${circle.x},${circle.y}`
    );
  else if (circle.color !== sp.selectedCircle) {
    throw new Error(`Circle at ${x},${y} is not selected, but expected to be`);
  }
};

const checkItemAtIsNotSelected = (views: Views, x: number, y: number) => {
  const circle = getClosestShape(views, "circle", x, y) as Circle;
  if (getDistance(circle.x, circle.y, x, y) > 0.1)
    throw new Error(
      `Couldn't find circle for item at ${x},${y}. Closest circle at ${circle.x},${circle.y}`
    );
  else if (circle.color !== "white") {
    throw new Error(`Circle at ${x},${y} is selected, but expected not to be`);
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

export const check = {
  itemSelectedHasTitle: (app: AppContent, title: string) =>
    expect(app.selectedItem!.title).toBe(title),
  itemSelected: (views: Views, gridX: number, gridY: number) =>
    checkItemAtIsSelected(
      views,
      50 + sp.xStep * (gridX - 1),
      50 + +sp.yStep * (gridY - 1)
    ),
  itemUnselected: (views: Views, gridX: number, gridY: number) =>
    checkItemAtIsNotSelected(
      views,
      50 + sp.xStep * (gridX - 1),
      50 + +sp.yStep * (gridY - 1)
    ),
  itemExistsAt: (views: Views, gridX: number, gridY: number, title: string) =>
    checkItemAt(
      views,
      50 + sp.xStep * (gridX - 1),
      50 + +sp.yStep * (gridY - 1),
      title
    ),
};
