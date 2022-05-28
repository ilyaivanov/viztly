import * as t from "../types";
import { colors } from "../colors";
import sp from "../spacings";
import { globalCanvas } from "../globalCanvas";
import { AnimatedNumber } from "../animations/animatedNumber";

//canvas is required to
export const viewItem = (
  item: t.Item,
  itemView: t.ItemView,
  isSelected: boolean,
  parentView: t.ItemView | undefined
) => {
  globalCanvas.context.globalAlpha = itemView.opacity.current;
  if (parentView) {
    if (item.parent?.view === "board")
      boardChildtoParentLine(itemView, parentView);
    else lineBetween(itemView, parentView);
  }
  drawItemView(item, itemView, isSelected);
  globalCanvas.context.globalAlpha = 1;
};

export const createView = (
  item: t.Item,
  gridX: number,
  gridY: number
): t.ItemView => ({
  item,
  gridX,
  gridY,
  opacity: new AnimatedNumber(1),
  x: new AnimatedNumber(gridX * sp.gridSize),
  y: new AnimatedNumber(gridY * sp.gridSize),
});

export const fadeIn = (view: t.ItemView) => {
  if (view.opacity.current === 1) view.opacity.current = 0;
  view.opacity.switchTo(1);
};

export const fadeOut = (view: t.ItemView) => {
  view.opacity.switchTo(0);
};

export const moveTo = (view: t.ItemView, gridX: number, gridY: number) => {
  if (view.gridX !== gridX) {
    view.gridX = gridX;
    view.x.switchTo(gridX * sp.gridSize);
  }
  if (view.gridY !== gridY) {
    view.gridY = gridY;
    view.y.switchTo(gridY * sp.gridSize);
  }
};

const drawItemView = (item: t.Item, view: t.ItemView, isSelected: boolean) => {
  const x = view.x.current;
  const y = view.y.current;
  const isFilled = item.children.length > 0;
  const circleInnerColor = isFilled
    ? isSelected
      ? colors.selectedCircle
      : colors.circleFilled
    : colors.background;
  const r = sp.circleRadius;
  globalCanvas.outlineCircle(
    x,
    y,
    r,
    sp.circleLineWidth,
    (isSelected ? colors.selectedCircle : colors.circleOutline).getHexColor(),
    circleInnerColor.getHexColor()
  );

  const xOffset = sp.textOffsetFromCircleCenter;
  const yOffset = 1;
  globalCanvas.fillTextAtMiddle(
    item.title,
    x + xOffset,
    y + yOffset,
    (isSelected ? colors.selectedText : colors.text).getHexColor()
  );
};

//TODO: think about how to animate between lineBetween and boardChildtoParentLine
const lineBetween = (view1: t.ItemView, view2: t.ItemView) => {
  const x1 = view1.x.current - sp.circleRadius - sp.lineToCircleDistance;
  const y1 = view1.y.current;

  const x2 = view2.x.current;
  const y2 = view2.y.current + sp.circleRadius + sp.lineToCircleDistance;

  const ctx = globalCanvas.context;

  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y1);
  ctx.lineTo(x2, y2);

  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.lines.getHexColor();
  ctx.stroke();
};

const boardChildtoParentLine = (from: t.ItemView, to: t.ItemView) => {
  const x1 = from.x.current;
  const y1 = from.y.current - sp.circleRadius - sp.lineToCircleDistance;

  const x2 = to.x.current;
  const y2 = to.y.current + sp.circleRadius + sp.lineToCircleDistance;

  const middleYPoint = (from.gridY - 1) * sp.gridSize;

  const ctx = globalCanvas.context;

  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1, middleYPoint);
  ctx.lineTo(x2, middleYPoint);
  ctx.lineTo(x2, y2);

  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.lines.getHexColor();
  ctx.stroke();
};
