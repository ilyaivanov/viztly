import { sp } from "../src3/design";
import { createItem, createTree } from "./items";
import {
  Circle,
  renderViews,
  Shape,
  ShapeType,
  TextShape,
  Views,
} from "./views";

describe("having three nested items", () => {
  let views: Views;

  beforeEach(() => {
    const tree = createTree([
      createItem("Item 1", "tree", [createItem("Item 1.1")]),
      createItem("Item 2"),
    ]);

    views = renderViews(tree, 50, 50);
  });

  it("should have an Item 1 at 50,50", () =>
    checkItemAt(views, 50, 50, "Item 1"));

  it("should have an Item 1.1 at 50+1,50+1", () =>
    checkItemAt(views, 50 + sp.xStep, 50 + sp.yStep, "Item 1.1"));

  it("should have an Item 2 at 50,50+2", () =>
    checkItemAt(views, 50, 50 + sp.yStep * 2, "Item 2"));
});

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
