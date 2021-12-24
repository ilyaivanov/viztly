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

  if (typeof title === "string" && text.text !== title)
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

type InputProps = {
  top: number;
  left: number;
  text: string;
};

export const check = {
  itemSelectedHasTitle: (app: AppContent, title: string) =>
    expect(app.selectedItem!.title).toBe(title),

  input: (inputProps: InputProps) => {
    const el = document.getElementById("main-input") as HTMLInputElement;
    if (el) {
      if (
        el.style.top !== inputProps.top + "px" ||
        el.style.left !== inputProps.left + "px"
      )
        throw new Error(
          `Input has invalid position. Expected ${inputProps.left}px, ${inputProps.top}px; but received ${el.style.left}, ${el.style.top}`
        );

      if (el.value !== inputProps.text)
        throw new Error(
          `Input has invalid value. Expected ${inputProps.text}; but received ${el.value}`
        );
    } else {
      throw new Error(
        `Can't find an input element. Searched for #main-input element in the body.`
      );
    }
  },

  inputDoesNotExist: () => {
    const el = document.getElementById("main-input") as HTMLInputElement;
    if (el) {
      throw new Error(
        "Input was expected to be removed from body, but found at #main-input"
      );
    }
  },

  itemSelected: (views: Views, gridX: number, gridY: number) =>
    checkItemAtIsSelected(views, toX(gridX), toY(gridY)),

  itemUnselected: (views: Views, gridX: number, gridY: number) =>
    checkItemAtIsNotSelected(views, toX(gridX), toY(gridY)),

  itemExistsAt: (views: Views, gridX: number, gridY: number, title: string) =>
    checkItemAt(views, toX(gridX), toY(gridY), title),

  circleAtHas: (
    views: Views,
    gridX: number,
    gridY: number,
    props: Partial<Circle>
  ) => {
    const circle = getClosestShape(
      views,
      "circle",
      toX(gridX),
      toY(gridY)
    ) as Circle;

    const coords = `${toX(gridX)},${toY(gridY)}`;
    if (!circle) throw new Error(`Can't find circle at ${coords}`);
    const propsKeys = Object.keys(props) as (keyof Circle)[];

    propsKeys.forEach((key) => {
      const given = circle[key];
      const expected = props[key];
      if (expected !== given) {
        throw new Error(
          `Expected ${key} of circle at ${coords} to be ${expected}, but was ${given}`
        );
      }
    });
  },

  notContainItemTitle: (views: Views, title: string) => {
    const v = Array.from(views.values()).find(
      (v) => v.type === "text" && v.text == title
    ) as TextShape | undefined;
    if (v) {
      const { x, y } = v;
      throw new Error(
        `Expected views not to have ${title}, but found at ${x},${y}`
      );
    }
  },
};

const toX = (gridX: number) => sp.start + sp.xStep * (gridX - 1);
const toY = (gridY: number) => sp.start + sp.yStep * (gridY - 1);

type ItemCheckProps = {
  //these are used to locate item on the canvas state
  gridX?: number;
  gridY?: number;
  title?: string;

  //these are props to check
  x?: number;
  y?: number;
  textX?: number;
  textY?: number;
  shouldNotExist?: boolean;
  isSelected?: boolean;
  circleFilled?: boolean;
};

const itemCheck = (views: Views, props: ItemCheckProps) => {};

// Examples
//     check.itemSelectedHasTitle(app, "Item 1.1.1.1");
//     check.circleAtHas(app.views, 1, 1, { filled: true });
//     check.itemExistsAt(app.views, 1, 1, "Item 2"));
//     check.notContainItemTitle(app.views, "Item 1.2");
//     check.itemSelected(app.views, 2, 2);
//     check.itemUnselected(app.views, 2, 3);
