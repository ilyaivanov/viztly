import { isRoot } from "../src/domain/tree.traversal";
import { canvas } from "../src/infra";
import { animatePosition } from "../src/infra/animations";
import { sp } from "../src/view/design";

export type ItemView = {
  circle: Circle;
  text: TextShape;
  textMinimap: TextShape;
  childLine: Line;
};

export const createItemView = (item: Item, x: number, y: number): ItemView => {
  const text: TextShape = {
    type: "text",
    x: 0,
    y: 0,
    color: "white",
    fontSize: sp.fontSize,
    text: item.title,
  };
  //Property order here determines draw order at canvas (because of Object.values(itemView)).
  //I need to think about better solution
  const view: ItemView = {
    childLine: {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      color: sp.line,
      type: "line",
      width: 2,
    },
    circle: {
      type: "circle",
      y: 0,
      x: 0,
      color: "white",
      filled: item.children.length > 0,
      r: sp.circleR,
    },
    text,
    textMinimap: scaleTextToMinimap(text),
  };
  setItemViewPosition(view, x, y, false);
  return view;
};

export const setItemViewPosition = (
  itemView: ItemView,
  x: number,
  y: number,
  isAnimating = true
) => {
  const textX = x + sp.circleToTextDistance;
  const textY = y + 0.32 * sp.fontSize;

  if (!isAnimating) {
    itemView.circle.x = x;
    itemView.circle.y = y;
    itemView.text.x = textX;
    itemView.text.y = textY;
    itemView.textMinimap.x = scaleTextXToMinimap(textX);
    itemView.textMinimap.y = scaleTextYToMinimap(textY);
    itemView.childLine.start.x = x;
    itemView.childLine.start.y = y;
    itemView.childLine.end.x = x - sp.xStep;
    itemView.childLine.end.y = y;
    return;
  }

  if (itemView.circle.x !== x || itemView.circle.y !== y) {
    animatePosition(itemView.circle, x, y);
    if (itemView.childLine) {
      animatePosition(itemView.childLine.start, x, y);
      animatePosition(itemView.childLine.end, x - sp.xStep, y);
    }
  }

  if (itemView.text.x !== textX || itemView.text.y !== textY) {
    animatePosition(itemView.text, textX, textY);
    animatePosition(
      itemView.textMinimap,
      scaleTextXToMinimap(textX),
      scaleTextYToMinimap(textY)
    );
  }
};

const scaleTextToMinimap = (shape: TextShape): TextShape => ({
  ...shape,
  x: scaleTextXToMinimap(shape.x),
  y: scaleTextYToMinimap(shape.y),
  fontSize: shape.fontSize / sp.minimapScale,
});

const scaleTextXToMinimap = (x: number) => {
  const c = canvas.canvas;
  return c.width - c.width / sp.minimapScale + x / sp.minimapScale;
};

const scaleTextYToMinimap = (y: number) => y / sp.minimapScale;
